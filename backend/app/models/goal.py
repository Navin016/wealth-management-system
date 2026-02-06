from sqlalchemy import (
    Column,
    Integer,
    Numeric,
    Date,
    Enum,
    ForeignKey,
    TIMESTAMP
)
from sqlalchemy.sql import func
from app.database import Base
import enum


# -----------------------------
# ENUMS
# -----------------------------
class GoalType(str, enum.Enum):
    retirement = "retirement"
    home = "home"
    education = "education"
    custom = "custom"


class GoalStatus(str, enum.Enum):
    active = "active"
    paused = "paused"
    completed = "completed"


# -----------------------------
# MODEL
# -----------------------------
class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    goal_type = Column(
        Enum(
            GoalType,
            name="goal_type_enum",
            create_type=True
        ),
        nullable=False
    )

    # 💰 Finance precision-safe fields
    target_amount = Column(
        Numeric(18, 2),
        nullable=False
    )

    target_date = Column(
        Date,
        nullable=False
    )

    monthly_contribution = Column(
        Numeric(18, 2),
        nullable=True
    )

    status = Column(
        Enum(
            GoalStatus,
            name="goal_status_enum",
            create_type=True
        ),
        default=GoalStatus.active,
        nullable=False
    )

    created_at = Column(
        TIMESTAMP(timezone=True),
        server_default=func.now()
    )
