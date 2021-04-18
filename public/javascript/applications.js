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
        this.navObject = document.querySelector("#application-template").cloneNode(true);
        this.navObject.id = "";
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