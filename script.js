const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const analyzeButton = document.getElementById("analyzeButton");

imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = "block";
            analyzeButton.style.display = "inline-block";
        };

        reader.readAsDataURL(file);
    }
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

    const formData = new FormData();
    formData.append("image", file);

    try {

        const response = await fetch(
            "https://stress-carwash-certified.ngrok-free.dev/predict",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Prediction failed");
        }

        disease.innerText = "🌱 " + data.disease;
        confidence.innerText = data.confidence + "%";
        severity.innerText = data.severity;
        recommendation.innerText = data.recommendation;

    } catch (error) {

        console.error(error);

        disease.innerText = "❌ Connection Error";
        confidence.innerText = "--";
        severity.innerText = "--";
        recommendation.innerText =
            "Could not connect to the AI backend. Make sure Flask and ngrok are running.";
    }
}


        
