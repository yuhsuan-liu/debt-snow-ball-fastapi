from fastapi import FastAPI
fomr Fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .models.debt import Debt
from .routers import calculate

app = FastAPI()

#Create CORS middleware to allow requests from the frontend
Base.metadata.create_all(bind=engine)
app.add_middleware(
    CORSMiddleware,
    allow_oringins=["*"],
    allow_credentials=True,
    allow_method=["*"],
    allow_headers=["*"],
)

#Register the calculate router
app.include_router(calculate.router)

@app.get("/")
def read_root():
    return {"message": "DebtSnowball backend is live"}
