# schemas/question.py
from pydantic import BaseModel
from datetime import datetime

class QuestionBase(BaseModel):
    text: str
    category: str
    unit: str
    factor: float

class QuestionCreate(QuestionBase):
    pass

class QuestionResponse(QuestionBase):
    id: int
    class Config:
        from_attributes = True  # ✅ Actualizado (orm_mode está deprecado)


class UserResponseBase(BaseModel):
    question_id: int
    value: float

class UserResponseCreate(UserResponseBase):
    pass

class UserResponseOut(UserResponseBase):  # ✅ Hereda de UserResponseBase
    id: int
    user_id: int  # ✅ Agregar este campo
    question_id: int  # ✅ Ya está en Base, pero por claridad
    value: float  # ✅ Ya está en Base, pero por claridad
    emission: float
    # Si tu modelo tiene created_at, agrégalo:
    # created_at: datetime

    class Config:
        from_attributes = True  # ✅ Actualizado