import yfinance as yf


class PriceService:

    # ---------------------------------------------------------
    # HELPER → USD → INR Conversion
    # ---------------------------------------------------------
    @staticmethod
    def _convert_to_inr(price: float, ticker) -> float:
        try:
            currency = ticker.info.get("currency", "USD")

            # Convert only if USD
            if currency == "USD":
                forex = yf.Ticker("USDINR=X")
                fx_data = forex.history(period="1d")

                if not fx_data.empty:
                    usd_inr = float(fx_data["Close"].iloc[-1])
                    return price * usd_inr

            return price

        except Exception:
            return price

    # ---------------------------------------------------------
    # LIVE PRICE
    # ---------------------------------------------------------
    @staticmethod
    def get_live_price(symbol: str):
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d")

            if data.empty:
                return None, "No price data"

            price = float(data["Close"].iloc[-1])

            # 🔥 Convert to INR
            price = PriceService._convert_to_inr(price, ticker)

            return price, None

        except Exception as e:
            return None, str(e)

    # ---------------------------------------------------------
    # 1 YEAR RETURN (Still % → No currency impact)
    # ---------------------------------------------------------
    @staticmethod
    def get_one_year_return(symbol: str):
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1y")

            if data.empty:
                return 0.0

            start_price = float(data["Close"].iloc[0])
            end_price = float(data["Close"].iloc[-1])

            # 🔥 Convert both to INR (optional but consistent)
            start_price = PriceService._convert_to_inr(start_price, ticker)
            end_price = PriceService._convert_to_inr(end_price, ticker)

            return float(
                ((end_price - start_price) / start_price) * 100
            )

        except Exception:
            return 0.0
