// The parent class (inherited by all applications).
// Used to handle the general functions of applications.
class Application {
    constructor(name) {
        this.createNavPresence();
        this.opened = false;
        this.name = name;

        dragElement(getElement(name), getElement(name + "-top"));
    }
    createNavPresence() {
        this.navObject = getElement("application-template").cloneNode(true);
        this.navObject.id = '';
        this.navObject.classList.remove("hidden");
        getElement("computer-nav").appendChild(this.navObject);

        this.navObject.addEventListener("click", () => {
            this.opened ? this.hideApplication() : this.openApplication();
        });
    }
    openApplication() {
        this.opened = true;
        getElement(this.name).classList.remove("hidden");
        this.navObject.classList.remove("closed");
    }
    hideApplication() {
        this.opened = false;
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

      setTimeout(() => {
         this.createEvent(['This is gaminger']);
      }, 500);
      setTimeout(() => {
         this.createEvent(['Gained '], ['0.5'], [' lorem!']);
      }, 1000);
   }
   createEvent(...args) {
      // Create the event
      const newEvent = document.createElement('div');
      newEvent.classList.add('event-viewer-entry');
      getElement('event-viewer-display').appendChild(newEvent);

      // Parse the text
      const displayText = document.createDocumentFragment();
      for (const text of args) {
         const textSegment = document.createElement('span');
         textSegment.innerHTML = text[0];

         // Apply modifiers
         for (const modifier of text) {
            if (modifier.split('')[0] === '#') {
               textSegment.style.color = modifier;
               textSegment.style.textShadow = '0 0 3px #000';
            }
         }
         displayText.appendChild(textSegment);
      }
      
      newEvent.appendChild(displayText);
   }
}