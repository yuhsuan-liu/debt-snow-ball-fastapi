from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from backend.database import get_db
from backend.crud import user as user_crud
from backend.schemas.user import User, UserCreate
from backend.schemas.debt import DebtCreate, DebtSchema

router = APIRouter()

@router.post("/users/", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return user_crud.create_user(db=db, user=user)

@router.get("/users/{username}", response_model=User)
def get_user(username: str, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/users/{username}/debts/", response_model=List[DebtSchema])
def save_user_debts(username: str, debts: List[DebtCreate], db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_crud.save_user_debts(db=db, user_id=db_user.id, debts=debts)

@router.get("/users/{username}/debts/", response_model=List[DebtSchema])
def get_user_debts(username: str, db: Session = Depends(get_db)):
    db_user = user_crud.get_user_by_username(db, username=username)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_crud.get_user_debts(db=db, user_id=db_user.id)
