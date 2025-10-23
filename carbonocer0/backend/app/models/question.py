# app/models/question.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String, nullable=False)
    category = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    factor = Column(Float, nullable=False)  # ✅ AGREGADO
    emission_factor_id = Column(Integer, ForeignKey("emission_factors.id"), nullable=True)

    emission_factor = relationship("EmissionFactor", back_populates="questions", lazy="joined")
