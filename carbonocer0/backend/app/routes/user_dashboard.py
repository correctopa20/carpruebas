from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import UserResponse
from app.routes.auth_routes import get_current_user

router = APIRouter(prefix="/user", tags=["UserDashboard"])

@router.get("/emissions")
def get_user_emissions(db: Session = Depends(get_db), user=Depends(get_current_user)):
    # obtener todas las emisiones del usuario autenticado
    responses = db.query(UserResponse).filter(UserResponse.user_id == user.id).all()

    total_emission = sum(r.emission for r in responses)
    category_summary = {}

    for r in responses:
        cat = r.question.category
        category_summary[cat] = category_summary.get(cat, 0) + r.emission

    return {
        "total_emission": total_emission,
        "by_category": category_summary
    }
