from typing import List
from backend.schemas.debt import DebtSchema
from backend.database import engine, Base
def calculate_snowball(debts: List[DebtSchema], monthly_payment: float) -> List[dict]:
    # Sort debts by balance to implement the snowball method
    debts_sorted = sorted(debts, key=lambda d: d.balance)
    plan = []  # Initialize the repayment plan.
    month = 1

    # First, verify we have enough to cover all minimum payments
    total_min_payment = sum(debt.min_payment for debt in debts_sorted)
    if total_min_payment > monthly_payment:
        raise ValueError(f"Monthly payment (${monthly_payment}) is less than total minimum payments required (${total_min_payment})")

    while any(debt.balance > 0 for debt in debts_sorted):
        month_summary = {"month": month, "payments": []}
        remaining_payment = monthly_payment

        # First pass: Pay minimum payments for all debts
        for debt in debts_sorted:
            if debt.balance <= 0:
                month_summary["payments"].append({
                    "name": debt.name,
                    "payment": 0,
                    "remaining_balance": 0
                })
                continue

            # Calculate interest and payment for this debt
            interest = debt.balance * (debt.interest_rate / 100 / 12)
            
            # Pay minimum payment first
            payment = min(debt.min_payment, debt.balance + interest)
            principal = payment - interest
            
            # Update the debt's balance
            debt.balance = max(0, debt.balance - principal)
            
            # Record the payment
            month_summary["payments"].append({
                "name": debt.name,
                "payment": round(payment, 2),
                "remaining_balance": round(debt.balance, 2)
            })
            
            remaining_payment -= payment

        # Second pass: Apply remaining payment to the smallest debt
        if remaining_payment > 0:
            for debt in debts_sorted:
                if debt.balance <= 0:
                    continue

                # Calculate additional payment possible
                interest = debt.balance * (debt.interest_rate / 100 / 12)
                additional_payment = min(remaining_payment, debt.balance + interest)
                principal = additional_payment - interest
                
                # Update the debt's balance
                old_balance = debt.balance
                debt.balance = max(0, debt.balance - principal)
                
                # Update the payment in our summary
                for payment_record in month_summary["payments"]:
                    if payment_record["name"] == debt.name:
                        payment_record["payment"] = round(payment_record["payment"] + additional_payment, 2)
                        payment_record["remaining_balance"] = round(debt.balance, 2)
                        break
                
                remaining_payment -= additional_payment
                if remaining_payment <= 0 or debt.balance <= 0:
                    break

        # Add this month's summary to the plan
        plan.append(month_summary)
        month += 1
        
        # If no more payments can be made, break the loop
        if remaining_payment == monthly_payment:
            break

    return plan