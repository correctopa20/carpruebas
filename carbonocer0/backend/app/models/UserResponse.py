from sqlalchemy import Column, Integer, Float, ForeignKey
from database import Base

class UserResponse(Base):
    __tablename__ = "user_responses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    value = Column(Float, nullable=False)  # valor respondido (ej: 30 kWh)
    emission = Column(Float, nullable=False)  # valor calculado (valor × factor)
