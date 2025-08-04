from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class PaymentPlan(Base):
    __tablename__ = "payment_plans"

    id = Column(Integer, primary_key=True, index=True)
    monthly_payment = Column(Numeric(10, 2))  # Total monthly payment amount
    total_months = Column(Integer)  # Total months to complete the plan
    plan_data = Column(JSON)  # Store the full payment plan as JSON
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with user
    user = relationship("User", back_populates="payment_plans")
