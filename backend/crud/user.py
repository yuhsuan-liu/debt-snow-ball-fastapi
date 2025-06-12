from sqlalchemy.orm import Session
from backend.models.user import User
from backend.models.debt import Debt
from backend.schemas.user import UserCreate
from backend.schemas.debt import DebtCreate

def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    db_user = User(username=user.username)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def save_user_debts(db: Session, user_id: int, debts: list[DebtCreate]):
    # Delete existing debts for this user
    db.query(Debt).filter(Debt.user_id == user_id).delete()
    
    # Create new debts
    db_debts = []
    for debt in debts:
        db_debt = Debt(
            name=debt.name,
            balance=debt.balance,
            min_payment=debt.min_payment,
            interest_rate=debt.interest_rate,
            user_id=user_id
        )
        db_debts.append(db_debt)
    
    db.add_all(db_debts)
    db.commit()
    return db_debts

def get_user_debts(db: Session, user_id: int):
    return db.query(Debt).filter(Debt.user_id == user_id).all()
