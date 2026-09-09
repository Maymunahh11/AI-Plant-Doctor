import os
import numpy as np
import tensorflow as tf
from PIL import Image
from flask import Flask, request, jsonify, send_file

app = Flask(__name__)

MODEL_PATH = "plant_disease_model.keras"

print("Loading AI Plant Doctor model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")

class_names = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]


def predict_image(image):
    image = Image.open(image).convert("RGB")
    image = image.resize((224, 224))

    image_array = np.array(image, dtype=np.float32)
    image_array = np.expand_dims(image_array, axis=0)

    prediction = model.predict(image_array, verbose=0)

    index = int(np.argmax(prediction[0]))
    confidence = float(prediction[0][index]) * 100

    disease = class_names[index]

    if "healthy" in disease.lower():
        severity = "Healthy ✅"
        recommendation = (
            "The plant appears healthy. Continue regular watering, "
            "proper nutrition and regular monitoring."
        )
    else:
        severity = "Needs Attention ⚠️"
        recommendation = (
            "The plant may be affected by this disease. Remove severely "
            "affected leaves, maintain good air circulation, avoid "
            "excessive moisture on leaves and consider appropriate treatment."
        )

    disease = disease.replace("___", " — ").replace("_", " ")

    return {
        "disease": disease,
        "confidence": f"{confidence:.2f}%",
        "severity": severity,
        "recommendation": recommendation
    }


@app.route("/predict", methods=["POST"])
def predict():

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]

    try:
        result = predict_image(file)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/")
def home():
    return """
    <h1>🌿🩺 AI Plant Doctor</h1>
    <p>AI Plant Disease Detection System</p>
    <p>Model: MobileNetV2</p>
    <p>Classes: 38</p>
    <p>Status: Running ✅</p>
    """


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )
