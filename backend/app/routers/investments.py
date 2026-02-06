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

router = APIRouter(prefix="/investments", tags=["Investments"])


@router.get("/", response_model=List[InvestmentResponse])
def get_user_investments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id,
        Investment.units > 0   # Hide zero holdings
    ).all()

    for inv in investments:

        # 🔹 Ensure Decimal safety
        current_value = Decimal(inv.current_value or 0)
        cost_basis = Decimal(inv.cost_basis or 0)

        if cost_basis > 0:
            gain_loss = current_value - cost_basis
            gain_loss_percent = (
                gain_loss / cost_basis
            ) * Decimal("100")
        else:
            gain_loss = Decimal("0")
            gain_loss_percent = Decimal("0")

        # 🔹 Attach dynamic fields
        inv.gain_loss = gain_loss
        inv.gain_loss_percent = gain_loss_percent

    return investments





@router.post("/refresh")
def refresh_prices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id
    ).all()

    for inv in investments:

        price, _ = PriceService.get_live_price(inv.symbol)
        one_year_return = PriceService.get_one_year_return(inv.symbol)

        if price:

            inv.last_price = Decimal(str(price))
            inv.current_value = inv.units * Decimal(str(price))
            inv.last_price_at = datetime.now()

            # Store return safely
            inv.one_year_return_rate = Decimal(
                str(one_year_return)
            )

    db.commit()

    return {"message": "Prices refreshed"}
