```javascript
const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const analyzeButton = document.getElementById("analyzeButton");

const API_URL = "https://ai-plant-doctor-backend.onrender.com/predict";

imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
        preview.style.display = "none";
        analyzeButton.style.display = "none";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = "block";
        analyzeButton.style.display = "inline-block";
    };

    reader.readAsDataURL(file);
});

async function analyzePlant() {

    const file = imageInput.files[0];

    if (!file) {
        alert("Please choose a plant leaf image first.");
        return;
    }

    const result = document.getElementById("result");
    const disease = document.getElementById("disease");
    const confidence = document.getElementById("confidence");
    const severity = document.getElementById("severity");
    const recommendation = document.getElementById("recommendation");

    result.style.display = "block";

    disease.innerText = "🧠 AI is analyzing...";
    confidence.innerText = "...";
    severity.innerText = "...";
    recommendation.innerText = "Please wait...";

    analyzeButton.disabled = true;

    const formData = new FormData();
    formData.append("image", file);

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Prediction failed");
        }

        disease.innerText = "🌱 " + data.disease;
        confidence.innerText = data.confidence;
        severity.innerText = data.severity;
        recommendation.innerText = data.recommendation;

    } catch (error) {

        console.error("AI Plant Doctor Error:", error);

        disease.innerText = "❌ Connection Error";
        confidence.innerText = "--";
        severity.innerText = "--";
        recommendation.innerText =
            "The AI server could not process this image. Please try again.";

    } finally {

        analyzeButton.disabled = false;

    }
}
```
