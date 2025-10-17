from fastapi import Depends, HTTPException, Request, status
from app.core.auth import verify_token

# 🔹 Obtener usuario desde el token del header
def get_current_user(request: Request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        raise HTTPException(status_code=401, detail="Token no proporcionado")

    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

    return payload


# 🔸 Requiere rol EMPLEADO
def empleado_required(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "empleado":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso restringido a empleados"
        )
    return current_user


# 🔸 Requiere rol ADMIN
def admin_required(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso restringido a administradores"
        )
    return current_user
