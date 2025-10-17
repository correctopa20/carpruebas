from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.activity_model import Activity
from app.dependencies.roles_dependency import admin_required

router = APIRouter(prefix="/activities", tags=["Activities"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🟩 Crear una actividad (solo admin)
@router.post("/", dependencies=[Depends(admin_required)])
def create_activity(nombre: str, categoria: str, unidad: str, factor_emision: float, db: Session = Depends(get_db)):
    existing = db.query(Activity).filter(Activity.nombre == nombre).first()
    if existing:
        raise HTTPException(status_code=400, detail="La actividad ya existe")

    activity = Activity(nombre=nombre, categoria=categoria, unidad=unidad, factor_emision=factor_emision)
    db.add(activity)
    db.commit()
    db.refresh(activity)
    return {"message": "Actividad creada", "data": activity}

# 🟦 Obtener todas las actividades
@router.get("/")
def get_activities(db: Session = Depends(get_db)):
    return db.query(Activity).all()

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
    return {"message": "Actividad eliminada correctamente"}
