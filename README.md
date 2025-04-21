# Proyecto de Predicción de Cáncer de Mama

Este proyecto implementa un modelo de aprendizaje automático para predecir si un tumor de mama es maligno o benigno, basándose en un conjunto de características médicas. Se utiliza un modelo perceptrón simple (MpNeurona) para la clasificación y se expone una API RESTful construida con FastAPI para realizar predicciones.

## Descripción General

El objetivo principal de este proyecto es demostrar la creación de un modelo de clasificación simple y su despliegue a través de una API. El modelo se entrena con un dataset de características de tumores de mama y la API permite a los usuarios enviar estas características y obtener una predicción sobre la naturaleza del tumor.

## Tecnologías Utilizadas

* **Python:** Lenguaje de programación principal.
* **FastAPI:** Framework moderno y de alto rendimiento para construir APIs con Python.
* **scikit-learn:** Biblioteca de aprendizaje automático para Python (utilizada para el dataset y métricas).
* **joblib:** Biblioteca para serializar y deserializar objetos de Python (para guardar y cargar el modelo).
* **NumPy:** Biblioteca para computación numérica en Python.
* **Pydantic:** Biblioteca para la validación de datos y la gestión de la configuración.
* **Uvicorn:** Servidor ASGI para ejecutar aplicaciones FastAPI.

## Estructura del Proyecto

├── app/
│   ├── main.py           # Punto de entrada de la aplicación FastAPI
│   ├── models/
│   │   ├── mp_neurona.py   # Implementación del modelo MpNeurona
│   │   └── pydantic_models.py # Definiciones de modelos Pydantic para la API
│   └── routers/
│       └── prediction.py # Rutas de la API para la predicción
├── model/
│   └── mp_neurona.joblib # Modelo entrenado (se genera después de ejecutar train_model.py)
├── train_model.py      # Script para entrenar el modelo
├── requirements.txt    # Lista de dependencias del proyecto
├── README.md           # Este archivo
└── .gitignore          # Especifica los archivos que Git debe ignorar

## Configuración e Instalación

1.  **Clonar el repositorio (si aplica):**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <nombre_del_repositorio>
    ```

3.  **Instalar las dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

## Entrenamiento del Modelo

Ejecuta el script `train_model.py` para entrenar el modelo `MpNeurona` con el dataset de cáncer de mama y guardar el modelo entrenado en la carpeta `model`.

```bash
python train_model.py

