from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from .core.settings import settings

# Determine Database URL
# 1. Prefer POSTGRES_URL from Vercel environment
# 2. Fallback to settings.DATABASE_URL (local .env or default)
SQLALCHEMY_DATABASE_URL = os.getenv("POSTGRES_URL")

if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = str(settings.DATABASE_URL)

# Fix protocol for SQLAlchemy and use pg8000 driver for Vercel reliability
if SQLALCHEMY_DATABASE_URL and "postgres" in SQLALCHEMY_DATABASE_URL:
    if SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+pg8000://", 1)
    elif SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
        if "+pg8000" not in SQLALCHEMY_DATABASE_URL:
             SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+pg8000://", 1)

# Ensure data directory exists only for SQLite
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    try:
        # Check if we can write to ./data
        data_dir = "./data"
        if not os.path.exists(data_dir):
            os.makedirs(data_dir, exist_ok=True)
    except OSError:
        # If read-only (Vercel), switch to /tmp
        print("Detected read-only filesystem. Switching SQLite to /tmp.")
        SQLALCHEMY_DATABASE_URL = "sqlite:////tmp/sql_app.db"
    
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
