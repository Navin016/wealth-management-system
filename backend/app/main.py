from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.models import user, goal
from app.routers import auth, goals

# 🔹 CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wealth Management Backend")

# 🔹 CORS (Frontend Access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔹 ROUTERS
app.include_router(auth.router)
app.include_router(goals.router)

@app.get("/")
def root():
    return {"status": "working"}
