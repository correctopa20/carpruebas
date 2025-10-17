from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from app.routes import (
    auth_routes,
    admin_routes,
    activity_routes,
    emission_factor_routes,
    report_routes,
    employee_routes
)
from app.database import Base, engine

app = FastAPI(
    title="CarbonoCer0 API",
    version="1.0.0",
    description="API de autenticación y gestión de usuarios de CarbonoCer0",
    swagger_ui_parameters={"persistAuthorization": True},
)

# 🔧 Crear tablas
Base.metadata.create_all(bind=engine)

# 🟢 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧱 Incluir rutas
app.include_router(auth_routes.router, prefix="/auth")
app.include_router(admin_routes.router)
app.include_router(activity_routes.router)
app.include_router(emission_factor_routes.router)
app.include_router(report_routes.router)
app.include_router(employee_routes.router)
# 🧩 Configuración OpenAPI (para JWT persistente)
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
        }
    }
    for path in openapi_schema["paths"]:
        for method in openapi_schema["paths"][path]:
            if "security" not in openapi_schema["paths"][path][method]:
                openapi_schema["paths"][path][method]["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

# 🟢 Ruta raíz
@app.get("/")
def root():
    return {"message": "🌿 Bienvenido a la API de CarbonoCer0"}
