# app/routes/responses.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models import UserResponse, Question
from app.schemas import UserResponseCreate, UserResponseOut
from app.database import get_db
from typing import List

router = APIRouter(prefix="/responses", tags=["Responses"])

@router.post("/", response_model=List[UserResponseOut])
def submit_responses(responses: List[UserResponseCreate], db: Session = Depends(get_db)):
    results = []
    for r in responses:
        question = db.query(Question).filter(Question.id == r.question_id).first()
        if not question:
            continue

        emission = r.value * question.factor  # ⚙️ Cálculo de emisiones

        new_response = UserResponse(
            user_id=1,  # ⚠️ Luego obtendrás esto del token JWT
            question_id=r.question_id,
            value=r.value,
            emission=emission,
        )
        db.add(new_response)
        db.commit()
        db.refresh(new_response)
        results.append(new_response)
    return results
