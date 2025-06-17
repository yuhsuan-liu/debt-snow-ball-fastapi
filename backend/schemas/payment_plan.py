from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime

class PaymentPlanBase(BaseModel):
    monthly_payment: float
    total_months: int
    plan_data: Dict[str, Any]

class PaymentPlanCreate(PaymentPlanBase):
    pass

class PaymentPlan(PaymentPlanBase):
    id: int
    user_id: int
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
