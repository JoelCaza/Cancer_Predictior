"""
Script para entrenar el modelo MpNeurona con los datos de cáncer de mama de sklearn
"""
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
import pandas as pd
import joblib
import os
import sys

# Agregar el directorio raíz al path para importar los módulos de la app
sys.path.append('.')
from app.models.mp_neurona import MpNeurona

def train_and_save_model():
    # Crear directorio para el modelo si no existe
    os.makedirs("model", exist_ok=True)

    # Cargar los datos
    print("Cargando dataset de cáncer de mama...")
    cancer_mama = load_breast_cancer()
    X = cancer_mama.data
    Y = cancer_mama.target

    # Convertir a DataFrame
    print("Preparando datos...")
    df = pd.DataFrame(X, columns=cancer_mama.feature_names)

    # Dividir los datos
    x_train, x_test, y_train, y_test = train_test_split(df, Y, stratify=Y, random_state=42)
    print(f"Datos divididos: {len(x_train)} muestras de entrenamiento, {len(x_test)} muestras de prueba")

    # Binarizar las características (convertir a valores 0 y 1)
    print("Binarizando características...")
    X_train_bin = x_train.apply(lambda x: pd.cut(x, bins=2, labels=[1, 0])).astype(int)

    # Crear y entrenar el modelo
    print("Entrenando modelo MpNeurona...")
    neurona = MpNeurona()
    threshold = neurona.fit(X_train_bin.values, y_train)
    
    # Evaluar el modelo
    X_test_bin = x_test.apply(lambda x: pd.cut(x, bins=2, labels=[1, 0])).astype(int)
    y_pred = neurona.predict(X_test_bin.values)
    from sklearn.metrics import accuracy_score
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Entrenamiento completado. Threshold óptimo: {threshold}")
    print(f"Precisión del modelo en datos de prueba: {accuracy:.4f}")

    # Guardar el modelo entrenado
    model_path = "model/mp_neurona.joblib"
    joblib.dump(neurona, model_path)
    print(f"Modelo guardado en {model_path}")

if __name__ == "__main__":
    train_and_save_model()
    print("Ejecutando script de entrenamiento...")
