# app/main.py (ajustado para importaciones sin __init__.py)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.prediction import router as prediction_router

app = FastAPI(
    title="Cancer de Mama API",
    description="API para predicción de cáncer de mama usando MpNeurona",
    version="1.0.0"
)

# Configurar CORS para permitir solicitudes desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, limitar a los orígenes específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(prediction_router)

@app.get("/")
def read_root():
    return {"mensaje": "Bienvenido a la API de Predicción de Cáncer de Mama"}
