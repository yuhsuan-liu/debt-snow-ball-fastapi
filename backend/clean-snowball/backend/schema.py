"""
Database schema management script.
Run this script to initialize or reset the database schema.
"""
from backend.database import engine, Base
from backend.models.debt import Debt
from backend.models.user import User

def init_schema():
    """Initialize the database schema."""
    print("Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    
    print("Creating all tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Schema initialization complete!")

if __name__ == "__main__":
    init_schema()
