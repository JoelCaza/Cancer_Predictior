// script.js

// Variable global para la URL de la API
let API_URL = localStorage.getItem('apiUrl') || 'http://localhost:8000';

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Cargar la URL guardada
    document.getElementById('apiUrlInput').value = API_URL;

    // Verificar la conexión a la API y cargar información del modelo
    testApiConnection();
    fetchModelInfo();
});

// Guardar cambios en la URL de la API
document.getElementById('saveApiUrl').addEventListener('click', function() {
    const newUrl = document.getElementById('apiUrlInput').value.trim();
    if (newUrl) {
        API_URL = newUrl;
        localStorage.setItem('apiUrl', API_URL);

        // Mostrar mensaje de confirmación
        const apiStatus = document.getElementById('apiStatus');
        apiStatus.innerHTML = `
            <div class="alert alert-info alert-dismissible fade show" role="alert">
                URL de la API guardada: <strong>${API_URL}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;

        // Probar la conexión
        testApiConnection();
        fetchModelInfo();
    }
});

// Botón para probar la conexión a la API
document.getElementById('testApiBtn').addEventListener('click', function() {
    testApiConnection();
});

// Función para verificar la conexión a la API
async function testApiConnection() {
    const apiStatus = document.getElementById('apiStatus');
    apiStatus.innerHTML = `
        <div class="alert alert-info" role="alert">
            Comprobando conexión a la API...
        </div>
    `;

    try {
        // Intentar conectarse al endpoint raíz
        const response = await fetch(`${API_URL}/`);
        if (response.ok) {
            apiStatus.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ✅ Conexión exitosa. La API está funcionando correctamente.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        } else {
            apiStatus.innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    ⚠️ Se ha conectado al servidor pero la respuesta no fue la esperada. Código: ${response.status}
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }
    } catch (error) {
        apiStatus.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ❌ No se pudo conectar a la API en ${API_URL}.
                Error: ${error.message}
                <br><br>
                <strong>Posibles soluciones:</strong>
                <ul>
                    <li>Asegúrese de que la API esté ejecutándose</li>
                    <li>Verifique que la URL sea correcta</li>
                    <li>Revise si hay problemas de CORS (ejecute la API con las opciones de CORS necesarias)</li>
                    <li>Si está usando localhost, asegúrese que el backend y frontend estén en el mismo puerto o que CORS esté configurado</li>
                </ul>
                <br>
                <em>Comando para iniciar la API: <code>uvicorn app.main:app --reload</code></em>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
    }
}

// Función para obtener información del modelo
async function fetchModelInfo() {
    try {
        const response = await fetch(`${API_URL}/prediction/model-info`);
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();

        const modelInfoElement = document.getElementById('modelInfo');
        modelInfoElement.innerHTML = `
            <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Tipo de Modelo
                    <span class="badge bg-primary rounded-pill">${data.model_type}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Umbral (Threshold)
                    <span class="badge bg-info rounded-pill">${data.threshold}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    Cantidad de Características
                    <span class="badge bg-success rounded-pill">${data.feature_count}</span>
                </li>
                ${data.accuracy !== undefined ? `<li class="list-group-item d-flex justify-content-between align-items-center">Precisión<span class="badge bg-warning rounded-pill">${(data.accuracy * 100).toFixed(2)}%</span></li>` : ''}
            </ul>
        `;
    } catch (error) {
        console.error('Error al obtener información del modelo:', error);
        document.getElementById('modelInfo').innerHTML = `
            <div class="alert alert-danger" role="alert">
                <strong>No se pudo obtener la información del modelo</strong>
                <p>Error: ${error.message}</p>
                <p>Verifica que la API esté funcionando y que la URL sea correcta.</p>
            </div>
        `;
    }
}

// Función para verificar y mostrar errores de validación
function validateForm() {
    let isValid = true;
    const validationError = document.getElementById('validationError');
    validationError.style.display = 'none';

    // Obtener todos los inputs del formulario requeridos
    const requiredInputs = document.querySelectorAll('#predictionForm input[required]');

    requiredInputs.forEach(input => {
        if (input.value.trim() === '' || isNaN(parseFloat(input.value))) {
            input.classList.add('is-invalid');
            isValid = false;
        } else {
            input.classList.remove('is-invalid');
        }
    });

    if (!isValid) {
        validationError.style.display = 'block';
        validationError.scrollIntoView({ behavior: 'smooth' });
    }

    return isValid;
}

// Manejar envío del formulario con validación manual
document.getElementById('predictionForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    if (!validateForm()) {
        return;
    }

    document.querySelector('.spinner-border').style.display = 'block';
    document.querySelector('.result-card').style.display = 'none';

    const formData = new FormData(this);
    const jsonData = {};

    formData.forEach((value, key) => {
        jsonData[key] = parseFloat(value);
    });

    try {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(jsonData)
        };

        console.log('Enviando solicitud a:', `${API_URL}/prediction/predict`);
        console.log('Datos enviados:', JSON.stringify(jsonData, null, 2));

        const response = await fetch(`${API_URL}/prediction/predict`, requestOptions);
        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (parseError) {
            throw new Error(`Error al analizar la respuesta JSON: ${parseError.message}. Texto recibido: ${responseText}`);
        }

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        document.querySelector('.spinner-border').style.display = 'none';
        const resultCard = document.querySelector('.result-card');
        resultCard.style.display = 'block';

        const predictionResult = document.getElementById('predictionResult');
        const progressBar = document.querySelector('.progress-bar');
        const probabilityText = document.getElementById('probabilityText');
        const debugInfo = document.getElementById('debugInfo');
        const accuracyResult = document.getElementById('accuracyResult'); // Obtén el nuevo elemento

        const resultText = data.prediction === 1 ? 'Benigno' : 'Maligno';
        const alertClass = data.prediction === 1 ? 'alert-success' : 'alert-danger';

        predictionResult.innerHTML = `
            <div class="alert ${alertClass}" role="alert">
                <h4 class="alert-heading">${resultText}</h4>
                <p>La predicción indica que el tumor es <strong>${resultText}</strong>.</p>
            </div>
        `;

        const probability = data.probability * 100;
        progressBar.style.width = `${probability}%`;
        progressBar.setAttribute('aria-valuenow', probability);
        progressBar.textContent = `${probability.toFixed(2)}%`;

        if (data.prediction === 1) {
            progressBar.classList.remove('bg-danger');
            progressBar.classList.add('bg-success');
        } else {
            progressBar.classList.remove('bg-success');
            progressBar.classList.add('bg-danger');
        }

        probabilityText.innerHTML = `
            <p>Probabilidad de que sea ${resultText}: ${probability.toFixed(2)}%</p>
            <small class="text-muted">Basado en ${data.features_used.length} características analizadas</small>
        `;

        // Mostrar la precisión
        if (data.accuracy !== undefined) {
            accuracyResult.innerHTML = `<p class="mt-2"><strong>Precisión del modelo:</strong> ${ (data.accuracy * 100).toFixed(2) }%</p>`;
        } else {
            accuracyResult.innerHTML = `<p class="mt-2 text-warning">Precisión no disponible en la respuesta.</p>`;
        }

        debugInfo.textContent = `Respuesta completa de la API:
${JSON.stringify(data, null, 2)}

Endpoint: ${API_URL}/prediction/predict
Estado: ${response.status} ${response.statusText}
`;

        resultCard.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('Error al realizar la predicción:', error);
        document.querySelector('.spinner-border').style.display = 'none';
        const resultCard = document.querySelector('.result-card');
        resultCard.style.display = 'block';
        const predictionResult = document.getElementById('predictionResult');
        const debugInfo = document.getElementById('debugInfo');
        const accuracyResult = document.getElementById('accuracyResult'); // Asegúrate de obtenerlo también en caso de error

        predictionResult.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <h4 class="alert-heading">Error al realizar la predicción</h4>
                <p>${error.message}</p>
                <hr>
                <p class="mb-0">Verifica que:</p>
                <ul>
                    <li>La API esté en funcionamiento</li>
                    <li>La URL sea correcta: <code>${API_URL}</code></li>
                    <li>Los 30 campos requeridos se hayan completado con valores numéricos</li>
                </ul>
            </div>
        `;
        accuracyResult.innerHTML = ''; // Limpia el resultado de precisión en caso de error
        debugInfo.textContent = `Error: ${error.message}\n\nDatos enviados:\n${JSON.stringify(jsonData, null, 2)}\n\nEndpoint: ${API_URL}/prediction/predict`;
        debugInfo.style.display = 'block';
    }
});

document.getElementById('toggleDebugBtn').addEventListener('click', function() {
    const debugInfo = document.getElementById('debugInfo');
    debugInfo.style.display = debugInfo.style.display === 'none' ? 'block' : 'none';
    this.textContent = debugInfo.style.display === 'none' ? 'Mostrar detalles técnicos' : 'Ocultar detalles técnicos';
});

document.getElementById('fillSampleBtn').addEventListener('click', function() {
    const sampleData = {
        mean_radius: 14.127, mean_texture: 19.289, mean_perimeter: 91.969, mean_area: 654.889, mean_smoothness: 0.096,
        mean_compactness: 0.104, mean_concavity: 0.088, mean_concave_points: 0.048, mean_symmetry: 0.181, mean_fractal_dimension: 0.063,
        radius_error: 0.405, texture_error: 1.216, perimeter_error: 2.866, area_error: 40.337, smoothness_error: 0.007,
        compactness_error: 0.025, concavity_error: 0.031, concave_points_error: 0.011, symmetry_error: 0.015, fractal_dimension_error: 0.003,
        worst_radius: 16.269, worst_texture: 25.677, worst_perimeter: 107.261, worst_area: 880.583, worst_smoothness: 0.132,
        worst_compactness: 0.254, worst_concavity: 0.272, worst_concave_points: 0.114, worst_symmetry: 0.290, worst_fractal_dimension: 0.083
    };

    for (const [key, value] of Object.entries(sampleData)) {
        const input = document.getElementById(key);
        if (input) {
            input.value = value;
            input.classList.remove('is-invalid');
        }
    }
    document.getElementById('validationError').style.display = 'none';
});

document.querySelectorAll('#predictionForm input').forEach(input => {
    input.addEventListener('input', function() {
        if (this.hasAttribute('required') && (this.value.trim() === '' || isNaN(parseFloat(this.value)))) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });
});