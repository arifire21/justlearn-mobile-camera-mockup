// face back camera by default
const constraints = { video: { facingMode: "environment" }, audio: false };

const cameraContainer = document.querySelector("#full-cam-container");
const cameraView = document.querySelector("#camera-view");
const cameraOutput = document.querySelector("#pic-output");
const cameraCanvas = document.querySelector("#camera-canvas");
const cameraButton = document.querySelector("#camera-btn");

const startButton = document.querySelector("#activate-btn");
const retakeButton = document.querySelector("#retake-btn");
const saveButton = document.querySelector("#upload-btn");

const coordinateDisplay = document.querySelector("#coord-num");
const readyText = document.querySelector("#ready-text");

//const variables
const aspectRatioConst = 1.5;

//variables for geolocation
var timesTried = 0;
var id; //for the registered handler, to unregister when done
var longitudeArr = [];
var latitudeArr = [];
var lastStoredLon = 0.0;
var lastStoredLat = 0.0;
var tempLat1 = 0.0;
var tempLon1 = 0.0;

function startGeolocation() {
    if(!navigator.geolocation){
        console.log("navigator.geolocation is not supported.");
        window.alert("navigator.geolocation is not supported.");
    } else {
        id = navigator.geolocation.watchPosition(geoSuccess, geoError, geoOptions);
    }
}
    
// Access the device camera and stream to canvas
function startCamera() {
    //remove start button
    document.getElementById("activate-btn-container").style.display = "none";

    //reset each time app is started
    timesTried = 0;
    printedOnceGeoCheck = false;
    printedOnceSecureCheck = false;
    longitudeArr = [];
    latitudeArr = [];
    lastStoredLon = 0.0;
    lastStoredLat = 0.0;
    tempLat1 = 0.0;
    tempLon1 = 0.0;
    // document.getElementById('debug-label').style.color = "black";
    // document.getElementById('debug-lat').style.color = "black";
    // document.getElementById('debug-lon').style.color = "black";
    coordinateDisplay.style.color = "red";
    readyText.innerText = "NOT READY TO CAPTURE";
    readyText.style.color = "red";

    //get screen size on start
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    //adjust sizes of everything #camera, #camera-view, #camera-canvas
    cameraContainer.style.width = windowWidth + "px";
    cameraContainer.style.height = (windowWidth * aspectRatioConst) + "px";

    cameraView.style.width = windowWidth + "px";
    cameraView.style.height = (windowWidth * aspectRatioConst) + "px";

    cameraCanvas.style.width = windowWidth + "px";
    cameraCanvas.style.height = (windowWidth * aspectRatioConst) + "px";

    //also adjust size of prompt
    document.getElementById("Layer_1").style.width = windowWidth + "px";
    document.getElementById("Layer_1").style.height = (windowWidth * aspectRatioConst) + "px";

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
            //todo -- find a way to specifically look for NotAllowedError?
            console.error("Camera error:", error);
            cameraContainer.innerHTML = "Camera error - page reload required."
            window.alert("Camera access is required. Please reload the page and allow camera access.");
        });
    }

    //show camera
    cameraContainer.style.display = "block";
    readyText.style.display = "block";
    coordinateDisplay.style.display = "block";
    //disable button until reached 10 readings
    cameraButton.disabled = true;
    cameraButton.style.opacity = "0.5";

    startGeolocation()
}

//geolocation methods
var geoOptions = {
    enableHighAccuracy: true,
    timeout: 4000,
    maximumAge: 5000
};

function geoSuccess(pos) {
    var crd = pos.coords;

    //get geolocation constantly
    // document.getElementById('debug-label').innerText = "DEBUG (attempt " + timesTried + ")";
    // document.getElementById('debug-lat').innerText = "Lat: " + crd.latitude;
    // document.getElementById('debug-lon').innerText = "Lon: " + crd.longitude;
    console.log(`ATTEMPT : ${timesTried}`);
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);

    //add to arrays
    if(longitudeArr.length == 10){
        longitudeArr.splice(0, 1); //remove first (oldest) item
        longitudeArr.push(crd.longitude); //add newest item
    } else{
        longitudeArr.push(crd.longitude);
    }
    
    if(latitudeArr.length == 10){
        latitudeArr.splice(0, 1); //remove first (oldest) item
        latitudeArr.push(crd.latitude); //add newest item
    } else{
        latitudeArr.push(crd.latitude);
    }

    //NOTE: let timesTried increment first bc the user will probably not know attempt 0 is really the 1st one
    timesTried++;
    coordinateDisplay.innerText = timesTried + "/10 readings";
    
    //at end of loop bc of how this is incrememnted
    if(timesTried == 10){ //0-9 = 10 readings
        //activate button
        cameraButton.disabled = false;
        cameraButton.style.opacity = "1.0";
        coordinateDisplay.style.color = "lightgreen";
        readyText.innerText = "READY TO CAPTURE";
        readyText.style.color = "lightgreen";
    }
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
            document.getElementById("activate-btn-container").style.display = "none";
            instructions.style.display = "block";
            cameraContainer.style.display = "none";
            console.log("phone error");
        }
        if(navigator.platform === "MacIntel"){
            instructions.innerText = "Go to Settings > Security and Privacy > Location Services, and enable access for your browser.\nReload the app and webpage."
            track.stop();
            document.getElementById("activate-btn-container").style.display = "none";
            instructions.style.display = "block";
            cameraContainer.style.display = "none";
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

    //geolocation stuff
    navigator.geolocation.clearWatch(id);
    console.log("geo stopped");

    //calculating avgs
    let finalLat = 0.0; let finalLon = 0.0;

    latitudeArr.forEach(element => {
        tempLat1 += element;
    });

    longitudeArr.forEach(element => {
        tempLon1 += element;
    });

    finalLat = tempLat1 / latitudeArr.length;
    console.log(`${tempLat1} \\ ${latitudeArr.length} = ${finalLat}`);
    finalLon = tempLon1 / longitudeArr.length;
    console.log(`${tempLon1} \\ ${longitudeArr.length} = ${finalLon}`);

    //for coordinate display?
    lastStoredLat = latitudeArr[latitudeArr.length-1];
    lastStoredLon = longitudeArr[longitudeArr.length-1];

    console.log("Lat vals: " + latitudeArr);
    console.log("Lon vals: " + longitudeArr);

    // document.getElementById('debug-label').innerText = "DEBUG (attempt " + timesTried + ") DONE";
    // document.getElementById('debug-lat').innerText = "Avg Lat: " + finalLat + "\nLast Stored Lat: " + lastStoredLat;
    // document.getElementById('debug-lon').innerText = "Avg Lon: " + finalLon + "\nLast Stored Lon: " + lastStoredLon;
    // document.getElementById('debug-label').style.color = "green";
    // document.getElementById('debug-lat').style.color = "green";
    // document.getElementById('debug-lon').style.color = "green";


    //hide anything camera related to show the preview / option buttons
    cameraContainer.style.display = "none";
    readyText.style.display = "none";
    coordinateDisplay.style.display = "none";
    document.getElementById("btn-container").style.display = "block";
    document.getElementById("activate-btn-container").style.display = "block";
});

// retakeButton.addEventListener("click", function() {
//     cameraContainer.style.display = "block";
//     cameraOutput.src = "//:0";
//     cameraOutput.classList.remove("taken");
//     document.getElementById("btn-container").style.display = "none";
//     // cameraCanvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
// });

// saveButton.addEventListener("click", function() {
//     let imgPath = cameraOutput.getAttribute("src");
//     let fileName = getFileName();
//     //from FileSaver
//     saveAs(imgPath, fileName);
// });

// Start the app when the window loads
startButton.addEventListener("click", startCamera); 
