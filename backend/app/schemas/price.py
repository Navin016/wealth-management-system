# backend/app/schemas/price.py

from pydantic import BaseModel
from typing import List


class BatchPriceRequest(BaseModel):
    symbols: List[str]
