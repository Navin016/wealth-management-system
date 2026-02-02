from decimal import Decimal
import requests

class PriceService:
    @staticmethod
    def get_live_price(symbol: str):
        url = "https://www.alphavantage.co/query"
        params = {
            "function": "GLOBAL_QUOTE",
            "symbol": symbol,
            "apikey": "YOUR_API_KEY"
        }

        response = requests.get(url, params=params)
        data = response.json()

        # 🔴 Alpha Vantage error handling
        if "Information" in data:
            return None, data["Information"]

        if "Note" in data:
            return None, data["Note"]

        quote = data.get("Global Quote", {})
        price_str = quote.get("05. price")

        if not price_str:
            return None, "Price not available from Alpha Vantage"

        return Decimal(price_str), None
