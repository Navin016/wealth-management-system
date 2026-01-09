from pydantic import BaseModel
from datetime import date, datetime
from enum import Enum
from typing import Optional


# ENUMS (must match DB enums)
class GoalType(str, Enum):
    retirement = "retirement"
    home = "home"
    education = "education"
    custom = "custom"


class GoalStatus(str, Enum):
    active = "active"
    paused = "paused"
    completed = "completed"


# 🔹 CREATE GOAL (POST)
class GoalCreate(BaseModel):
    user_id: int
    goal_type: GoalType
    target_amount: float
    target_date: date
    monthly_contribution: Optional[float] = None


# 🔹 UPDATE GOAL (PUT / PATCH)
class GoalUpdate(BaseModel):
    goal_type: Optional[GoalType] = None
    target_amount: Optional[float] = None
    target_date: Optional[date] = None
    monthly_contribution: Optional[float] = None
    status: Optional[GoalStatus] = None


# 🔹 RESPONSE MODEL (GET)
class GoalResponse(BaseModel):
    id: int
    user_id: int
    goal_type: GoalType
    target_amount: float
    target_date: date
    monthly_contribution: Optional[float]
    status: GoalStatus
    created_at: datetime

    class Config:
        from_attributes = True   # (Pydantic v2)
