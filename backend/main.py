from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base, get_db
from backend.models.debt import Debt
from backend.routers import calculate, user, payment_plan
from sqlalchemy.orm import Session

#Use FastAPI to initiate the main application
app = FastAPI()

# Allow CORS for the frontend application to send requests to the backend
origin = [
    "http://localhost:5173",
    #Insert github page URL here once deployed 
]


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
app.include_router(payment_plan.router, tags=["payment-plans"])

# Define a root endpoint to check if the backend is running
@app.get("/")
def read_root():
    return {"message": "DebtSnowball backend is live"}


