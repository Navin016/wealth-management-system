from pydantic import BaseModel, Field, validator
from typing import List


class BatchPriceRequest(BaseModel):

    # List of stock symbols
    symbols: List[str] = Field(
        ...,
        min_length=1,
        max_length=100,
        description="List of stock symbols to fetch prices for"
    )

    # 🔧 Validate symbol formatting
    @validator("symbols")
    def validate_symbols(cls, symbols):

        cleaned_symbols = []

        for symbol in symbols:
            symbol = symbol.strip().upper()

            if not symbol:
                raise ValueError("Symbol cannot be empty")

            if len(symbol) > 10:
                raise ValueError(
                    f"Invalid symbol length: {symbol}"
                )

            cleaned_symbols.append(symbol)

        return cleaned_symbols
