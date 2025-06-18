from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from backend.utils.snowball import calculate_snowball
from backend.schemas.debt import DebtSchema, DebtInput

router = APIRouter()

class SnowballRequest(BaseModel):
    debts: List[DebtInput]
    monthly_payment: float

@router.post("/calculate-snowball")
async def calculate_snowball(data:SnowballRequest):
def calculate_snowball_route(request: SnowballRequest):
    """
    This route accepts a POST request with:
    - debts: a list of debts (name, balance, min_payment, interest_rate)
    - monthly_payment: the total amount user can pay each month

    Returns:
    - A JSON object with the debt snowball payoff plan.
    """
    plan = calculate_snowball(request.debts, request.monthly_payment)
    return {"plan": plan}
