# app/schemas/investment.py
from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal
from datetime import datetime
from .transaction import AssetType, InvestmentResponse

class InvestmentCreate(BaseModel):
    user_id: int
    asset_type: AssetType
    symbol: str
    units: Decimal
    avg_buy_price: Optional[Decimal] = None
    cost_basis: Optional[Decimal] = None

class InvestmentUpdate(BaseModel):
    units: Optional[Decimal] = None
    avg_buy_price: Optional[Decimal] = None
    cost_basis: Optional[Decimal] = None
    current_value: Optional[Decimal] = None
    last_price: Optional[Decimal] = None
    last_price_at: Optional[datetime] = None
class InvestmentResponse(BaseModel):
    id: int
    symbol: str
    units: Decimal
    avg_buy_price: Optional[Decimal]
    cost_basis: Decimal
    current_value: Decimal
    last_price: Optional[Decimal]

    gain_loss: Optional[Decimal] = None
    gain_loss_percent: Optional[Decimal] = None

    class Config:
        from_attributes = True
