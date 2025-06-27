from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.crud import payment_plan as payment_plan_crud
from ..schemas.payment_plan import PaymentPlan, PaymentPlanCreate
from backend.crud import user as user_crud
from backend.schemas.user import UserBase

router = APIRouter()

@router.post("/users/{user_id}/payment-plans/", response_model=PaymentPlan)
def create_payment_plan(
    user_id: int,
    plan: PaymentPlanCreate,
    db: Session = Depends(get_db)
):
    """Create a new payment plan for a user"""
    return payment_plan_crud.create_payment_plan(db=db, plan=plan, user_id=user_id)

@router.post("/users/by-username/{username}/payment-plans/", response_model=PaymentPlan)
def create_plan_by_username(
    username: str,
    plan: PaymentPlanCreate,
    db: Session = Depends(get_db)
):
    user = user_crud.get_user_by_username(db, username=username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return payment_plan_crud.create_payment_plan(db=db, plan=plan, user_id=user.id)

@router.get("/payment-plans/{plan_id}", response_model=PaymentPlan)
def get_payment_plan(plan_id: int, db: Session = Depends(get_db)):
    """Get a specific payment plan by ID"""
    db_plan = payment_plan_crud.get_payment_plan(db=db, plan_id=plan_id)
    if db_plan is None:
        raise HTTPException(status_code=404, detail="Payment plan not found")
    return db_plan

@router.get("/users/{user_id}/payment-plans/", response_model=List[PaymentPlan])
def get_user_payment_plans(
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all payment plans for a user"""
    return payment_plan_crud.get_user_payment_plans(
        db=db,
        user_id=user_id,
        skip=skip,
        limit=limit
    )

@router.put("/payment-plans/{plan_id}", response_model=PaymentPlan)
def update_payment_plan(
    plan_id: int,
    plan_update: PaymentPlanCreate,
    db: Session = Depends(get_db)
):
    """Update a payment plan"""
    db_plan = payment_plan_crud.update_payment_plan(
        db=db,
        plan_id=plan_id,
        plan_update=plan_update
    )
    if db_plan is None:
        raise HTTPException(status_code=404, detail="Payment plan not found")
    return db_plan

@router.delete("/payment-plans/{plan_id}")
def delete_payment_plan(plan_id: int, db: Session = Depends(get_db)):
    """Delete a payment plan"""
    success = payment_plan_crud.delete_payment_plan(db=db, plan_id=plan_id)
    if not success:
        raise HTTPException(status_code=404, detail="Payment plan not found")
    return {"message": "Payment plan deleted successfully"}
