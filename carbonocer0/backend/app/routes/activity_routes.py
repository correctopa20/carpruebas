from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.activity_model import Activity
from app.models.emission_factor_model import EmissionFactor
from app.models.user_model import User
from app.schemas.activity import ActivityCreate, ActivityOut
from app.dependencies.roles_dependency import admin_required
from app.routes.auth_routes import get_current_user
from app.utils.calculations import calculate_emissions

router = APIRouter(prefix="/activities", tags=["Activities"])


# 🟩 Crear una nueva actividad (usuario autenticado)
@router.post("/", response_model=ActivityOut)
def create_activity(
    activity_in: ActivityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Buscar el factor de emisión
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == activity_in.emission_factor_id).first()
    if not factor:
        raise HTTPException(status_code=404, detail="❌ Factor de emisión no encontrado")

    # Calcular emisiones (usa función utilitaria si la tienes)
    emissions = calculate_emissions(activity_in.quantity, factor.value)

    # Crear y guardar la actividad
    activity = Activity(
        user_id=current_user.id,
        category=activity_in.category,
        description=activity_in.description,
        quantity=activity_in.quantity,
        unit=activity_in.unit,
        emission_factor_id=activity_in.emission_factor_id,
        total_emision=emissions
    )

    db.add(activity)
    db.commit()
    db.refresh(activity)
    return activity


# 🟦 Obtener todas las actividades (solo admin)
@router.get("/", dependencies=[Depends(admin_required)])
def get_activities(db: Session = Depends(get_db)):
    return db.query(Activity).all()


# 🟨 Ver mis actividades (usuario actual)
@router.get("/mis-actividades")
def get_my_activities(db: Session = Depends(get_db), user=Depends(get_current_user)):
    user_id = user.get("id") or user.get("sub")
    if isinstance(user_id, str):
        user_db = db.query(User).filter(User.email == user_id).first()
        if not user_db:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        user_id = user_db.id

    actividades = db.query(Activity).filter(Activity.user_id == user_id).all()
    return actividades


# 🟧 Calcular mi huella total
@router.get("/mi-huella")
def get_my_emissions(db: Session = Depends(get_db), user=Depends(get_current_user)):
    user_id = user.get("id") or user.get("sub")
    if isinstance(user_id, str):
        user_db = db.query(User).filter(User.email == user_id).first()
        if not user_db:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        user_id = user_db.id

    total = db.query(func.sum(Activity.total_emision)).filter(Activity.user_id == user_id).scalar()
    return {"usuario_id": user_id, "huella_total_kgCO2": round(total or 0, 2)}


# 🟥 Eliminar una actividad (solo admin)
@router.delete("/{activity_id}", dependencies=[Depends(admin_required)])
def delete_activity(activity_id: int, db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="No encontrada")
    db.delete(activity)
    db.commit()
    return {"message": "🗑️ Actividad eliminada correctamente"}
