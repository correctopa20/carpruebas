# app/api/auth.py
from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timedelta
import jwt

router = APIRouter(prefix="/auth", tags=["Autenticación"])
SECRET_KEY = "superclave"

@router.post("/login")
def login(data: dict):
    if data["email"] == "admin@carbono.com" and data["password"] == "1234":
        token = jwt.encode({
            "sub": data["email"],
            "rol": "admin",
            "exp": datetime.utcnow() + timedelta(hours=2)
        }, SECRET_KEY, algorithm="HS256")
        return {"access_token": token}
    raise HTTPException(status_code=401, detail="Credenciales incorrectas")
