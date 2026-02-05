# app/routers/investments.py

import decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.investment import Investment, AssetType
from app.schemas.investment import InvestmentResponse
from app.services.price_service import PriceService

router = APIRouter(prefix="/investments", tags=["Investments"])


@router.get("/", response_model=List[InvestmentResponse])
def get_user_investments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments = (
        db.query(Investment)
        .filter(Investment.user_id == current_user.id)
        .all()
    )

    for inv in investments:
        if inv.cost_basis and inv.cost_basis > 0:
            inv.gain_loss = inv.current_value - inv.cost_basis
            inv.gain_loss_percent = (
                inv.gain_loss / inv.cost_basis
            ) * decimal.Decimal("100")

    return investments


@router.get("/{investment_id}", response_model=InvestmentResponse)
def get_investment(
    investment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investment = (
        db.query(Investment)
        .filter(
            Investment.id == investment_id,
            Investment.user_id == current_user.id
        )
        .first()
    )

    if not investment:
        raise HTTPException(
            status_code=404,
            detail="Investment not found"
        )

    return investment


@router.post("/update-prices")
def update_investment_prices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments: List[Investment] = (
        db.query(Investment)
        .filter(Investment.user_id == current_user.id)
        .all()
    )

    if not investments:
        return {
            "message": "No investments to update",
            "updated": 0,
            "failed": 0,
            "errors": []
        }

    updated = 0
    failed = 0
    errors = []

    for inv in investments:
        try:
            # 🔹 Fetch live price
            price, error = PriceService.get_live_price(inv.symbol)

            if price is None:
                failed += 1
                errors.append({
                    "symbol": inv.symbol,
                    "error": error
                })
                continue

            # 🔹 Defensive Decimal handling
            units = decimal.Decimal(inv.units or 0)

            inv.last_price = price
            inv.current_value = units * price
            inv.last_updated = datetime.utcnow()

            updated += 1

        except Exception as e:
            failed += 1
            errors.append({
                "symbol": inv.symbol,
                "error": str(e)
            })

    # 🔹 Single commit (safe & efficient)
    db.commit()

    return {
        "message": "Price update completed",
        "updated": updated,
        "failed": failed,
        "errors": errors
    }
