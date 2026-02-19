
from app.database import SessionLocal, engine, Base
from app.models.user import User

def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if user exists
    user = db.query(User).filter(User.email == "test@example.com").first()
    if not user:
        user = User(name="Test User", email="test@example.com")
        db.add(user)
        db.commit()
        print("Database seeded with test user.")
    else:
        print("User already exists.")
    db.close()

if __name__ == "__main__":
    seed()
