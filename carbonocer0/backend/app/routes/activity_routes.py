from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from pydantic import BaseModel

from app.database import SessionLocal
from app.models.activity_model import Activity
from app.models.emission_factor_model import EmissionFactor
from app.models.user_model import User
from app.dependencies.roles_dependency import admin_required
from app.routes.auth_routes import get_current_user

router = APIRouter(prefix="/activities", tags=["Activities"])


# 🟩 Conexión con la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🟩 Modelo de entrada para crear actividades
class ActivityCreate(BaseModel):
    tipo: str
    descripcion: str
    cantidad: float


# 🟩 Crear una actividad
@router.post("/")
def create_activity(
    activity_data: ActivityCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Obtener ID del usuario desde el token
    user_id = user.get("id") or user.get("sub")

    # Si 'sub' es un email, buscar su ID en la BD
    if isinstance(user_id, str):
        user_db = db.query(User).filter(User.email == user_id).first()
        if not user_db:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        user_id = user_db.id

    # Buscar automáticamente el factor de emisión según el tipo
    factor = db.query(EmissionFactor).filter(EmissionFactor.tipo == activity_data.tipo).first()
    if not factor:
        raise HTTPException(status_code=404, detail=f"No se encontró un factor para '{activity_data.tipo}'")

    # Calcular la emisión total
    total_emision = activity_data.cantidad * factor.factor_emision

    # Crear registro de la actividad
    activity = Activity(
        tipo=activity_data.tipo,
        descripcion=activity_data.descripcion,
        cantidad=activity_data.cantidad,
        unidad=factor.unidad,
        total_emision=total_emision,
        user_id=user_id,
        emission_factor_id=factor.id,
        fecha=datetime.now()
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)

    return {
        "message": f"✅ Actividad '{activity.tipo}' registrada correctamente",
        "data": {
            "tipo": activity.tipo,
            "cantidad": activity_data.cantidad,
            "unidad": factor.unidad,
            "factor_emision": factor.factor_emision,
            "total_emision": total_emision
        }
    }


# 🟦 Obtener todas las actividades (solo admin)
@router.get("/", dependencies=[Depends(admin_required)])
def get_activities(db: Session = Depends(get_db)):
    return db.query(Activity).all()


# 🟩 Ver mis actividades
@router.get("/mis-actividades")
def get_my_activities(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Resolver ID real del usuario
    user_id = user.get("id") or user.get("sub")
    if isinstance(user_id, str):
        user_db = db.query(User).filter(User.email == user_id).first()
        if not user_db:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        user_id = user_db.id

    actividades = db.query(Activity).filter(Activity.user_id == user_id).all()
    return actividades


# 🟩 Calcular mi huella total
@router.get("/mi-huella")
def get_my_emissions(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Resolver ID real del usuario
    user_id = user.get("id") or user.get("sub")
    if isinstance(user_id, str):
        user_db = db.query(User).filter(User.email == user_id).first()
        if not user_db:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        user_id = user_db.id

    total = db.query(func.sum(Activity.total_emision)).filter(Activity.user_id == user_id).scalar()
    return {"usuario_id": user_id, "huella_total_kgCO2": round(total or 0, 2)}


# 🟨 Obtener una actividad por ID
@router.get("/{activity_id}")
def get_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Actividad no encontrada")
    return activity


# 🟧 Eliminar una actividad (solo admin)
@router.delete("/{activity_id}", dependencies=[Depends(admin_required)])
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="No encontrada")
    db.delete(activity)
    db.commit()
    return {"message": "🗑️ Actividad eliminada correctamente"}
