// face back camera by default
const constraints = { video: { facingMode: "environment" }, audio: false };

const cameraContainer = document.getElementById("full-cam-container");
const cameraView = document.querySelector("#camera-view");
const cameraOutput = document.querySelector("#pic-output");
const cameraCanvas = document.querySelector("#camera-canvas");
const cameraButton = document.querySelector("#camera-btn");

const startButton = document.querySelector("#activate-btn");
const retakeButton = document.querySelector("#retake-btn");
const saveButton = document.querySelector("#upload-btn");
    
// Access the device camera and stream to canvas
function cameraStart() {
    //get screen size on start
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    //adjust sizes of everything #camera, #camera-view, #camera-canvas
    //todo, full width and aspect height
    cameraContainer.style.width = windowWidth + "px";
    cameraContainer.style.height = windowHeight + "px";
    
    cameraView.style.width = windowWidth + "px";
    cameraView.style.height = windowHeight + "px";

    cameraCanvas.style.width = windowWidth + "px";
    cameraCanvas.style.height = windowHeight + "px";

    //also adjust size of prompt
    document.getElementById("Layer_1").style.height = windowWidth + "px";
    document.getElementById("Layer_1").style.height = windowHeight + "px";

    //make output slightly smaller?
    //todo set width when actually saving img
    cameraOutput.style.width = (windowWidth-100) + "px";
    cameraOutput.style.height = (windowHeight-100) + "px";
    
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
            //todo -- find a way to specifically look for NotAllowedError?
            console.error("Camera error:", error);
            cameraContainer.innerHTML = "Camera error - page reload required."
            window.alert("Camera access is required. Please reload the page and allow camera access.");
        });
    }

    //wip-geolocation
    if(!navigator.geolocation){
        console.log("navigator.geolocation is not supported.");
        window.alert("navigator.geolocation is not supported.");
    } else {
        var location = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
    }

    //show camera, hide start button
    cameraContainer.style.display = "block";
    document.getElementById("activate-btn-container").style.display = "none";
}

//geolocation methods
var geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function geoSuccess(pos) {
    var crd = pos.coords;

    document.getElementById('debug-lat').innerText = "Lat: " + crd.latitude;
    document.getElementById('debug-lon').innerText = "Lon: " + crd.longitude;

    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
}

function geoError(err) {
    if (document.location.protocol === "http:" || document.location.protocol === "file:" || document.location.protocol === "about:") {
        window.alert("Geolocation is only allowed on a HTTPS (secure) connection.");
    }
    if (err.code == 1) {
        window.alert("Geolocation is required. Please reload the page and allow geolocation access.");
        // cameraContainer.innerHTML = "Error - page reload required."
    }
    console.warn(`ERROR(${err.code}): ${err.message}`);
}
    

//get filename to save img
function getFileName() {
    return "tree-kind_" + Date.now();
}

// Take a picture when button is tapped
cameraButton.addEventListener("click", function() {
    cameraCanvas.width = cameraView.videoWidth;
    cameraCanvas.height = cameraView.videoHeight;
    cameraCanvas.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraCanvas.toDataURL("image/png");
    cameraOutput.classList.add("taken");

    //hide anything camera related to show the preview / option buttons
    cameraContainer.style.display = "none";
    document.getElementById("btn-container").style.display = "block";
});

retakeButton.addEventListener("click", function() {
    cameraContainer.style.display = "block";
    cameraOutput.src = "//:0";
    cameraOutput.classList.remove("taken");
    document.getElementById("btn-container").style.display = "none";
    // cameraCanvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
});

saveButton.addEventListener("click", function() {
    let imgPath = cameraOutput.getAttribute("src");
    let fileName = getFileName();

    saveAs(imgPath, fileName);
});

// Start the video stream when the window loads
// window.addEventListener("load", cameraStart, false);
startButton.addEventListener("click", cameraStart); 