// Helping functions
function randomInt(min, max, inclusive) {
    inclusive = inclusive || false;
    const add = inclusive ? 1 : 0;
    const randomInt = Math.floor(Math.random() * (max - min + add)) + min;
    return randomInt;
}
function randomFloat(min, max) {
    const randomFloat = Math.random() * (max - min) + min;
    return randomFloat;
}
function getElement(elementName) {
    const element = document.querySelector("#" + elementName);
    return element;
}
function formatFloat(input) {
    const formattedFloat = Math.round((input + Number.EPSILON) * 100) / 100;
    return formattedFloat;
}

var popups = {};
var semiPopups = {};
var applications = {};
var points = 0;
var Game = {
    maxPopups: 5,
    popupQueue: [],
    get visiblePopups() {
        let count = 0;
        const popupNames = Object.keys(popups);
        for (let i = 0; i < popupNames.length; i++) {
            if (popups[popupNames[i]].displayed) count++;
        }
        return count;
    },
    stats: {
        totalLoremMined: 0
    }
};

function generatePopups() {
    // Can't automate popupDisplayName as it doesn't get pushed to the array before the constructor is run.
    popups.microsoftAntivirus = new MicrosoftAntivirus("microsoftAntivirus");
    popups.browserError = new BrowserError("browserError");
    popups.freeIPhone = new FreeIPhone("freeIPhone");
    popups.rain = new Rain("rain");
    popups.chunky = new Chunky("chunky");
    popups.adblockBlocker = new AdblockBlocker("adblockBlocker");
    popups.annualSurvey = new AnnualSurvey("annualSurvey");
    popups.luremImpsir = new LuremImpsir("luremImpsir");
    popups.chunkyVirus = new ChunkyVirus("chunkyVirus");
    popups.visitor = new Visitor("visitor");
    popups.chunkyPlantation = new ChunkyPlantation("chunkyPlantation");
    popups.ramDownload = new RamDownload("ramDownload");
    popups.bankDetails = new BankDetails("bankDetails");
    popups.expandinator = new Expandinator("expandinator");
}

function generateSemiPopups() {
    semiPopups.chunkyMessage = new ChunkyMessage("chunky-message");
    semiPopups.plagueOfChunky = new PlagueOfChunky("plague-of-chunky");
    semiPopups.scourgeOfChunky = new ScourgeOfChunky("scourge-of-chunky");
    semiPopups.wrathOfChunky = new WrathOfChunky("wrath-of-chunky");
    semiPopups.hexOfChunky = new HexOfChunky("hex-of-chunky");

    semiPopups.ad1 = new Ad1("ad1");
    semiPopups.ad2 = new Ad2("ad2");
    semiPopups.ad3 = new Ad3("ad3");
    semiPopups.ad4 = new Ad4("ad4");
    semiPopups.ad5 = new Ad5("ad5");
}

function generateApplications() {
    applications.loremController = new LoremController();
}

function addPoints(add, force) {
    force = force || false;
    if (!semiPopups.scourgeOfChunky.activated || force) {
        points += add;
        Game.stats.totalLoremMined += add;

        createMiningEntry(add);
        
        displayPoints();

        const incrementText = new PointIncrementText(add);
    }
}
function multiplyPoints(mult, force) {
    force = force || false;
    if (!semiPopups.scourgeOfChunky.activated || force) {
        points *= mult;

        Game.stats.totalLoremMined *= mult;

        displayPoints();
    }
}
function displayPoints() {
    getElement("total-lorem-mined").innerHTML = formatFloat(Game.stats.totalLoremMined);

    getElement("pointCounter").innerHTML = formatFloat(points);
    getElement("pointCounterContainer").classList.remove("hidden");
}

function goToChangelog() {
    window.location = "changelog.html";
}
function moveToPopupView() {
    window.location = "popupView.html";
}

function load() {
    generatePopups();
    generateSemiPopups();
    generateApplications();

    dragElement(getElement("pointCounterContainer"), getElement("point-counter-title"));

    changeComputerHeight();

    window.addEventListener("resize", () => changeComputerHeight());

    setupDevtools();

    getElement("header-title").addEventListener("click", () => getElement("devtools").classList.remove("hidden"));
}

function changeComputerHeight() {
    const mainHeight = getElement("info-bar").getBoundingClientRect().height;
    getElement("computer").style.height = window.innerHeight - mainHeight + "px";
}

const loremTemplate = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aliquid! Officia amet adipisci porro repellat deserunt vero quos ad id sint dolore iure odio reprehenderit dolores sed, molestias vitae dicta!";
const loremLength = loremTemplate.split("").length;
var iterationCount = 0;
var nextText = 400;

const adTexts = [" Full version costs $204967.235 ", " Go to www.this.is.a.site for free viruses! "];



function ipsumStep() {
    if (popups.luremImpsir.canLorem) {
        let currentCharacter = iterationCount % loremLength;
        getElement("current-lorem-text").innerHTML += loremTemplate.split("")[currentCharacter];
        currentCharacter++;
        iterationCount++;
        if (currentCharacter > loremLength) {
            currentCharacter = 0;
        }
        if (iterationCount > nextText) {
            // Create an ad.
            nextText += randomInt(80, 120);
            let ad = document.createElement("div");
            getElement("loremContainer").appendChild(ad);
            ad.classList.add("loremAd");
            ad.innerHTML = adTexts[randomInt(0, adTexts.length)];
            ad.addEventListener("click", () => {
                console.log("FFFFFF");
            });
            
            // Update the current lorem text container.
            getElement("current-lorem-text").id = "";
            let newLoremContainer = document.createElement("span");
            getElement("loremContainer").appendChild(newLoremContainer);
            newLoremContainer.id = "current-lorem-text";
        }

        switch(iterationCount) {
            case 50:
                popups.microsoftAntivirus.showPopup();
                break;
            case 100:
                popups.annualSurvey.showPopup();
                break;
            case 150:
                popups.browserError.showPopup();
                break;
            case 200:
                popups.freeIPhone.showPopup();
                break;
            case 225:
                popups.bankDetails.showPopup();
                break;
            case 250:
                popups.chunky.showPopup();
                break;
            case 275:
                popups.ramDownload.showPopup();
                break;
            case 300:
                popups.rain.showPopup();
                break;
            case 325:
                popups.chunkyVirus.showPopup();
                break;
            case 350:
                popups.visitor.showPopup();
                break;
            case 375:
                popups.chunkyPlantation.showPopup();
                break;
            case 400:
                popups.adblockBlocker.showPopup();
                break;
        }

        if (iterationCount % 10 == 0) {
            addPoints(0.1);
            if (iterationCount % 100 == 0 && Math.random() > 0.6 && iterationCount >= 200) {
                popups.luremImpsir.showPopup();
            }
        }
    }
}

var generating = false;
var hasClicked = false; // Used to track the first time the button is clicked.
var continued = false;
var loremInterval;

function generateLorumIpsum() {
    if (!hasClicked) {
        showCostPrompt();
        hasClicked = true;
    } else if (continued) {
        // When the button is clicked while active
        generating = !generating;
        const loremStatus = getElement("lorem-status");
        if (generating) {
            loremStatus.innerHTML =  "Generating...";
            loremStatus.classList.add("generating");
            loremInterval = setInterval(ipsumStep, 80);
        } else {
            loremStatus.innerHTML =  "Stopped.";
            loremStatus.classList.remove("generating");
            clearInterval(loremInterval);
        }
    }
}

// Mining feed

// MAKE INTO SMART OBJECT THING
var miningEntries = {};
function createMiningEntry(amount, description) {
    const maxEntries = 4;

    // Remove any entries that go over the max entry limit.
    const excessEntry = miningEntries[maxEntries];
    if (excessEntry != undefined) {
        excessEntry.remove();
        delete excessEntry;
    }

    // Move the position of all entries down 1.
    for (let i = maxEntries; i > 1; i--) {
        miningEntries[i] = miningEntries[i - 1];
    }

    // Create the mining entry.
    const newEntry = document.createElement("p");
    getElement("mining-feed").appendChild(newEntry);
    miningEntries[1] = newEntry;

    const gainStatus = Math.sign(amount) == 1 ? "gained" : "lost";
    newEntry.innerHTML = Math.abs(amount) + " packets " + gainStatus;

    // Move the new entry to the top of its parent.
    for (let i = 1; i < maxEntries + 1; i++) {
        if (miningEntries[i] != undefined) {
            getElement("mining-feed").appendChild(miningEntries[i]);
        }
    }

    // Automatically remove the entry after some time.
    const lastTime = 7500;
    setTimeout(() => {
        // Find the index of the created entry.
        let entryIndex = -1;
        for (let i = 1; i < maxEntries + 1; i++) {
            if (miningEntries[i] == newEntry) {
                entryIndex = i;
            }
        }

        // Remove the entry.
        newEntry.remove();
        if (entryIndex != -1) {
            delete newEntry[entryIndex];
        }
    }, lastTime);
}

function hidePrompt() {
    continued = true;
    getElement("loremButtonClick").classList.add("hidden");

    getElement("a").classList.remove("unclickable");
}

function showCostPrompt() {
    let costPrompt = getElement("loremButtonClick");
    costPrompt.classList.add("selected");
    costPrompt.classList.remove("hidden");

    getElement("a").classList.add("unclickable");
}

function engageChunky() {
    chunky1();
    chunky2();
}

function chunky1() {
    getElement("chunky1").classList.remove("hidden");
}
function chunky2() {
    getElement("chunky2").classList.remove("hidden");
}

function dragElement(elmnt, start) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    start.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // Check that the clicked element is the move element.
        if (e.path[0] == start) {
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // Stop the popup from being dragged outside
        let bounds = elmnt.getBoundingClientRect();
        let containingBounds = getElement("computer").getBoundingClientRect();
        if (bounds.x + bounds.width > containingBounds.width) {
            elmnt.style.left = containingBounds.width - bounds.width + "px";
        } else if (bounds.x < 0) {
            elmnt.style.left = "0px";
        } else {
            elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
        }
        if (bounds.y + bounds.height - containingBounds.y > containingBounds.height) {
            elmnt.style.top = containingBounds.height - bounds.height + "px";
        } else if (bounds.top < containingBounds.y) {
            elmnt.style.top = "0px";
        } else {
            elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        }
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


// DEVTOOLS
function setupDevtools() {
    // Devtools won't be draggable.

    summonPopupSetup();
    miscToolsSetup();
}
function switchVisibility(elem) {
    getElement(elem).classList.contains("hidden") ? getElement(elem).classList.remove("hidden") : getElement(elem).classList.add("hidden");

    const allTools = ["summon-popup", "misc-tools"];
    for (let i = 0; i < allTools.length; i++) {
        if (allTools[i] != elem) {
            getElement(allTools[i]).classList.add("hidden");
        }
    }
}
function miscToolsSetup() {
    getElement("devtools-misc").addEventListener("click", () => {
        switchVisibility("misc-tools");
        appendToDevtools(getElement("misc-tools"));
    });

    getElement("summon-chunky").addEventListener("click", () => {
        popups.chunky.activateChunky();
    });
}
function summonPopupSetup() {
    getElement("devtools-summon").addEventListener("click", () => {
        switchVisibility("summon-popup");
        appendToDevtools(getElement("summon-popup"));
    });

    // Update the summon popup display
    let selectedPopups = {};
    let popupNames = Object.keys(popups);
    for (let i = 0; i < popupNames.length; i++) {
        let newOption = getElement("summon-popup-base").cloneNode(true);
        newOption.id = "";
        newOption.classList.remove("hidden");
        getElement("summon-popup-unit-container").appendChild(newOption);

        newOption.querySelector(".summon-popup-text").innerHTML = popups[popupNames[i]].displayName;

        selectedPopups[popupNames[i]] = false;
        let summonInput = newOption.querySelector(".summon-popup-input");
        summonInput.addEventListener("click", () => {
            selectedPopups[popupNames[i]] = !selectedPopups[popupNames[i]];
        });

        // Make the text click the checkbox
        summonInput.id = "_summon_" + popupNames[i];
        newOption.querySelector(".summon-popup-text").htmlFor = "_summon_" + popupNames[i];
    }

    // Add the submit button functionality.
    const submitButton = getElement("summon-popup-submit");
    submitButton.addEventListener("click", () => {
        for (let i = 0; i < popupNames.length; i++) {
            if (selectedPopups[popupNames[i]]) {
                popups[popupNames[i]].showPopup();
            }
        }
    });

    // Add the summon all button functionality.
    const summonAllButton = getElement("summon-popup-all");
    summonAllButton.addEventListener("click", () => {
        for (let i = 0; i < popupNames.length; i++) {
            popups[popupNames[i]].showPopup();
        }
    });
}
function showSummonPopup() {
    let summonPopup = getElement("summon-popup");
    summonPopup.classList.remove("hidden");
}
function appendToDevtools(element) {
    let devBounds = getElement("devtools").getBoundingClientRect();
    element.style.left = devBounds.x + devBounds.width + "px";
    element.style.top = devBounds.y - getElement("computer").offsetTop + "px";
}