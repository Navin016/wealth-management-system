import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import user, goal, investment, transaction
from app.routers import auth, goals, transactions, investments, portfolio, reports


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wealth Management Backend")


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "https://wealth-management-system-1-06go.onrender.com"
]

FRONTEND_URL = os.getenv("FRONTEND_URL")

if FRONTEND_URL:
    origins.append(FRONTEND_URL)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(goals.router)
app.include_router(investments.router)
app.include_router(transactions.router)
app.include_router(portfolio.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {"status": "working"}
