# app/utils/data_processing.py
import pandas as pd
import numpy as np

def binarize_features(data_dict):
    """
    Binariza las características según un umbral (similar a pd.cut con bins=2)
    """
    # Convertir el diccionario de características a DataFrame
    df = pd.DataFrame([data_dict])
    
    # Aplicar binarización
    df_binary = df.apply(lambda x: pd.cut(x, bins=2, labels=[1, 0])).astype(int)
    
    return df_binary.values[0]
