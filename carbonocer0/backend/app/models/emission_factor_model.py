# app/models/emission_factor_model.py
from sqlalchemy import Column, Integer, String, Float
from app.database import Base
from sqlalchemy.orm import relationship

class EmissionFactor(Base):
    __tablename__ = "emission_factors"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)     # Ej: "Transporte", "Energía"
    name = Column(String, nullable=False)         # Ej: "Gasolina", "Electricidad"
    value = Column(Float, nullable=False)         # kg CO₂ por unidad (kWh, litro, etc.)
    unit = Column(String, nullable=False)         # Ej: "kWh", "litro"

    questions = relationship("Question", back_populates="emission_factor")
    activities = relationship("Activity", back_populates="emission_factor")

    def __repr__(self):
        return f"<EmissionFactor(tipo={self.tipo}, factor_emision={self.factor_emision})>"
