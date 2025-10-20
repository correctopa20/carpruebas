from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base
from datetime import datetime

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    titulo = Column(String(100))
    descripcion = Column(String(255))
    categoria = Column(String(50))
    impacto_estimado = Column(Float)
    fecha_creacion = Column(DateTime, default=datetime.now)
