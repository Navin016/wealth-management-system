from pydantic import BaseModel, EmailStr, Field
from enum import Enum
from datetime import datetime
from typing import Optional


# -----------------------------
# ENUMS
# -----------------------------
class RiskProfile(str, Enum):
    conservative = "conservative"
    moderate = "moderate"
    aggressive = "aggressive"


class KYCStatus(str, Enum):
    unverified = "unverified"
    verified = "verified"
    rejected = "rejected"


# -----------------------------
# CREATE USER
# -----------------------------
class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)

    email: EmailStr

    password: str = Field(
        ...,
        min_length=6,
        description="Password must be at least 6 characters"
    )

    # Optional — enable later if needed
    # risk_profile: RiskProfile = RiskProfile.moderate


# -----------------------------
# LOGIN
# -----------------------------
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# -----------------------------
# RESPONSE
# -----------------------------
class UserResponse(BaseModel):
    id: int
    name: Optional[str]
    email: EmailStr
    risk_profile: Optional[RiskProfile]
    kyc_status: KYCStatus
    created_at: datetime

    class Config:
        from_attributes = True


# -----------------------------
# JWT TOKEN RESPONSE
# -----------------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# -----------------------------
# TOKEN PAYLOAD
# -----------------------------
class TokenData(BaseModel):
    user_id: Optional[int] = None
