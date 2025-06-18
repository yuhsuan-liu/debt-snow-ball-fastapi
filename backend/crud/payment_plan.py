from sqlalchemy.orm import Session
from backend.models.payment_plan import PaymentPlan
from backend.schemas.payment_plan import PaymentPlanCreate
from typing import List, Optional

def create_payment_plan(db: Session, plan: PaymentPlanCreate, user_id: int) -> PaymentPlan:
    db_plan = PaymentPlan(
        monthly_payment=plan.monthly_payment,
        total_months=plan.total_months,
        plan_data=plan.plan_data,
        user_id=user_id
    )
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)
    return db_plan

def get_payment_plan(db: Session, plan_id int) -> Optional[PaymentPlan]:
    return (
        db.query(PaymentPlan)
            .filter(PaymentPlan.id == plan_id)
            .first()
)

def get_user_payment_plan(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[PaymentPlan]:
    """Get all payment plans for a specific user"""
    return db.query(PaymentPlan)\
        .filter(PaymentPlan.user_id == user_id)\
        # Filters plans to only those belonging to the specified user
        .order_by(PaymentPlan.created_at.desc())\
        # Orders results by creation date, newest first
        .offset(skip)\
        # Skips the first 'skip' results (for pagination)
        .limit(limit)\
        # Limits the number of results (for pagination)
        .all()
        # Returns all matching results as a list

def update_payment_plan(
    db: Session, 
    plan_id: int, 
    plan_update: PaymentPlanCreate
) -> Optional[PaymentPlan]:
    """Update an existing payment plan"""
    db_plan = db.query(PaymentPlan).filter(PaymentPlan.id == plan_id).first()
    # Finds the existing plan by ID
    
    if not db_plan:
        return None
    # Returns None if plan doesn't exist
    
    for key, value in plan_update.dict().items():
        setattr(db_plan, key, value)
    # Iterates through all fields in the update data
    # Uses setattr to update each field in the database model
    # .dict() converts Pydantic model to dictionary
    
    db.commit()
    # Saves changes to database
    
    db.refresh(db_plan)
    # Refreshes the instance from database
    
    return db_plan
    # Returns updated plan

def delete_payment_plan(db: Session, plan_id: int) -> bool:
    """Delete a payment plan"""
    db_plan = db.query(PaymentPlan).filter(PaymentPlan.id == plan_id).first()
    # Finds the plan to delete
    
    if not db_plan:
        return False
    # Returns False if plan doesn't exist
    
    db.delete(db_plan)
    # Marks the plan for deletion
    
    db.commit()
    # Commits the deletion to the database
    
    return True
    # Returns True to indicate successful deletion