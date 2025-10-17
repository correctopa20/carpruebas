# app/models/emission_factor_model.py
from sqlalchemy import Column, Integer, String, Float
from app.database import Base
from sqlalchemy.orm import relationship

class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, unique=True, index=True, nullable=False)
    unidad = Column(String, nullable=False)
    factor_emision = Column(Float, nullable=False)

    # Relación inversa con Activity
    activities = relationship("Activity", back_populates="emission_factor")

    def __repr__(self):
        return f"<EmissionFactor(tipo={self.tipo}, factor_emision={self.factor_emision})>"
