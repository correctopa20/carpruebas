from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class EmissionRecord(Base):
    __tablename__ = "emission_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    activity_id = Column(Integer, ForeignKey("activities.id"), nullable=False)
    cantidad = Column(Float, nullable=False)
    total_emision = Column(Float, nullable=False)
    fecha = Column(DateTime, default=datetime.utcnow)

    # Relaciones
    user = relationship("User", back_populates="emisiones")
    activity = relationship("Activity")
