from celery_app import celery_app
from app.services.price_service import PriceService
from app.models import Investment
from app.database import SessionLocal
from decimal import Decimal
from datetime import datetime

@celery_app.task
def refresh_prices_task():
    print("=== PRICE REFRESH STARTED ===")

    db = SessionLocal()
    investments = db.query(Investment).all()

    for inv in investments:
        price, _ = PriceService.get_live_price(inv.symbol)

        inv.last_price = price


        # 🔥 FIX — Update timestamp
        inv.last_price_at = datetime.now()
        inv.current_value = inv.units * Decimal(str(price))
        # Recalculate PnL
        inv.unrealized_pnl = (
            inv.current_value - inv.cost_basis
        )

        inv.pnl_percent = (
            (inv.unrealized_pnl / inv.cost_basis) * 100
            if inv.cost_basis else 0
        )

    db.commit()
    db.close()

    print("=== PRICE REFRESH COMPLETED ===")

 