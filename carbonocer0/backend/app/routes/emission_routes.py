from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.emission_model import Emission
from app.models.activity_model import Activity
from app.dependencies.auth_dependency import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/emissions", tags=["Emissions"])


# 🧩 Esquemas Pydantic
class EmissionCreate(BaseModel):
    tipo: str
    cantidad: float
    unidad: str = "kg CO2"


# ✅ Registrar emisión manualmente
@router.post("/")
def crear_emision(
    data: EmissionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    nueva = Emission(
        user_id=user.id,
        tipo=data.tipo,
        cantidad=data.cantidad,
        unidad=data.unidad,
        fecha=datetime.utcnow()
    )
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    return {"message": "Emisión registrada correctamente", "emision": nueva}


# ✅ Registrar emisión automáticamente al crear actividad
def crear_emision_por_actividad(db: Session, user_id: int, actividad: Activity):
    emision = Emission(
        user_id=user_id,
        activity_id=actividad.id,
        tipo=actividad.tipo,
        cantidad=actividad.total_emision,
        unidad="kg CO2",
    )
    db.add(emision)
    db.commit()


# 📋 Listar emisiones del usuario
@router.get("/")
def listar_emisiones(db: Session = Depends(get_db), user=Depends(get_current_user)):
    emisiones = db.query(Emission).filter(Emission.user_id == user.id).all()
    return {"emisiones": emisiones}


# 🔍 Obtener una emisión específica
@router.get("/{id}")
def obtener_emision(id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    emision = db.query(Emission).filter(
        Emission.id == id, Emission.user_id == user.id
    ).first()
    if not emision:
        raise HTTPException(status_code=404, detail="Emisión no encontrada")
    return emision


# 📊 Total de emisiones del usuario
@router.get("/total")
def total_emisiones(db: Session = Depends(get_db), user=Depends(get_current_user)):
    total = db.query(Emission).filter(Emission.user_id == user.id).all()
    suma = sum(e.cantidad for e in total)
    return {"total_emisiones": round(suma, 2), "unidad": "kg CO2"}