# app/routes/admin_routes.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.activity_model import Activity
from app.models.emission_factor_model import EmissionFactor
from app.dependencies.roles_dependency import admin_required

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/estadisticas", dependencies=[Depends(admin_required)])
def obtener_estadisticas(db: Session = Depends(get_db)):
    actividades = db.query(Activity).all()  # ✅ nombre corregido
    emisiones = db.query(EmissionFactor).all()

    total_emisiones = sum(a.total_emision for a in actividades)

    # Agrupamos por tipo de actividad
    resumen_por_actividad = {}
    for a in actividades:
        tipo = a.tipo or "Desconocido"
        resumen_por_actividad[tipo] = resumen_por_actividad.get(tipo, 0) + a.total_emision

    return {
        "total_emisiones": total_emisiones,
        "resumen_por_actividad": resumen_por_actividad,
        "total_actividades": len(actividades)
    }
