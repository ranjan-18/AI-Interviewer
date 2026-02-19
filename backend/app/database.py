from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from .core.settings import settings

# Create data directory if it doesn't exist to store sqlite db
if settings.DATABASE_URL.startswith("sqlite"):
    if not os.path.exists("./data"):
        os.makedirs("./data")

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

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
