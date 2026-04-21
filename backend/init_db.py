from app.database import SessionLocal, engine
from app import models
from app.auth import get_password_hash
import bcrypt

# Create tables
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if users already exist to avoid duplicates
existing_users = db.query(models.User).count()
if existing_users > 0:
    print("⚠️ Users already exist. Skipping creation.")
    db.close()
    exit()

# Create initial users
users = [
    {
        "username": "archbishop",
        "email": "archbishop@abuja.org",
        "hashed_password": get_password_hash("admin123"),
        "first_name": "John",
        "last_name": "Doe",
        "role": "ARCHBISHOP",
        "is_active": True
    },
    {
        "username": "priest",
        "email": "priest@parish.org",
        "hashed_password": get_password_hash("priest123"),
        "first_name": "Michael",
        "last_name": "Smith",
        "role": "PRIEST",
        "parish_id": 1,
        "is_active": True
    },
    {
        "username": "faithful",
        "email": "faithful@email.com",
        "hashed_password": get_password_hash("faith123"),
        "first_name": "Peter",
        "last_name": "Johnson",
        "role": "LAITY",
        "parish_id": 1,
        "is_active": True
    }
]

# Create parishes first (since users reference them)
parish = models.Parish(
    name="Our Lady Queen of Nigeria",
    location="Garki, Abuja",
    deanery="Garki Deanery",
    phone="08012345678",
    email="ourlady@garki.org"
)
db.add(parish)
db.commit()
db.refresh(parish)
print(f"✅ Created parish: {parish.name} (ID: {parish.id})")

# Update priest with parish_id
for user_data in users:
    if user_data["username"] == "priest":
        user_data["parish_id"] = parish.id
    elif user_data["username"] == "faithful":
        user_data["parish_id"] = parish.id

# Create users
for user_data in users:
    user = models.User(**user_data)
    db.add(user)
    print(f"✅ Created user: {user_data['username']} ({user_data['role']})")

db.commit()
db.close()
print("\n🎉 Database initialized successfully!")
print("\nLogin credentials:")
print("  Archbishop: archbishop / admin123")
print("  Priest: priest / priest123")
print("  Faithful: faithful / faith123")