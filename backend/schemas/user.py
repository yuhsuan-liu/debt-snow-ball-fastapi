from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import List
from .debt import DebtSchema

class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    #debts: List[DebtSchema] = [] 
    #commented out to avoid FastAPI issues during user creation
    
    model_config = ConfigDict(from_attributes=True)
