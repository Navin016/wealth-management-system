# app/routers/investments.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.investment import Investment, AssetType
from app.schemas.investment import InvestmentResponse
from app.services.price_service import PriceService
from sqlalchemy import func
from datetime import datetime


router = APIRouter(prefix="/investments", tags=["Investments"])

@router.get("/", response_model=List[InvestmentResponse])
def get_user_investments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id
    ).all()

    for inv in investments:
        if inv.cost_basis > 0:
            inv.gain_loss = inv.current_value - inv.cost_basis
            inv.gain_loss_percent = (inv.gain_loss / inv.cost_basis) * 100

    return investments


@router.get("/{investment_id}", response_model=InvestmentResponse)
def get_investment(
    investment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investment = db.query(Investment).filter(
        Investment.id == investment_id,
        Investment.user_id == current_user.id
    ).first()
    
    if not investment:
        raise HTTPException(status_code=404, detail="Investment not found")


@router.post("/update-prices")
def update_investment_prices(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id,
        Investment.asset_type.in_([AssetType.stock, AssetType.etf])
    ).all()

    updated = 0
    skipped = 0

    for inv in investments:
        price = PriceService.get_live_price(inv.symbol)
        

        if price is None:
            skipped += 1
            continue

        inv.last_price = price
        inv.current_value = inv.units * price
        updated += 1

    db.commit()

    return {
        "message": "Price update completed",
        "updated": updated,
        "skipped": skipped
    }
