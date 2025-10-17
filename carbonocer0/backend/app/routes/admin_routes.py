from fastapi import APIRouter, Depends, HTTPException
from app.core.auth import verify_token

router = APIRouter()

@router.get("/admin/dashboard")
def admin_dashboard(user=Depends(verify_token)):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Acceso restringido a administradores")
    return {"message": "Bienvenido al panel de administrador"}
