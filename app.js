// face back camera by default
var constraints = { video: { facingMode: "environment" }, audio: false };

const cameraView = document.querySelector("#camera-view");
const cameraOutput = document.querySelector("#pic-output");
const cameraSensor = document.querySelector("#camera-canvas");
const cameraTrigger = document.querySelector("#camera-btn");

const startButton = document.querySelector("#activate-btn");
    
// Access the device camera and stream to canvas
function cameraStart() {
    document.getElementById("full-cam-container").style.display = "block";
    
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
cameraTrigger.onclick = function() {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");

    //todo, change to button listener
};
// Start the video stream when the window loads
// window.addEventListener("load", cameraStart, false);

startButton.addEventListener("click", cameraStart); 