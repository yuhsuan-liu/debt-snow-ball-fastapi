from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DebtSchema(BaseModel):
    name: str
    balance: float
    min_payment: float
    interest_rate: float
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Enables ORM model -> Pydantic model conversion