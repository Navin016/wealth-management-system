from sqlalchemy import Column, Integer, Numeric, String, TIMESTAMP, ForeignKey, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum


class AssetType(enum.Enum):
    stock = "stock"
    etf = "etf"
    mutual_fund = "mutual_fund"
    bond = "bond"
    cash = "cash"


class TransactionType(enum.Enum):
    buy = "buy"
    sell = "sell"
    contribution = "contribution"
    withdrawal = "withdrawal"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    symbol = Column(String(20), nullable=False)
    type = Column(Enum(TransactionType), nullable=False)

    quantity = Column(Numeric(20, 8))
    price = Column(Numeric(20, 8))
    fees = Column(Numeric(20, 8), default=0)

    asset_type = Column(Enum(AssetType), nullable=False)

    executed_at = Column(TIMESTAMP, server_default=func.now())
    created_at = Column(TIMESTAMP, server_default=func.now())
