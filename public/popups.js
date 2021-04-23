class BaseStructure {
   constructor() {

   }
   moveToRandomPosition(randomRange) {
      const newXPos = Math.random() * randomRange + 50 - randomRange / 2;
      const newYPos = Math.random() * randomRange + 50 - randomRange / 2;
      const displayBounds = this.displayObj.getBoundingClientRect();

      this.displayObj.style.top = "calc(" + newYPos + "% - " + displayBounds.height / 2 + "px)";
      this.displayObj.style.left = "calc(" + newXPos + "% - " + displayBounds.width / 2 + "px)";
   }
}

class Popup extends BaseStructure {
   constructor(popupDataName) {
      super();

      this.displayObj = getElement("" + data[popupDataName].name);
      dragElement(this.displayObj, getElement("" + this.displayObj.id + "-title"));
      this.popupDataName = popupDataName;
      this.displayName = this.getDisplayName();
      this.displayed = false;
   }
   getDisplayName() {
      let displayName = data[this.popupDataName].name.replace("-", " ").split(" ");
      for (let i = 0; i < displayName.length; i++) {
         displayName[i] = displayName[i][0].toUpperCase() + displayName[i].substring(1);
         if (i != displayName.length - 1) displayName[i] += " ";
      }
      return displayName.join("");
   }
   showPopup(noMove = false, manualForce = false) {
      const force = this == popups[Game.popupQueue[0]];
      if (force) Game.popupQueue.splice(0, 1);

      if (Game.visiblePopups < Game.maxPopups || force || manualForce) {
         if (!this.displayed) {
            console.log("Displayed " + this.displayName + ".");
            clearTimeout(this.redisplayDelay);
            this.displayObj.classList.remove("hidden");
            this.displayed = true;

            if (!noMove) this.moveToRandomPosition(80);
         } else {
            console.warn("Tried to show " + this.displayName + ", but it was already visible.");
         }
      } else {
         Game.popupQueue.push(this.popupDataName);
         console.log("ADDED " + this.popupDataName + " TO LE QUEU");
      }
   }
   hidePopup(givePoints = true) {
      if (!this.displayed) {
         console.warn("Tried to hide " + this.displayName + " but was already hidden.");
         return;
      }

      // Show a queued popup
      if (Game.popupQueue[0] != undefined) {
         popups[Game.popupQueue[0]].showPopup();
      }

      this.displayed = false;
      this.displayObj.classList.add("hidden");
      console.log("User closed " + this.displayName + ".");

      const points = data[this.popupDataName].stats.points;
      if (typeof points != "object" && givePoints) Game.addLorem(points);

      let redisplayTime = data[this.popupDataName].stats.redisplayTime;
      if (typeof redisplayTime == "undefined") {
         redisplayTime = 15000;
         console.warn("WARNING: Redisplay time not defined for " + this.displayName + ". Defaulting to 15 seconds.");
      }

      this.redisplayDelay = setTimeout(() => this.showPopup(), redisplayTime);
   }
   deletePopup(popup) {
      popup.remove();
   }
}

class MicrosoftAntivirus extends Popup {
   constructor(popupDataName) {
      super(popupDataName);

      // Close button
      getElement("microsoft-antivirus-close").addEventListener("click", () => {
         this.hidePopup();
      });
      // Upgrade system button
      getElement("microsoft-antivirus-upgrade").addEventListener("click", () => {
         // Show the clicked popup
         const clicked = getElement("microsoft-antivirus-clicked");
         clicked.classList.remove("hidden");
         let bounds = this.displayObj.getBoundingClientRect();
         let computerBounds = getElement("computer").getBoundingClientRect();
         const xPos = bounds.x + bounds.width / 2;
         clicked.style.left = xPos / computerBounds.width * 100 + "%";
         const yPos = bounds.y;
         clicked.style.top = yPos / computerBounds.height * 100 + "%";

         this.hidePopup(false);
      });
   }
}
class LuremImpsir extends Popup {
   constructor(popupDataName) {
      super(popupDataName);
      this.canLorem = true;
      this.loremTime = 5;

      getElement("loremTimeRemaining").addEventListener("click", () => {
         this.hidePopup();
      });
   }
   showPopup() {
      super.showPopup();
      if (!this.displayed) return;

      this.canLorem = false;
      getElement("loremContainer").setAttribute("display-text", "STOPPED");
      getElement("loremContainer").classList.remove("canLorem");
      this.displayObj.classList.remove("hidden");
      const updateLoremText = setInterval(() => {
         // Update lorem time.
         getElement("loremTimeRemaining").innerHTML = `continue (${formatFloat(this.loremTime)})`;

         this.loremTime -= 0.01;
         if (this.loremTime <= 0) {
            clearInterval(updateLoremText);
            const timeObject = getElement("loremTimeRemaining");
            timeObject.classList.add("clickable");
            timeObject.innerHTML = "continue";
         }
      }, 10);
   }
   hidePopup() {
      // Only execute if the countdown has ended.
      if (!getElement("loremTimeRemaining").classList.contains("clickable")) return;

      super.hidePopup();

      getElement("loremContainer").setAttribute("display-text", "Generate your lorem here.");
      getElement("loremContainer").classList.add("canLorem");
      getElement("loremTimeRemaining").classList.remove("clickable");
      this.canLorem = true;
      this.loremTime = 5;
      this.displayObj.classList.add("hidden");
   }
}
class BrowserError extends Popup {
   constructor(popupDataName) {
      super(popupDataName);
      this.moveInterval;
      getElement("browser-error-close").addEventListener("click", () => this.hidePopup());
   }
   showPopup() {
      super.showPopup();

      if (!this.displayed) return;
      this.moveInterval = setInterval(() => {
         this.moveToRandomPosition(80);
      }, 1500);
   }
   hidePopup() {
      super.hidePopup();
      clearInterval(this.moveInterval);
   }
}
class FreeIPhone extends Popup {
   constructor(popupDataName) {
      super(popupDataName);
      const iPhoneCloseButton = getElement("free-iPhone-close")
      iPhoneCloseButton.addEventListener("click", () => this.hidePopup());
      iPhoneCloseButton.addEventListener("mouseenter", () => this.popupHover());
   }
   showPopup() {
      super.showPopup();

      if (!this.displayed) return;
      getElement("iphonePopupMoveText").classList.add("hidden");
      this.moveToRandomPosition(3); // Needed due to the hover movement
   }
   hidePopup() {
      super.hidePopup();

      clearInterval(this.moveTimer);
   }
   popupHover() {
      this.moveTimer = setTimeout(() => {
         this.moveToRandomPosition(3);
         getElement("iphonePopupMoveText").classList.remove("hidden");
      }, Math.random() * 200 + 50);
   }
}
class Rain extends Popup {
   constructor(popupDataName) {
      super(popupDataName);

      this.createLetterInterval;
      this.checkLetterInterval;
      this.updateTextInterval;
      this.sapPointInterval;
      this.letters = [];
      this.totalSapAmount = 0;

      getElement("rain-close-button").addEventListener("click", () => this.hidePopup());
   }
   showPopup() {
      super.showPopup();

      if (!this.displayed) return;
      this.createLetterInterval = setInterval(() => {
         // Create a letter.
         if (this.letters.length < 20) { // Amount of letters is capped at 20.
            const letter = new RainText();
         }

         // Sap points.
         const sapAmount = data.rain.stats.sapAmount;
         Game.addLorem(-sapAmount);
         this.totalSapAmount += sapAmount;
      }, 500);
      this.checkLetterInterval = setInterval(() => {
         this.letters.forEach(letter => letter.incrementTop());
      }, 10);
      this.updateTextInterval = setInterval(() => this.changeRainText(), 100);
   }
   hidePopup() {
      super.hidePopup();
      clearInterval(this.createLetterInterval);
      clearInterval(this.updateTextInterval);

      Game.addLorem(this.totalSapAmount * 1.5);
   }
   changeRainText() {
      const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
      let result = "";
      for (let i = 0; i < 17; i++) {
         result += symbols[randomInt(0, symbols.length)];
      }
      getElement("rainCode").innerHTML = result;
   }
}
class RainText {
   constructor() {
      this.displayObj = document.createElement("div");
      getElement("computer").appendChild(this.displayObj);
      this.displayObj.classList.add("letter");
      this.displayObj.style.left = Math.random() * 100 + "vw";
      const letterCharacters = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
      this.displayObj.innerHTML = letterCharacters[randomInt(0, letterCharacters.length)];
      popups.rain.letters.push(this);

      this.topPos = 0;
      this.fallSpeed = 1 + Math.random();
   }
   incrementTop() {
      this.topPos += 0.1 * this.fallSpeed;
      this.displayObj.style.top = this.topPos + "vh";
      if (this.topPos > 100 && popups.rain.letters.length <= 1) {
         if (popups.rain.letters.length <= 1) clearInterval(popups.rain.checkLetterInterval);

         popups.rain.letters.splice(popups.rain.letters.indexOf(this), 1);
         this.displayObj.remove();
         delete this;
      }
   }
}

class Visitor extends Popup {
   constructor(popupDataName) {
      super(popupDataName);
      this.rewards = {
         points: {
            1: -3,
            2: -1,
            3: 4,
            4: 7
         },
         special: {
            1: "Popup wave",
            2: "3x points (5s)"
         }
      };
      getElement("visitor-open-button").addEventListener("click", () => {
         this.spinBox();
         setTimeout(() => {
            this.openBox();
         }, 3000);
      });
   }
   spinBox() {
      getElement("visitor-open-button").style.pointerEvents = "none";
      getElement("visitor-status").innerHTML = "Spinning...";
      getElement("visitor-status").classList.remove("specialReward");
      this.visitorStatusType = 0;
      this.updateStatusInterval = setInterval(() => {
         this.visitorStatusType = this.visitorStatusType == 0 ? 1 : 0;
         getElement("visitor-status").innerHTML = this.visitorStatusType == 9 ? "Spinning.." : "Spinning...";
      }, 200);

      // Show the box spinning
      this.spinningBox = true;
      this.randomiseRate = 10;
      this.randomiseBoxText();
   }
   randomiseBoxText() {
      if (this.spinningBox) {
         // Display current reward
         let randomReward = this.getRandomReward();
         this.currentReward = randomReward;
         if (typeof randomReward == "number") {
            let prefix = randomReward > 0 ? "+" : "";
            let suffix = randomReward == -1 ? "" : "s";
            getElement("visitor-value").innerHTML = `${prefix + randomReward} point${suffix}`;
         } else {
            getElement("visitor-value").innerHTML = randomReward;
         }

         // Respin
         setTimeout(() => {
            this.randomiseRate += 0.9;
            this.randomiseRate *= 1.15;
            this.randomiseBoxText();
         }, Math.pow(this.randomiseRate, 1.2) + this.randomiseRate / 2);
      }
   }
   openBox() {
      this.spinningBox = false;
      clearInterval(this.updateStatusInterval);
      clearInterval(this.randomiseBoxText);

      if (typeof this.currentReward == "number") {
         // Points
         Game.addLorem(this.currentReward);
         let s = "s";
         if ((this.currentReward == 1) || (this.currentReward == -1)) s = "";
         if (this.currentReward > 0) {
            getElement("visitor-value").innerHTML = `+${this.currentReward} point${s}!`;
            getElement("visitor-status").innerHTML = "Yay!";
         } else {
            getElement("visitor-value").innerHTML = `${this.currentReward} point${s}`;
            getElement("visitor-value").classList.add("negativeViewerReward");
            getElement("visitor-status").innerHTML = "Aww...";
         }
      } else {
         // Special
         getElement("visitor-status").innerHTML = "Special!";
         getElement("visitor-status").classList.add("specialReward");

         // Show 3 random popups
         if (this.currentReward == "Popup wave") this.showRandomPopups();
      }

      setTimeout(() => {
         this.hidePopup();
      }, 1000);
   }
   showRandomPopups() {
      const potentialPopups = Object.assign({}, popups);

      // Stop popups which are already visible from being displayed.
      const popupLength = Object.keys(potentialPopups).length;
      for (let i = popupLength - 1; i >= 0; i--) {
         if (!potentialPopups[Object.keys(potentialPopups)[i]].displayObj.classList.contains("hidden")) {
            delete potentialPopups[Object.keys(potentialPopups)[i]];
         }
      }

      // Show 3 random popups.
      const showPopupAmount = Object.keys(potentialPopups).length < 3 ? Object.keys(potentialPopups).length : 3;
      for (let i = 0; i < showPopupAmount; i++) {
         let randomName = Object.keys(potentialPopups)[randomInt(0, Object.keys(potentialPopups).length)];
         let chosenPopup = potentialPopups[randomName];
         chosenPopup.showPopup();
         delete potentialPopups[randomName];
      }
   }
   getRandomReward() {
      let totalLength = Object.keys(this.rewards.points).length + Object.keys(this.rewards.special).length;
      let randomNum = randomInt(1, totalLength + 1);

      let pointsLength = Object.keys(this.rewards.points).length;
      if (randomNum <= pointsLength) {
         return this.rewards.points[randomInt(1, pointsLength + 1)];
      } else {
         let specialRewardNames = Object.keys(this.rewards.special);
         let randomSpecialName = specialRewardNames[randomInt(0, specialRewardNames.length)];
         return this.rewards.special[randomSpecialName];
      }
   }
   showPopup() {
      super.showPopup();

      if (!this.displayed) return;
      this.displayObj.style.opacity = 1;
      getElement("visitor-open-button").style.pointerEvents = "visible";
      getElement("visitor-value").innerHTML = "??";
      getElement("visitor-value").classList.remove("negativeViewerReward");
      getElement("visitor-status").innerHTML = "";
   }
   hidePopup() {
      this.displayOpacity = 1;
      let opacityFade = setInterval(() => {
         this.displayOpacity -= 0.06;
         this.displayObj.style.opacity = this.displayOpacity;
         if (this.displayOpacity <= 0) {
            clearInterval(opacityFade);
            this.displayOpacity = 1;
            super.hidePopup();
         }
      }, 80)
   }
}
class PointIncrementText {
   constructor(pointIncrement) {
      this.displayObj = document.createElement("div");
      this.displayObj.innerHTML = Math.round(pointIncrement * 100) / 100;
      getElement("pointIncrementTextContainer").appendChild(this.displayObj);
      this.displayObj.classList.add("pointIncrementText");
      if (pointIncrement < 0) this.displayObj.classList.add("negativePointIncrement");
      this.topPos = 0;
      this.topFact = pointIncrement < 0 ? -2 : 2;

      this.updateInterval = setInterval(() => {
         this.topPos++;
         this.displayObj.style.top = this.topPos * this.topFact + "px";
         this.displayObj.style.opacity = 1 - this.topPos / 20;
         if (this.topPos >= 50) {
            clearInterval(this.updateInterval);
            this.displayObj.remove();
            delete this;
         }
      }, 50);
   }
}
class Chunky extends Popup {
   constructor(popupDataName) {
      super(popupDataName);
      this.chunkyRage = 0;

      getElement("chunky-close").addEventListener("click", () => {
         this.hidePopup();
      });

      getElement("chunky-remove").addEventListener("click", () => this.removeVirus());
   }
   removeVirus() {
      popups.chunkyVirus.showPopup(false, true);
      popups.chunkyPlantation.showPopup(false, true);
   }
   showPopup() {
      super.showPopup();

      if (!this.displayed) return;
      // Reset the progress bar text colour.
      getElement("chunky-progress-text").classList.remove("red");
      // Make the buttons clickable.
      this.displayObj.querySelector(".button-container").classList.add("clickable");
      getElement("chunky-reward").classList.add("hidden");
      getElement("chunky-button-container").classList.remove("hidden");
   }
   hidePopup() {
      this.chunkyRage += 34 + randomInt(0, 11);
      let displayText = Math.round((this.chunkyRage + Number.EPSILON) * 100) / 100;
      getElement("chunky-progress-text").innerHTML = displayText + "%";

      let progressBar = getElement("chunky-progress-bar");
      progressBar.style.width = displayText + "%";
      progressBar.classList.add("changed");

      // Show the chunky status text.
      let chunkyStatus = getElement("chunky-status");
      chunkyStatus.classList.remove("hidden");
      if (this.chunkyRage <= 25) {
         chunkyStatus.innerHTML = "Chunky is appeased.";
      } else if (this.chunkyRage <= 50) {
         chunkyStatus.innerHTML = "Chunky grows angry.";
      } else if (this.chunkyRage <= 75) {
         chunkyStatus.innerHTML = "Chunky is angry.";
      } else if (this.chunkyRage <= 99) {
         chunkyStatus.innerHTML = "Chunky is fuming.";
      } else if (this.chunkyRage >= 100) {
         chunkyStatus.innerHTML = "Chunky has risen.";
         this.activateChunky();
      }

      if (this.chunkyRage <= 99) {
         let chunkyReward = getElement("chunky-reward");
         chunkyReward.classList.remove("hidden");
         let displayPoints = Math.round((points + Number.EPSILON) * 100) / 100;
         chunkyReward.innerHTML = "+20% points. (" + displayPoints + " points)";
      }

      getElement("chunky-progress-text").classList.add("red");

      this.displayObj.querySelector(".button-container").classList.remove("clickable");
      // Hide the buttons
      getElement("chunky-button-container").classList.add("hidden");

      // Hide chunky after time
      setTimeout(() => {
         super.hidePopup();
         progressBar.classList.remove("changed");
      }, 2500);
   }
   activateChunky() {
      let potentialPopups = ["plagueOfChunky", "scourgeOfChunky", "wrathOfChunky", "hexOfChunky"];

      // Show 3 random chunky debuffs.
      const popupDisplayAmount = 4;
      for (let i = 0; i < popupDisplayAmount; i++) {
         let popupIndex = randomInt(0, potentialPopups.length);
         let currentShowPopup = potentialPopups[popupIndex];
         potentialPopups.splice(popupIndex, 1);
         semiPopups[currentShowPopup].showPopup();
      }

      // Show the chunky message.
      semiPopups.chunkyMessage.showPopup();
   }
}
class AnnualSurvey extends Popup {
   constructor(popupDataName) {
      super(popupDataName);

      getElement("survey-start").addEventListener("click", () => {
         this.startSurvey();
      });
      getElement("survey-submit").addEventListener("click", () => {
         this.submitSurvey();
      });
   }
   startSurvey() {
      // Show the survey
      let visibleList = document.getElementsByClassName("survey-visible");
      for (let i = 0; i < visibleList.length; i++) {
         visibleList[i].classList.remove("hidden");
      }
      let hiddenList = document.getElementsByClassName("survey-hidden");
      for (let i = 0; i < hiddenList.length; i++) {
         hiddenList[i].classList.add("hidden");
      }
   }
   submitSurvey() {
      // Reset the survey
      let visibleList = document.getElementsByClassName("survey-visible");
      for (let i = 0; i < visibleList.length; i++) {
         visibleList[i].classList.add("hidden");
      }
      let hiddenList = document.getElementsByClassName("survey-hidden");
      for (let i = 0; i < hiddenList.length; i++) {
         hiddenList[i].classList.remove("hidden");
      }

      // Create 3-8 error popups
      let maxPopupCount = randomInt(3, 8);
      let popupBounds = this.displayObj.getBoundingClientRect();
      this.popupPixelsLeft = popupBounds.x;
      this.popupPixelsTop = popupBounds.y;
      this.createIncorrectPopups(0, maxPopupCount);

      super.hidePopup();
   }
   createIncorrectPopups(currentPopup, maxPopups) {
      let copy = getElement("incorrectOG").cloneNode(true);
      copy.classList.remove("hidden");
      document.body.appendChild(copy);
      copy.style.left = "calc(" + this.popupPixelsLeft + "px + " + currentPopup + "em)";
      copy.style.top = "calc(" + this.popupPixelsTop + "px + " + currentPopup / 2 + "em)";
      setTimeout(() => {
         if (currentPopup < maxPopups) this.createIncorrectPopups(currentPopup + 1, maxPopups);
      }, 20);

      copy.querySelector(".close-icon").addEventListener("click", () => {
         this.deletePopup(copy);
         Game.addLorem(1);
      });
   }
}
class AdblockBlocker extends Popup {
   constructor(popupDataName) {
      super(popupDataName);

      getElement("adblock-blocker-close").addEventListener("click", () => {
         this.hidePopup();
      });
      const leaveButton = getElement("adblockExit");
      leaveButton.addEventListener("mouseenter", () => {
         leaveButton.classList.add("invisible");
      });
      leaveButton.addEventListener("mouseleave", () => {
         leaveButton.classList.remove("invisible");
      });
   }
   hidePopup() {
      super.hidePopup();
      for (let i = 1; i <= 5; i++) {
         setTimeout(() => {
            semiPopups["ad" + i].showPopup();
         }, i * 50);
         getElement("ad" + i).querySelector(".close-icon").addEventListener("click", () => {
            semiPopups["ad" + i].hidePopup();
            Game.addLorem(1.5);
         });
         dragElement(this.displayObj, this.displayObj.querySelector(".popup-title"));
      }
   }
}
class ChunkyVirus extends Popup {
   constructor(popupDataName) {
      super(popupDataName);
      this.baseTime = 10;
      this.copies = {};

      getElement("chunky-virus-close").addEventListener("click", () => {
         this.duplicatePopup();
      });
   }
   duplicatePopup() {
      // Reset the timer.
      this.baseTime = 10;

      // Decrement points.
      Game.addLorem(-3);

      // Create a copy.
      const newPopup = new ChunkyVirusCopy();
   }
   showPopup() {
      super.showPopup();

      if (!this.displayed) return;
      this.baseTime = 10;
      this.updateInterval = setInterval(() => {
         this.baseTime -= 0.1;
         if (this.baseTime <= 0) {
            this.hidePopup();
         } else {
            // Update the base display time.
            this.displayObj.querySelector(".chunky-invisible").innerHTML = formatFloat(this.baseTime);

            const virusKeys = Object.keys(this.copies);
            for (let i = 0; i < virusKeys.length; i++) {
               this.copies[virusKeys[i]].copyTime -= 0.1;

               // Update the display time.
               this.copies[virusKeys[i]].displayObj.querySelector(".chunky-invisible").innerHTML = formatFloat(this.copies[virusKeys[i]].copyTime);

               if (this.copies[virusKeys[i]].copyTime <= 0) {
                  // Remove the copy.
                  this.deletePopup(this.copies[virusKeys[i]].displayObj);
                  delete this.copies[virusKeys[i]];
               }
            }
         }
      }, 100);
   }
   hidePopup() {
      super.hidePopup();
      clearInterval(this.updateInterval);
   }
}
class ChunkyVirusCopy {
   constructor() {
      this.copyTime = 5;

      // Create the new popup.
      this.displayObj = popups.chunkyVirus.displayObj.cloneNode(true);
      this.displayObj.id = "";
      getElement("computer").appendChild(this.displayObj);

      // Find the next available display position
      const copyLength = Object.keys(popups.chunkyVirus.copies).length;
      let lastValue = Object.keys(popups.chunkyVirus.copies)[copyLength - 1];
      lastValue = parseInt(lastValue) || 0;
      let nextAvailable;
      for (let i = 0; i < lastValue + 1; i++) {
         if (popups.chunkyVirus.copies[i + 1] == undefined) {
            nextAvailable = i + 1;
            break;
         }
      }

      // Position the popup.
      this.displayObj.style.top = "calc(40% + " + nextAvailable / 3 + "em)";
      this.displayObj.style.left = "calc(5% + " + nextAvailable + "em)";

      // Add it to the copies data.
      popups.chunkyVirus.copies
      for (let i = 0; i < copyLength + 1; i++) {
         if (popups.chunkyVirus.copies[i + 1] == undefined) {
            popups.chunkyVirus.copies[i + 1] = this;
         }
      }

      this.displayObj.querySelector(".close-icon").addEventListener("click", () => {
         popups.chunkyVirus.duplicatePopup();
      });
   }
}
class ChunkyPlantation extends Popup {
   constructor(popupDataName) {
      super(popupDataName);
   }
   showPopup() {
      super.showPopup();

      if (!this.displayed) return;
      // Remove existing bananas
      let bananaList = document.getElementsByClassName("plantation-banana");
      for (let i = 0; i < bananaList.length; i++) {
         bananaList[i].remove();
      }

      this.currentTimerTime = 15;
      getElement("chunky-plantation-count").innerHTML = 10;

      this.updateTimerText = setInterval(() => {
         this.currentTimerTime -= 0.1;

         getElement("chunky-plantation-count").innerHTML = formatFloat(this.currentTimerTime);
         if (this.currentTimerTime <= 0) {
            this.hidePopup();
         }
      }, 100);

      // Show the bananas
      const bananaCount = randomInt(15, 20, true);
      const maxDisplayTime = 200; // Time it takes to display the bananas.
      let currentBanana = 0;
      this.createBananaInterval = setInterval(() => {
         currentBanana++;
         const newBanana = new ChunkyPlantationBanana();
         if (currentBanana >= bananaCount) clearInterval(this.createBananaInterval);
      }, maxDisplayTime / bananaCount);
   }
   hidePopup() {
      clearInterval(this.updateTimerText);
      super.hidePopup();
   }
}
class ChunkyPlantationBanana {
   constructor() {
      this.displayObj = document.createElement("div");
      this.displayObj.classList.add("plantation-banana");
      document.querySelector(".chunky-tree").appendChild(this.displayObj);

      // Change display position.
      const displayBounds = this.displayObj.getBoundingClientRect();
      this.top = Math.random() * 90 + 5;
      this.left = Math.random() * 90 + 5;
      this.displayObj.style.top = this.top + "%";
      this.displayObj.style.left = this.left + "%";

      // Give random rotation.
      this.displayObj.style.transform = "rotate(" + randomInt(0, 360) + "deg)";

      this.displayObj.addEventListener("click", () => {
         this.collectBanana();
      });
   }
   collectBanana() {
      // Hide popup if all bananas are collected.
      if (document.getElementsByClassName("plantation-banana").length == 1) {
         popups.chunkyPlantation.hidePopup();
      }

      this.displayObj.remove();

      for (let i = 0; i < 10 + Math.random() * 5; i++) {
         let text = new ChunkyPlantationText(this.top, this.left);
      }
   }
}
class ChunkyPlantationText {
   constructor(top, left) {
      this.displayObj = document.createElement("div");
      this.displayObj.classList.add("plantation-text");
      this.displayObj.classList.add("xp-font");
      document.querySelector(".chunky-tree").appendChild(this.displayObj);

      if (Math.random() > 0.65) this.displayObj.style.color = "red";

      this.displayObj.style.top = "calc(" + top + "% + 16px)";
      this.displayObj.style.left = "calc(" + left + "% + 16px)";

      this.randomiseText();

      this.startTop = top;
      this.startLeft = left;
      this.topOffset = 0;
      this.leftOffset = 0;

      this.xVel = this.getRandomVel() * this.getRandomSign();
      this.yVel = this.getRandomVel() * this.getRandomSign();

      this.dieTime = randomFloat(9, 15);

      this.tickCount = 0;
      this.updateInterval = setInterval(() => {
         this.update();
      }, 40);
   }
   update() {
      this.tickCount += 0.8;
      if (this.tickCount >= this.dieTime) {
         this.displayObj.remove();
         delete this;
      } else {
         this.topOffset += this.xVel / 3;
         this.leftOffset += this.yVel / 3;

         this.xVel *= 0.925 - this.tickCount / 75;
         this.yVel *= 0.925 - this.tickCount / 75;

         this.displayObj.style.top = "calc(" + this.startTop + "% + 16px + " + this.topOffset + "em)";
         this.displayObj.style.left = "calc(" + this.startLeft + "% + 16px + " + this.leftOffset + "em)";

         this.displayObj.opacity = 1 - this.tickCount * 0.1;

         this.randomiseText();
      }
   }
   randomiseText() {
      const symbols = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
      this.displayObj.innerHTML = symbols[randomInt(0, symbols.length)];
   }
   getRandomVel() {
      const rand = Math.random() * 2 - 1;
      const result = Math.sin((rand * Math.PI + Math.PI) / 2);
      return result;
   }
   getRandomSign() {
      return randomInt(0, 2) * 2 - 1;
   }
}

class RamDownload extends Popup {
   constructor(popupDataName) {
      super(popupDataName);
      this.running = false;

      getElement("ram-download-button").addEventListener("click", () => {
         if (!this.running) this.startRamDownload();
      });
   }
   startRamDownload() {
      this.running = true;

      const ramDownloadButton = getElement("ram-download-button");
      ramDownloadButton.innerHTML = "Working...";

      let progress = 0;
      const finishProgress = randomInt(5, 11);
      this.ramDownload = setInterval(() => {
         progress += 0.1;
         if (progress >= finishProgress) {
            clearInterval(this.ramDownload);
            getElement("ram-download-button").innerHTML = "Done!"

            setTimeout(() => {
               this.fadeOut();
            }, 2000);
         } else {
            const displayProgress = progress / finishProgress * 100;
            getElement("ram-download-progress-bar").style.width = displayProgress + "%";
            getElement("ram-download-progress-text").innerHTML = formatFloat(displayProgress) + "%";
         }
      }, 100);
   }
   fadeOut() {
      let displayOpacity = 1;
      this.fadeInterval = setInterval(() => {
         displayOpacity -= 0.05;
         if (displayOpacity <= 0) {
            clearInterval(this.fadeInterval);
            this.hidePopup();
         } else {
            this.displayObj.style.opacity = displayOpacity;
         }
      }, 50);
   }
   showPopup() {
      super.showPopup();
      this.displayObj.style.opacity = 1;
      getElement("ram-download-button").innerHTML = "Download";
      getElement("ram-download-progress-bar").style.width = "0px";
      getElement("ram-download-progress-text").innerHTML = "0%";
   }
   hidePopup() {
      super.hidePopup();
      this.running = false;
   }
}

class BankDetails extends Popup {
   constructor(popupDataName) {
      super(popupDataName);

      getElement("bank-details-submit").addEventListener("click", () => this.submit());

      const form = getElement("bank-details-form");
      form.addEventListener("submit", this.handleForm);
   }
   handleForm(event) {
      event.preventDefault();
   }
   submit() {
      const valid = this.checkDetails();
      if (valid != true) {
         getElement("bank-details-error").innerHTML = valid;
      } else {
         getElement("bank-details-error").innerHTML = "Accepted.";

         setTimeout(() => {
            this.hidePopup();
            getElement("bank-details-error").innerHTML = "";
            getElement("bank-details-input").value = "";
         }, 2000);
      }
   }
   checkDetails() {
      const userInput = getElement("bank-details-input").value;
      const inputChars = userInput.split("");

      const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      let numberCount = 0;
      for (let i = 0; i < inputChars.length; i++) {
         if (numbers.indexOf(parseInt(inputChars[i])) >= 0) numberCount++;
      }

      if (this.checkType == 1) {
         if (!userInput.includes("pass")) {
            return "ERROR: Must contain the word 'pass'.";
         }

         const specialCharacters = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
         let containsSpecial = false;
         for (let i = 0; i < specialCharacters.length; i++) {
            if (userInput.includes(specialCharacters[i])) {
               containsSpecial = true;
               break;
            }
         }
         if (!containsSpecial) {
            return "ERROR: Must contain a special character.";
         }
         if (numberCount < 3) {
            return "ERROR: Must contain at least 3 numbers.";
         }

         if (inputChars[2] != "_") {
            return "ERROR: Third character must be an underscore.";
         }

         if (inputChars[inputChars.length - 1] != "?") {
            return "ERROR: Last character must be a question mark.";
         }
      } else if (this.checkType == 2) {
         if (inputChars[0] != "(") {
            return "ERROR: Must start with opening bracket.";
         }

         if (numberCount != 4) {
            return "ERROR: Must have exactly 4 numbers.";
         }

         let characterIsNumber = false;
         for (let i = 0; i < inputChars.length; i++) {
            if (numbers.indexOf(parseInt(inputChars[i])) >= 0) {
               if (characterIsNumber) {
                  return "ERROR: All numbers must be separated.";
               }
               characterIsNumber = true;
            } else {
               characterIsNumber = false;
            }
         }

         let equalsCount = 0;
         for (let i = 0; i < inputChars.length; i++) {
            if (inputChars[i] == "=") {
               equalsCount++;
            }
         }
         if (equalsCount != 2) {
            return "ERROR: Must contain exactly 2 equals signs.";
         }

         let lastIsDot = true;
         for (let i = 0; i < inputChars.length; i++) {
            if (inputChars[i] != ".") {
               if (!lastIsDot) {
                  return "ERROR: All characters must be separated by dots.";
               }
               lastIsDot = false;
            } else {
               lastIsDot = true;
            }
         }
      } else {
         if (inputChars.length < 10) {
            return "ERROR: Must be at least 10 characters long.";
         }

         let usedCharacters = [];
         for (let i = 0; i < inputChars.length; i++) {
            if (usedCharacters.indexOf(inputChars[i]) != -1) {
               return "ERROR: Must not contain any of the same characters.";
            }
            usedCharacters.push(inputChars[i]);
         }

         if (numberCount < 5) {
            return "ERROR: Must contain at least 5 numbers.";
         }

         let sum = 0;
         for (let i = 0; i < inputChars.length; i++) {
            if (numbers.indexOf(parseInt(inputChars[i])) >= 0) {
               sum += parseInt(inputChars[i]);
            }
         }
         if (sum != 19) {
            return "ERROR: The sum of the numbers must be 19.";
         }

         if (inputChars.length > 12) {
            return "ERROR: Must contain at most 12 characters.";
         }
      }
      return true;
   }
   showPopup() {
      super.showPopup();

      this.checkType = randomInt(1, 3, true);
   }
}

class Expandinator extends Popup {
   constructor(popupDataName) {
      super(popupDataName);

      this.displayTimeSeconds = 1.5;

      getElement("expandinator-close").addEventListener("click", () => this.hidePopup());
   }
   showPopup() {
      super.showPopup();

      this.resetPopup();

      const bounds = this.displayObj.getBoundingClientRect();
      const computerBounds = getElement("computer").getBoundingClientRect();

      this.startWidth = bounds.width;
      const widthRemaining = computerBounds.width - bounds.width;
      const startLeft = bounds.x;

      this.startHeight = bounds.height;
      const heightRemaining = computerBounds.height - bounds.height;
      const startTop = bounds.y - computerBounds.y;

      let time = this.displayTimeSeconds;
      this.updateTimerInterval = setInterval(() => {
         time -= 0.1;
         getElement("expandinator-timer").innerHTML = "Time remaining: " + formatFloat(time);
      }, 100);

      this.timeout = setTimeout(() => {
         clearInterval(this.updateTimerInterval);

         let space = 0;
         this.expandInterval = setInterval(() => {
            space += 0.002;

            this.displayObj.style.width = this.startWidth + widthRemaining * space + "px";
            this.displayObj.style.height = this.startHeight + heightRemaining * space + "px";
            this.displayObj.style.left = startLeft * (1 - space) + "px";
            this.displayObj.style.top = startTop * (1 - space) + "px";

            if (space >= 1) clearInterval(this.expandInterval);
         }, 20);
      }, this.displayTimeSeconds * 1000);
   }
   resetPopup() {
      clearTimeout(this.timeout);
      clearInterval(this.expandInterval);
      clearInterval(this.updateTimerInterval);

      getElement("expandinator-timer").innerHTML = "Time remaining: " + this.displayTimeSeconds;

      console.log(this.startWidth, this.startHeight);

      this.displayObj.style.width = this.startWidth + "px";
      this.displayObj.style.height = this.startHeight + "px";
   }
}

class DevHire extends Popup {
   constructor(popupDataName) {
      super(popupDataName);

      const promptCount = 4;
      for (let i = 1; i <= promptCount - 1; i++) {
         getElement(`dev-hire-prompt-${i}`).querySelector(".correct-button").addEventListener("click", () => {
            console.log("A");
            this.showPrompt(i + 1);
         });
      }
      getElement(`dev-hire-prompt-${promptCount}`).addEventListener("click", () => {
         this.hidePopup();
      });

      getElement("dev-hire-close").addEventListener("click", () => {
         this.showPrompt(1);
      });

      getElement("equ-in-1").addEventListener("click", () => {
         getElement("dev-hire-prompt-3").classList.add("hidden");
      });
      getElement("equ-in-2").addEventListener("click", () => {
         getElement("dev-hire-prompt-3").classList.add("hidden");
      });
   }
   showPrompt(promptN) {
      getElement(`dev-hire-prompt-${promptN}`).classList.remove("hidden");
      if (promptN > 1) getElement(`dev-hire-prompt-${promptN - 1}`).classList.add("hidden");
   }
   showPopup() {
      super.showPopup();

      if (!this.displayed) return;
      this.updatePrompt3();
      getElement("dev-hire-prompt-4").classList.dd("hidden");
   }
   updatePrompt3() {
      const equationType = randomInt(0, 5);
      const equations = ["9 - 4 =", "2 * 5 =", "6 / 2 =", "9 + 9 =", "1 + 0 ="];
      const answers = ["5", "10", "3", "18", "1"];
      getElement("prompt-equation").innerHTML = equations[equationType];
      getElement("equ-correct").innerHTML = answers[equationType];
      getElement("equ-in-1").innerHTML = parseInt(answers[equationType]) + 9;
      getElement("equ-in-2").innerHTML = randomInt(parseInt(answers[equationType]), parseInt(answers[equationType]) + 5, true);
   }
}