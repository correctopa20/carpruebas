from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings


# Cargar la URL de la base de datos desde el archivo .env
DATABASE_URL = settings.DATABASE_URL

# Crear el motor de la base de datos
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Crear la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base de datos declarativa (para los modelos)
Base = declarative_base()

# Dependencia para obtener la sesión de BD en cada request (FastAPI la usa con "Depends")
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
