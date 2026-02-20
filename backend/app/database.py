from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from .core.settings import settings

# Determine Database URL
# 1. Prefer POSTGRES_URL from Vercel environment (set automatically by Vercel Postgres)
# 2. Fallback to settings.DATABASE_URL (local .env or default)
SQLALCHEMY_DATABASE_URL = os.getenv("POSTGRES_URL")

if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = str(settings.DATABASE_URL)

# Fix protocol for SQLAlchemy (postgres:// -> postgresql://)
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Ensure data directory exists only for SQLite
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    if not os.path.exists("./data"):
        os.makedirs("./data")
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args=connect_args
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
