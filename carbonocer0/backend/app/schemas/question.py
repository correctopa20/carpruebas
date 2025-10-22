from pydantic import BaseModel

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
        orm_mode = True


class UserResponseBase(BaseModel):
    question_id: int
    value: float

class UserResponseCreate(UserResponseBase):
    pass

class UserResponseOut(BaseModel):
    id: int
    emission: float
    class Config:
        orm_mode = True
