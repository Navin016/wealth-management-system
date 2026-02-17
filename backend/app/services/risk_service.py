from sqlalchemy.orm import Session
from datetime import date

from app.models.investment import Investment, AssetType
from app.models.goal import Goal
from app.models.transaction import Transaction
from app.models.user import User


def calculate_risk_score(db: Session, user_id: int):

    score = 50  # Base neutral score

    # -----------------------------
    # INVESTMENT ALLOCATION
    # -----------------------------
    investments = db.query(Investment).filter(
        Investment.user_id == user_id
    ).all()

    equity_value = 0
    safe_value = 0
    total_value = 0

    for inv in investments:

        value = float(inv.current_value or 0)
        total_value += value

        if inv.asset_type in [
            AssetType.stock,
            AssetType.etf,
            AssetType.mutual_fund
        ]:
            equity_value += value
        else:
            safe_value += value

        # PnL impact
        pnl = float(inv.pnl_percent or 0)

        if pnl > 20:
            score += 5
        elif pnl < -10:
            score -= 5

    if total_value > 0:
        equity_ratio = equity_value / total_value

        if equity_ratio > 0.7:
            score += 15
        elif equity_ratio < 0.3:
            score -= 10

    # -----------------------------
    # GOALS DURATION
    # -----------------------------
    goals = db.query(Goal).filter(
        Goal.user_id == user_id
    ).all()

    long_term_goals = 0

    for g in goals:
        if g.target_date:
            years = (
                g.target_date.year -
                date.today().year
            )

            if years >= 5:
                long_term_goals += 1

    if long_term_goals >= 2:
        score += 10
    elif long_term_goals == 0:
        score -= 5

    # -----------------------------
    # TRANSACTION ACTIVITY
    # -----------------------------
    txn_count = db.query(Transaction).filter(
        Transaction.user_id == user_id
    ).count()

    if txn_count > 50:
        score += 10
    elif txn_count < 5:
        score -= 5

    # -----------------------------
    # WALLET vs SALARY STABILITY
    # -----------------------------
    user = db.query(User).filter(
        User.id == user_id
    ).first()

    wallet = float(user.wallet_balance or 0)
    salary = float(user.salary or 0)

    if salary > 0:
        ratio = wallet / salary

        if ratio > 6:
            score += 5
        elif ratio < 1:
            score -= 5

    # -----------------------------
    # CLAMP SCORE
    # -----------------------------
    score = max(0, min(score, 100))

    return {
        "risk_score": score,
        "risk_profile": get_risk_profile(score)
    }


def get_risk_profile(score: int):

    if score < 35:
        return "conservative"

    elif score < 70:
        return "moderate"

    return "aggressive"
