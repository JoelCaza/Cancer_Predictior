# app/models/mp_neurona.py (sin cambios)
import numpy as np
from sklearn.metrics import accuracy_score

class MpNeurona:
    def __init__(self):
        self.threshold = None
    
    def model(self, x):
        z = sum(x)
        return (z >= self.threshold)
    
    def predict(self, X):
        Y = []
        for x in X:
            result = self.model(x)
            Y.append(result)
        return np.array(Y)
    
    def fit(self, X, Y):
        accuracy = {}
        for th in range(X.shape[1] + 1):
            self.threshold = th
            Y_pred = self.predict(X)
            accuracy[th] = accuracy_score(Y_pred, Y)
        self.threshold = max(accuracy, key=accuracy.get)
        return self.threshold