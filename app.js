// face back camera by default
var constraints = { video: { facingMode: "environment" }, audio: false };

const cameraView = document.querySelector("#camera-view");
const cameraOutput = document.querySelector("#pic-output");
const cameraSensor = document.querySelector("#camera-canvas");
const cameraButton = document.querySelector("#camera-btn");

const startButton = document.querySelector("#activate-btn");
const retakeButton = document.querySelector("#retake-btn");
const saveButton = document.querySelector("#upload-btn");
    
// Access the device camera and stream to canvas
function cameraStart() {
    document.getElementById("full-cam-container").style.display = "block";
    startButton.style.display = "none";
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("enumerateDevices is not supported.");
    } else{
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
    }
}
// Take a picture when button is tapped
cameraButton.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/png");
    cameraOutput.classList.add("taken");

    //hide anything camera related to show the preview / option buttons
    document.getElementById("full-cam-container").style.display = "none";
    document.getElementById("btn-container").style.display = "block";
};

retakeButton.onclick = function() {
    document.getElementById("full-cam-container").style.display = "block";
    cameraOutput.src = "//:0";
    cameraOutput.classList.remove("taken");
    document.getElementById("btn-container").style.display = "none";
};

// Start the video stream when the window loads
// window.addEventListener("load", cameraStart, false);
startButton.addEventListener("click", cameraStart); 