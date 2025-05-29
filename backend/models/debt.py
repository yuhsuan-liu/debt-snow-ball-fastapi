from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from backend.database import Base

class Debt(Base):
    __tablename__ = "debts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    balance = Column(Float)
    min_payment = Column(Float)
    interest_rate = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
