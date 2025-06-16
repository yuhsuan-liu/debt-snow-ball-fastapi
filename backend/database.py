from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv(override=True)
DATABASE_URL="postgresql://snowball_db_user:HAgSDx9zc8i9Mbprx6nHeZh8QDYHPJT5@dpg-d189qbmuk2gs73fmvqs0-a.virginia-postgres.render.com/snowball_db"


engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
