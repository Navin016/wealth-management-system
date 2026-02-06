import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base


# ✅ Get DB URL from environment (Render)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:161105@localhost:5432/wealth_management"
)


# ✅ Fix for Render PostgreSQL SSL requirement
connect_args = {}

if "render.com" in DATABASE_URL or "postgres://" in DATABASE_URL:
    connect_args = {"sslmode": "require"}


# ✅ Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)


# ✅ Session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# ✅ Base model
Base = declarative_base()
