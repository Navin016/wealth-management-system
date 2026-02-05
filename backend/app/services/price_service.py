import decimal
import requests
import os
import logging

logger = logging.getLogger(__name__)

class PriceService:
    @staticmethod
    def get_live_price(symbol: str):
        api_key = os.getenv("ALPHA_VANTAGE_API_KEY")
        symbol = symbol.upper().strip()

        if not api_key:
            return None, "Price service not configured"

        url = "https://www.alphavantage.co/query"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": api_key
        }

        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
        except Exception:
            logger.exception("Price API request failed")
            return None, "Failed to fetch live price"

        # 🚦 Alpha Vantage throttling messages
        if "Information" in data:
            logger.warning(data["Information"])
            return None, "Price service rate limit exceeded"

        if "Note" in data:
            logger.warning(data["Note"])
            return None, "Price service temporarily unavailable"

        quote = data.get("Global Quote", {})
        price_str = quote.get("05. price")

        # 🔒 STRICT VALIDATION (this fixes META)
        if (
            not price_str
            or price_str in {"0.0000", "N/A", "-", ""}
        ):
            logger.warning(
                f"Invalid price for {symbol}: {price_str}"
            )
            return None, "Invalid live price received"

        try:
            price = decimal.Decimal(price_str)
        except decimal.InvalidOperation:
            logger.error(
                f"Decimal conversion failed for {symbol}: {price_str}"
            )
            return None, "Invalid price format"

        return price, None
