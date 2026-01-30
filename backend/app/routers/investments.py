# app/routers/investments.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.investment import Investment
from app.schemas.investment import InvestmentResponse

router = APIRouter(prefix="/investments", tags=["Investments"])

@router.get("/", response_model=List[InvestmentResponse])
def get_user_investments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id
    ).order_by(Investment.current_value.desc()).all()
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
    
    return investment
