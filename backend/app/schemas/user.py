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


# NEW ENUM — Gender
class Gender(str, Enum):
    male = "male"
    female = "female"
    other = "other"


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

    # -------- PROFILE FIELDS --------
    phone: Optional[str]
    city: Optional[str]
    gender: Optional[Gender]
    profession: Optional[str]
    age: Optional[int]
    salary: Optional[float] = Field(
    None, ge=0
    )


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


# -----------------------------
# PROFILE UPDATE
# -----------------------------
class ProfileUpdate(BaseModel):
    name: Optional[str]
    email: Optional[EmailStr]
    phone: Optional[str]
    city: Optional[str]
    gender: Optional[Gender]
    profession: Optional[str]
    age: Optional[int]
    salary: Optional[float] = Field(
    None, ge=0
    )

# -----------------------------
# CHANGE PASSWORD
# -----------------------------
class ChangePassword(BaseModel):
    old_password: str
    new_password: str = Field(
        ...,
        min_length=6,
        description="Minimum 6 characters"
    )
