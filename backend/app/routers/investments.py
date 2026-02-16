from decimal import Decimal
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.investment import Investment
from app.schemas.investment import InvestmentResponse
from app.services.price_service import PriceService

router = APIRouter(
    prefix="/investments",
    tags=["Investments"]
)

# ==========================================
# GET USER INVESTMENTS
# ==========================================
@router.get("/", response_model=List[InvestmentResponse])
def get_user_investments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id,
        Investment.units > 0
    ).all()

    for inv in investments:

        current_value = Decimal(inv.current_value or 0)
        cost_basis = Decimal(inv.cost_basis or 0)

        if cost_basis > 0:

            pnl = current_value - cost_basis
            pnl_percent = (
                pnl / cost_basis
            ) * Decimal("100")

        else:
            pnl = Decimal("0")
            pnl_percent = Decimal("0")

        # 🔹 Attach response-only fields
        inv.gain_loss = pnl
        inv.gain_loss_percent = pnl_percent
        try:
            one_year_return = PriceService.get_one_year_return(
            inv.symbol
            )
        except Exception:
            one_year_return = 0
 
        inv.one_year_return_rate = Decimal(
            one_year_return or 0
            )


    return investments


# ==========================================
# REFRESH PRICES + UPDATE PnL
# ==========================================
@router.post("/refresh")
def refresh_prices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id
    ).all()

    for inv in investments:

        price, _ = PriceService.get_live_price(
            inv.symbol
        )

        one_year_return = (
            PriceService.get_one_year_return(
                inv.symbol
            )
        )

        if price:

            # 🔹 Update price fields
            inv.last_price = Decimal(str(price))

            inv.current_value = (
                inv.units * Decimal(str(price))
            )

            inv.last_price_at = datetime.now()

            inv.one_year_return_rate = Decimal(
                str(one_year_return)
            )

            # ======================================
            # 🔥 CALCULATE & STORE PnL
            # ======================================

            cost_basis = Decimal(inv.cost_basis or 0)

            if cost_basis > 0:

                pnl = (
                    inv.current_value - cost_basis
                )

                pnl_percent = (
                    pnl / cost_basis
                ) * Decimal("100")

            else:
                pnl = Decimal("0")
                pnl_percent = Decimal("0")

            # 🔹 Store in DB columns
            inv.unrealized_pnl = pnl
            inv.pnl_percent = pnl_percent

    db.commit()

    return {
        "message": "Prices & PnL refreshed"
    }
