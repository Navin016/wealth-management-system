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
