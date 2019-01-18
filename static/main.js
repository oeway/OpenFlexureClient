var apiVersion = "v1"
var hostName
var hostPort
var baseURI

// Key IDs
var pgupKeyID = 33;
var pgdnKeyID = 34;

var leftKeyID = 37;
var upKeyID = 38;
var rightKeyID = 39;
var downKeyID = 40;

var enterKeyID = 13;
var escKeyID = 27;

var keysDown = {}; //Array of keys down

var stageVelocity = 50;  
var focusVelocity = 20;

var requestLock = false;

// Microscope client-side callibration
//TODO: Move to serverside microscope property
var fovX =  4100;
var fovY = 3146;

window.onload = function() {
    setHostFromInput()
    getStagePositions()
    updateTextBoxes()
    getCaptures()
}


// Cosmetic methods
function toggleClassToDiv(div_id, class_name) {
    document.getElementById(div_id).classList.toggle(class_name)
}

// Setup methods
function setHostFromInput() {
    hostName = document.getElementById('microscopeHostInput').value;
    hostPort = document.getElementById('microscopePortInput').value;

    baseURI = `http://${hostName}:${hostPort}/api/${apiVersion}`

    streamContent = `<img src="${baseURI}/stream" ondblclick="clickHotspotImage(event);">`
    document.getElementById("streambox").innerHTML = streamContent;
}

// Microscope methods

function deleteCapture(capture_id) {
    function deleteCaptureCallback(response, status) {
        console.log(status);
        getCaptures();
    }
    var r = confirm("Warning! This will delete all copies of this capture from the Raspberry Pi. Click OK to proceed.");
    if (r == true) {
        safeRequest("DELETE", baseURI+"/camera/capture/"+capture_id+"/", null, deleteCaptureCallback, false)
    }
}

function deleteAllCaptures() {
    function deleteAllCapturesCallback(response, status) {
        console.log(status);
        getCaptures();
    }
    var r = confirm("Warning! This will delete all copies of all captures from the Raspberry Pi. Click OK to proceed.");
    if (r == true) {
        safeRequest("DELETE", baseURI+"/camera/capture/", null, deleteAllCapturesCallback, false)
    }
}

function getCaptures() {
    function updateCapturesCallback(response, status) {
        console.log(status);
        updateCaptureList(response);
    }
    safeRequest("GET", baseURI+"/camera/capture", null, updateCapturesCallback, false)
}

function updateCaptureList(response) {
    // Clear captures list
    var capturesNode = document.getElementById("captures");
    while (capturesNode.firstChild) {
        capturesNode.removeChild(capturesNode.firstChild);
    }

    // For each capture in the response array
    response.forEach(function(element) {
        // Store the capture object URI
        element_uri = `${baseURI}/camera/capture/${element.metadata.id}`

        // Generate inner HTML from capture object
        html = `
        <div class="capture-thumb"><img src="${element_uri}/download?thumbnail=true"></div>
        <div class="capture-actions"> 
            <div class='capture-heading'>${element.metadata.filename}</div>
            <br>
            <button type="button" class="capture-button" onclick="window.open('${element_uri}/download');">Image</button>
            <button type="button" class="capture-button" onclick="window.open('${element_uri}/metadata');">Metadata</button>
            <br>
            <button type="button" class="capture-button" onclick="window.open('${element_uri}/', '_blank');">JSON</button>
            <button type="button" class="capture-button" onclick="deleteCapture('${element.metadata.id}');">Delete</button>
            <br>
        </div>
        `

        // Create a new capture div, and append HTML
        var div = document.createElement("div");
        div.className = "capture";
        div.innerHTML = html;
        capturesNode.appendChild(div);
    });

}

function updateTextBoxes() {
    document.getElementById('stageVelocityText').value = stageVelocity;
    document.getElementById('stageVelocityInput').value = stageVelocity;
    document.getElementById('focusVelocityText').value = focusVelocity;
    document.getElementById('focusVelocityInput').value = focusVelocity;

    document.getElementById('fovXText').value = fovX;
    document.getElementById('fovYText').value = fovY;
}

function updateStagePositions(response) {
    document.getElementById('x_abs').value = response.x;
    document.getElementById('y_abs').value = response.y;
    document.getElementById('z_abs').value = response.z;
}

function getStagePositions() {
    function updatePositionCallback(response, status) {
        console.log(status, response);
        updateStagePositions(response);
    }
    safeRequest("GET", baseURI+"/stage/position", null, updatePositionCallback, false)
}

// Capture methods
function newCapture(filename, keep_on_disk, use_video_port, bayer, resizeWidth=null, resizeHeight=null) {
    // Make a position request
    function newCaptureCallback(response, status) {
        if (status != 200) {
            alert("Capture failed.");
        }
        console.log(status, response);
        getCaptures();  // Update full list of captures when done
    }

    payload = {
        "filename": filename,
        "keep_on_disk": keep_on_disk,
        "use_video_port": use_video_port,
        "bayer": bayer
    }

    if ((resizeWidth) && (resizeHeight)) {
        payload.size = {
            "width": resizeWidth,
            "height": resizeHeight
        }
    }

    console.log(payload);
    safeRequest("POST", baseURI+"/camera/capture/", payload, newCaptureCallback);
}

function newCaptureFromInput() {
    captureFilenameInput = document.getElementById('captureFilenameInput');
    captureKeepOnDiskCheck = document.getElementById('captureKeepOnDiskCheck');
    captureFullResolutionCheck = document.getElementById('captureFullResolutionCheck');
    captureBayerCheck = document.getElementById('captureBayerCheck')

    captureResizeCheck = document.getElementById('captureResizeCheck');
    captureWidthInput = document.getElementById('captureWidthInput')
    captureHeightInput = document.getElementById('captureHeightInput')

    // Get filename if one is given
    if (captureFilenameInput.value === "") {
        filename = null;
    }
    else {
        filename = captureFilenameInput.value;
    }

    if (captureResizeCheck.checked) {
        resizeWidth = Number(captureWidthInput.value);
        resizeHeight = Number(captureHeightInput.value);
    }
    else {
        resizeWidth = null;
        resizeHeight = null;
    }

    newCapture(
        filename, 
        captureKeepOnDiskCheck.checked, 
        !(captureFullResolutionCheck.checked), 
        captureBayerCheck.checked, 
        resizeWidth, 
        resizeHeight
    );

}

function newCaptureResizeToggle(checkbox) {
    captureWidthInput = document.getElementById('captureWidthInput')
    captureHeightInput = document.getElementById('captureHeightInput')

    captureWidthInput.disabled = !(checkbox.checked)
    captureHeightInput.disabled = !(checkbox.checked)
}

// Move stage methods
// TODO: Combine setStagePositions and moveStagePositions, with bool argument for 'absolute'

function setStagePositions(x_abs, y_abs, z_abs) {
    // Make a position request
    function absMoveCallback(response, status) {
        if (status != 200) {
            alert("Error moving stage.");
        }
        console.log(status, response);
        updateStagePositions(response);
    }
    safeRequest("POST", baseURI+"/stage/position", { "absolute": true, "x": x_abs, "y": y_abs, "z": z_abs}, absMoveCallback)
}

function moveStagePositions(x_rel, y_rel, z_rel) {
    // Make a position request
    function relMoveCallback(response, status) {
        if (status != 200) {
            alert("Error moving stage.");
        }
        console.log(status, response);
        updateStagePositions(response);
    }
    safeRequest("POST", baseURI+"/stage/position", { "absolute": false, "x": x_rel, "y": y_rel, "z": z_rel}, relMoveCallback)
}

function setStagePositionsFromInput() {
    x_abs = Number(document.getElementById('x_abs').value);
    y_abs = Number(document.getElementById('y_abs').value);
    z_abs = Number(document.getElementById('z_abs').value);
    setStagePositions(x_abs, y_abs, z_abs)
}

// Standard callback for user-controller movement
function keyMoveCallback(response, status) {
    console.log(status, response);
    updateStagePositions(response);
}

// Methods for input events

// Click-to-move
function clickHotspotImage(event) {
    if (document.getElementById("clickPositionCheck").checked == true) {
        xCoordinate = event.offsetX;
        yCoordinate = event.offsetY;
        console.log(xCoordinate, yCoordinate)
        xRelative = (0.5*event.target.offsetWidth - xCoordinate)/event.target.offsetWidth;
        yRelative = (0.5*event.target.offsetHeight - yCoordinate)/event.target.offsetHeight;
        console.log(xRelative, yRelative)
        xSteps = xRelative * fovX;
        ySteps = yRelative * fovY;
        console.log(xSteps, ySteps, 0)
        // Make a position request
        moveStagePositions(xSteps, ySteps, 0)
    }
}

// Scroll-to-focus
window.addEventListener('wheel', function(e) {
    multiplier = 1/100;
    z_delta = e.deltaY * multiplier * focusVelocity;
    if ((document.getElementById("scrollFocusCheck").checked == true) && (e.target.parentNode.classList.value == "column middle")) {
        console.log(z_delta);
        console.log(e.target.parentNode.classList.value);
        // Make a position request
        safeRequest("POST", baseURI+"/stage/position", { "absolute": false, "z": z_delta}, keyMoveCallback)
    }
});

// Keyboard to move
addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true; //Add key to array

    // If not currently in an input box
    if (!(e.target instanceof HTMLInputElement)) {

        // TODO: Remove this if condition? Pointless?
        // If stage movement keys are pressed
        if ((leftKeyID in keysDown) || (rightKeyID in keysDown) || (upKeyID in keysDown) || (downKeyID in keysDown) || (pgupKeyID in keysDown) || (pgdnKeyID in keysDown)) {
            // Calculate movement array
            x_rel = 0;
            y_rel = 0;
            z_rel = 0;
            if (leftKeyID in keysDown) {
            x_rel = x_rel + stageVelocity;
            }
            if (rightKeyID in keysDown) {
            x_rel = x_rel - stageVelocity;
            }
            if (upKeyID in keysDown) {
            y_rel = y_rel + stageVelocity;
            }
            if (downKeyID in keysDown) {
            y_rel = y_rel - stageVelocity;
            }
            if (pgupKeyID in keysDown) {
            z_rel = z_rel - focusVelocity;
            }
            if (pgdnKeyID in keysDown) {
            z_rel = z_rel + focusVelocity;
            }

            // Make a position request
            moveStagePositions(x_rel, y_rel, z_rel)
        }
    }

}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode]; //Remove key from array
}, false);

// Methods for making requests
function safeRequest(method, url, payload, callback, lock=true, force=false) {
    if (force == true) {
        allowRequest = true;
    }
    else {
        allowRequest = !(requestLock);
    }
    if (allowRequest == true) {
        var xhr = new XMLHttpRequest();   // new HttpRequest instance 
        xhr.open(method, url);

        if (lock == true) {  // If request is using the lock
            requestLock = true;  // Hold the lock
        }

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (lock == true) {  // If request is using the lock
                    requestLock = false;  // Release the lock
                }

                if (xhr.status !== 200) {
                    console.error(xhr.statusText);
                } 
                callback(JSON.parse(xhr.responseText), xhr.status);
            }
        };

        if (method == "POST" || method == "PUT") {
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }

        xhr.send(JSON.stringify(payload));

    }
    else {
        console.log("Cannot start the following request while the previous requets is pending:")
        console.log(method, url, payload)
    }
}
