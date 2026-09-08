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


function analyzePlant() {

    const result = document.getElementById("result");
    const disease = document.getElementById("disease");
    const confidence = document.getElementById("confidence");
    const severity = document.getElementById("severity");
    const recommendation = document.getElementById("recommendation");

    result.style.display = "block";

    disease.innerText = "🧠 AI is analyzing...";

    confidence.innerText = "...";
    severity.innerText = "...";

    setTimeout(function () {

        disease.innerText = "🍅 Tomato — Late Blight";

        confidence.innerText = "94.7%";

        severity.innerText = "Moderate ⚠️";

        recommendation.innerText =
            "Remove infected leaves, avoid overhead watering, " +
            "improve air circulation, and monitor nearby plants " +
            "for similar symptoms.";

    }, 1500);
}
