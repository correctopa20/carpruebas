from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from models import UserResponse, Question
from schemas import UserResponseCreate, UserResponseOut
from database import get_db
from typing import List

router = APIRouter(prefix="/responses", tags=["Responses"])

@router.post("/", response_model=List[UserResponseOut])
def submit_responses(responses: List[UserResponseCreate], db: Session = Depends(get_db)):
    results = []
    for r in responses:
        question = db.query(Question).filter(Question.id == r.question_id).first()
        emission = r.value * question.factor

        new_response = UserResponse(
            user_id=1,  # ⚠️ luego se obtiene del token JWT
            question_id=r.question_id,
            value=r.value,
            emission=emission,
        )
        db.add(new_response)
        db.commit()
        db.refresh(new_response)
        results.append(new_response)
    return results
