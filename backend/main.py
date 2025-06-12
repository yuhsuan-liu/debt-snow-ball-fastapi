from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base, get_db
from backend.models.debt import Debt
from backend.routers import calculate, user
from sqlalchemy.orm import Session

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

# Create CORS middleware to allow requests from the frontend
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register the routers
app.include_router(calculate.router)
app.include_router(user.router, tags=["users"])

@app.get("/")
def read_root():
    return {"message": "DebtSnowball backend is live"}
