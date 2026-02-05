import yfinance as yf
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from decimal import Decimal
from sqlalchemy import func
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.investment import Investment

router = APIRouter(prefix="/portfolio", tags=["Portfolio"])

@router.get("/summary")
def get_portfolio_summary(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🔹 Fetch holdings (only active)
    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id,
        Investment.units > 0
    ).all()

    # 🔹 Initialize totals
    total_value = Decimal("0")
    total_invested = Decimal("0")

    for inv in investments:
        total_value += Decimal(inv.current_value or 0)
        total_invested += Decimal(inv.cost_basis or 0)

    # 🔹 Gain / Loss
    total_gain_loss = total_value - total_invested

    # 🔹 Gain %
    if total_invested > 0:
        gain_percent = (
            total_gain_loss / total_invested
        ) * Decimal("100")
    else:
        gain_percent = Decimal("0")

    # 🔹 Wallet
    wallet_balance = Decimal(current_user.wallet_balance or 0)

    # 🔹 Total Net Worth
    net_worth = total_value + wallet_balance

    return {
        "total_portfolio_value": round(total_value, 2),
        "total_invested": round(total_invested, 2),
        "total_gain_loss": round(total_gain_loss, 2),
        "total_gain_loss_percent": round(gain_percent, 2),
        "wallet_balance": round(wallet_balance, 2),
        "net_worth": round(net_worth, 2),
        "total_holdings": len(investments)
    }




@router.get("/allocation")
def get_symbol_allocation(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🔹 Aggregate by symbol
    results = db.query(
        Investment.symbol,
        func.sum(Investment.current_value)
    ).filter(
        Investment.user_id == current_user.id,
        Investment.units > 0
    ).group_by(
        Investment.symbol
    ).all()

    total_value = Decimal("0")

    for _, value in results:
        total_value += Decimal(value or 0)

    allocation = []

    for symbol, value in results:
        value = Decimal(value or 0)

        percent = (
            (value / total_value) * Decimal("100")
            if total_value > 0 else 0
        )

        allocation.append({
            "symbol": symbol,
            "value": round(value, 2),
            "percentage": round(percent, 2)
        })

    return {
        "total_portfolio_value": round(total_value, 2),
        "allocation": allocation
    }

@router.get("/performance")
def get_portfolio_performance(
    period: str = "1mo",   # 1d, 5d, 1mo, 6mo, 1y, max
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 🔹 Fetch active holdings
    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id,
        Investment.units > 0
    ).all()

    if not investments:
        return {"performance": []}

    portfolio_history = {}

    # 🔹 Loop each investment
    for inv in investments:

        ticker = yf.Ticker(inv.symbol)
        history = ticker.history(period=period)

        if history.empty:
            continue

        units = float(inv.units)

        # 🔹 Loop each day price
        for date, row in history.iterrows():

            close_price = row["Close"]
            value = units * close_price

            date_str = date.strftime("%Y-%m-%d")

            if date_str not in portfolio_history:
                portfolio_history[date_str] = 0

            portfolio_history[date_str] += value

    # 🔹 Convert to sorted list
    performance = [
        {
            "date": date,
            "portfolio_value": round(value, 2)
        }
        for date, value in sorted(portfolio_history.items())
    ]

    return {
        "period": period,
        "performance": performance
    }
