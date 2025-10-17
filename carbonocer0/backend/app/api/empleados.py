# app/api/empleados.py
from fastapi import APIRouter, Depends
from app.core.auth import require_admin

router = APIRouter(prefix="/empleados", tags=["Empleados"])

@router.get("/", dependencies=[Depends(require_admin)])
def listar_empleados():
    return [{"id": 1, "nombre": "Carlos"}]
