# app/models/activity_model.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, nullable=False)
    descripcion = Column(String, nullable=True)
    cantidad = Column(Float, nullable=False)
    unidad = Column(String, nullable=False)
    total_emision = Column(Float, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)

    # 🔗 Relaciones
    user_id = Column(Integer, ForeignKey("users.id"))
    emission_factor_id = Column(Integer, ForeignKey("emission_factors.id"))  # 👈 Nuevo

    # Relaciones inversas
    user = relationship("User", back_populates="activities")
    emission_factor = relationship("EmissionFactor", back_populates="activities")

    def __repr__(self):
        return f"<Activity(tipo={self.tipo}, cantidad={self.cantidad}, total_emision={self.total_emision})>"
