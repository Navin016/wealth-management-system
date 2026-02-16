from sqlalchemy import Column, Integer, String, Enum, DateTime, Numeric
from sqlalchemy.sql import func
from app.database import Base
import enum
from decimal import Decimal


# ---------------- ENUMS ----------------

class RiskProfile(enum.Enum):
    conservative = "conservative"
    moderate = "moderate"
    aggressive = "aggressive"


class KYCStatus(enum.Enum):
    unverified = "unverified"
    verified = "verified"
    rejected = "rejected"


# NEW ENUM → Gender
class Gender(enum.Enum):
    male = "male"
    female = "female"
    other = "other"


# ---------------- USER MODEL ----------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(String(100), unique=True, index=True, nullable=False)

    password = Column(String(255), nullable=False)

    risk_profile = Column(
        Enum(RiskProfile, name="risk_profile_enum"),
        default=RiskProfile.moderate,
        nullable=False
    )

    kyc_status = Column(
        Enum(KYCStatus, name="kyc_status_enum"),
        default=KYCStatus.unverified,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=False),
        server_default=func.now(),
        nullable=False
    )

    wallet_balance = Column(
        Numeric,
        default=Decimal("0.00"),
        nullable=False
    )

    # --------------------------------------------------
    # NEW PROFILE FIELDS (ADDED — NOTHING REMOVED)
    # --------------------------------------------------

    phone = Column(String(20))

    city = Column(String(100))

    gender = Column(
        Enum(Gender, name="gender_enum")
    )

    profession = Column(String(100))

    age = Column(Integer)

    salary = Column(Numeric(18, 2))
