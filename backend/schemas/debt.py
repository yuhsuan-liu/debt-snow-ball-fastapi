from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class DebtBase(BaseModel):
    name: str
    balance: float
    min_payment: float
    interest_rate: float

class DebtCreate(DebtBase):
    pass

class DebtSchema(DebtBase):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    user_id: Optional[int] = None

    class Config:
        from_attributes = True  # Enables ORM model -> Pydantic model conversion