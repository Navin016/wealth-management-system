from app.services.price_service import PriceService
from app.models import Investment
from app.database import SessionLocal

from decimal import Decimal
from datetime import datetime
import traceback


def refresh_prices():
    print("=== PRICE REFRESH STARTED ===")

    db = SessionLocal()

    try:
        investments = db.query(Investment).all()

        if not investments:
            print("No investments found.")
            return

        for inv in investments:
            try:
                price, _ = PriceService.get_live_price(inv.symbol)

                if price is None:
                    print(f"Price not found for {inv.symbol}")
                    continue

                # Update last price
                inv.last_price = price

                # Update timestamp
                inv.last_price_at = datetime.utcnow()

                # Current value (Decimal safe)
                inv.current_value = inv.units * Decimal(str(price))

                # Unrealized PnL
                inv.unrealized_pnl = (
                    inv.current_value - inv.cost_basis
                )

                # PnL %
                inv.pnl_percent = (
                    (inv.unrealized_pnl / inv.cost_basis) * 100
                    if inv.cost_basis else 0
                )

                print(f"Updated {inv.symbol} → {price}")

            except Exception as inv_error:
                print(f"Error updating {inv.symbol}")
                traceback.print_exc()

        db.commit()
        print("=== PRICE REFRESH COMPLETED ===")

    except Exception as e:
        print("GLOBAL ERROR IN PRICE REFRESH")
        traceback.print_exc()

    finally:
        db.close()


# ✅ Runs when executed directly (Local + Render Cron)
if __name__ == "__main__":
    refresh_prices()
