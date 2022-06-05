//JS ELEMENTS
const viewfinderContainer = document.querySelector("#full-viewfinder-container");
const cameraContainer = document.querySelector("#full-cam-container");
const cameraVid = document.querySelector("#camera-vid");
const cameraOutput = document.querySelector("#pic-output");
const cameraCanvas = document.querySelector("#camera-canvas");
const cameraButton = document.querySelector("#camera-btn");

const startButton = document.querySelector("#activate-btn");
const retakeButton = document.querySelector("#retake-btn");
const doneButton = document.querySelector("#done-btn");

//VARIABLES
const aspectRatioConst = 1.2;
// let windowWidth = 0;
// let windowHeight = 0;
// let calc = 0;

//------------------------------------------------------//

//METHODS
// Access the device camera and stream to canvas
function startCamera() {
    //remove start button
    document.getElementById("activate-btn-container").style.display = "none";

    //get screen size on start
    const windowWidth = window.outerWidth;
    const windowHeight = window.outerHeight;

    const calc = (windowWidth * aspectRatioConst);

    // format vid constraints face back camera by default
    const constraints = {
        audio: false,
        video: {
            facingMode: "environment",
            width: { min: windowWidth, ideal: windowWidth },
            height: { min: calc, ideal: calc },
        }
    };

    viewfinderContainer.height = windowHeight;
    // viewfinderContainer.style.backgroundColor = "#333";

    cameraVid.style.width = windowWidth + "px";
    cameraVid.style.height = calc + "px";

    // cameraCanvas.style.width = windowWidth + "px";
    // cameraCanvas.style.height = calc + "px";

    cameraOutput.width = windowWidth;
    cameraOutput.height = calc;

    cameraCanvas.width = windowWidth;
    cameraCanvas.height = calc;

    document.querySelector("#actual-cam").style.height = calc + "px";

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

    //tablet sizes?
    if(windowWidth >= 810){
        document.querySelector("#full-cam-container").style.paddingTop = 0;
    }

    //show camera
    cameraContainer.style.display = "block";
    document.querySelector("#full-viewfinder-container").style.backgroundColor = "#333";
}

//get filename to save img
function getFileName() {
    return "tree-kind_" + Date.now();
}

//------------------------------------------------------//

//EVENT LISTENERS
// Take a picture when button is tapped
cameraButton.addEventListener("click", function() {
    cameraCanvas.getContext("2d").drawImage(cameraVid, 0, 0);
    cameraOutput.src = cameraCanvas.toDataURL("image/png");
    cameraOutput.classList.add("taken");

    //hide anything camera related to show the preview / option buttons
    cameraContainer.style.display = "none";
    document.getElementById("result-container").style.display = "block";
});

retakeButton.addEventListener("click", function() {
    cameraOutput.src = "//:0";
    cameraOutput.classList.remove("taken");
    cameraCanvas.getContext("2d").clearRect(0, 0, cameraCanvas.width, cameraCanvas.height);
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
