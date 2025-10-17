from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.emission_factor_model import EmissionFactor
from app.dependencies.roles_dependency import admin_required  # ✅ Protección admin
from pydantic import BaseModel

router = APIRouter(prefix="/emission-factors", tags=["Emission Factors"])


# 🧾 Esquema Pydantic para entrada de datos
class EmissionFactorCreate(BaseModel):
    tipo: str
    unidad: str
    factor_emision: float


# ✅ Crear un nuevo factor de emisión (solo admin)
@router.post("/", dependencies=[Depends(admin_required)], response_model=dict)
def create_emission_factor(data: EmissionFactorCreate, db: Session = Depends(get_db)):
    # Verificar si el tipo ya existe
    existing = db.query(EmissionFactor).filter(EmissionFactor.tipo == data.tipo).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"El tipo '{data.tipo}' ya existe.")

    new_factor = EmissionFactor(
        tipo=data.tipo,
        unidad=data.unidad,
        factor_emision=data.factor_emision
    )

    db.add(new_factor)
    db.commit()
    db.refresh(new_factor)

    return {
        "message": f"✅ Factor de emisión '{data.tipo}' creado correctamente",
        "data": {
            "id": new_factor.id,
            "tipo": new_factor.tipo,
            "unidad": new_factor.unidad,
            "factor_emision": new_factor.factor_emision
        }
    }


# 📋 Obtener todos los factores de emisión (acceso público/autenticado)
@router.get("/", response_model=list)
def get_all_emission_factors(db: Session = Depends(get_db)):
    factors = db.query(EmissionFactor).all()
    return [
        {
            "id": f.id,
            "tipo": f.tipo,
            "unidad": f.unidad,
            "factor_emision": f.factor_emision
        }
        for f in factors
    ]


# 🔍 Obtener un factor específico (acceso público/autenticado)
@router.get("/{factor_id}", response_model=dict)
def get_emission_factor(factor_id: int, db: Session = Depends(get_db)):
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
    if not factor:
        raise HTTPException(status_code=404, detail="Factor de emisión no encontrado")

    return {
        "id": factor.id,
        "tipo": factor.tipo,
        "unidad": factor.unidad,
        "factor_emision": factor.factor_emision
    }


# ✏️ Actualizar un factor de emisión (solo admin)
@router.put("/{factor_id}", dependencies=[Depends(admin_required)], response_model=dict)
def update_emission_factor(factor_id: int, data: EmissionFactorCreate, db: Session = Depends(get_db)):
    from app.models.activity_model import Activity  # 👈 Importamos aquí para evitar import circular

    factor = db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
    if not factor:
        raise HTTPException(status_code=404, detail="Factor de emisión no encontrado")

    # Actualizamos el factor
    factor.tipo = data.tipo
    factor.unidad = data.unidad
    factor.factor_emision = data.factor_emision
    db.commit()
    db.refresh(factor)

    # 🔁 Recalcular las actividades que usan este factor
    actividades = db.query(Activity).filter(Activity.emission_factor_id == factor_id).all()
    for act in actividades:
        act.total_emision = act.cantidad * factor.factor_emision

    db.commit()

    return {
        "message": f"✅ Factor '{factor.tipo}' actualizado correctamente y {len(actividades)} actividades recalculadas.",
        "data": {
            "id": factor.id,
            "tipo": factor.tipo,
            "unidad": factor.unidad,
            "factor_emision": factor.factor_emision
        }
    }



# 🗑️ Eliminar un factor (solo admin)
@router.delete("/{factor_id}", dependencies=[Depends(admin_required)], response_model=dict)
def delete_emission_factor(factor_id: int, db: Session = Depends(get_db)):
    factor = db.query(EmissionFactor).filter(EmissionFactor.id == factor_id).first()
    if not factor:
        raise HTTPException(status_code=404, detail="Factor de emisión no encontrado")

    db.delete(factor)
    db.commit()
    return {"message": f"🗑️ Factor '{factor.tipo}' eliminado correctamente"}
