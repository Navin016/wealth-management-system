# # app/routers/transactions.py
# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session
# from typing import List
# from decimal import Decimal
# from app.dependencies import get_db, get_current_user
# from app.models.user import User
# from app.models.investment import Investment, AssetType  # ← ADD THIS LINE
# from app.models.transaction import Transaction, TransactionType  # ← ADD THIS LINE
# from app.schemas.transaction import (  # ← FIXED IMPORT
#     BuyTransactionCreate, SellTransactionCreate, DividendTransactionCreate,
#     ContributionTransactionCreate, WithdrawalTransactionCreate,
#     TransactionResponse
# )

# router = APIRouter(prefix="/transactions", tags=["Transactions"])

# @router.post("/buy", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
# def create_buy_transaction(
#     transaction: BuyTransactionCreate,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     try:
#         # Get or create investment - SAFE query without timestamps
#         investment = db.query(Investment).filter(
#             Investment.user_id == current_user.id,
#             Investment.symbol == transaction.symbol,
#             Investment.asset_type == transaction.asset_type
#         ).first()
        
#         if not investment:
#             investment = Investment(
#                 user_id=current_user.id,
#                 symbol=transaction.symbol,
#                 asset_type=transaction.asset_type,
#                 units=Decimal('0'),
#                 cost_basis=Decimal('0'),
#                 current_value=Decimal('0')
#             )
#             db.add(investment)
#             db.flush()

#         # Process BUY transaction
#         total_cost = (transaction.quantity * transaction.price) + transaction.fees
        
#         if investment.units > 0 and investment.cost_basis > 0:
#             # Weighted average
#             new_total_cost = investment.cost_basis + total_cost
#             new_total_units = investment.units + transaction.quantity
#             investment.avg_buy_price = new_total_cost / new_total_units
#         else:
#             investment.avg_buy_price = transaction.price
        
#         investment.units += transaction.quantity
#         investment.cost_basis += total_cost
#         investment.last_price = transaction.price
        
#         # Create transaction
#         db_transaction = Transaction(
#             user_id=current_user.id,
#             symbol=transaction.symbol,
#             type=TransactionType.buy,
#             quantity=transaction.quantity,
#             price=transaction.price,
#             fees=transaction.fees,
#             asset_type=transaction.asset_type,
#             executed_at=transaction.executed_at
#         )
#         db.add(db_transaction)
#         db.commit()
#         db.refresh(db_transaction)
        
#         return db_transaction
        
#     except Exception as e:
#         db.rollback()
#         raise HTTPException(status_code=400, detail=str(e))


# @router.post("/sell", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
# def create_sell_transaction(
#     transaction: SellTransactionCreate,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     investment = InvestmentService.get_or_create_investment(
#         db, current_user.id, transaction.symbol, transaction.asset_type
#     )
    
#     investment = InvestmentService.process_sell_transaction(
#         db, investment, transaction.quantity, transaction.price
#     )
    
#     db_transaction = Transaction(
#         user_id=current_user.id,
#         symbol=transaction.symbol,
#         type=TransactionType.sell,
#         quantity=transaction.quantity,
#         price=transaction.price,
#         fees=transaction.fees,
#         asset_type=transaction.asset_type,
#         executed_at=transaction.executed_at
#     )
#     db.add(db_transaction)
#     db.commit()
#     db.refresh(db_transaction)
    
#     return db_transaction

# @router.post("/dividend", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
# def create_dividend_transaction(
#     transaction: DividendTransactionCreate,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     investment = InvestmentService.get_or_create_investment(
#         db, current_user.id, transaction.symbol, transaction.asset_type
#     )
    
#     InvestmentService.process_dividend(db, investment, transaction.amount)
    
#     db_transaction = Transaction(
#         user_id=current_user.id,
#         symbol=transaction.symbol,
#         type=TransactionType.dividend,
#         quantity=None,
#         price=None,
#         fees=Decimal('0'),
#         asset_type=transaction.asset_type,
#         executed_at=transaction.executed_at
#     )
#     db.add(db_transaction)
#     db.commit()
#     db.refresh(db_transaction)
    
#     return db_transaction

# @router.post("/contribute", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
# def create_contribution_transaction(
#     transaction: ContributionTransactionCreate,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     investment = InvestmentService.get_or_create_investment(
#         db, current_user.id, transaction.symbol, transaction.asset_type
#     )
    
#     InvestmentService.process_contribution(db, investment, transaction.amount)
    
#     db_transaction = Transaction(
#         user_id=current_user.id,
#         symbol=transaction.symbol,
#         type=TransactionType.contribution,
#         quantity=None,
#         price=None,
#         fees=Decimal('0'),
#         asset_type=transaction.asset_type,
#         executed_at=transaction.executed_at
#     )
#     db.add(db_transaction)
#     db.commit()
#     db.refresh(db_transaction)
    
#     return db_transaction

# @router.get("/", response_model=List[TransactionResponse])
# def get_user_transactions(
#     limit: int = 50,
#     offset: int = 0,
#     current_user: User = Depends(get_current_user),
#     db: Session = Depends(get_db)
# ):
#     transactions = db.query(Transaction).filter(
#         Transaction.user_id == current_user.id
#     ).order_by(Transaction.executed_at.desc()).limit(limit).offset(offset).all()
#     return transactions






from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from decimal import Decimal
from sqlalchemy import func
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.investment import Investment, AssetType
from app.models.transaction import Transaction, TransactionType
from app.schemas.transaction import (
    BuyTransactionCreate, 
    SellTransactionCreate, 
    DividendTransactionCreate,
    ContributionTransactionCreate, 
    WithdrawalTransactionCreate,
    TransactionResponse
)
from app.services.price_service import PriceService


router = APIRouter(prefix="/transactions", tags=["Transactions"])

def get_or_create_investment(db: Session, user_id: int, symbol: str, asset_type: AssetType):
    """Get existing investment or create new one"""
    investment = db.query(Investment).filter(
        Investment.user_id == user_id,
        Investment.symbol == symbol,
        Investment.asset_type == asset_type
    ).first()
    
    if not investment:
        investment = Investment(
            user_id=user_id,
            symbol=symbol,
            asset_type=asset_type,
            units=Decimal('0'),
            cost_basis=Decimal('0'),
            current_value=Decimal('0')
        )
        db.add(investment)
        db.flush()
    return investment

@router.post("/buy", response_model=TransactionResponse)
def create_buy_transaction(
    transaction: BuyTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        price, error_message = PriceService.get_live_price(transaction.symbol)

        # ✅ Handle Alpha Vantage failure
        if price is None:
            raise HTTPException(
                status_code=502,
                detail=f"Alpha Vantage Error: {error_message}"
            )

        investment = get_or_create_investment(
            db, current_user.id, transaction.symbol, transaction.asset_type
        )

        total_cost = (transaction.quantity * price) + transaction.fees

        if investment.units > 0:
            investment.avg_buy_price = (
                investment.cost_basis + total_cost
            ) / (investment.units + transaction.quantity)
        else:
            investment.avg_buy_price = price

        investment.units += transaction.quantity
        investment.cost_basis += total_cost
        investment.last_price = price
        investment.current_value = investment.units * price

        db_transaction = Transaction(
            user_id=current_user.id,
            symbol=transaction.symbol,
            type=TransactionType.buy,
            quantity=transaction.quantity,
            price=price,
            fees=transaction.fees,
            asset_type=transaction.asset_type
        )

        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sell", response_model=TransactionResponse)
def create_sell_transaction(
    transaction: SellTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        price, error_message = PriceService.get_live_price(transaction.symbol)

        # ✅ Handle Alpha Vantage failure
        if price is None:
            raise HTTPException(
                status_code=502,
                detail=f"Alpha Vantage Error: {error_message}"
            )

        investment = get_or_create_investment(
            db, current_user.id, transaction.symbol, transaction.asset_type
        )

        if investment.units < transaction.quantity:
            raise HTTPException(400, "Insufficient units")

        # ✅ Safe because units > 0 guaranteed
        cost_per_unit = investment.cost_basis / investment.units
        cost_sold = cost_per_unit * transaction.quantity

        investment.units -= transaction.quantity
        investment.cost_basis -= cost_sold
        investment.last_price = price
        investment.current_value = investment.units * price

        if investment.units == 0:
            investment.avg_buy_price = None

        db_transaction = Transaction(
            user_id=current_user.id,
            symbol=transaction.symbol,
            type=TransactionType.sell,
            quantity=transaction.quantity,
            price=price,
            fees=transaction.fees,
            asset_type=transaction.asset_type
        )

        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
        return db_transaction

    except HTTPException:
        db.rollback()
        raise

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))



@router.post("/contribute", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_contribution_transaction(
    transaction: ContributionTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_transaction = Transaction(
        user_id=current_user.id,
        symbol=transaction.symbol,
        type=TransactionType.contribution,
        quantity=None,
        price=None,
        fees=Decimal('0'),
        asset_type=transaction.asset_type,
        executed_at=transaction.executed_at or func.now()
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.post("/withdraw", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
def create_withdrawal_transaction(
    transaction: WithdrawalTransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_transaction = Transaction(
        user_id=current_user.id,
        symbol=transaction.symbol,
        type=TransactionType.withdrawal,
        quantity=None,
        price=None,
        fees=Decimal('0'),
        asset_type=transaction.asset_type,
        executed_at=transaction.executed_at or func.now()
    )
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@router.get("/", response_model=List[TransactionResponse])
def get_user_transactions(
    limit: int = 50,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(Transaction.executed_at.desc()).limit(limit).offset(offset).all()
    return transactions
