import yfinance as yf


class PriceService:

    @staticmethod
    def get_live_price(symbol: str):
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d")

            if data.empty:
                return None, "No price data"

            price = float(data["Close"].iloc[-1])
            return price, None

        except Exception as e:
            return None, str(e)

    @staticmethod
    def get_one_year_return(symbol: str):
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1y")

            if data.empty:
                return 0.0

            start_price = float(data["Close"].iloc[0])
            end_price = float(data["Close"].iloc[-1])

            return float(
                ((end_price - start_price) / start_price) * 100
            )

        except Exception:
            return 0.0
