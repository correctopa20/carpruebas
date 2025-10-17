from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100), unique=True, nullable=False)
    categoria = Column(String(50), nullable=False)
    unidad = Column(String(50), nullable=False)  # Ej: "km", "kWh", "kg", etc.
    factor_emision = Column(Float, nullable=False)  # kg CO2e por unidad
      # Relación uno a uno o uno a muchos con emisiones
    emission = relationship("Emission", back_populates="activity", uselist=False)
    def __repr__(self):
        return f"<Activity(nombre={self.nombre}, categoria={self.categoria})>"
