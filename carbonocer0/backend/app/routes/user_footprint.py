from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from app.database import get_db
from app.models.UserResponse import UserResponse
from app.models.question import Question
from app.models.user_model import User
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
    print(f"🎯 [DEBUG] INICIANDO get_user_footprint_data para user_id: {user_id}")
    
    # Verificar que el usuario existe
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        print(f"❌ [DEBUG] Usuario {user_id} no encontrado")
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    print(f"✅ [DEBUG] Usuario encontrado: {user.username} ({user.email})")

    # DEBUG 1: Contar respuestas directas sin JOIN
    total_responses_direct = db.query(UserResponse).filter(UserResponse.user_id == user_id).count()
    print(f"📊 [DEBUG] Total respuestas en BD (directo): {total_responses_direct}")

    # DEBUG 2: Ver respuestas específicas
    if total_responses_direct > 0:
        responses_debug = db.query(UserResponse).filter(UserResponse.user_id == user_id).all()
        print(f"🔍 [DEBUG] Detalles de respuestas encontradas:")
        for resp in responses_debug:
            print(f"   - Response ID: {resp.id}, Question ID: {resp.question_id}, Emission: {resp.emission}")

    # DEBUG 3: Verificar preguntas existentes
    all_questions = db.query(Question.id, Question.category).all()
    print(f"📝 [DEBUG] Preguntas en BD: {len(all_questions)}")
    for q in all_questions[:10]:  # Mostrar primeras 10
        print(f"   - Question ID: {q.id}, Category: {q.category}")

    # Obtener respuestas con información de categoría
    print("🔄 [DEBUG] Ejecutando JOIN entre UserResponse y Question...")
    responses = (
        db.query(UserResponse, Question)
        .join(Question, Question.id == UserResponse.question_id)
        .filter(UserResponse.user_id == user_id)
        .all()
    )

    print(f"🔗 [DEBUG] Respuestas después del JOIN: {len(responses)}")

    # DEBUG 4: Detalle completo de cada respuesta después del JOIN
    if len(responses) > 0:
        print("📋 [DEBUG] Detalles completos después del JOIN:")
        for i, (response, question) in enumerate(responses):
            print(f"   📝 Respuesta {i+1}:")
            print(f"      - UserResponse ID: {response.id}")
            print(f"      - Question ID: {response.question_id}")
            print(f"      - Emission: {response.emission}")
            print(f"      - Question Category: '{question.category}'")
    else:
        print("❌ [DEBUG] CERO respuestas después del JOIN")

    # DEBUG 5: Si hay respuestas directas pero no en JOIN, investigar
    if total_responses_direct > 0 and len(responses) == 0:
        print("🚨 [DEBUG] PROBLEMA DETECTADO: Hay respuestas pero el JOIN falla")
        
        # Obtener todos los question_ids de las respuestas del usuario
        user_question_ids = [r.question_id for r in responses_debug]
        print(f"🔍 [DEBUG] Question IDs en respuestas del usuario: {user_question_ids}")
        
        # Verificar cuáles de estos IDs existen en questions
        existing_questions = db.query(Question.id).filter(Question.id.in_(user_question_ids)).all()
        existing_ids = [q[0] for q in existing_questions]
        print(f"🔍 [DEBUG] Question IDs que existen en BD: {existing_ids}")
        
        # Encontrar los IDs que no existen
        missing_ids = set(user_question_ids) - set(existing_ids)
        if missing_ids:
            print(f"❌ [DEBUG] Question IDs NO encontrados en BD: {missing_ids}")

    # Calcular por categoría
    categories = {}
    total = 0
    
    print("🧮 [DEBUG] Calculando categorías y emisiones...")
    for response, question in responses:
        category = question.category
        emission_value = response.emission
        print(f"   ➕ Procesando: categoria='{category}', emission={emission_value}")
        
        categories[category] = categories.get(category, 0) + emission_value
        total += emission_value

    print(f"📈 [DEBUG] Resultados del cálculo:")
    print(f"   - Total emisiones: {total}")
    print(f"   - Categorías encontradas: {categories}")
    print(f"   - Número de categorías: {len(categories)}")

    # VERIFICAR QUE HAY DATOS ANTES DE CALCULAR
    total_responses = len(responses)
    
    if total_responses == 0:
        print("ℹ️ [DEBUG] No hay respuestas después del JOIN, retornando estructura vacía")
        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            },
            "categories": {},
            "total_emissions": 0,
            "total_responses": 0,
            "average_emission": 0,
            "breakdown": []
        }
    
    avg_emission = total / total_responses

    # ✅ Asegurar que categories es un objeto/dict válido
    breakdown = [
        {
            "category": category,
            "emissions": round(emission, 2),
            "percentage": round((emission / total) * 100, 2) if total > 0 else 0
        }
        for category, emission in categories.items()
    ]

    print(f"🎉 [DEBUG] Retornando datos completos:")
    print(f"   - User: {user.username}")
    print(f"   - Total responses: {total_responses}")
    print(f"   - Total emissions: {total}")
    print(f"   - Categories: {categories}")
    print(f"   - Breakdown items: {len(breakdown)}")

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
        "breakdown": breakdown
    }