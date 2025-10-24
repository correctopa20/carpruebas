# app/routes/responses.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.UserResponse import UserResponse  # ✅ Solo modelos que necesitas
from app.models.question import Question  # ✅ Importar la CLASE Question
from app.schemas.question import UserResponseCreate, UserResponseOut
from app.database import get_db
from app.routes.auth_routes import get_current_user 
from typing import List

router = APIRouter(prefix="/responses", tags=["Responses"])

@router.post("/", response_model=List[UserResponseOut])
def submit_responses(
    responses: List[UserResponseCreate], 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)  # ✅ AÑADIR ESTO
):
    print(f"🔍 Recibiendo respuestas para user_id: {current_user.get('id')}")
    
    user_id = current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Usuario no autenticado")
    
    print(f"👤 Usuario autenticado: {current_user.get('username')} (ID: {user_id})")
    
    results = []
    try:
        for r in responses:
            question_obj = db.query(Question).filter(Question.id == r.question_id).first()
            
            if not question_obj:
                raise HTTPException(status_code=404, detail=f"Pregunta {r.question_id} no encontrada")

            emission = r.value * question_obj.factor

            new_response = UserResponse(
                user_id=user_id,  # ✅ Ahora sí usa el ID correcto del usuario logueado
                question_id=r.question_id,
                value=r.value,
                emission=emission,
            )
            db.add(new_response)
            results.append(new_response)
            print(f"💾 Guardando respuesta: question_id={r.question_id}, value={r.value}, emission={emission}")
        
        db.commit()
        
        # Refrescar todos los objetos
        for response in results:
            db.refresh(response)
            
        print(f"✅ {len(results)} respuestas guardadas para user_id: {user_id}")
        return results
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error guardando respuestas: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {str(e)}")