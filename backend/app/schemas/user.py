# from pydantic import BaseModel, EmailStr
# from enum import Enum


# class RiskProfile(str, Enum):
#     conservative = "conservative"
#     moderate = "moderate"
#     aggressive = "aggressive"


# class UserCreate(BaseModel):
#     name: str
#     email: EmailStr
#     password: str
#     risk_profile: RiskProfile = RiskProfile.moderate

#-------------------------------------------------------------
from pydantic import BaseModel, EmailStr
from enum import Enum
from datetime import datetime
from typing import Optional

class RiskProfile(str, Enum):
    conservative = "conservative"
    moderate = "moderate"
    aggressive = "aggressive"

class KYCStatus(str, Enum):
    unverified = "unverified"
    verified = "verified"
    rejected = "rejected"

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    # risk_profile: RiskProfile = RiskProfile.moderate

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: Optional[str]
    email: EmailStr
    risk_profile: Optional[RiskProfile]
    kyc_status: KYCStatus
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[int] = None
