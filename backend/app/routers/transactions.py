from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from decimal import Decimal

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.investment import Investment, AssetType
from app.models.transaction import Transaction, TransactionType
from app.schemas.transaction import (
    BuyTransactionCreate,
    SellTransactionCreate,
    ContributionTransactionCreate,
    WithdrawalTransactionCreate,
    TransactionResponse
)
from app.services.price_service import PriceService

router = APIRouter(prefix="/transactions", tags=["Transactions"])


# -------------------------------------------------------------------
# HELPER → Get or Create Investment (ONLY USED FOR BUY)
# -------------------------------------------------------------------
def get_or_create_investment(db, user_id, symbol, asset_type):
    inv = db.query(Investment).filter(
        Investment.user_id == user_id,
        Investment.symbol == symbol,
        Investment.asset_type == asset_type
    ).first()

    if not inv:
        inv = Investment(
            user_id=user_id,
            symbol=symbol,
            asset_type=asset_type,
            units=Decimal("0"),
            cost_basis=Decimal("0"),
            current_value=Decimal("0")
        )
        db.add(inv)
        db.flush()

    return inv


# -------------------------------------------------------------------
# BUY
# -------------------------------------------------------------------
@router.post("/buy", response_model=TransactionResponse)
def buy(
    data: BuyTransactionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    price, error = PriceService.get_live_price(data.symbol)

    if price is None:
        raise HTTPException(502, error)

    price = Decimal(price)

    total_cost = (data.quantity * price) + data.fees

    # ✅ Wallet validation
    if user.wallet_balance < total_cost:
        raise HTTPException(400, "Insufficient wallet balance")

    # ✅ Deduct wallet
    user.wallet_balance -= total_cost

    # ✅ Get/Create holding
    inv = get_or_create_investment(
        db, user.id, data.symbol, data.asset_type
    )

    # ✅ Weighted average buy price
    if inv.units > 0:
        inv.avg_buy_price = (
            (inv.cost_basis + total_cost)
            / (inv.units + data.quantity)
        )
    else:
        inv.avg_buy_price = price

    inv.units += data.quantity
    inv.cost_basis += total_cost
    inv.last_price = price
    inv.current_value = inv.units * price

    txn = Transaction(
        user_id=user.id,
        symbol=data.symbol,
        type=TransactionType.buy,
        quantity=data.quantity,
        price=price,
        fees=data.fees,
        asset_type=data.asset_type
    )

    db.add(txn)
    db.commit()
    db.refresh(txn)

    return txn


# -------------------------------------------------------------------
# SELL  🔥 FULLY FIXED
# -------------------------------------------------------------------
@router.post("/sell", response_model=TransactionResponse)
def sell(
    data: SellTransactionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🔹 Get live price
    price, error = PriceService.get_live_price(data.symbol)

    if price is None:
        raise HTTPException(502, error)

    price = Decimal(price)

    # 🔹 Fetch EXISTING holding ONLY
    inv = db.query(Investment).filter(
        Investment.user_id == user.id,
        Investment.symbol == data.symbol,
        Investment.asset_type == data.asset_type
    ).first()

    if not inv:
        raise HTTPException(404, "Investment not found")

    if inv.units < data.quantity:
        raise HTTPException(400, "Not enough units")

    # 🔹 Wallet credit
    proceeds = data.quantity * price
    user.wallet_balance += proceeds

    # 🔹 COST BASIS REDUCTION (Weighted Average)
    cost_per_unit = inv.cost_basis / inv.units
    cost_removed = cost_per_unit * data.quantity

    inv.units -= data.quantity
    inv.cost_basis -= cost_removed

    # 🔥 If all units sold → delete holding
    if inv.units == 0:
        db.delete(inv)
    else:
        inv.avg_buy_price = inv.cost_basis / inv.units
        inv.last_price = price
        inv.current_value = inv.units * price

    # 🔹 Transaction record
    txn = Transaction(
        user_id=user.id,
        symbol=data.symbol,
        type=TransactionType.sell,
        quantity=data.quantity,
        price=price,
        fees=data.fees,
        asset_type=data.asset_type
    )

    db.add(txn)

    # 🔥 Commit BOTH wallet + investment updates
    db.commit()
    db.refresh(txn)

    return txn


@router.post("/contribute", response_model=TransactionResponse)
def contribute(
    data: ContributionTransactionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # ✅ Increase wallet balance
        user.wallet_balance += data.amount

        txn = Transaction(
            user_id=user.id,
            symbol="WALLET",   # Internal wallet symbol
            type=TransactionType.contribution,
            quantity=1,
            price=data.amount,
            fees=Decimal("0"),
            asset_type=AssetType.cash.value  # 🔥 FIX
        )

        db.add(txn)
        db.commit()
        db.refresh(txn)

        return txn

    except Exception as e:
        db.rollback()
        raise HTTPException(400, str(e))
@router.post("/withdraw", response_model=TransactionResponse)
def withdraw(
    data: WithdrawalTransactionCreate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # ✅ Balance validation
        if user.wallet_balance < data.amount:
            raise HTTPException(400, "Insufficient wallet balance")

        # ✅ Deduct wallet
        user.wallet_balance -= data.amount

        txn = Transaction(
            user_id=user.id,
            symbol="WALLET",
            type=TransactionType.withdrawal,
            quantity=1,
            price=data.amount,
            fees=Decimal("0"),
            asset_type=AssetType.cash.value  # 🔥 FIX
        )

        db.add(txn)
        db.commit()
        db.refresh(txn)

        return txn

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(400, str(e))



# -------------------------------------------------------------------
# GET ALL TRANSACTIONS
# -------------------------------------------------------------------
@router.get("/", response_model=list[TransactionResponse])
def get_transactions(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    txns = db.query(Transaction).filter(
        Transaction.user_id == user.id
    ).order_by(Transaction.created_at.desc()).all()

    return txns
@router.get("/recent")
def get_recent_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    transactions = (
        db.query(Transaction)
        .filter(Transaction.user_id == current_user.id)
        .order_by(Transaction.created_at.desc())
        .limit(3)
        .all()
    )

    return [
        {
            "id": t.id,
            "symbol": t.symbol,
            "type": t.type.value,
            "quantity": float(t.quantity or 0),
            "price": float(t.price or 0),
            "fees": float(t.fees or 0),
            "amount": float(
                (t.quantity or 0) * (t.price or 0)
            ),
            "date": t.created_at.isoformat(),
        }
        for t in transactions
    ]
