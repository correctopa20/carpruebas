from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User, UserResponse
from app.routes.auth_routes import get_current_user

router = APIRouter(prefix="/admin", tags=["AdminDashboard"])

@router.get("/global-stats")
def get_global_emissions(db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.role != "admin":
        return {"error": "No autorizado"}

    # 🧮 Obtener todas las respuestas
    responses = db.query(UserResponse).all()
    users = db.query(User).count()

    if not responses:
        return {"message": "No hay datos aún"}

    total_emission = sum(r.emission for r in responses)
    avg_emission = total_emission / users if users > 0 else 0

    # 📊 Emisiones por categoría
    category_summary = {}
    for r in responses:
        cat = r.question.category
        category_summary[cat] = category_summary.get(cat, 0) + r.emission

    # 🧍 Usuarios con mayor huella
    user_totals = {}
    for r in responses:
        user_totals[r.user_id] = user_totals.get(r.user_id, 0) + r.emission

    top_users = sorted(user_totals.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "total_emission": total_emission,
        "avg_emission": avg_emission,
        "category_summary": category_summary,
        "top_users": [
            {"user_id": uid, "emission": val} for uid, val in top_users
        ]
    }
