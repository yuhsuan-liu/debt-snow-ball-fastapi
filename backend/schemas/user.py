from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .debt import DebtSchema

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    debts: List[DebtSchema] = []

    class Config:
        from_attributes = True
