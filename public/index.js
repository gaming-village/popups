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

const popups = {};
const semiPopups = {};
const applications = {};
var points = 0;
const Game = {
   loremCount: 0,
   addLorem: (add, force = false) => {
      if (semiPopups.scourgeOfChunky.activated && !force) return;

      Game.loremCount += add;
      Game.stats.totalLoremMined += add;

      createMiningEntry(add);
      displayPoints(add);

      const incrementText = new PointIncrementText(add);
   },
   multLorem: (mult, force = false) => {
      if (semiPopups.scourgeOfChunky.activated && !force) return;

      const loremBefore = Game.loremCount;
      Game.loremCount *= mult;
      Game.stats.totalLoremMined *= mult;

      // Find the difference in points.
      const difference = Game.loremCount - loremBefore;
      const incrementText = new PointIncrementText(difference);
      
      displayPoints(difference);
      createMiningEntry(difference);
   },
   packetCount: 0,
   addPackets: (add, force = false) => {
      if (semiPopups.scourgeOfChunky.activated && !force) return;

      this.packetCount += add;
      this.stats.totalLoremMined += add;

      console.log(add);

      createMiningEntry(add);
      displayPoints(add);

      const incrementText = new PointIncrementText(add);
   },
   multPackets: (mult, force = false) => {
      if (semiPopups.scourgeOfChunky.activated && !force) return;

      const pointsBefore = this.packetCount;
      this.packetCount *= mult;
      this.stats.totalLoremMined *= mult;

      // Find the difference in points.
      const difference = this.packetCount - pointsBefore;
      const incrementText = new PointIncrementText(difference);
      
      displayPoints(difference);
      createMiningEntry(difference);
   },
   maxPopups: 7,
   popupQueue: [],
   get visiblePopups() {
      let visiblePopupCount = 0;
      for (const popup in popups) {
         if (popups[popup].displayed) visiblePopupCount++;
      }
      return visiblePopupCount;
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
   popups.devHire = new DevHire("devHire");
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

   semiPopups.loremWarning = new LoremWarning("lorem-warning");
}

function generateApplications() {
   applications.loremController = new LoremController();
   applications.loremCounter = new LoremCounter();
}

function displayPoints(add) {
   getElement("total-lorem-mined").innerHTML = formatFloat(Game.stats.totalLoremMined);

   getElement("pointCounter").innerHTML = formatFloat(Game.loremCount);
   getElement("pointCounterContainer").classList.remove("hidden");

   getElement("lorem-count").innerHTML = formatFloat(Game.loremCount);
   updateLoremCounter(add);
}

function updateLoremCounter(add) {
   const text = document.createElement("div");
   text.innerHTML = add;

   text.classList.add("loremCounterAddText");
   getElement("lorem-counter-display").appendChild(text);
   
   const xVel = getCircleVel();
   const yVel = 1 - xVel;

   let xPos = 0;
   let yPos = 0;
   let ticks = 0;
   const mult = 4;
   const moveText = setInterval(() => {
      text.style.left = `calc(50% + ${xPos}px)`;
      text.style.top = `calc(50% + ${yPos}px)`;
      xPos += xVel * mult;
      yPos += yVel * mult;

      if (ticks++ > 50) {
         clearInterval(moveText);
         text.remove();
      }
   }, 30);
}
function getCircleVel() {
   const rand = randomFloat(-1, 1);
   const result = Math.sin((rand * Math.PI + Math.PI) / 2);
   return result;
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
var nextText = 300;

const adTexts = [" Full version costs $204967.235 ", " Go to www.this.is.a.site for free viruses! "];



function ipsumStep() {
   if (popups.luremImpsir.canLorem) {
      let currentCharacter = iterationCount % loremLength;
      getElement("current-lorem-text").innerHTML += loremTemplate.split("")[currentCharacter];
      iterationCount++;
      if (currentCharacter++ > loremLength) {
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
            loremAdClick(ad);
         });

         // Update the current lorem text container.
         getElement("current-lorem-text").id = "";
         const newLoremContainer = document.createElement("span");
         getElement("loremContainer").appendChild(newLoremContainer);
         newLoremContainer.id = "current-lorem-text";
      }

      switch (iterationCount) {
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
            popups.expandinator.showPopup();
            break;
         case 350:
            popups.visitor.showPopup();
            break;
         case 375:
            popups.devHire.showPopup();
            break;
         case 400:
            popups.adblockBlocker.showPopup();
            break;
      }

      if (iterationCount % 10 == 0) {
         Game.addLorem(0.1);
         if (iterationCount % 100 == 0 && Math.random() > 0.6 && iterationCount >= 200) {
            popups.luremImpsir.showPopup();
         }
      }
   }
}
function loremAdClick(ad) {
   ad.remove();
   Game.addLorem(0.5);
}

var generating = false;
var hasClicked = false; // Used to track the first time the button is clicked.
var continued = false;
var loremInterval;

function generateLorumIpsum() {
   if (!hasClicked) {
      semiPopups.loremWarning.showPopup();
      hasClicked = true;
   } else if (continued) {
      // When the button is clicked while active
      generating = !generating;
      const loremStatus = getElement("lorem-status");
      if (generating) {
         loremStatus.innerHTML = "Generating...";
         loremStatus.classList.add("generating");
         loremInterval = setInterval(ipsumStep, 80);
      } else {
         loremStatus.innerHTML = "Stopped.";
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
            popups[popupNames[i]].showPopup(false, true);
         }
      }
   });

   // Add the summon all button functionality.
   const summonAllButton = getElement("summon-popup-all");
   summonAllButton.addEventListener("click", () => {
      for (let i = 0; i < popupNames.length; i++) {
         popups[popupNames[i]].showPopup(false, true);
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