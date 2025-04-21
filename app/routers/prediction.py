from fastapi import APIRouter, Depends, HTTPException
from app.models.pydantic_models import CancerFeatures, PredictionResponse
from app.models.mp_neurona import MpNeurona
from app.utils.data_processing import binarize_features
import joblib
import os
import numpy as np
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/prediction",
    tags=["prediction"],
    responses={404: {"description": "Not found"}},
)

MODEL_PATH = "model/mp_neurona.joblib"

def get_model():
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        logger.info("Modelo cargado desde disco.")
    else:
        model = MpNeurona()
        model.threshold = 10
        logger.info("Nuevo modelo creado con threshold predeterminado.")
    return model

@router.post("/predict", response_model=PredictionResponse)
def predict_cancer(features: CancerFeatures):
    try:
        logger.info(f"Datos de entrada recibidos: {features.dict()}")
        features_dict = features.dict()
        logger.info(f"Diccionario de características: {features_dict}")
        binarized_features = binarize_features(features_dict)
        logger.info(f"Características binarizadas: {binarized_features}")
        model = get_model()
        prediction = model.model(binarized_features)
        logger.info(f"Predicción del modelo: {prediction}")
        sum_features = sum(binarized_features)
        distance_to_threshold = abs(sum_features - model.threshold)
        max_distance = max(model.threshold, len(binarized_features) - model.threshold)
        probability = 1 - (distance_to_threshold / max_distance) if max_distance > 0 else 0.5
        logger.info(f"Probabilidad calculada: {probability}")
        response = PredictionResponse(
            prediction=int(prediction),
            probability=float(probability),
            features_used=list(features_dict.keys())
        )
        logger.info(f"Respuesta de la predicción: {response.dict()}")
        return response
    except Exception as e:
        logger.error(f"Error en la predicción: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error en la predicción: {str(e)}")

@router.get("/model-info")
def get_model_info():
    model = get_model()
    return {
        "threshold": model.threshold,
        "feature_count": 30,
        "model_type": "MpNeurona"
    }