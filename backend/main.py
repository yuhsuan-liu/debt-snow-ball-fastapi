from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.database import engine, Base, get_db
from backend.models.debt import Debt
from backend.routers import calculate, user, payment_plan
from sqlalchemy.orm import Session

# For openai API and chatbot-feature
import os
import openai
from dotenv import load_dotenv
from backend.schemas.chat import ChatRequest, ChatResponse

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")


#Use FastAPI to initiate the main application
app = FastAPI()

# Allow CORS for the frontend application to send requests to the backend
origin = [
    "http://localhost:5173", # Local development URL
    "https://yuhsuan-liu.github.io/debt-snow-ball-fastapi/" #Deployed Github page URL 
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

# Define a chatbot endpoint to interact with OpenAI's API
@app.post("/chat", response_model=ChatResponse)
def chat_with_bot(request: ChatRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4", 
            messages=[
                {"role": "system", "content": "You are a debt advisor who explains the Debt Snowball method clearly and gives actionable steps to reduce debt."}, 
                {"role": "user", "content": request.message}
            ]
        )
        return {"reply": response["choices"][0]["message"]["content"]}
    except Exception as e:
        return {"reply": "Sorry, something went wrong while trying to contact the assistant. Please try again later or check your internet connection."}