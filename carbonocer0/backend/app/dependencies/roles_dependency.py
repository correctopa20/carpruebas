from fastapi import Depends, HTTPException, Request, status
from app.core.auth import verify_token


# 🧩 Obtener el usuario actual a partir del token
def get_current_user(request: Request):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return payload


# 👷‍♂️ Solo empleados
def empleado_required(user=Depends(get_current_user)):
    if user.get("role") != "empleado":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso restringido: se requiere rol de empleado",
        )
    return user


# 👑 Solo administradores
def admin_required(user=Depends(get_current_user)):
    if user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acceso restringido: se requiere rol de administrador",
        )
    return user
