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

//for geolocation
var timesTried = 0;
var id; //for the registered handler, to unregister when done
let cumLat = 0;
let cumLon = 0;
let locationConfirmed = false;

function startGeolocation() {
    //reset each time app is started
    timesTried = 0;
    cumLat = 0;
    cumLon = 0;
    printedOnceGeoCheck = false;
    printedOnceSecureCheck = false;
    locationConfirmed = false;

    if(!navigator.geolocation){
        console.log("navigator.geolocation is not supported.");
        window.alert("navigator.geolocation is not supported.");
    } else {
        id = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
    }
}
    
// Access the device camera and stream to canvas
function startCamera() {
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
    // cameraOutput.style.width = (windowWidth-100) + "px";
    // cameraOutput.style.height = (windowHeight-100) + "px";

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

    //show camera
    cameraContainer.style.display = "block";
}

//geolocation methods
var geoOptions = {
    enableHighAccuracy: true,
    timeout: 500,
    maximumAge: 1000
};

var tempLat1 = 0;
var tempLon1 = 0;
var tempLat2 = 0;
var tempLon2 = 0;
var LatStr = "";
var LonStr = "";
var firstValLat = 0;
var firstValLon = 0;
function geoSuccess(pos) {
    var crd = pos.coords;

    // document.getElementById('debug-label').innerText = "DEBUG (attempt " + timesTried + ")";
    // document.getElementById('debug-lat').innerText = "Lat: " + crd.latitude;
    // document.getElementById('debug-lon').innerText = "Lon: " + crd.longitude;

    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);

    // cumLat += crd.latitude;
    // cumLon += crd.longitude;
    // console.log(`Temp Lat: ${cumLat}\nTemp Lon: ${cumLon}`)

    if (timesTried <= 2) {
        // //temp thing -- check 1st and 2nd numbers to see if the whole number has changed
        // if(timesTried == 0){
        //     tempLat1 = crd.latitude;
        //     tempLon1 = crd.longitude;
        // }
            
        // if(timesTried == 1){
        //     tempLat2 = crd.latitude;
        //     tempLon2 = crd.longitude;
        // }
        document.getElementById('debug-label').innerText = "DEBUG (attempt " + timesTried + ")";
        document.getElementById('debug-lat').innerText = "Lat: " + crd.latitude;
        document.getElementById('debug-lon').innerText = "Lon: " + crd.longitude;
    
        console.log('Your current position is:');
        console.log(`Latitude : ${crd.latitude}`);
        console.log(`Longitude: ${crd.longitude}`);

        LatStr = String(crd.latitude);
        LonStr = String(crd.longitude);
        firstValLat = parseFloat(LatStr.split('.')[0]);
        firstValLon = parseFloat(LonStr.split('.')[0]);
        console.log(`Temp Lat: ${firstValLat}\nTemp Lon: ${firstValLon}`)

        cumLat += parseFloat(LatStr.split('.')[1]);
        cumLon += parseFloat(LonStr.split('.')[1]);;
        console.log(`Temp Lat: ${cumLat}\nTemp Lon: ${cumLon}`)
    }

    if(timesTried == 3){
        navigator.geolocation.clearWatch(id);
        console.log("geo stopped");
        let divLat = cumLat / 3;
        let divLon = cumLon / 3;
        //debug bullshit, turn everything back into strings
        firstValLat = String(firstValLat); divLat =  String(divLat); firstValLon = String(firstValLon); divLon = String(divLon);
        let debugStringLat = firstValLat.concat(".", divLat);
        let debugStringLon = firstValLon.concat(".", divLon);
        let finalLat = parseFloat(debugStringLat);
        let finalLon = parseFloat(debugStringLon);
        // let finalLat = firstValLat + divLat;
        // let finalLon = firstValLon + divLon;

        document.getElementById('debug-label').innerText = "DEBUG (attempt " + timesTried + ") DONE";
        document.getElementById('debug-lat').innerText = "Avg Lat: " + finalLat;
        document.getElementById('debug-lon').innerText = "Avg Lon: " + finalLon;
        document.getElementById('debug-label').style.color = "green";
        document.getElementById('debug-lat').style.color = "green";
        document.getElementById('debug-lon').style.color = "green";

        console.log(`FINAL\nAvg Lat: ${finalLat}\nAvg Lon: ${finalLon}`)
        locationConfirmed = true
        //after location is confirmed, start camera
        if(locationConfirmed){
            document.getElementById("activate-btn-container").style.display = "none";
            startCamera();
        }
    }
    timesTried++;
}

function geoError(err) {
    // console.log(navigator.platform)
    // console.log(window.navigator.userAgentData.platform)
    var instructions = document.getElementById('err-instructions');
    if (!printedOnceSecureCheck && (document.location.protocol === "http:" || document.location.protocol === "file:" || document.location.protocol === "about:")) {
        printedOnceSecureCheck = true;
        window.alert("Geolocation is only allowed on a HTTPS (secure) connection.");
    }

    if (err.code == 1 && !printedOnceGeoCheck) {
        printedOnceGeoCheck = true;
        window.alert("Geolocation is required.\nPlease follow the displayed instructions.");
        if(navigator.platform === "iPhone"){
            instructions.innerText = "If browsing with Safari:\nGo to Settings > Location Services > Safari Website, and set to \"ask next time\" or \"while using the app.\"\nGo to Settings > Safari > Settings For Websites > Location, and set to \"Ask.\"\nReload Safari and the webpage.\nSelect \"allow once\" when prompted."
            track.stop();
            cameraContainer.style.display = "none";
            instructions.style.display = "block";
            console.log("phone error");
        }
        if(navigator.platform === "MacIntel"){
            instructions.innerText = "Go to Settings > Security and Privacy > Location Services, and enable access for your browser.\nReload the app and webpage."
            track.stop();
            cameraContainer.style.display = "none";
            instructions.style.display = "block";
            console.log("mac error");
        }
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
    //from FileSaver
    saveAs(imgPath, fileName);
});

// Start the app when the window loads
startButton.addEventListener("click", startGeolocation); 