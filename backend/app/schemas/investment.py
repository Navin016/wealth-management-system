from pydantic import BaseModel
from typing import Optional
from decimal import Decimal
from datetime import datetime
from app.models.investment import AssetType


class InvestmentResponse(BaseModel):
    id: int
    symbol: str
    asset_type: AssetType
    units: Decimal
    avg_buy_price: Optional[Decimal]
    cost_basis: Decimal
    current_value: Decimal
    last_price: Optional[Decimal]
    last_price_at: Optional[datetime]

    one_year_return_rate: Optional[Decimal]

    gain_loss: Optional[Decimal] = None
    gain_loss_percent: Optional[Decimal] = None

    class Config:
        from_attributes = True
