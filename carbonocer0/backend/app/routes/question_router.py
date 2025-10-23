# app/routes/question_router.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import database
from app.models.question import Question
from app.schemas.question import QuestionCreate, QuestionResponse
from app.routes.auth_routes import get_current_user

router = APIRouter(prefix="/questions", tags=["Questions"])

@router.post("/", response_model=QuestionResponse)
def create_question(
    question: QuestionCreate,
    db: Session = Depends(database.get_db),
    user=Depends(get_current_user)
):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    db_question = Question(**question.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question


@router.get("/", response_model=list[QuestionResponse])
def get_questions(db: Session = Depends(database.get_db)):
    return db.query(Question).all()


@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int,
    updated: QuestionCreate,
    db: Session = Depends(database.get_db),
    user=Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")

    for key, value in updated.dict().items():
        setattr(question, key, value)
    db.commit()
    db.refresh(question)
    return question


@router.delete("/{question_id}")
def delete_question(
    question_id: int,
    db: Session = Depends(database.get_db),
    user=Depends(get_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="No autorizado")
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Pregunta no encontrada")
    db.delete(question)
    db.commit()
    return {"detail": "Pregunta eliminada correctamente"}
