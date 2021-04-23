class SemiPopup extends BaseStructure {
   constructor(popupDataName) {
      super();
      this.displayObj = getElement(popupDataName);
      this.displayed = false;

      dragElement(this.displayObj, getElement(popupDataName + "-title"));
   }
   showPopup(range) {
      this.displayObj.classList.remove("hidden");
      this.moveToRandomPosition(range);
      this.displayed = true;
   }
   hidePopup() {
      this.displayObj.classList.add("hidden");
      this.displayed = false;
   }
}

class ChunkyMessage extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);
      this.isChunky = true;
   }
   showPopup() {
      super.showPopup(0);

      setTimeout(() => {
         this.hidePopup();
      }, 20000);
   }
}
class PlagueOfChunky extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);
      this.isChunky = true;
   }
   showPopup() {
      super.showPopup(50);

      Game.multLorem(0.65, true);

      const displayTime = 7.5; // In seconds
      setTimeout(() => {
         this.hidePopup();
      }, displayTime * 1000);
   }
}
class ScourgeOfChunky extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);

      this.activated = false;
      this.isChunky = true;
   }
   showPopup() {
      super.showPopup(50);

      this.activated = true;

      const displayTime = 20; // In seconds
      setTimeout(() => {
         this.hidePopup();
      }, displayTime * 1000);
   }
   hidePopup() {
      super.hidePopup();

      this.activated = false;
   }
}
class WrathOfChunky extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);
      this.isChunky = true;
   }
   showPopup() {
      super.showPopup(50);

      // Move all popups.
      const movePopupsInterval = setInterval(() => {
         const movePopups = { ...popups, ...semiPopups };
         for (const item of Object.values(movePopups)) {
            if (item.displayed && !item.isChunky) item.moveToRandomPosition(60);
         }
      }, 500);

      const clearIntervalTime = 10000;
      setTimeout(() => {
         this.hidePopup();
         clearInterval(movePopupsInterval);
      }, clearIntervalTime);
   }
}
class HexOfChunky extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);

      this.nextAssociateTime = 200;
      this.associateList = {};
      this.isChunky = true;
   }
   showPopup() {
      super.showPopup(50);

      this.associateTimer();

      const hideTimer = setTimeout(() => {
         this.hidePopup();
         clearInterval(this.createAssociateTimer);
      }, 10000);

      // Move associates timer.
      const moveAssociates = setInterval(() => {
         const associateNames = Object.keys(this.associateList);
         for (let i = 0; i < associateNames.length; i++) {
            const associateCheck = this.associateList[associateNames[i]];
            if (associateCheck.left >= 100) {
               this.associateList[associateNames[i]].displayObj.remove();
               delete this.associateList[associateNames[i]];
               if (associateNames.length == 1) clearInterval(moveAssociates);
            } else {
               associateCheck.left += 0.1 + associateCheck.addedSpeed;
               associateCheck.top += randomFloat(-0.6, 0.6) + associateCheck.glitchMod * Math.sign(randomFloat(-1, 1));
               associateCheck.displayObj.style.top = associateCheck.top + "%";
               associateCheck.displayObj.style.left = associateCheck.left + "%";
            }
         }
      }, 30);
   }
   associateTimer() {
      this.createAssociateTimer = setTimeout(() => {
         this.createAssociate();

         this.nextAssociateTime = randomInt(150, 250);
         this.associateTimer();
      }, this.nextAssociateTime);
   }
   createAssociate() {
      const potentialAssociates = ["banana", "chunky", "monke"];
      let currentAssociate = potentialAssociates[randomInt(0, potentialAssociates.length)];
      if (Math.random() < 0.05) currentAssociate = "bigmonke";
      this.createAssociateElement(currentAssociate);
   }
   createAssociateElement(associateType) {
      // Create the element.
      const newAssociate = document.createElement("div");
      getElement("computer").appendChild(newAssociate);

      // Find next available name
      const associateNames = Object.keys(this.associateList);
      const maxCheck = associateNames[associateNames.length - 1] + 1;
      let earliestAvailable = 1;
      for (let i = 1; i <= maxCheck; i++) {
         if (this.associateList[i] == undefined) {
            earliestAvailable = i;
            break;
         }
      }

      // Add the element ot the list to be checked in the iteration.
      this.associateList[earliestAvailable] = {};
      this.associateList[earliestAvailable].displayObj = newAssociate;
      this.associateList[earliestAvailable].left = -1;
      this.associateList[earliestAvailable].addedSpeed = randomFloat(0, 0.6);
      this.associateList[earliestAvailable].glitchMod = randomInt(0, 2) * 2.5;

      // Move the element to a random top position;
      this.associateList[earliestAvailable].top = associateType === "bigmonke" ? 50 : randomInt(0, 100);
      newAssociate.style.top = this.associateList[earliestAvailable].top + "%";

      // Style the element.
      if (associateType === "banana") {
         newAssociate.classList.add("hex-banana");
      } else if (associateType === "chunky") {
         newAssociate.classList.add("hex-chunky");
      } else if (associateType === "monke") {
         newAssociate.classList.add("hex-monke");
      } else if (associateType === "bigmonke") {
         newAssociate.classList.add("hex-bigmonke");

         this.associateList[earliestAvailable].addedSpeed += 0.3;
         this.associateList[earliestAvailable].addedSpeed *= 2;
         this.associateList[earliestAvailable].glitchMod += 2.5;
         this.associateList[earliestAvailable].glitchMod *= 2.5;
      }
   }
}
class Ad1 extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);
   }
}
class Ad2 extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);
   }
}
class Ad3 extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);
   }
}
class Ad4 extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);
   }
}
class Ad5 extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);
   }
}

class LoremWarning extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);

      getElement("lorem-warning-send").addEventListener("click", () => {
         addPoints(-1);
      });

      getElement("lorem-warning-close").addEventListener("click", () => this.hidePopup());
   }
   hidePopup() {
      super.hidePopup();

      continued = true;
      getElement("a").classList.remove("unclickable");
   }
   showPopup() {
      super.showPopup(30);

      getElement("a").classList.add("unclickable");
   }
}