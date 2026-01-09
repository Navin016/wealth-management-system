from fastapi import FastAPI
from app.database import engine, Base
from app.models import user, goal
from app.routers import auth, goals 

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Wealth Management Backend")

app.include_router(auth.router)
app.include_router(goals.router)

@app.get("/")
def root():
    return {"status": "working"}
