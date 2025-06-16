from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.database import Base

class Debt(Base):
    __tablename__ = "debts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    balance = Column(Numeric(10, 2))  # 10 digits total, 2 decimal places
    min_payment = Column(Numeric(10, 2))
    interest_rate = Column(Numeric(5, 2))  # 5 digits total, 2 decimal places for percentage
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship with user
    user = relationship("User", back_populates="debts")
