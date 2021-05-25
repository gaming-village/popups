function loadSchema() {
    let popups = Object.keys(data);

    // Update display objects
    for (let i = 0; i < popups.length; i++) {
        // Create the popup unit.
        const copy = getElement("popup-template").cloneNode(true);
        copy.id = data[popups[i]].name;
        copy.style.left = data[popups[i]].display.left;
        copy.style.top = data[popups[i]].display.top;
        copy.style.transform = data[popups[i]].display.transform;

        getElement("popup-schema").appendChild(copy);
        copy.classList.remove("hidden");

        copy.querySelector(".popup-icon").src = data[popups[i]].display.imgSrc;


        if (data[popups[i]].unlocked) {
            // If unlocked
            copy.classList.add("unlocked");
        } else {
            for (let k = 0; k < popups.length; k++) {
                if (data[popups[i]].from == data[popups[k]].id) {
                    console.log(data[popups[k]]);
                    console.log(data[popups[i]]);
                    console.log(data);
                }
                if (data[popups[i]].from == data[popups[k]].id && !data[popups[k]].unlocked && !data[popups[i]].unlocked) {
                    console.log("did game:");
                    console.log(data[popups[i]].name);
                    getElement("" + data[popups[i]].name).classList.add("hidden");
                    // console.log(getElement("" + data[popups[i]].name));
                }
            }
        }
    }

    // Create connecting lines between units.
    for (let i = 0; i < popups.length; i++) {
        let currentPopup = data[popups[i]];
        if (currentPopup.from != undefined) {
            // Search for the parent popup:
            let parentPopup;
            for (let k = 0; k < popups.length; k++) {
                if (data[popups[k]].id == currentPopup.from && data[popups[k]].unlocked) {
                    parentPopup = data[popups[k]];
                    let currentPopupObj = getElement("" + currentPopup.name);
                    let parentPopupObj = getElement("" + parentPopup.name);
                    drawLine(currentPopupObj, parentPopupObj, currentPopup.unlocked);
                }
            }
        }
    }

    // Hover text
    let popupUnits = document.getElementsByClassName("popup-container");
    for (let i = 0; i < popupUnits.length; i++) {
        popupUnits[i].addEventListener("mouseover", function() {
            document.body.classList.add("unitFocused");

            // Display the hover box above the unit.
            let unitRect = popupUnits[i].getBoundingClientRect();
            let popupHover = getElement("popup-hover");
            popupHover.classList.remove("hidden");
            popupHover.style.bottom = document.documentElement.clientHeight - unitRect.y + 7.5 + "px"; // Aka distance to cell from bottom + styling
            popupHover.style.left = unitRect.left + unitRect.width / 2 + "px";

            // Display the unit info in the hover box.
            for (let k = 0; k < Object.keys(data).length; k++) {
                let unitInfo = data[Object.keys(data)[k]];
                if (popupUnits[i].id == unitInfo.name) {
                    if (unitInfo.unlocked) {
                        getElement("popup-hover").classList.add("selected");
                        getElement("hover-cost-img").classList.add("hidden");
                    } else {
                        getElement("popup-hover").classList.remove("selected");
                        getElement("hover-cost-img").classList.remove("hidden");
                        getElement("hover-cost-img").innerHTML = unitInfo.stats.cost;
                    }
                    getElement("hover-name").innerHTML = unitInfo.name;
                    getElement("hover-unlock-type").innerHTML = unitInfo.unlocked ? "(UNLOCKED)" : "(LOCKED)";
                    // NOTE TO FUTURE SELF: MOVE TO HIGHER UP IF FUNCTION.
                    // NOTE TO FUTURE SELF: MOVE TO HIGHER UP IF FUNCTION.
                    if (unitInfo.unlocked) {
                        if (typeof unitInfo.stats.points == "object") {
                            getElement("hover-points").innerHTML = "+" + unitInfo.stats.points.min + "-" + unitInfo.stats.points.max + " points";
                        } else {
                            getElement("hover-points").innerHTML = "+" + unitInfo.stats.points + " point" + (unitInfo.stats.points == 1 ? "" : "s");
                        }
                    } else {
                        getElement("hover-points").innerHTML = "";
                    }
                    getElement("hover-special").innerHTML = unitInfo.stats.special;
                    getElement("hover-description").innerHTML = unitInfo.stats.description;
                }
            }
        });
        popupUnits[i].addEventListener("mouseout", function() {
            document.body.classList.remove("unitFocused");
            let popupHover = getElement("popup-hover");
            popupHover.classList.add("hidden");
        });
    }
}

function drawLine(startObj, endObj, unlocked) {
    let startObjRect = startObj.getBoundingClientRect();
    let startObjPos = [startObjRect.left + startObjRect.width / 2, startObjRect.top + startObjRect.height / 2];
    let endObjRect = endObj.getBoundingClientRect();
    let endObjPos = [endObjRect.left + endObjRect.width / 2, endObjRect.top + endObjRect.height / 2];
    let distance = Math.sqrt(Math.pow(startObjPos[0] - endObjPos[0], 2) + Math.pow(startObjPos[1] - endObjPos[1], 2));

    let firstObj = endObjPos, lastObj = startObjPos;
    if (startObjPos[0] < endObjPos[0]) {
        firstObj = startObjPos;
        lastObj = endObjPos;
    }

    let angle = Math.atan2(lastObj[1] - firstObj[1], lastObj[0] - firstObj[0]) * 180 / Math.PI;

    let schemaObj = getElement("popup-schema");
    let lineObj = document.createElement("div");
    lineObj.classList.add("schema-line");
    schemaObj.appendChild(lineObj);
    lineObj.style.width = distance + "px";
    lineObj.style.transform = "rotate(" + angle + "deg)";

    let schemaRect = schemaObj.getBoundingClientRect();
    lineObj.style.top = firstObj[1] - schemaRect.top + "px";
    lineObj.style.left = firstObj[0] - schemaRect.left + "px";

    if (unlocked) lineObj.classList.add("unlocked");
}

function a() {
    setCookie("unlockedMalware", "101000000", 1);
    console.log(getCookie("unlockedMalware"));
}