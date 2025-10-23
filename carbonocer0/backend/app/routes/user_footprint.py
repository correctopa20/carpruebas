from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import UserResponse, Question, User
from app.routes.auth_routes import get_current_user

router = APIRouter(prefix="/users", tags=["UserFootprint"])

@router.get("/my-footprint")
def get_my_footprint(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Usuario no autenticado")
    
    return get_user_footprint_data(user_id, db)

@router.get("/{user_id}/footprint")
def get_user_footprint(user_id: int, db: Session = Depends(get_db)):
    return get_user_footprint_data(user_id, db)

def get_user_footprint_data(user_id: int, db: Session):
    # Verificar que el usuario existe
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener respuestas con información de categoría
    responses = (
        db.query(UserResponse, Question)
        .join(Question, Question.id == UserResponse.question_id)
        .filter(UserResponse.user_id == user_id)
        .all()
    )

    # Calcular por categoría
    categories = {}
    total = 0
    
    for response, question in responses:
        category = question.category
        categories[category] = categories.get(category, 0) + response.emission
        total += response.emission

    # Estadísticas adicionales
    total_responses = len(responses)
    avg_emission = total / total_responses if total_responses > 0 else 0

    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email
        },
        "categories": categories,
        "total_emissions": round(total, 2),
        "total_responses": total_responses,
        "average_emission": round(avg_emission, 2),
        "breakdown": [
            {
                "category": category,
                "emissions": round(emission, 2),
                "percentage": round((emission / total) * 100, 2) if total > 0 else 0
            }
            for category, emission in categories.items()
        ]
    }