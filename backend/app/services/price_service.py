# # app/services/price_service.py
# import os
# import requests
# from decimal import Decimal

# ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
# BASE_URL = "https://www.alphavantage.co/query"


# class PriceService:
#     @staticmethod
#     def get_live_price(symbol: str) -> Decimal:
#         params = {
#             "function": "GLOBAL_QUOTE",
#             "symbol": symbol,
#             "apikey": ALPHA_VANTAGE_API_KEY
#         }

#         response = requests.get(BASE_URL, params=params, timeout=10)
#         data = response.json()

#         try:
#             price = data["Global Quote"]["05. price"]
#             return Decimal(price)
#         except Exception:
#             raise ValueError(f"Unable to fetch price for {symbol}")






import os
import requests
from decimal import Decimal
from typing import Optional

ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY")
BASE_URL = "https://www.alphavantage.co/query"


class PriceService:
    @staticmethod
    def get_live_price(symbol: str) -> Optional[Decimal]:
        """
        Fetch live stock/ETF price from Alpha Vantage.
        Returns Decimal price or None if unavailable.
        NEVER raises exception.
        """

        try:
            response = requests.get(
                BASE_URL,
                params={
                    "function": "GLOBAL_QUOTE",
                    "symbol": symbol,
                    "apikey": ALPHA_VANTAGE_API_KEY,
                },
                timeout=6,   # shorter timeout
            )

            data = response.json()

            # ✅ Handle rate limit / API errors
            if "Global Quote" not in data:
                return None

            price_str = data["Global Quote"].get("05. price")
            if not price_str:
                return None

            return Decimal(price_str)

        except requests.exceptions.RequestException:
            return None

        except Exception:
            return None
