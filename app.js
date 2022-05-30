//JS ELEMENTS
const cameraContainer = document.querySelector("#full-cam-container");
const cameraView = document.querySelector("#camera-view");
const cameraOutput = document.querySelector("#pic-output");
const cameraCanvas = document.querySelector("#camera-canvas");
const cameraButton = document.querySelector("#camera-btn");

const startButton = document.querySelector("#activate-btn");
const retakeButton = document.querySelector("#retake-btn");
const doneButton = document.querySelector("#done-btn");

//CONST VARIABLES
const aspectRatioConst = 1.2;

// face back camera by default
const constraints = { video: { facingMode: "environment" }, audio: false };

//------------------------------------------------------//

//METHODS
// Access the device camera and stream to canvas
function startCamera() {
    //remove start button
    document.getElementById("activate-btn-container").style.display = "none";

    //get screen size on start
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    cameraContainer.style.width = windowWidth + "px";
    cameraContainer.style.height = windowHeight + "px";

    cameraView.style.width = windowWidth + "px";
    cameraView.style.height = windowHeight + "px";

    cameraCanvas.style.width = windowWidth + "px";
    cameraCanvas.style.height = windowHeight + "px";

    //WIREFRAME IS STYLED IN CSS
    //KEEP OUTPUT THE SAME
    cameraOutput.style.width = windowWidth + "px";
    cameraOutput.style.height = (windowWidth * aspectRatioConst) + "px";

    //camera permissions and such
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("navigator.mediaDevices or enumerateDevices() is not supported.");
        window.alert("navigator.mediaDevices or enumerateDevices() is not supported.");
    } else{
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            if(error.name == "NotAllowedError"){
                console.error("NotAllowedError:", error);
                cameraContainer.innerHTML = "Camera error - page reload required."
                window.alert("Camera access is required. Please reload the page and allow camera access.");
            } else {
               console.error("Camera error:", error);
               cameraContainer.innerHTML = "Camera error - pleae check console."
            }
        });
    }

    //show camera
    cameraContainer.style.display = "block";
}

//get filename to save img
function getFileName() {
    return "tree-kind_" + Date.now();
}

//------------------------------------------------------//

//EVENT LISTENERS
// Take a picture when button is tapped
cameraButton.addEventListener("click", function() {
    cameraCanvas.width = cameraView.videoWidth;
    cameraCanvas.height = cameraView.videoHeight;
    cameraCanvas.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraCanvas.toDataURL("image/png");
    cameraOutput.classList.add("taken");

    //hide anything camera related to show the preview / option buttons
    cameraContainer.style.display = "none";
    document.getElementById("result-container").style.display = "block";
});

retakeButton.addEventListener("click", function() {
    cameraOutput.src = "//:0";
    cameraOutput.classList.remove("taken");
    // cameraCanvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    cameraContainer.style.display = "block";
    document.getElementById("result-container").style.display = "none";
});

//do whatever to next window here
// doneButton.addEventListener("click", function() {
//     let imgPath = cameraOutput.getAttribute("src");
//     let fileName = getFileName();
//     //from FileSaver
//     saveAs(imgPath, fileName);
// });

// Start the app when the window loads
startButton.addEventListener("click", startCamera); 
