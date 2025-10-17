from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="empleado")  # 👈 ESTA LÍNEA ES IMPORTANTE
    emisiones = relationship("EmissionRecord", back_populates="user", cascade="all, delete")
    activities = relationship("Activity", back_populates="user")
    emissions = relationship("Emission", back_populates="user")
from app.models import emission_model
from app.models import activity_model