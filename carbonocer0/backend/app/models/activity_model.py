# models/activity.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String, nullable=False)  # Ej: "Transporte", "Energía", "Ropa"
    description = Column(String)
    quantity = Column(Float, nullable=False)   # Ej: litros de gasolina, kWh, prendas compradas
    unit = Column(String, nullable=False)      # Ej: "litros", "kWh", "prendas"
    emission_factor_id = Column(Integer, ForeignKey("emission_factors.id"))
    emissions = Column(Float, default=0.0)
    date = Column(DateTime, default=datetime.utcnow)

    emission_factor = relationship("EmissionFactor", back_populates="activities")
    user = relationship("User", back_populates="activities")


    def __repr__(self):
        return f"<Activity(category={self.category}, quantity={self.quantity}, emissions={self.emissions})>"
