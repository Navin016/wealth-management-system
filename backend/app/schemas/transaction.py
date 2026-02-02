# app/schemas/transaction.py - FINAL WORKING VERSION
from pydantic import BaseModel, Field
from typing import Optional, Union
from decimal import Decimal
from enum import Enum
from datetime import datetime

class AssetType(str, Enum):
    stock = "stock"
    etf = "etf"
    mutual_fund = "mutual_fund"
    bond = "bond"
    cash = "cash"

# Make asset_type OPTIONAL to handle NULL database values
class TransactionResponse(BaseModel):
    id: int
    user_id: int
    symbol: str
    type: str
    quantity: Optional[Decimal] = None
    price: Optional[Decimal] = None
    fees: Optional[Decimal] = None
    asset_type: Optional[Union[AssetType, str]] = None  # ← FIXED: Accepts None/str
    executed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class InvestmentResponse(BaseModel):
    id: int
    user_id: int
    symbol: str
    asset_type: Optional[Union[AssetType, str]] = None  # ← FIXED
    units: Optional[Decimal] = None
    avg_buy_price: Optional[Decimal] = None
    cost_basis: Optional[Decimal] = None
    current_value: Optional[Decimal] = None
    last_price: Optional[Decimal] = None
    last_price_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Input schemas remain strict
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


class DividendTransactionCreate(BaseModel):
    symbol: str = Field(..., max_length=20)
    asset_type: AssetType
    amount: Decimal = Field(..., gt=0)
    executed_at: Optional[datetime] = None

class ContributionTransactionCreate(BaseModel):
    symbol: str = Field(..., max_length=20)
    asset_type: AssetType
    amount: Decimal = Field(..., gt=0)
    executed_at: Optional[datetime] = None

class WithdrawalTransactionCreate(BaseModel):
    symbol: str = Field(..., max_length=20)
    asset_type: AssetType
    amount: Decimal = Field(..., gt=0)
    executed_at: Optional[datetime] = None
