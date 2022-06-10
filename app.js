//JS ELEMENTS
const viewfinderContainer = document.querySelector("#full-viewfinder-container");
const cameraContainer = document.querySelector("#camera-container");
const remainderContainer = document.querySelector("#remainder-container");
const cameraVid = document.querySelector("#camera-vid");
const cameraOutput = document.querySelector("#pic-output");
const cameraCanvas = document.querySelector("#camera-canvas");
const cameraButton = document.querySelector("#camera-btn");

const startButton = document.querySelector("#activate-btn");
const retakeButton = document.querySelector("#retake-btn");
const doneButton = document.querySelector("#done-btn");

doneButton.disabled = true;
doneButton.style.opacity="0.5";

//VARIABLES
const aspectRatioConst = 1.2;
var windowWidth = 0;
var calc=0;

//------------------------------------------------------//

//METHODS
// Access the device camera and stream to canvas
function startCamera() {
    //remove start button
    document.getElementById("activate-btn-container").style.display = "none";

    //get screen size on start
    windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    calc = (windowWidth * aspectRatioConst);

    // format vid constraints face back camera by default
    const constraints = {
        audio: false,
        video: {
            facingMode: "environment",
        }
    };

    viewfinderContainer.height = windowHeight;

    cameraVid.width = windowWidth;
    cameraVid.height = calc;

    cameraOutput.width = windowWidth;
    cameraOutput.height = calc;

    cameraCanvas.width = windowWidth;
    cameraCanvas.height = calc;

    document.querySelector("#wireframe").style.width = windowWidth + "px";
    document.querySelector("#wireframe").style.height = calc + "px";

    document.querySelector("#remainder-container").style.height = (windowHeight - calc) + "px";

    //camera permissions and such
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        console.log("navigator.mediaDevices or enumerateDevices() is not supported.");
        window.alert("navigator.mediaDevices or enumerateDevices() is not supported.");
    } else{
        navigator.mediaDevices
            .getUserMedia(constraints)
            .then(function(stream) {
            track = stream.getTracks()[0];
            cameraVid.srcObject = stream;
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
    remainderContainer.style.display = "block";
    document.querySelector("#full-viewfinder-container").style.backgroundColor = "#333";
}

//get filename to save img
// function getFileName() {
//     return "tree-kind_" + Date.now();
// }

//------------------------------------------------------//

//EVENT LISTENERS
// Take a picture when button is tapped
cameraButton.addEventListener("click", function() {
    cameraCanvas.getContext("2d").drawImage(cameraVid, 0, 0, cameraVid.videoWidth, cameraVid.videoHeight, 0, 0, windowWidth, calc);
    cameraOutput.src = cameraCanvas.toDataURL("image/png");
    cameraOutput.classList.add("taken");

    //hide anything camera related to show the preview / option buttons
    cameraContainer.style.display = "none";
    remainderContainer.style.display = "none";
    document.getElementById("result-container").style.display = "block";
});

retakeButton.addEventListener("click", function() {
    cameraOutput.src = "//:0";
    cameraOutput.classList.remove("taken");
    cameraCanvas.getContext("2d").clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
    cameraContainer.style.display = "block";
    remainderContainer.style.display = "block";
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
