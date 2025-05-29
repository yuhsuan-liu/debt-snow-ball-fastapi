from fastapi import FastAPI
from .database import engine, Base
from .models.debt import Debt

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "DebtSnowball backend is live"}
