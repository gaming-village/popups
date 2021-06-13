class SemiPopup extends BaseStructure {
   constructor(popupDataName) {
      super();
      this.displayed = false;

      // Convert camelCase to slug-case
      this.slugCase = popupDataName.replace(/([A-Z])/g, "-$1").toLowerCase(); 
      this.displayObj = getElement(this.slugCase);

      dragElement(this.displayObj, getElement(`${this.slugCase}-title`));
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
      super.showPopup(60);

      Game.multLorem(0.65, true);

      const displayTime = 7500;
      setTimeout(() => this.hidePopup(), displayTime);
   }
}
class ScourgeOfChunky extends SemiPopup {
   constructor(popupDataName) {
      super(popupDataName);

      this.activated = false;
      this.isChunky = true;
   }
   showPopup() {
      super.showPopup(60);

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
      super.showPopup(60);

      // Move all popups.
      const movePopupsInterval = setInterval(() => {
         const movePopups = { ...popups, ...semiPopups };
         for (const item of Object.values(movePopups)) {
            if (item.displayed && !item.isChunky && item.popupDataName != "chunky") item.moveToRandomPosition(60);
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
      super.showPopup(60);

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
               associateCheck.left += associateCheck.speed;
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
      const size = randomFloat(1, 5);
      this.associateList[earliestAvailable].size = size;
      this.associateList[earliestAvailable].displayObj = newAssociate;
      this.associateList[earliestAvailable].left = -1;
      this.associateList[earliestAvailable].speed = Math.pow(size / 3, 1.15);

      // Convert (size * 20) to (vw+vh)/2 to scale with viewport size.
      const px = size * 20;
      const vw = 100 / window.innerWidth * px;
      const vh = 100 / window.innerHeight * px;

      // Change the element's size.
      newAssociate.style.width = `calc((${vw}vw + ${vh}vh) / 2)`;
      newAssociate.style.height = `calc((${vw}vw + ${vh}vh) / 2)`;
      if (size >= 2.5) {
         newAssociate.style.zIndex = 2;
      }

      // Move the element to a random top position;
      this.associateList[earliestAvailable].top = randomFloat(5, 95);
      newAssociate.style.top = this.associateList[earliestAvailable].top + "%";

      // Style the element.
      if (associateType === "banana") {
         newAssociate.classList.add("hex-banana");
      } else if (associateType === "chunky") {
         newAssociate.classList.add("hex-chunky");
      } else if (associateType === "monke") {
         newAssociate.classList.add("hex-monke");
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

      // continued = true;
      // getElement("a").classList.remove("unclickable");
   }
   showPopup() {
      super.showPopup(30);

      // getElement("a").classList.add("unclickable");
   }
}