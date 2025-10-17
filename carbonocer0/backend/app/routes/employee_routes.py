from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from app.database import get_db
from app.models.user_model import User
from app.dependencies.roles_dependency import admin_required
from app.core.auth import get_password_hash  # 👈 asegúrate de tenerlo en tu auth

router = APIRouter(prefix="/employees", tags=["Employees"])

# 🧾 Esquema para crear/editar usuarios
class EmployeeCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class EmployeeUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    password: str | None = None
    is_active: bool | None = None


# 🟢 Crear un nuevo empleado (solo admin)
@router.post("/", dependencies=[Depends(admin_required)], response_model=dict)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="El correo ya está registrado.")

    hashed_password = get_password_hash(data.password)

    new_employee = User(
        username=data.username,
        email=data.email,
        hashed_password=hashed_password,
        role="empleado",  # 👈 se crea como empleado
        is_active=True
    )

    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)

    return {
        "message": f"✅ Empleado '{new_employee.username}' creado correctamente",
        "data": {
            "id": new_employee.id,
            "username": new_employee.username,
            "email": new_employee.email,
            "role": new_employee.role
        }
    }


# 📋 Obtener todos los empleados (solo admin)
@router.get("/", dependencies=[Depends(admin_required)], response_model=list)
def get_all_employees(db: Session = Depends(get_db)):
    employees = db.query(User).filter(User.role == "empleado").all()
    return [
        {
            "id": e.id,
            "username": e.username,
            "email": e.email,
            "is_active": e.is_active,
            "role": e.role
        }
        for e in employees
    ]


# 🔍 Obtener un empleado por ID (solo admin)
@router.get("/{employee_id}", dependencies=[Depends(admin_required)], response_model=dict)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(User).filter(User.id == employee_id, User.role == "empleado").first()
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")
    return {
        "id": employee.id,
        "username": employee.username,
        "email": employee.email,
        "is_active": employee.is_active,
        "role": employee.role
    }


# ✏️ Actualizar empleado (solo admin)
@router.put("/{employee_id}", dependencies=[Depends(admin_required)], response_model=dict)
def update_employee(employee_id: int, data: EmployeeUpdate, db: Session = Depends(get_db)):
    employee = db.query(User).filter(User.id == employee_id, User.role == "empleado").first()
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    if data.username:
        employee.username = data.username
    if data.email:
        employee.email = data.email
    if data.password:
        employee.hashed_password = get_password_hash(data.password)
    if data.is_active is not None:
        employee.is_active = data.is_active

    db.commit()
    db.refresh(employee)

    return {
        "message": f"✅ Empleado '{employee.username}' actualizado correctamente",
        "data": {
            "id": employee.id,
            "username": employee.username,
            "email": employee.email,
            "is_active": employee.is_active
        }
    }


# 🗑️ Eliminar empleado (solo admin)
@router.delete("/{employee_id}", dependencies=[Depends(admin_required)], response_model=dict)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(User).filter(User.id == employee_id, User.role == "empleado").first()
    if not employee:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    db.delete(employee)
    db.commit()

    return {"message": f"🗑️ Empleado '{employee.username}' eliminado correctamente"}
