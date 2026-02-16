from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime, date
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    Image
)
from reportlab.lib.styles import getSampleStyleSheet

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

from app.dependencies import get_current_user, get_db
from app.models.user import User
from app.models.investment import Investment
from app.models.transaction import Transaction
from app.models.goal import Goal

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)

# =========================================================
# HELPER → MONTHS BETWEEN
# =========================================================
def months_between(start: date, end: date):
    return (
        (end.year - start.year) * 12
        + end.month - start.month
    )

# =========================================================
# HELPER → CHART
# =========================================================
def create_allocation_chart(investments):

    labels = [i.symbol for i in investments]
    values = [float(i.current_value or 0) for i in investments]

    if not values:
        return None

    plt.figure(figsize=(4, 4))
    plt.pie(values, labels=labels, autopct="%1.1f%%")
    plt.title("Asset Allocation")

    path = "allocation_chart.png"
    plt.savefig(path)
    plt.close()

    return path


# =========================================================
# SUMMARY API
# =========================================================
@router.get("/summary")
def get_report_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    investments = db.query(Investment).filter(
        Investment.user_id == current_user.id
    ).all()

    goals_db = db.query(Goal).filter(
        Goal.user_id == current_user.id
    ).all()

    transactions = db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).order_by(
        Transaction.created_at.desc()
    ).limit(5).all()

    total_invested = sum(
        float(i.cost_basis or 0)
        for i in investments
    )

    current_value = sum(
        float(i.current_value or 0)
        for i in investments
    )

    profit_loss = (
        current_value - total_invested
    )

    best_asset = max(
        investments,
        key=lambda x: x.unrealized_pnl or 0
    ) if investments else None

    worst_asset = min(
        investments,
        key=lambda x: x.unrealized_pnl or 0
    ) if investments else None

    # ===============================
    # GOALS CALCULATION
    # ===============================
    goals = []
    today = date.today()

    for g in goals_db:

        created_date = (
            g.created_at.date()
            if g.created_at else today
        )

        target_date = g.target_date

        monthly = float(
            g.monthly_contribution or 0
        )

        target_amount = float(
            g.target_amount or 0
        )

        # TOTAL MONTHS
        total_months = months_between(
            created_date,
            target_date
        ) if target_date else 0

        # ELAPSED MONTHS
        elapsed_months = months_between(
            created_date,
            today
        )

        elapsed_months = max(
            0,
            min(elapsed_months, total_months)
        )

        # CURRENT SAVED
        current_saved = (
            elapsed_months * monthly
        )

        current_saved = min(
            current_saved,
            target_amount
        )

        # PROGRESS %
        progress = (
            (current_saved / target_amount) * 100
            if target_amount else 0
        )

        progress = min(progress, 100)

        goals.append({
            "goal_type": g.goal_type.value,
            "target_date": g.target_date,
            "target_amount": target_amount,
            "current_saved": current_saved,
            "progress_percent": progress,
        })

    # ===============================
    # RESPONSE
    # ===============================
    return {
        "total_invested": total_invested,
        "current_value": current_value,
        "profit_loss": profit_loss,
        "best_asset": {
            "symbol": best_asset.symbol,
            "percent": float(
                best_asset.pnl_percent or 0
            ),
        } if best_asset else None,
        "worst_asset": {
            "symbol": worst_asset.symbol,
            "percent": float(
                worst_asset.pnl_percent or 0
            ),
        } if worst_asset else None,
        "investments": investments,
        "goals": goals,
        "recent_transactions": [
            {
                "symbol": t.symbol,
                "type": t.type.value,
                "quantity": float(t.quantity or 0),
                "price": float(t.price or 0),
                "fees": float(t.fees or 0),
                "created_at": t.created_at,
            }
            for t in transactions
        ],
    }


# =========================================================
# PDF DOWNLOAD → FULL MIRROR
# =========================================================
@router.get("/download")
def download_report(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    summary = get_report_summary(
        db=db,
        current_user=current_user
    )

    file_path = "wealth_report.pdf"

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()
    content = []

    content.append(
        Paragraph(
            "Wealth Management Report",
            styles["Title"]
        )
    )
    content.append(Spacer(1, 12))

    content.append(
        Paragraph(
            f"Total Invested: ${summary['total_invested']:.2f}",
            styles["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"Current Value: ${summary['current_value']:.2f}",
            styles["BodyText"]
        )
    )

    content.append(
        Paragraph(
            f"Profit / Loss: ${summary['profit_loss']:.2f}",
            styles["BodyText"]
        )
    )

    content.append(Spacer(1, 12))

    if summary["best_asset"]:
        content.append(
            Paragraph(
                f"Best Asset: "
                f"{summary['best_asset']['symbol']} "
                f"({summary['best_asset']['percent']:.2f}%)",
                styles["BodyText"]
            )
        )

    if summary["worst_asset"]:
        content.append(
            Paragraph(
                f"Worst Asset: "
                f"{summary['worst_asset']['symbol']} "
                f"({summary['worst_asset']['percent']:.2f}%)",
                styles["BodyText"]
            )
        )

    content.append(Spacer(1, 20))

    chart = create_allocation_chart(
        summary["investments"]
    )

    if chart:
        content.append(Image(chart, 300, 300))

    # GOALS TABLE
    goal_table = [[
        "Goal Type",
        "Target Date",
        "Target",
        "Saved",
        "Progress %",
    ]]

    for g in summary["goals"]:
        goal_table.append([
            g["goal_type"],
            str(g["target_date"]),
            f"${g['target_amount']:.2f}",
            f"${g['current_saved']:.2f}",
            f"{g['progress_percent']:.1f}%",
        ])

    content.append(Spacer(1, 20))
    content.append(
        Paragraph("Goals", styles["Heading2"])
    )
    content.append(Table(goal_table))

    # TRANSACTIONS TABLE
    txn_table = [[
        "Symbol",
        "Type",
        "Qty",
        "Price",
        "Fees",
        "Date"
    ]]

    for t in summary["recent_transactions"]:
        txn_table.append([
            t["symbol"],
            t["type"],
            t["quantity"],
            f"${t['price']:.2f}",
            f"${t['fees']:.2f}",
            str(t["created_at"]),
        ])

    content.append(Spacer(1, 20))
    content.append(
        Paragraph(
            "Recent Transactions",
            styles["Heading2"]
        )
    )
    content.append(Table(txn_table))

    doc.build(content)

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename="Wealth_Report.pdf"
    )
