from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/wallet", tags=["Wallet"])


@router.get("/balance")
def get_balance(
    current_user: User = Depends(get_current_user)
):
    return {
        "cash_balance": current_user.cash_balance
    }
