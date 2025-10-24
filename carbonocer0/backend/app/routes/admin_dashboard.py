from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database import get_db
from app.models.UserResponse import UserResponse
from app.models.question import Question
from app.models.user_model import User
from app.models.activity_model import Activity
from app.models.emission_factor_model import EmissionFactor
from app.routes.auth_routes import get_current_user

router = APIRouter(prefix="/admin", tags=["AdminDashboard"])

# ✅ Endpoint PRINCIPAL - Estadísticas completas
@router.get("/stats")
@router.get("/estadisticas")  # Para compatibilidad
def get_global_stats(
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)
):
    """Estadísticas completas del sistema - ENDPOINT PRINCIPAL"""
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    try:
        print("📊 [ADMIN] Calculando estadísticas globales...")
        
        # Estadísticas básicas
        total_users = db.query(User).count()
        total_responses = db.query(UserResponse).count()
        
        # Total de emisiones globales
        total_emissions_result = db.query(func.sum(UserResponse.emission)).scalar()
        total_emissions = float(total_emissions_result) if total_emissions_result else 0.0
        
        # Usuarios con respuestas (para promedio real)
        users_with_responses = db.query(func.count(func.distinct(UserResponse.user_id))).scalar()
        avg_emission_per_user = total_emissions / users_with_responses if users_with_responses > 0 else 0
        
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
            emission = user_emission.user_emission or 0
            if emission < 100:
                emission_levels["bajo"] += 1
            elif emission < 500:
                emission_levels["medio"] += 1
            else:
                emission_levels["alto"] += 1
        
        # Usuarios sin respuestas
        users_without_responses = total_users - users_with_responses
        
        print(f"✅ [ADMIN] Estadísticas calculadas: {total_users} usuarios, {total_responses} respuestas")
        
        return {
            "summary": {
                "total_users": total_users,
                "total_responses": total_responses,
                "total_emissions": round(total_emissions, 2),
                "avg_emission_per_user": round(avg_emission_per_user, 2),
                "users_with_responses": users_with_responses,
                "users_without_responses": users_without_responses
            },
            "categories": categories,
            "top_users": top_users_list,
            "emission_levels": emission_levels
        }
        
    except Exception as e:
        print(f"❌ [ADMIN] Error calculando estadísticas: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error calculando estadísticas: {str(e)}")

# ✅ Endpoint para actividades específicas
@router.get("/actividades")
def get_activities_stats(
    db: Session = Depends(get_db), 
    user: dict = Depends(get_current_user)
):
    """Estadísticas específicas de actividades"""
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")

    actividades = db.query(Activity).all()
    emisiones = db.query(EmissionFactor).all()

    total_emisiones = sum(a.total_emision for a in actividades)

    # Agrupamos por tipo de actividad
    resumen_por_actividad = {}
    for a in actividades:
        tipo = a.tipo or "Desconocido"
        resumen_por_actividad[tipo] = resumen_por_actividad.get(tipo, 0) + a.total_emision

    return {
        "total_emisiones": total_emisiones,
        "resumen_por_actividad": resumen_por_actividad,
        "total_actividades": len(actividades)
    }