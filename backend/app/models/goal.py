from sqlalchemy import Column, Integer, Numeric, Date, Enum, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base
import enum


class GoalType(enum.Enum):
    retirement = "retirement"
    home = "home"
    education = "education"
    custom = "custom"


class GoalStatus(enum.Enum):
    active = "active"
    paused = "paused"
    completed = "completed"


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    goal_type = Column(
        Enum(GoalType, name="goal_type_enum"),
        nullable=True
    )

    target_amount = Column(
        Numeric,
        nullable=True
    )

    target_date = Column(
        Date,
        nullable=True
    )

    monthly_contribution = Column(
        Numeric,
        nullable=True
    )

    status = Column(
        Enum(GoalStatus, name="goal_status_enum"),
        default=GoalStatus.active
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now()
    )
