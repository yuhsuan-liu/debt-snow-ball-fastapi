from pydantic import BaseModel, ConfigDict
from datetime import datetime
from decimal import Decimal

class DebtBase(BaseModel):
    name: str
    balance: Decimal
    min_payment: Decimal
    interest_rate: Decimal

class DebtCreate(DebtBase):
    pass

class DebtSchema(DebtBase):
    id: int
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
