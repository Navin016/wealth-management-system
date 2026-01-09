from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.dependencies import get_db
from app.models.goal import Goal
from app.schemas.goal import GoalCreate, GoalUpdate, GoalResponse

router = APIRouter(
    prefix="/goals",
    tags=["Goals"]
)

# -------------------------------------------------
# CREATE GOAL
# -------------------------------------------------
@router.post(
    "/",
    response_model=GoalResponse,
    status_code=status.HTTP_201_CREATED
)
def create_goal(
    goal: GoalCreate,
    db: Session = Depends(get_db)
):
    new_goal = Goal(
        user_id=goal.user_id,
        goal_type=goal.goal_type,
        target_amount=goal.target_amount,
        target_date=goal.target_date,
        monthly_contribution=goal.monthly_contribution
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


# -------------------------------------------------
# GET ALL GOALS OF A USER
# -------------------------------------------------
@router.get(
    "/user/{user_id}",
    response_model=List[GoalResponse]
)
def get_user_goals(
    user_id: int,
    db: Session = Depends(get_db)
):
    goals = db.query(Goal).filter(Goal.user_id == user_id).all()
    return goals


# -------------------------------------------------
# GET SINGLE GOAL BY ID
# -------------------------------------------------
@router.get(
    "/{goal_id}",
    response_model=GoalResponse
)
def get_goal(
    goal_id: int,
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )

    return goal


# -------------------------------------------------
# UPDATE GOAL
# -------------------------------------------------
@router.put(
    "/{goal_id}",
    response_model=GoalResponse
)
def update_goal(
    goal_id: int,
    goal_update: GoalUpdate,
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )

    update_data = goal_update.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(goal, field, value)

    db.commit()
    db.refresh(goal)

    return goal


# -------------------------------------------------
# DELETE GOAL
# -------------------------------------------------
@router.delete(
    "/{goal_id}",
    status_code=status.HTTP_200_OK
)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db)
):
    goal = db.query(Goal).filter(Goal.id == goal_id).first()

    if not goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )

    db.delete(goal)
    db.commit()

    return {"message": "Goal deleted successfully"}
