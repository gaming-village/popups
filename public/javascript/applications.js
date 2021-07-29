// The parent class (inherited by all applications).
// Used to handle the general functions of applications.
class Application {
   constructor(name) {
      this.opened = false;
      this.name = name;

      this.createNavPresence();

      dragElement(getElement(name), getElement(name + '-top'));
   }
   get position() {
      const pos = getElement(this.name).getBoundingClientRect();
      return {
         x: pos.left,
         y: pos.top
      };
   }
   set position(newPos) {
      const obj = getElement(this.name);
      obj.style.top = newPos.y + "vh";
      obj.style.left = newPos.x + "vw";
   }
   get displayName() {
      let returnVal = this.name.split('-');
      returnVal = returnVal.map(item => capitalize(item));
      return returnVal.join(' ');
   }
   createNavPresence() {
      this.navObject = getElement("application-template").cloneNode(true);
      this.navObject.id = '';
      this.navObject.classList.remove("hidden");
      getElement("computer-nav").appendChild(this.navObject);

      this.navObject.addEventListener("click", () => {
         this.opened ? this.hide() : this.open();
      });

      this.navObject.querySelector('.text').innerHTML = this.displayName;
   }
   open(updateCookie = true) {
      this.opened = true;
      getElement(this.name).classList.remove("hidden");
      if (updateCookie) updateApplicationPositions();
      this.navObject.classList.remove("closed");
   }
   hide() {
      this.opened = false;
      updateApplicationPositions();
      getElement(this.name).classList.add("hidden");
      this.navObject.classList.add("closed");
   }
}

class LoremController extends Application {
    constructor() {
        super("lorem-app");

        getElement("mining-feed-open").addEventListener("click", () => {
            const miningFeed = getElement("mining-feed");
            miningFeed.classList.contains("hidden") ? miningFeed.classList.remove("hidden") : miningFeed.classList.add("hidden");
        });
    }
}

class LoremCounter extends Application {
   constructor() {
      super("lorem-counter");
   }
}

class EventViewer extends Application {
   constructor() {
      super('event-viewer');
   }
   createEvent(...args) {
      // Create the event
      const newEvent = document.createElement('div');
      newEvent.classList.add('event-viewer-entry');
      getElement('event-viewer-display').prepend(newEvent);

      // Parse the text
      const displayText = document.createDocumentFragment();
      for (const text of args) {
         const textSegment = document.createElement('span');
         textSegment.innerHTML = text[0];

         // Apply modifiers
         for (const modifier of text) {
            if (typeof modifier !== 'string') continue;

            if (modifier.split('')[0] === '#') {
               textSegment.style.color = modifier;
            }
         }
         displayText.appendChild(textSegment);
      }
      
      newEvent.appendChild(displayText);

      setTimeout(() => {
         newEvent.remove();
      }, 5000);
   }
}