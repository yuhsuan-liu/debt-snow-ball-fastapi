from typing import List
from backend.schemas.debt import DebtSchema

def calculate_snowball(debts: List[DebtSchema], monthly_payment: float) -> List[dict]:
    # Sort debts by balance to implement the snowball method
    debts_sorted = sorted(debts, key=lambda d: d.balance)
    plan = [] # Initialize the repayment plan.
    month = 1
    while any(debt.balance > 0 for debt in debts_sorted):
        month_summary = {"month": month, "payments": []}
        remaining_payment = monthly_payment
        for debt in debts_sorted:
            if debt.balance <= 0: #If the debt is already paid off, skip to next.
            #Still keep track of debts even if they are paid off.
                month_summary["payments"].append({
                    "name": debt.name,
                    "payment": 0,
                    "remaining_balance": 0
            })
            continue

        interest = debt.balance * (debt.interest_rate / 100 /12) # Calculate interest for the month.
        total_payment = min(remaining_payment, debt.balance + interest)
        principal = total_payment - interest # Calculate principal payment.
        debt.balance = max(0, debt.balance - principal) # if the balance goes below 0, set it to 0 and continue to pay off next debt.
        
        month_summary["payments"].append({
            "name": debt.name,
            "payment": round(total_payment, 2), # Round to 2 decimal places for currency.
            "remaining_balance": round(debt.balance, 2)
        })

        remaining_payment -= total_payment # Reduce the remaining payment by the total payment made.
        if remaining_payment <= 0:
            break

        plan.append(month_summary)
        month += 1
    return plan