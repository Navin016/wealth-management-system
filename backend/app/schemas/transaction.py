from pydantic import BaseModel, Field
from typing import Optional
from decimal import Decimal
from enum import Enum
from datetime import datetime


class AssetType(str, Enum):
    stock = "stock"
    etf = "etf"
    mutual_fund = "mutual_fund"
    bond = "bond"
    cash = "cash"


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    symbol: str
    type: str
    quantity: Optional[Decimal]
    price: Optional[Decimal]
    fees: Optional[Decimal]
    asset_type: AssetType
    executed_at: Optional[datetime]
    created_at: Optional[datetime]  
    class Config:
        from_attributes = True


# INPUT SCHEMAS

class BuyTransactionCreate(BaseModel):
    symbol: str
    asset_type: AssetType
    quantity: Decimal = Field(..., gt=0)
    fees: Decimal = Field(0, ge=0)


class SellTransactionCreate(BaseModel):
    symbol: str
    asset_type: AssetType
    quantity: Decimal = Field(..., gt=0)
    fees: Decimal = Field(0, ge=0)


class ContributionTransactionCreate(BaseModel):
    amount: Decimal = Field(..., gt=0)


class WithdrawalTransactionCreate(BaseModel):
    amount: Decimal = Field(..., gt=0)
