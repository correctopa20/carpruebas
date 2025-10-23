from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database import get_db
from app.models import UserResponse, Question, User
from app.dependencies.roles_dependency import admin_required

router = APIRouter(prefix="/admin", tags=["AdminStats"])

@router.get("/stats", dependencies=[Depends(admin_required)])
def get_global_stats(db: Session = Depends(get_db)):
    try:
        # Estadísticas básicas
        total_users = db.query(User).count()
        total_responses = db.query(UserResponse).count()
        
        # Total de emisiones globales
        total_emissions_result = db.query(func.sum(UserResponse.emission)).scalar()
        total_emissions = total_emissions_result if total_emissions_result else 0
        
        # Promedio por usuario
        avg_emission_per_user = total_emissions / total_users if total_users > 0 else 0
        
        # Emisiones por categoría
        category_stats = (
            db.query(
                Question.category,
                func.sum(UserResponse.emission).label('total_emission'),
                func.count(UserResponse.id).label('response_count'),
                func.avg(UserResponse.emission).label('avg_emission')
            )
            .join(Question, UserResponse.question_id == Question.id)
            .group_by(Question.category)
            .all()
        )
        
        categories = {}
        for cat in category_stats:
            categories[cat.category] = {
                "total_emission": float(cat.total_emission),
                "response_count": cat.response_count,
                "avg_emission": float(cat.avg_emission)
            }
        
        # Top 5 usuarios con mayor huella
        top_users = (
            db.query(
                User.id,
                User.username,
                User.email,
                func.sum(UserResponse.emission).label('total_emission')
            )
            .join(UserResponse, User.id == UserResponse.user_id)
            .group_by(User.id, User.username, User.email)
            .order_by(desc('total_emission'))
            .limit(5)
            .all()
        )
        
        top_users_list = []
        for user in top_users:
            top_users_list.append({
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "total_emission": float(user.total_emission)
            })
        
        # Distribución de usuarios por nivel de huella
        user_emissions = (
            db.query(
                User.id,
                func.sum(UserResponse.emission).label('user_emission')
            )
            .join(UserResponse, User.id == UserResponse.user_id)
            .group_by(User.id)
            .all()
        )
        
        emission_levels = {"bajo": 0, "medio": 0, "alto": 0}
        for user_emission in user_emissions:
            emission = user_emission.user_emission
            if emission < 100:
                emission_levels["bajo"] += 1
            elif emission < 500:
                emission_levels["medio"] += 1
            else:
                emission_levels["alto"] += 1
        
        return {
            "summary": {
                "total_users": total_users,
                "total_responses": total_responses,
                "total_emissions": round(total_emissions, 2),
                "avg_emission_per_user": round(avg_emission_per_user, 2)
            },
            "categories": categories,
            "top_users": top_users_list,
            "emission_levels": emission_levels,
            "user_distribution": {
                "with_responses": len(user_emissions),
                "without_responses": total_users - len(user_emissions)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculando estadísticas: {str(e)}")