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

## Configuración e Instalación

1.  **Clonar el repositorio (si aplica):**
    ```bash
    git clone <https://github.com/JoelCaza/Cancer_Predictior.git>
    cd <Cancer_Predictior>
    ```

3.  **Instalar las dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

## Entrenamiento del Modelo

Ejecuta el script `train_model.py` para entrenar el modelo `MpNeurona` con el dataset de cáncer de mama y guardar el modelo entrenado en la carpeta `model`.

```bash
python train_model.py

