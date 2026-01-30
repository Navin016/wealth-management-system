
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import user, goal, investment, transaction
from app.routers import auth, goals, transactions, investments

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wealth Management Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(goals.router)
app.include_router(investments.router)
app.include_router(transactions.router)

@app.get("/")
def root():
    return {"status": "working"}
