# app/api/auth.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from passlib.context import CryptContext
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import jwt
from app.database import get_db  # Ajusta el import según tu estructura
from app.models.user_model import User  # Tu modelo de usuario

router = APIRouter(prefix="/auth", tags=["Autenticación"])
SECRET_KEY = "superclave"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt", "argon2"], deprecated="auto")

# ---- Modelo de entrada ----
class LoginData(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    # Buscar usuario por email
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Usuario no encontrado")

    # Verificar la contraseña
    if not pwd_context.verify(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Contraseña incorrecta")

    # ✅ CORREGIR: Cambiar "rol" por "role" para ser consistente
    token = jwt.encode({
        "sub": user.email,
        "role": user.role,  # ← CAMBIAR "rol" por "role"
        "user_id": user.id,  # ← AGREGAR user_id (IMPORTANTE)
        "exp": datetime.utcnow() + timedelta(hours=2)
    }, SECRET_KEY, algorithm=ALGORITHM)

    return {"access_token": token, "role": user.role, "username": user.username}
