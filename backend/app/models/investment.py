from sqlalchemy import Column, Integer, Numeric, String, TIMESTAMP, ForeignKey, Enum, Float
from sqlalchemy.sql import func
from app.database import Base
import enum


class AssetType(enum.Enum):
    stock = "stock"
    etf = "etf"
    mutual_fund = "mutual_fund"
    bond = "bond"
    cash = "cash"


class Investment(Base):
    __tablename__ = "investments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    asset_type = Column(Enum(AssetType), nullable=False, index=True)
    symbol = Column(String(20), nullable=False, index=True)

    units = Column(Numeric(20, 8), default=0)
    avg_buy_price = Column(Numeric(20, 8))
    cost_basis = Column(Numeric(20, 8), default=0)

    current_value = Column(Numeric(20, 8), default=0)
    last_price = Column(Numeric(20, 8))
    last_price_at = Column(TIMESTAMP)

    # ✅ For simulation slider
    one_year_return_rate = Column(Numeric(10, 4))
    unrealized_pnl = Column(Float, default=0)
    pnl_percent = Column(Float, default=0)

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
