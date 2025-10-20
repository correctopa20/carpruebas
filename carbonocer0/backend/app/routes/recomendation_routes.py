from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

from app.database import SessionLocal
from app.models.recomendation_model import Recommendation
from app.models.user_model import User
from app.dependencies.roles_dependency import admin_required
from app.routes.auth_routes import get_current_user

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


# 🟩 Conexión a la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🟩 Esquemas Pydantic
class RecommendationCreate(BaseModel):
    titulo: str
    descripcion: str
    categoria: str
    impacto_estimado: float


class RecommendationUpdate(BaseModel):
    titulo: Optional[str] = None
    descripcion: Optional[str] = None
    categoria: Optional[str] = None
    impacto_estimado: Optional[float] = None


# 🟩 Crear una recomendación (solo admin)
@router.post("/", dependencies=[Depends(admin_required)])
def create_recommendation(rec_data: RecommendationCreate, db: Session = Depends(get_db)):
    recommendation = Recommendation(
        titulo=rec_data.titulo,
        descripcion=rec_data.descripcion,
        categoria=rec_data.categoria,
        impacto_estimado=rec_data.impacto_estimado,
        fecha_creacion=datetime.now()
    )

    db.add(recommendation)
    db.commit()
    db.refresh(recommendation)

    return {
        "message": f"✅ Recomendación '{recommendation.titulo}' creada correctamente",
        "data": recommendation
    }


# 🟦 Obtener todas las recomendaciones (acceso libre)
@router.get("/")
def get_all_recommendations(db: Session = Depends(get_db)):
    recomendaciones = db.query(Recommendation).all()
    return recomendaciones


# 🟢 Obtener recomendaciones personalizadas según huella
@router.get("/sugeridas")
def get_personal_recommendations(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    # Obtener el usuario real desde el token
    user_id = user.get("id") or user.get("sub")
    if isinstance(user_id, str):
        user_db = db.query(User).filter(User.email == user_id).first()
        if not user_db:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
        user_id = user_db.id

    # Calcular la huella total del usuario
    from app.models.activity_model import Activity
    from sqlalchemy import func

    total_emision = (
        db.query(func.sum(Activity.total_emision))
        .filter(Activity.user_id == user_id)
        .scalar()
        or 0
    )

    # 🔹 Reglas simples de recomendación
    if total_emision < 100:
        nivel = "bajo"
    elif total_emision < 500:
        nivel = "medio"
    else:
        nivel = "alto"

    # 🔹 Buscar recomendaciones según el nivel
    recomendaciones = db.query(Recommendation).filter(
        Recommendation.categoria.ilike(f"%{nivel}%")
    ).all()

    if not recomendaciones:
        # Si no hay recomendaciones exactas, devolver algunas generales
        recomendaciones = db.query(Recommendation).limit(3).all()

    return {
        "huella_total_kgCO2": round(total_emision, 2),
        "nivel": nivel,
        "recomendaciones": [
            {
                "titulo": r.titulo,
                "descripcion": r.descripcion,
                "categoria": r.categoria,
                "impacto_estimado": r.impacto_estimado,
            }
            for r in recomendaciones
        ],
    }


# 🟩 Obtener una recomendación por ID
@router.get("/{rec_id}")
def get_recommendation(rec_id: int, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recomendación no encontrada")
    return rec


# 🟧 Actualizar una recomendación (solo admin)
@router.put("/{rec_id}", dependencies=[Depends(admin_required)])
def update_recommendation(rec_id: int, update_data: RecommendationUpdate, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recomendación no encontrada")

    for key, value in update_data.dict(exclude_unset=True).items():
        setattr(rec, key, value)

    db.commit()
    db.refresh(rec)
    return {"message": "✏️ Recomendación actualizada correctamente", "data": rec}


# 🗑️ Eliminar una recomendación (solo admin)
@router.delete("/{rec_id}", dependencies=[Depends(admin_required)])
def delete_recommendation(rec_id: int, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recomendación no encontrada")
    db.delete(rec)
    db.commit()
    return {"message": "🗑️ Recomendación eliminada correctamente"}
