from fastapi import APIRouter, HTTPException, Depends, Request, status
from pydantic import BaseModel, EmailStr
from app.models.user_model import User
from app.database import SessionLocal
from app.dependencies.roles_dependency import admin_required, empleado_required, get_current_user
from app.core.auth import create_access_token, verify_password, get_password_hash, verify_token
from app.schemas.auth_schema import LoginSchema

router = APIRouter(
    prefix="/auth",
    tags=["Autenticación"]
)

# 📦 MODELOS Pydantic (para validación + Swagger)
class RegisterSchema(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str | None = "empleado"

    class Config:
        json_schema_extra = {
            "example": {
                "username": "Juan Perez",
                "email": "juan@example.com",
                "password": "123456",
                "role": "empleado"
            }
        }


class LoginSchema(BaseModel):
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "juan@example.com",
                "password": "123456"
            }
        }


# 🟩 REGISTRO DE USUARIO
@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(data: RegisterSchema):
    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == data.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="El correo ya está registrado")

        hashed_pw = get_password_hash(data.password)
        new_user = User(
            username=data.username,
            email=data.email,
            hashed_password=hashed_pw,
            role=data.role
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {
            "message": "✅ Usuario registrado con éxito",
            "user": new_user.email
        }
    finally:
        db.close()


# 🟦 LOGIN DE USUARIO
@router.post("/login")
def login(data: LoginSchema):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == data.email).first()
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(status_code=400, detail="Credenciales inválidas")

        token = create_access_token({
            "sub": user.email,
            "role": user.role
        })

        return {
            "access_token": token,
            "role": user.role,
            "token_type": "bearer"
        }
    finally:
        db.close()


# 🟨 OBTENER USUARIO ACTUAL DESDE EL TOKEN
def get_current_user(request: Request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")
    return payload



# 🟦 PERFIL DEL USUARIO ACTUAL
@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {"user": user}


# 🟩 SOLO EMPLEADOS
@router.get("/usuario/dashboard")
def empleado_dashboard(user=Depends(empleado_required)):
    return {"message": f"Hola {user['sub']}, bienvenido a tu panel de empleado"}


# 🟥 SOLO ADMINISTRADORES
@router.get("/admin-only")
def admin_route(user=Depends(admin_required)):
    email = user.get("sub", "usuario")
    return {"message": f"Bienvenido, {email}. Eres administrador."}
