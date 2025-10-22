from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.user_model import User
from app.models.activity_model import Activity
from app.dependencies.roles_dependency import admin_required

router = APIRouter(prefix="/reports", tags=["Reports"])

# 🧾 Reporte general (solo admin)
@router.get("/usuarios", dependencies=[Depends(admin_required)])
def get_all_users_emissions(db: Session = Depends(get_db)):
    results = (
        db.query(
            User.id,
            User.username,
            func.coalesce(func.sum(Activity.total_emision), 0).label("total_emision")
        )
        .outerjoin(Activity, User.id == Activity.user_id)
        .group_by(User.id)
        .all()
    )

    return [
        {
            "id": r.id,
            "username": r.username,
            "total_emision_kgCO2": round(r.total_emision, 2)
        }
        for r in results
    ]

# 🔍 Reporte detallado (solo admin)
@router.get("/usuario/{user_id}", dependencies=[Depends(admin_required)])
def get_user_emission_detail(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    actividades = (
        db.query(Activity)
        .filter(Activity.user_id == user_id)
        .order_by(Activity.fecha.desc())
        .all()
    )

    total_emision = (
        db.query(func.coalesce(func.sum(Activity.total_emision), 0))
        .filter(Activity.user_id == user_id)
        .scalar()
    )

    return {
        "usuario": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        "total_emision_kgCO2": round(total_emision, 2),
        "actividades": [
            {
                "id": a.id,
                "tipo": a.tipo,
                "descripcion": a.descripcion,
                "cantidad": a.cantidad,
                "unidad": a.unidad,
                "total_emision": round(a.total_emision, 2),
                "fecha": a.fecha
            }
            for a in actividades
        ]
    }
