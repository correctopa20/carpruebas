from carbonocer0.backend.app.database import SessionLocal
from app.models.user_model import User
from app.core.auth import get_password_hash

db = SessionLocal()

# Verifica si ya existe
admin = db.query(User).filter(User.email == "admin@carbonocer0.com").first()

if not admin:
    hashed_pw = get_password_hash("123456")
    admin = User(
        username="admin",
        email="admin@carbonocer0.com",
        hashed_password=hashed_pw,
        role="admin"
    )
    db.add(admin)
else:
    admin.hashed_password = get_password_hash("123456")

db.commit()
db.close()

print("✅ Usuario admin creado o actualizado correctamente.")
