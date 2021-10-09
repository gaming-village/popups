const popups = {};
const semiPopups = {};
const applications = {
   "lorem-counter": {
      isOpened: true,
      id: "loremCounter"
   },
   "achievement-tracker": {
      isOpened: false,
      id: "achievementTracker",
      unlockedAchievements: null,
      setup: function() {
         Game.achievements.setup();

         // Creates the achievement objects and puts them into the Achievement Tracker 
         this.createAchievementsWithoutFilter();

         // Creates the filters for the achievements.
         this.createFilters();

         this.setupSearchBar();
      },
      open: function() {
         // Updates the achievements
         this.updateAchievements();

         // Sets up the view types.
         this.createViewTypes();
      },
      close: function() {
         // Removes the view types.
         this.removeViewTypes();
      },
      currentViewType: "strips",
      viewTypes: ["grid", "strips"],
      selectViewType: function(newViewType) {
         const achievementTracker = getElement("achievement-tracker");

         // Update the achievement object's css to match the new view type.
         const achievementContainer = achievementTracker.querySelector(".achievement-container");
         for (const viewType of this.viewTypes) {
            achievementContainer.classList.remove(viewType);
         }
         achievementContainer.classList.add(newViewType);

         // Update the view type buttons' css
         const viewTypeButtons = getElement("achievement-tracker").getElementsByClassName("view-type");
         for (const viewTypeButton of viewTypeButtons) {
            viewTypeButton.classList.remove("selected");
         }
         getElement("achievement-tracker").querySelector("." + newViewType).classList.add("selected");
      },
      createViewTypes: function() {
         const container = getElement("achievement-tracker").querySelector(".view-type-container");
         for (const viewType of this.viewTypes) {
            const obj = document.createElement("div");
            obj.className = `view-type ${viewType}`;
            container.appendChild(obj);
            
            obj.innerHTML = `
            <div class="name">${capitalize(viewType)}</div>
            <img src="images/win95/thumbnail-${viewType}.png" draggable="false" />`;

            obj.addEventListener("click", () => {
               this.selectViewType(viewType);

               new Sound({
                  path: "audio/select.mp3",
                  volume: 0.5
               });
            });
         }

         // Update the selected view type to its defalt value
         this.selectViewType(this.currentViewType);
      },
      removeViewTypes: function() {
         const viewTypesContainer = getElement("achievement-tracker").querySelector(".view-type-container");
         while (viewTypesContainer.children[0]) {
            viewTypesContainer.children[0].remove();
         }
      },
      createAchievementsWithoutFilter: function() {
         let list = [];
         const allAchievements = Game.achievements.getAchievements();
         for (const achievement of allAchievements) {
            list.push(achievement);
         }
         this.drawAchievements(list);
      },
      removeAchievements: function() {
         const container = getElement("achievement-tracker").querySelector(".achievement-container");
         while (container.children[0]) {
            container.children[0].remove();
         }
      },
      drawAchievements: function(objects) {
         // Remove existing achievements to prevent duplicates
         this.removeAchievements();

         const container = getElement("achievement-tracker").querySelector(".achievement-container");
         for (const object of objects) {
            if (typeof object[1] === "string") {
               const header = document.createElement(object[1]);
               header.innerHTML = object[0];
               if (object[1] === "p") {
                  header.className = "message";
               }
               container.appendChild(header);
            } else if (typeof object[1] === "object") {
               const obj = document.createElement("div");
               obj.className = "achievement " + object[0];
               container.appendChild(obj);

               obj.innerHTML = `
               <img src="./images/achievements/unknown.png" />
               <div>
                  <p class="name">???</p>
                  <p class="description">???</p>
               </div>
               <div class="bg"></div>`;
               container.appendChild(obj);

               if (object[1].unlocked) this.unlockAchievement(object[0], object[1]);
            }
         }
      },
      unlockAchievement: function(name, achievement) {
         const container = getElement("achievement-tracker").querySelector(".achievement-container");
         const obj = container.querySelector("." + name);
         if (obj.classList.contains("unlocked")) return;
         
         obj.classList.add("unlocked");
         obj.querySelector(".bg").remove();
         obj.querySelector("img").src = achievement.img;
         obj.querySelector(".name").innerHTML = achievement.name;
         obj.querySelector(".description").innerHTML = achievement.description;
      },
      updateAchievements: function() {
         let unlockedAchievements = 0;
         let totalAchievements = 0;
         for (const achievement of Object.entries(Game.achievements.list)) {
            if (achievement[1].unlocked) {
               this.unlockAchievement(achievement[0], achievement[1]);
               unlockedAchievements++;
            }
            totalAchievements++;
         }

         const progress = unlockedAchievements / totalAchievements * 100;
         getElement("achievement-tracker").querySelector(".achievement-count").innerHTML = `Achievements: ${unlockedAchievements}/${totalAchievements} <i>(${progress}%)</i>`;
      },
      filters: ["category", "search", "unlocked"],
      selectedFilter: "",
      unselectFilter: function() {
         this.selectedFilter = "";

         getElement("achievement-tracker").querySelector("li.selected").classList.remove("selected");
      },
      setupSearchBar: function() {
         const searchBar = getElement("achievement-tracker").querySelector("input");
         searchBar.addEventListener("input", () => {
            this.filterAchievements();
         });
      },
      showSearchBar: function() {
         const searchBar = getElement("achievement-tracker").querySelector("input");
         searchBar.classList.remove("hidden");
      },
      hideSearchBar: function() {
         const searchBar = getElement("achievement-tracker").querySelector("input");
         searchBar.classList.add("hidden");
      },
      selectFilter: function(newFilter) {
         if (newFilter === this.selectedFilter) {
            this.unselectFilter();
            this.hideSearchBar();
            return;
         };

         const container = getElement("achievement-tracker");
         if (newFilter === "search") {
            this.showSearchBar();

         } else {
            this.hideSearchBar();
         }

         this.selectedFilter = newFilter;

         // Update the css of the items
         const filterItems = container.getElementsByTagName("li");
         for (const item of filterItems) {
            item.classList.remove("selected");
         }
         container.querySelector("." + newFilter).classList.add("selected");
      },
      createFilters: function() {
         const filters = ["category", "search", "unlocked"];

         const list = getElement("achievement-tracker").querySelector(".filter-list");
         for (const filter of filters) {
            const item = document.createElement("li");
            item.className = filter;
            item.innerHTML = capitalize(filter);
            list.appendChild(item);

            item.addEventListener("click", () => {
               this.selectFilter(filter);
               this.filterAchievements();
            });
         }
      },
      filterAchievements: function() {
         if (this.selectedFilter === "") {
            this.createAchievementsWithoutFilter();
            return;
         }

         const achievements = Game.achievements.getAchievements();
         switch (this.selectedFilter) {
            case "category": {
               const dictionary = {};
               for (const achievement of achievements) {
                  if (!dictionary.hasOwnProperty(achievement[1].category)) {
                     dictionary[achievement[1].category] = [];
                  }

                  dictionary[achievement[1].category].push(achievement);
               }

               const objects = [];
               for (const category of Object.entries(dictionary)) {
                  objects.push([capitalize(category[0]), "h3"]);
                  for (const achievement of category[1]) {
                     objects.push(achievement);
                  }
               }
               this.drawAchievements(objects);
               break;
            }
            case "search":
               const searchBar = getElement("achievement-tracker").querySelector("input");
               const searchItem = searchBar.value.toLowerCase();
               const filteredAchievements = achievements.filter(achievement => achievement[1].name.toLowerCase().includes(searchItem) || achievement[1].description.toLowerCase().includes(searchItem));
               this.drawAchievements(filteredAchievements);
               break;
            case "unlocked": {
               const dictionary = {
                  unlocked: [],
                  locked: []
               };
               for (const achievement of achievements) {
                  if (achievement[1].unlocked) {
                     dictionary.unlocked.push(achievement);
                  } else {
                     dictionary.locked.push(achievement);
                  }
               }

               const objects = [];
               for (const category of Object.entries(dictionary)) {
                  objects.push([capitalize(category[0]), "h3"]);

                  if (dictionary.unlocked.length === 0 && category[0] === "unlocked") {
                     objects.push(["You haven't unlocked any achievements yet!", "p"]);
                  } else if (dictionary.locked.length === 0 && category[0] === "locked") {
                     objects.push(["There are no achievements left to unlock. I think it's time to take a break...", "p"]);
                  }

                  for (const achievement of category[1]) {
                     objects.push(achievement);
                  }
               }
               this.drawAchievements(objects);
               break;
            }
         }
      }
   }
};

const Game = {
   currentView: "",
   inFocus: false,
   tps: 10,
   lorem: 0,
   ticks: 0,
   tick: function() {
      this.ticks++;

      if (this.previousLorem === undefined) this.previousLorem = this.lorem;
      if (this.previousLorem !== this.lorem) {
         const amount = this.lorem - this.previousLorem;
         
         for (const achievement of Game.achievements.loremAchievements) {
            if (Game.lorem >= achievement[1].requirements.lorem) {
               Game.achievements.unlockAchievement(achievement[0]);
            }
         }

         // Check for any letters which require lorem to be sent
         Game.checkLoremLetters();
         Game.updateLorem(formatNum(amount));
      }
      this.previousLorem = this.lorem;

      if (this.previousPackets === undefined) this.previousPackets = this.packets;
      if (this.previousLorem !== this.lorem) {
         // const amount = this.packets - this.previousPackets;

         Game.updatePackets();
      }
      this.previousPackets = this.packets;

      const SECONDS_BETWEEN_SAVES = 1;
      if (this.ticks % (this.tps * SECONDS_BETWEEN_SAVES) === 0) {
         updateSave();
      }
   },
   gainLorem: function(amount, force = false) {
      if (popups.visitor.tripleLorem) amount *= 3;
      Game.lorem += amount;
      Game.stats.loremEarned += amount;
   },
   loseLorem: function(amount, force = false) {
      Game.lorem -= amount;
   },
   multLorem: (amount, force = false) => {
      if (amount > 1) {
         Game.stats.loremEarned += Game.lorem * (amount - 1);
      }
      Game.lorem *= amount;
   },
   updateLorem: function(amount) {
      displayPoints(amount);
      new PointIncrementText(amount);
   },
   stats: {
      loremEarned: 0
   },
   settings: {
      dpp: 2,
      progressType: 2,
      animatedBGs: false,
      rainLetters: true,
      categories: [{
         type: "audio",
         display: "Audio"
      },
      {
         type: "numerals",
         display: "Numerals"
      },
      {
         type: "graphics",
         display: "Graphics"
      }],
      list: {
         masterVolume: {
            name: "Master Volume",
            category: "audio",
            id: "mv",
            value: null,
            type: "range",
            min: 0,
            max: 100,
            defaultValue: 100,
            additionalText: "[VALUE]%"
         },
         displayType: {
            name: "Display Type",
            category: "numerals",
            id: "dt",
            value: null,
            type: "select",
            options: ["Standard", "Letter", "Scientific Notation", "Decimal", "Words"],
            defaultValue: 0
         },
         decimalPointPrecision: {
            name: "Decimal Point Precision",
            category: "numerals",
            id: "dpp",
            value: null,
            type: "range",
            min: 0,
            max: 9,
            defaultValue: 2
         },
         progressDisplay: {
            name: "Progress Display",
            category: "numerals",
            id: "pd",
            value: null,
            type: "select",
            options: ["Percentage", "Current/Total", "Current/Total (Percentage)"],
            defaultValue: 0
         },
         animatedBackgrounds: {
            name: "Animated Backgrounds",
            category: "graphics",
            id: "ab",
            value: null,
            type: "checkbox",
            defaultValue: false
         }
      },
      getContainerElems: function(containerID) {
         return [
            getElement(containerID),
            getElement(containerID).querySelector(".selected-val")
         ];
      },
      updateSettingsValue: function(container, setting, newValue) {
         setting.value = newValue;
         container.querySelector(".selected-val").innerHTML = this.getSelectedValue(setting, newValue);
      },
      getSelectedValue: function(setting, value) {
         let newSelectedValue = "";

         if (setting.type === "range") {
            newSelectedValue = value;
         } else if (setting.type === "select") {
            newSelectedValue = setting.options[value];
         } else if (setting.type === "checkbox") {
            newSelectedValue = value ? "On" : "Off";
         } 

         if (setting.hasOwnProperty("additionalText")) {
            newSelectedValue = setting.additionalText.replace("[VALUE]", newSelectedValue)
         }

         return newSelectedValue;
      },
      getSelectIndex: function(setting) {
         let value = setting.value;
         if (value === null) value = setting.defaultValue;
         return setting.options.indexOf(value);
      },
      setup: function() {
         const dictionary = this.categories.reduce((previousValue, currentValue) => {
            return { ...previousValue, [currentValue.type]: {
               display: currentValue.display,
               settings: []
            }};
         }, {});

         for (const setting of Object.values(this.list)) {
            dictionary[setting.category].settings.push(setting);
         }

         const settings = getElement("settings").querySelector(".main");
         for (const category of Object.values(dictionary)) {
            const categoryContainer = document.createElement("div");
            settings.appendChild(categoryContainer);
            
            const header = document.createElement("h2");
            header.innerHTML = category.display;
            categoryContainer.appendChild(header);

            for (const setting of category.settings) {
               let value = setting.value;
               if (value === null) {
                  value = setting.options[setting.defaultValue];
               }

               let inputType;
               if (setting.type === "checkbox") {
                  inputType = `
                  <input type="checkbox" ${value ? "checked" : ""} />`;
               } else if (setting.type === "select") {
                  inputType = `<select>`;
                  for (const option of setting.options) {
                     inputType += `<option>${option}</option>`;
                  }
                  inputType += `</select>`;
               } else if (setting.type === "range") {
                  inputType = `
                  <input type="range" min="${setting.min}" max="${setting.max}" value="${value}" />`;
               }

               selectedVal = this.getSelectedValue(setting, value);
               
               const settingsContainer = document.createElement("div");
               settingsContainer.className = "section";
               settingsContainer.innerHTML = `
               <div class="cf">
                  <p class="label">${setting.name}</p>
                  <p class="selected-val">${selectedVal}</p>
               </div>
               ${inputType}`;
               categoryContainer.appendChild(settingsContainer);

               if (setting.type === "checkbox") {
                  const input = settingsContainer.querySelector("input");
                  input.addEventListener("click", () => {
                     this.updateSettingsValue(settingsContainer, setting, input.checked);
                  });
               } else if (setting.type === "select") {
                  settingsContainer.querySelector("select").selectedIndex = setting.value;

                  const input = settingsContainer.querySelector("select");
                  input.addEventListener("change", () => {
                     this.updateSettingsValue(settingsContainer, setting, setting.options.indexOf(input.value));
                  });
               } else if (setting.type === "range") {
                  const input = settingsContainer.querySelector("input");
                  input.addEventListener("input", () => {
                     this.updateSettingsValue(settingsContainer, setting, Number(input.value));
                  });
               }
            }
         }
      }
   },
   achievements: {
      list: {
         /* TODO:
          * Achievements for buying applications
          * Achievements for closing popups
         */
         soItBegins: {
            name: "So it begins...",
            description: "Earn your first lorem.",
            id: 1,
            category: "tiered",
            img: "images/achievements/tiered/soItBegins2.png",
            requirements: {
               lorem: 1
            },
            unlocked: false
         },
         gettingSomewhere: {
            name: "Getting somewhere",
            description: "Earn 100 lorem.",
            id: 2,
            category: "tiered",
            requirements: {
               lorem: 100
            },
            unlocked: false
         },
         madeOfMoney: {
            name: "Made of money",
            description: "Earn 10000 lorem.",
            id: 3,
            category: "tiered",
            requirements: {
               lorem: 10000
            },
            unlocked: false
         },
         corporateEntity: {
            name: "Corporate Entity",
            description: "Earn 1000000 lorem.",
            id: 4,
            category: "tiered",
            requirements: {
               lorem: 1000000
            },
            unlocked: false
         },
         multiLevelMarketing: {
            name: "Multi level marketing",
            description: "Hire your first employee.",
            id: 6,
            category: "tiered",
            requirements: {
               workers: 1
            },
            unlocked: false
         },
         theDarkSide: {
            name: "The dark side",
            description: "Convert some lorem to packets.",
            id: 7,
            category: "challenge",
            unlocked: false
         },
         allThatGlittersIsNotGold: {
            name: "All that glitters is not gold",
            description: "Sell 10 employees.",
            id: 8,
            category: "challenge",
            requirements: {

            },
            unlocked: false
         },
         // atAllCosts:
         foolsGold: {
            name: "Fool's Gold",
            description: "do something",
            id: 9,
            category: "challenge",
            requirements: {

            },
            unlocked: false
         },
         shadySales: {
            name: "Shady Sales",
            description: "Unlock the black market",
            id: 10,
            category: "challenge",
            unlocked: false
         },
         brainwashed: {
            name: "Brainwashed",
            description: "Read 5 editions of the Daily Indoctrination",
            id: 11,
            category: "challenge",
            unlocked: false
         }
      },
      getAchievements: function() {
         return Object.entries(this.list);
      },
      unlockAchievement: function(name) {
         const achievement = this.list[name];
         if (achievement.unlocked) return;
         achievement.unlocked = true;

         applications["achievement-tracker"].unlockedAchievements++;

         applications["achievement-tracker"].unlockAchievement(name, achievement);

         alerts.createAlert({
            title: achievement.name,
            iconSrc: achievement.img,
            description: achievement.description,
            caption: "New achievement!"
         });
      },
      unlockAllAchievements: function() {
         for (const achievementName of Object.keys(this.list)) {
            this.unlockAchievement(achievementName);
         }
      },
      setup: function() {
         this.loremAchievements = this.getAchievements().filter(achievement => achievement[1].hasOwnProperty("requirements") && Object.keys(achievement[1].requirements).includes("lorem"));
      }
   },
   loremQuota: {
      quota: 0,
      quotaIdx: -1,
      unlocked: false,
      unlock: function() {
         this.unlocked = true;
         this.updateProgress();
         getElement("lorem-quota").classList.remove("hidden");
      },
      updateProgress: function() {
         const progress = Game.lorem / this.quota * 100;

         getElement("lorem-quota").querySelector(".progress-bar").style.width = progress + "%";
         const displayProgress = formatProg(Game.lorem, this.quota, true)
         getElement("lorem-quota-progress").innerHTML = "Progress: <span>" + displayProgress + "</span>";
         getElement("lorem-quota-progress2").innerHTML = `Progress: <span>${displayProgress}</span>`;

         const quotaStatus = getElement("lorem-quota-status");

         if (progress >= 100) {
            if (getElement("lorem-quota-complete") != undefined) return;

            getElement("claim-quota-button").classList.remove("dark");

            quotaStatus.innerHTML = "Quota Status: <span>Available</span>";
            quotaStatus.querySelector("span").style.color = "rgb(0, 255, 0)";

            const progressText = document.createElement("p");
            progressText.id = "lorem-quota-complete";
            progressText.innerHTML = "Quota reached! Go to the <span>Corporate Overview</span> to claim your reward.";
            getElement("quota-reward-text").after(progressText);

            progressText.querySelector("span").addEventListener("click", () => {
               switchView("corporate-overview");
            });
         } else {
            const quotaNotice = getElement("lorem-quota-complete");
            if (quotaNotice !== null) quotaNotice.remove();

            getElement("claim-quota-button").classList.add("dark");

            quotaStatus.innerHTML = "Quota Status: <span>Unavailable</span>";
            quotaStatus.querySelector("span").style.color = "rgb(255, 0, 0)";
         }
      },
      updateText: function() {
         for (const reward of Object.entries(loremQuotaData)) {
            if (reward[1].requirement === this.quota) {
               getElement("quota-reward-title").innerHTML = reward[1].rewardTitle;
               getElement("quota-reward-text").innerHTML = reward[1].rewardText;
            }
         }
      },
      updateCorporateOverviewScreen: function() {
         const quotaStage = this.quotaIdx;
         getElement("lorem-quota-stage").innerHTML = `Current quota stage: ${quotaStage}`;
         const rewardContainer = getElement("lorem-quota-claimed-rewards");

         while (rewardContainer.children[0]) {
            rewardContainer.children[0].remove();
         }

         const frag = document.createDocumentFragment();
         Object.values(loremQuotaData).every((quota, idx) => {
            if (idx >= this.quotaIdx) return false;
            
            const li = document.createElement("li");
            li.innerHTML = quota.rewardText;
            frag.appendChild(li);
            return true;
         });
         rewardContainer.appendChild(frag);
      },
      setup: function(startQuota) {
         this.quota = startQuota;

         getElement("quota-amount").innerHTML = startQuota;

         getElement("claim-quota-button").addEventListener("click", () => {
            if (Game.lorem >= this.quota) {
               this.quotaIdx += 1;
               this.quota = loremQuotaData[this.quotaIdx].requirement;

               getElement("lorem-quota-complete").remove();

               updateMiscCookie();
               this.updateText();
               this.updateProgress();
               this.updateCorporateOverviewScreen();
            }
         });

         this.updateText();
         this.updateCorporateOverviewScreen();
      }
   },
   loremCorp: {
      setWorkerGainInterval: function() {
         const ms = 500;
         setInterval(() => {
            let loremGain = 0;
            for (const worker of Object.entries(loremCorpData.jobs)) {
               const workerCount = this.workers[worker[0]];
               loremGain += worker[1].stats.loremProduction * workerCount / (1000 / ms);
            }
            if (loremGain === 0) return;
            Game.gainLorem(loremGain);
         }, ms);
      },
      corporateOverview: {
         unlocked: false
      },
      setup: function(job) {
         for (const worker of Object.entries(loremCorpData.jobs)) {
            const name = worker[0];
            const workerCount = getCookie(name);
            
            if (workerCount === "") {
               // If the worker is not stored
               setCookie(name, 0);
               this.workers[name] = 0;
            } else {
               // If the worker is stored, update its value in the obj
               this.workers[name] = parseInt(workerCount);
            }
         }

         this.job = job;

         // Setup the promote button
         getElement("promote-button").addEventListener("click", () => {
            if (Game.lorem < loremCorpData.jobs[this.job].requirement) return;

            getElement("promote-button").classList.add("dark");

            // Promote
            if (this.jobIdx + 1 >= Object.keys(loremCorpData.jobs).length) return;
            const nextJob = Object.entries(loremCorpData.jobs)[this.jobIdx + 1];
            const nextJobName = nextJob[0];
            this.job = nextJobName;
            updateMiscCookie();
            this.updatePromotionProgress();

            Game.gainLorem(-Game.lorem);

            // Receive the promotion letter
            const letterName = nextJob[1].letterName;
            receiveLetter(letters[letterName]);
         });

         const quotaMenuButton = getElement('quota-menu-button');
         quotaMenuButton.addEventListener("click", () => {
            this.showView("quota-menu", quotaMenuButton);
         });

         // Set the workers to make lorem
         Game.loremCorp.setWorkerGainInterval();
      },
      updatePromotionProgress: function() {
         // Update the progress bar and text
         const req = loremCorpData.jobs[this.job].requirement;
         const progress = Game.lorem / req * 100;

         if (progress >= 100) {
            getElement("promote-button").classList.remove("dark");
         } else {
            getElement("promote-button").classList.add("dark");
         }

         getElement("job-status").querySelector("h2.center").innerHTML = formatProg(Game.lorem, req, true);
         const displayProgress = Math.min(progress, 100);
         getElement('job-status').querySelector('.progress-bar').style.width = displayProgress + '%';
      },
      workers: {},
      getWorkerCost: function(workerName, n) {
         // $ = b * 1.1^n + (b/10 * n)
         // Gets the cost of the n-th worker
         const baseCost = loremCorpData.jobs[workerName].cost.lorem;
         const cost = baseCost * Math.pow(1.1, n) + baseCost / 10 * n;
         return cost;
      },
      updateWorkerData: function(workerName = 'none') {
         if (workerName === 'none') {
            // Update all values
            for (const worker of Object.entries(this.workers)) {
               setCookie(worker[0], worker[1]);
            }
         } else {
            // Only update supplied worker
            setCookie(workerName, this.workers[workerName]);
         }
      },
      unlockCorporateOverview: function() {
         getElement('corporate-overview').classList.remove('hidden')
         Game.loremCorp.corporateOverview.unlocked = true;
      },
      job_internal: 'intern',
      get jobIdx() {
         let jobIndex = -1;
         Object.keys(loremCorpData.jobs).every((position, idx) => {
            if (position === this.job) {
               jobIndex = idx;
               return false;
            }
            return true;
         });
         return jobIndex;
      },
      showView: function(viewID, button) {
         // Remove all selected button styles
         const selectedButton = document.querySelector('#corporate-overview .button.selected');
         if (selectedButton != undefined) selectedButton.classList.remove('selected');

         const view = getElement(viewID);
         if (!view.classList.contains('hidden')) {
            // If view is visible
            view.classList.add('hidden');
            getElement('home-page').classList.remove('hidden');
         }
         else {
            // If view is not visible, show view.
            for (const container of document.querySelectorAll('.section-container')) {
               container.classList.add('hidden');
            }
            button.classList.add('selected');
            view.classList.remove('hidden');
         }
      },
      updateJobButtons: function() {
         for (const button of [...document.querySelectorAll('.job-button:not(#job-template)')]) {
            button.remove();
         }
         
         const frag = document.createDocumentFragment();
         getElement('job-title').classList.add('hidden');
         for (const job of Object.entries(loremCorpData.jobs)) {
            if (job[0] === this.job) break;
            
            getElement('job-title').classList.remove('hidden');
            const button = getElement('job-template').cloneNode(true);
            button.id = '';
            button.classList.remove('hidden');
            button.innerHTML = job[1].buttonText;

            // Create the hover overview for the buttons.
            const content = [
               [`<h2>${capitalize(job[0])}s</h2><p>You have `],
               [`this.workers["${job[0]}"]`, "eval"],
               [` ${job[0]}s producing `],
               [`formatFloat(loremCorpData.jobs["${job[0]}"].stats.loremProduction * this.workers["${job[0]}"])`, "eval"],
               [` lorem per second.`]];
            this.setupHoverPanel(button, content);

            button.addEventListener('click', () => {
               this.showView(job[0] + '-section', button);
            });

            frag.appendChild(button);
         }
         getElement('job-button-container').appendChild(frag);
      },
      setupHoverPanel: function(button, ...content) {
         const hoverPanel = getElement("corporate-overview-hover-panel");
         button.addEventListener("mouseover", () => {
            hoverPanel.classList.remove("hidden");

            const bounds = button.getBoundingClientRect();
            const topHeight = getElement("info-bar").offsetHeight;

            hoverPanel.style.left = bounds.left + bounds.width + "px";
            hoverPanel.style.top = bounds.top + bounds.height / 2 - topHeight + "px";

            let text = "";
            for (const component of content[0]) {
               if (component.includes("eval")) {
                  text += eval(component[0]);
               } else {
                  text += component[0];
               }
            }

            hoverPanel.innerHTML = text;
         });
         button.addEventListener("mouseleave", () => {
            hoverPanel.classList.add("hidden");
         })
      },
      updateWorkerInfo(view, job) {
         // Overview
         view.querySelector('.lorem-production').innerHTML = formatFloat(loremCorpData.jobs[job[0]].stats.loremProduction * this.workers[job[0]]);
         view.querySelector('.worker-count').innerHTML = this.workers[job[0]];
         view.querySelector('.workforce-count').innerHTML = job[1].cost.workforce * this.workers[job[0]];

         // Buy info
         const nextCost = formatFloat(this.getWorkerCost(job[0], this.workers[job[0]]));
         view.querySelector('.lorem-cost').innerHTML = nextCost;
      },
      buyWorker: function(name, jobView, job) {
         const currentWorkerCount = this.workers[name];
         const cost = this.getWorkerCost(name, currentWorkerCount);

         if (Game.lorem >= cost) {
            this.workers[name] += 1;
            Game.gainLorem(-cost);

            new Sound({
               path: './audio/click.mp3',
               volume: 1
            });

            this.updateWorkerData(name);
            this.updateWorkerInfo(jobView, job);
         }
      },
      buyMaxWorkers: function(name, jobView, job) {
         while (true) {
            currentWorkerCount = this.workers[name];
            const cost = this.getWorkerCost(name, currentWorkerCount);

            if (Game.lorem >= cost) {
               this.workers[name] += 1;
               Game.gainLorem(-cost);
            } else {
               break;
            }
         }

         this.updateWorkerData(name);
         this.updateWorkerInfo(jobView, job);

         new Sound({
            path: './audio/click.mp3',
            volume: 1
         });
      },
      createJobViews: function() {
         // For each of the jobs, create a new view
         for (const job of Object.entries(loremCorpData.jobs)) {
            if (job[0] === this.job) break;

            const jobView = getElement('job-view-template').cloneNode(true);
            jobView.id = job[0] + '-section';
            document.querySelector('.content-container').appendChild(jobView);

            for (const text of jobView.querySelectorAll('.job-name')) {
               text.innerHTML = job[1].buttonText;
            }
            for (const text of jobView.querySelectorAll('.job-name-p')) {
               text.innerHTML = job[1].displayText;
            }

            // Update the costs
            for (const cost of Object.entries(job[1].cost)) {
               const nameObj = document.createElement('p');
               nameObj.innerHTML = capitalize(cost[0]);

               jobView.querySelector('.cost-container').querySelector('.left-column').appendChild(nameObj);

               const costObj = document.createElement('p');
               costObj.classList.add(cost[0] + '-cost');
               if (cost[0] !== 'lorem') {
                  costObj.innerHTML = cost[1];
               }

               jobView.querySelector('.cost-container').querySelector('.right-column').appendChild(costObj);
            }

            this.updateWorkerInfo(jobView, job);

            // Hire button
            jobView.querySelector('.buy-button').addEventListener('click', () => this.buyWorker(job[0], jobView, job));
            // Hire max button
            jobView.querySelector(".buy-max-button").addEventListener("click", () => this.buyMaxWorkers(job[0], jobView, job));
         }
      },
      set job(newJob) {
         this.job_internal = newJob;
         const jobData = loremCorpData.jobs[newJob];

         getElement('welcome').innerHTML = jobData.welcomeText;

         getElement("job-display-name").innerHTML = jobData.displayText;

         // Create job views (e.g. intern)
         this.createJobViews();

         // Update buttons
         this.updateJobButtons();

         // Update the summary on the left
         getElement('job-position').innerHTML = 'Position: ' + jobData.displayText;
         getElement('job-salary').innerHTML = 'Salary: ' + jobData.salary;

         // Update the home text
         let currentJob = ' ' + jobData.displayText;
         if (this.jobIdx + 1 >= Object.keys(loremCorpData.jobs).length) {
            getElement('job-status').querySelector('.change').innerHTML = `You are currently a${currentJob}. You are at the highest position currently available.`;
         } else {
            let nextJob = ' ' + Object.values(loremCorpData.jobs)[this.jobIdx + 1].displayText;
            // change 'a' to 'an' when applicable
            const vowels = ['a', 'e', 'i', 'o', 'u'];
            if (vowels.indexOf(nextJob.split('')[1].toLowerCase()) !== -1) {
               nextJob = 'n' + nextJob;
            }
            if (vowels.indexOf(currentJob.split('')[1].toLowerCase()) !== -1) {
               currentJob = 'n' + currentJob;
            }
            getElement('job-status').querySelector('.change').innerHTML = `You are currently a${currentJob}. Your next position is a${nextJob}.`;
         }
      },
      get job() {
         return this.job_internal;
      }
   },

   blackMarket: {
      isUnlocked: false,
      transferRate: 0.1,
      transfer: function() {
         Game.addPackets(Game.lorem);
         Game.loseLorem(Game.lorem);
      },
      setup: function() {
         getElement("transfer-rate").innerHTML = this.transferRate;
         
         const transferButton = getElement("transfer-button");
         transferButton.addEventListener("click", this.transfer);

         // Updates the packet counts.
         Game.updatePackets();

         // Creates the unlockable shops seen at the bottom of the Black Market.
         this.shops.createShops();
      },
      unlockBlackMarket: function() {
         getElement("nav-black-market").classList.remove("hidden");
         this.isUnlocked = true;
      },
      shops: {
         buyShop: function(shop, shopObject) {
            Game.addPackets(-shop.cost, true);

            this.unlockShop(shop, shopObject);
         },
         unlockShop: function(shop, shopObject) {
            shopObject.classList.remove("locked");
   
            shop.isUnlocked = true;
            cookies.unlockedShops.update();
   
            shopObject.querySelector("h2").innerHTML = shop.display.title;
            shopObject.querySelector("p").innerHTML = shop.display.description;
            shopObject.querySelector("button").innerHTML = "GO";
         },
         lockShop: function(shop, shopObject) {
            shopObject.classList.add("locked");

            shopObject.querySelector("h2").innerHTML = "LOCKED";
   
            const suffix = shop.cost === 1 ? "" : "s";
            shopObject.querySelector("p").innerHTML = `You require <b>${shop.cost} packet${suffix}</b> to unlock this shop.`;
   
            shopObject.querySelector("button").innerHTML = "BUY";
         },
         canAffordShop: function(shop) {
            return Game.packets >= shop.cost;
         },
         createShop: function(shop) {
            const shopObject = document.createElement("div");
            shopObject.className = "segment";
            getElement("black-market-bottom").appendChild(shopObject);

            shopObject.innerHTML = `
            <h2></h2>
            <p></p>
            <button class="red-button shop-button"></button>`;

            if (shop.isUnlocked) {
               this.unlockShop(shop, shopObject);
            } else {
               this.lockShop(shop, shopObject);
            }

            shopObject.querySelector("button").addEventListener("click", () => {
               if (shop.isUnlocked) {
                  shop.clickEvent();
               } else if (this.canAffordShop(shop)) this.buyShop(shop, shopObject);
            });
         },
         createShops: function() {
            for (const shop of Object.values(blackMarketShops)) {
               this.createShop(shop);
            }
         },
      },
      minigames: {
         open: () => {
            getElement("minigames-opener").classList.remove("hidden");
            Game.inFocus = false;
         },
         close: () => {
            getElement("minigames-opener").classList.add("hidden");
            Game.inFocus = true;
         },
         setup: function() {
            const frag = document.createDocumentFragment();
            for (const minigame of Object.values(minigames)) {
               const box = document.createElement("div");
               box.classList.add("minigame");
               box.innerHTML = `
               <h2>${minigame.name}</h2>
               <p>${minigame.description}</p>
               `;

               box.addEventListener("click", minigame.open);

               frag.appendChild(box);
            }
            getElement("minigames-container").appendChild(frag);

            getElement("minigames-opener").querySelector("button").addEventListener("click", () => {
               this.close();
            });
         }
      }
   },

   packets: 0,
   addPackets: (add, directAdd = false) => {
      const packets = add * (directAdd ? 1 : Game.blackMarket.transferRate);
      Game.packets += packets;
      Game.updatePackets();
   },
   updatePackets: function() {
      getElement("packet-count").innerHTML = formatFloat(Game.packets);
   },

   checkLoremLetters: function() {
      if (Game.lorem >= 2) mail.receiveLetter(letters.motivationalLetter);
      if (Game.lorem >= 5) mail.receiveLetter(letters.greetings)
      if (Game.lorem >= 8) mail.receiveLetter(letters.invitation);
      if (Game.lorem >= 15) mail.receiveLetter(letters.rumors);
   },

   maxPopups: 7,
   popupQueue: [],
   get maxPopupCount() {
      let visibleCount = 0;
      for (const bit of getCookie('unlockedMalware')) {
         if (bit === "1") {
            visibleCount++;
         }
      }
      return visibleCount;
   },
   get visiblePopupsCount() {
      let visiblePopupCount = 0;
      for (const popup of Object.values(popups)) if (popup.displayed) visiblePopupCount++;
      return visiblePopupCount;
   },
   get visiblePopups() {
      let visiblePopups = [];
      Object.values(popups).forEach(popup => {
         if (popup.displayed) visiblePopups.push(popup);
      });
      return visiblePopups;
   },
   startMenu: {
      panels: {
         applications: {
            name: "Applications",
            imgSrc: "images/win95/app.png",
            tree: {
               shop: {
                  name: "Shop",
                  imgSrc: "images/win95/folder-search.png",
                  tree: "menu-application-shop"
               },
               status: {
                  name: "Status",
                  imgSrc: "images/win95/info.png",
                  tree: ""
               }
               // Manager/Management?
            }
         },
         preferences: {
            name: "Preferences",
            imgSrc: "images/win95/win95-save.png",
            tree: "menu-preferences"
         },
         help: {
            name: "Help",
            imgSrc: "images/win95/question-book.png",
            tree: {
               guide: {
                  name: "Guide",
                  imgSrc: "images/win95/books.png",
                  tree: ""
               },
               faq: {
                  name: "FaQ",
                  imgSrc: "images/win95/properties.png",
                  tree: ""
               },
               issues: {
                  name: "Issues",
                  imgSrc: "images/win95/error.png",
                  tree: ""
               }
            }
         }
      },
      applications: {
         "menu-preferences": {
            currentBackgroundImage: null,
            backgroundImages: {
               "#008080": {
                  type: "color",
                  name: "95 Green"
               },
               "xp-background.jpeg": {
                  type: "image",
                  name: "Bliss",
                  tileable: false
               },
               "windows-95-bg-2.jpeg": {
                  type: "image",
                  name: "Honeycomb",
                  tileable: true
               },
               "windows-95-bg-3.jpeg": {
                  type: "image",
                  name: "Infinity",
                  tileable: true
               },
               "windows-95-garden.png": {
                  type: "image",
                  name: "Garden",
                  tileable: true
               }
            },
            open: function(applicationName) {
               let idx = 0;
               for (const bg of Object.entries(this.backgroundImages)) {
                  const container = document.createElement("div");
                  container.classList.add("bg-preview");

                  const bgPreview = document.createElement("div");
                  bgPreview.classList.add("bg");
                  container.appendChild(bgPreview);
                  if (bg[1].type === "image") {
                     bgPreview.style.backgroundImage = "url(images/backgrounds/" + bg[0] + ")";
                  } else if (bg[1].type === "color") {
                     bgPreview.style.backgroundColor = bg[0];
                  }
                  getElement(applicationName).querySelector(".bg-image-container").appendChild(container);

                  const currentIdx = idx;
                  container.addEventListener("click", () => {
                     getElement(applicationName).querySelector(".bg-image-container .selected").classList.remove("selected");
                     container.classList.add("selected");

                     this.currentBackgroundImage = currentIdx;
                     updateMiscCookie();

                     this.updateBackgroundImage();
                  });

                  const hoverText = document.createElement("span");
                  hoverText.innerHTML = '"' + bg[1].name + '"';
                  container.appendChild(hoverText);
                  hoverText.className = "hidden";
                  container.addEventListener("mouseover", () => {
                     hoverText.classList.remove("hidden");
                  });
                  container.addEventListener("mouseleave", () => {
                     hoverText.classList.add("hidden");
                  });
                  
                  if (idx++ === this.currentBackgroundImage) {
                     container.classList.add("selected");
                  }
               }
            },
            close: function(applicationName) {
               const application = getElement(applicationName);
               application.classList.add("hidden");

               const bgImageContainer = application.querySelector(".bg-image-container");
               while (bgImageContainer.children[0]) {
                  bgImageContainer.children[0].remove();
               }
            },
            updateBackgroundImage: function() {
               const bg = Object.entries(this.backgroundImages)[this.currentBackgroundImage];
               const computer = getElement("computer");
               if (bg[1].type === "color") {
                  computer.style.backgroundImage = "none";
                  computer.style.backgroundColor = bg[0];
               } else if (bg[1].type === "image") {
                  computer.style.backgroundImage = "url(images/backgrounds/" + bg[0] + ")";
                  if (bg[1].tileable) {
                     computer.classList.add("tileable");
                  } else {
                     computer.classList.remove("tileable");
                  }
               }
            },
            setup: function() {
               getElement("menu-preferences").querySelector(".title-bar img").addEventListener("click", () => this.close("menu-preferences"));
            }
         },
         "menu-application-shop": {
            categories: ["lifestyle", "utility"],
            applications: {
               loremCounter: {
                  name: "Lorem Counter",
                  category: "lifestyle",
                  description: "The primary way of viewing your lorem.",
                  img: "images/win95/win95-save.png",
                  objID: "lorem-counter",
                  isDefaultApplication: true
               },
               achievementTracker: {
                  name: "Achievement Tracker",
                  category: "lifestyle",
                  description: "View your most significant achievements made here at Lorem Corp.",
                  img: "images/win95/win95-save.png",
                  objID: "achievement-tracker",
                  isDefaultApplication: true
               },
               bigLoremCounter: {
                  name: "Big Lorem Counter",
                  category: "lifestyle",
                  description: "A bigger, better lorem counter.",
                  img: "images/win95/win95-save.png",
                  objID: "",
                  isDefaultApplication: false,
                  price: 100
               },
               progressOverview: {
                  name: "Progress Overview",
                  category: "lifestyle",
                  description: "View your progress in relation to other employees.",
                  img: "images/win95/win95-save.png",
                  objID: "",
                  isDefaultApplication: false,
                  price: 500
               },
               antivirus: {
                  name: "Antivirus",
                  category: "utility",
                  description: "Tired of unwanted popups appearing? Simply download this application to rid your computer of malware.",
                  img: "images/win95/win95-save.png",
                  objID: "",
                  isDefaultApplication: false,
                  price: 500 
               },
               internEnhancementProgram: {
                  name: "Intern Enhancement Program",
                  category: "utility",
                  description: "Optimise your filthy intern's production capabilities, through somewhat unethical means.",
                  img: "images/win95/win95-save.png",
                  objID: "",
                  isDefaultApplication: false,
                  price: 1000
               }
            },
            canAffordApplication(application) {
               const cost = application.price;
               return Game.lorem >= cost;
            },
            buyApplication(applicationName, application) {
               if (application[1].owned || !this.canAffordApplication(application[1])) return;

               Game.gainLorem(-application[1].price);
               application[1].owned = true;
               this.updateAvailableApplications(applicationName);

               // Renders the application on the taskbar.
               taskbar.createApplication(application[1].name, "images/win95/program2.png", "taskbar-" + application[0]);

               // Renders the applications in the file system.
               const name = slugCase(application[0]).replace("-", "_");
               fileSystem.createFile({
                  name: name,
                  extension: "exe",
                  clickEvent: this.openApplication(application)
               });
            },
            updateAvailableApplications: function(applicationName) {
               for (const application of Object.entries(this.applications)) {
                  const obj = getElement(applicationName).querySelector("." + application[1].category + "-applications-container ." + application[0]);
                  const btn = obj.querySelector("button");

                  if (application[1].isDefaultApplication || application[1].owned) {
                     btn.innerHTML = "Owned";
                     btn.classList.add("dark");
                     obj.classList.add("owned");
                     obj.classList.remove("affordable");
                  } else {
                     btn.innerHTML = application[1].price;
                     if (this.canAffordApplication(application[1])) {
                        obj.classList.add("affordable");
                     } else {
                        obj.classList.remove("affordable");
                     }
                  }
               }
            },
            open: function(applicationName) {
               for (const application of Object.entries(this.applications)) {
                  const obj = document.createElement("div");
                  obj.className = "application-preview " + application[0];
                  const container = getElement(applicationName).querySelector("." + application[1].category + "-applications-container");
                  container.appendChild(obj);

                  obj.innerHTML = `
                  <div class="icon">
                     <img src=${application[1].img} />   
                  </div>
                  <div class="details">
                     <h3 class="name">${application[1].name}</h3>
                     <p class="description">${application[1].description}</p>
                  </div>
                  <button class="button"></button>`;

                  const btn = obj.querySelector("button");
                  btn.addEventListener("click", () => this.buyApplication(applicationName, application));
               }

               this.updateAvailableApplications(applicationName);
            },
            close: function(applicationName) {
               const application = getElement(applicationName);
               application.classList.add("hidden");

               for (const category of this.categories) {
                  const container = getElement(applicationName).querySelector("." + category + "-applications-container");
                  while (container.children[0]) {
                     container.children[0].remove();
                  }
               }
            },
            closeApplication: function(application) {
               const applicationData = applications[application[1].objID];
               applicationData.isOpened = false;
               getElement(application[1].objID).classList.add("hidden");

               if (applicationData.hasOwnProperty("close")) {
                  applicationData.close();
               }

               const taskbarItem = getElement("taskbar-" + application[0]);
               taskbarItem.classList.remove("open");
            },
            openApplication: function(application) {
               const applicationData = applications[application[1].objID];
               applicationData.isOpened = true;
               getElement(application[1].objID).classList.remove("hidden");

               if (applicationData.hasOwnProperty("open")) {
                  applicationData.open();
               }

               const taskbarItem = getElement("taskbar-" + application[0]);
               taskbarItem.classList.add("open");
            },
            setup: function() {
               getElement("menu-application-shop").querySelector(".title-bar img").addEventListener("click", () => this.close("menu-application-shop"));

               // Sets up all minimize buttons
               for (const application of Object.entries(this.applications)) {
                  if (applications[application[1].objID] !== undefined) {
                     const obj = getElement(application[1].objID);
                     obj.querySelector(".minimize-button").addEventListener("click", () => {
                        this.closeApplication(application);
                        updateApplicationPositions();
                     });
                  }
               }

               // Sets up the click events for the taskbar items, and style them as open if their application is open
               const taskbarItems = document.getElementsByClassName("taskbar-application");
               for (let i = 0; i < taskbarItems.length; i++) {
                  const taskbarItem = taskbarItems[i];
                  const id = taskbarItem.id.substring(8, taskbarItem.id.length);

                  let currentApplication;
                  for (const application of Object.entries(this.applications)) {
                     if (application[0] === id) {
                        currentApplication = application;
                        break;
                     }
                  }
                  
                  const applicationData = applications[currentApplication[1].objID];
                  if (applicationData !== undefined && applicationData.isOpened) taskbarItem.classList.add("open");
                  taskbarItem.addEventListener("click", () => {
                     if (applicationData.isOpened) {
                        this.closeApplication(currentApplication);
                     } else {
                        this.openApplication(currentApplication);
                     }
                     updateApplicationPositions();
                  });
               }

               // Sets up all drag elements
               for (const applicationID of Object.keys(applications)) {
                  const obj = getElement(applicationID);
                  const titleBar = obj.querySelector(":is(.popup-title, .title-bar)");
                  dragElement(obj, titleBar);
               }

               // Run all application's setup functions
               for (const application of Object.values(applications)) {
                  if (application.hasOwnProperty("setup")) {
                     application.setup();
                  }
               }

               // Open applications which were already previously opened
               for (const application of Object.values(applications)) {
                  if (application.isOpened) {
                     let applicationReference;
                     for (const currentApplication of Object.entries(this.applications)) {
                        if (currentApplication[0] === application.id) {
                           applicationReference = currentApplication;
                           break;
                        }
                     }
                     this.openApplication(applicationReference);
                  }
               }
            }
         },
         isOpened: function(applicationName) {
            const application = getElement(applicationName);
            return !application.classList.contains("hidden");
         },
         setupAll: function() {
            for (const prop of Object.values(this)) {
               if (prop.hasOwnProperty("setup")) {
                  prop.setup();
               }
            }
         }
      },
      opened: false,
      buttonClick: function() {
         this.opened ? this.close() : this.open();
      },
      open: function() {
         this.opened = true;
         getElement("start-menu").classList.remove("hidden");
         getElement("start-icon").classList.add("opened");
      },
      close: function() {
         this.opened = false;
         getElement("start-menu").classList.add("hidden");
         getElement("start-icon").classList.remove("opened");
      },
      createPanelContainer: function(name, parent, parentSection) {
         const container = document.createElement("div");
         container.className = "start-menu-container";
         container.id = name;

         if (parent === undefined) {
            getElement("computer").appendChild(container);
            container.style.bottom = "calc(2rem + 6px)";
         } else {
            parent.appendChild(container);
            container.style.left = "calc(100% + 2px)";

            if (parentSection !== undefined) {
               const sectionBounds = parentSection.getBoundingClientRect();
               const parentBounds = parent.getBoundingClientRect();
               const sectionTop = sectionBounds.y - parentBounds.y - 2;
               container.style.top = sectionTop + "px";
            }
         }
      },
      removePanelContainer: function(name) {
         getElement(name).remove();
      },
      fillPanelContainer: function(panelData, parent) {
         for (const panelInfo of Object.entries(panelData)) {
            const panel = panelInfo[1];
            
            const obj = document.createElement("div");
            obj.classList.add("section");

            const name = `<span class="underline">` + panel.name[0] + "</span>" + panel.name.slice(1, panel.name.length);
            obj.innerHTML = `
            <img src="${panel.imgSrc}" />
            <p>${name}</p>`;

            parent.appendChild(obj);

            if (typeof panel.tree === "object") {
               // Create an opening arrow icon
               const arrow = document.createElement("div");
               arrow.classList.add("arrow");
               obj.appendChild(arrow);

               obj.addEventListener("click", () => {
                  // (css) Unopen all sections
                  for (const child of parent.children) {
                     child.classList.remove("opened");
                  }

                  const containerName = "start-menu-" + panelInfo[0];
                  if (getElement(containerName) === null) {
                     this.createPanelContainer(containerName, parent, obj);
                     this.fillPanelContainer(panel.tree, getElement(containerName));

                     obj.classList.add("opened");
                  } else {
                     this.removePanelContainer(containerName);
                  }

                  // Close any existing trees
                  let containerObj;
                  const objectsToCheck = [this.panels];
                  while (true) {
                     for (const obj of objectsToCheck) {
                        for (const prop of Object.keys(obj)) {
                           if (prop === panelInfo[0]) {
                              containerObj = obj;
                              break;
                           }
                        }
                     }
                     break;
                  }
                  // If there are any other panels on the same layer, eat them
                  for (const name of Object.keys(containerObj)) {
                     if (name !== panelInfo[0] && getElement("start-menu-" + name) !== null) {
                        this.removePanelContainer("start-menu-" + name);
                     }
                  }
               });
            } else if (typeof panel.tree === "string") {
               obj.addEventListener("click", () => {
                  const applicationName = panel.tree;
                  if (panel.tree === "") {
                     // TODO: Create an error message
                     return;
                  }
                  const applicationObj = getElement(applicationName);

                  // Position the application in the center
                  applicationObj.style.top = "50%";
                  applicationObj.style.left = "50%";
                  applicationObj.style.transform = "translate(-50%, -50%)";
                  
                  const application = this.applications[applicationName];
                  if (!this.applications.isOpened(applicationName)) {
                     if (application.hasOwnProperty("open")) {
                        application.open(applicationName);
                     }
                     applicationObj.classList.remove("hidden");
                  } else {
                     if (application.hasOwnProperty("close")) {
                        application.close(applicationName);
                     }
                     applicationObj.classList.add("hidden");
                  }
               });
            }
         }

         const containerBounds = parent.getBoundingClientRect();
         const remainingSpace = window.innerHeight - containerBounds.bottom;
         const taskbarHeight = getElement("taskbar").offsetHeight;
         if (remainingSpace < taskbarHeight) {
            parent.style.top = null;
            parent.style.bottom = "-2px";
         }
      },
      renderApplications: function() {
         for (const application of Object.entries(this.applications["menu-application-shop"].applications)) {
            if (!application[1].owned) continue;

            // Renders the applications on the taskbar.
            taskbar.createApplication(application[1].name, "images/win95/program2.png", "taskbar-" + application[0]);

            // Renders the applications in the file system.
            const name = slugCase(application[0]).replace("-", "_");
            const clickEvent = () => {
               this.applications["menu-application-shop"].openApplication(application);
            }
            fileSystem.createFile({
               name: name,
               extension: "exe",
               clickEvent: clickEvent
            });
         }
      },
      hideMenuOnHoverOut: function() {
         getElement("start-menu").addEventListener("mouseleave", () => {
            this.hideStartMenu();
         });
      },
      startMenuIsVisible: function() {
         return getElement("start-menu") !== null;
      },
      hideStartMenu: function() {
         getElement("start-menu").remove();
      },
      setup: function() {
         // Triggered on page load
         getElement("start-icon").addEventListener("click", () => {
            if (!this.startMenuIsVisible()) {
               this.createPanelContainer("start-menu");
               this.fillPanelContainer(this.panels, getElement("start-menu"));
               this.hideMenuOnHoverOut();
            } else {
               this.hideStartMenu();
            }
         });

         // Renders the applications in the taskbar and file system
         this.renderApplications();

         // Sets up all the start menu applications
         this.applications.setupAll();
      }
   },
   createToolTip: function({ x, y }, title, content) {
      const toolTip = document.createElement("div");
      toolTip.className = "tooltip";
      getElement("computer").appendChild(toolTip);
      toolTip.style.left = x;
      toolTip.style.top = y;

      toolTip.innerHTML = `
      <p class="title">${title}</p>
      <div class="content">
         ${content}
      </div>`;

      return toolTip;
   }
};

const fileSystem = {
   createFile: function({ name, extension, img = "images/win95/program.png", clickEvent }) {
      const file = document.createElement("div");
      file.className = "file";
      getElement("file-system").appendChild(file);

      file.innerHTML = `
      <img src="${img}" />
      <p>${name + "." + extension}</p>`;

      let toolTip;
      file.addEventListener("mouseover", () => {
         const bounds = file.getBoundingClientRect();
         const x = bounds.x + bounds.width / 2 + "px";
         const y = bounds.y + bounds.height / 2 - topHeight() + "px";
         toolTip = Game.createToolTip({ x, y }, name, "Double click to open.");
      });
      file.addEventListener("mouseout", () => {
         toolTip.remove();
      });

      if (clickEvent) {
         file.addEventListener("dblclick", () => clickEvent());
      }
   }
};

const taskbar = {
   createApplication: function(name, img, id) {
      const application = document.createElement("div");
      application.className = "taskbar-application";
      application.id = id;
      getElement("taskbar").appendChild(application);

      application.innerHTML = `
      <img src="${img}"/>
      <p>${name}</p>`;
      return application;
   }
};

const dailyIndoctrination = {
   layouts: [
      `
      <div class="headline"></div>
         <div class="container">
            <div class="column">
               <div class="breaking-news"></div>
               <div class="story"></div>
               <div class="story"></div>
               <div class="story"></div>
            </div>
            <div class="seperator"></div>
            <div class="column">
               <div class="story"></div>
               <div class="story"></div>
               <div class="story"></div>
               <div class="story"></div>
            </div>
         </div>
      `
   ],
   generateEdition: function(edition = 1) {
      const page = getElement("news-main");
      const layout = randElem(this.layouts);
      page.innerHTML += layout;

      const editionData = dailyIndoctrinationEditions[edition];
      const breakingNews = randElem(Object.values(editionData.breakingNews));

      page.querySelector(".headline").innerHTML = breakingNews.headline;
      page.querySelector(".breaking-news").innerHTML = breakingNews.story;

      const stories = editionData.stories;
      const storySections = page.getElementsByClassName("story");
      for (const story of storySections) {
         const storyIdx = randomInt(0, stories.length);
         const currentStory = stories[storyIdx];
         stories.splice(storyIdx, 1);
         story.innerHTML = currentStory;
      }
   },
   show: function() {
      this.clear();
      this.generateEdition();

      getElement("news-main").classList.remove("hidden");

      Game.inFocus = true;

      const mask = getElement("mask");
      mask.classList.remove("hidden");
      mask.addEventListener("click", this.hide);
   },
   hide: function() {
      Game.inFocus = false;

      getElement("news-main").classList.add("hidden");

      const mask = getElement("mask");
      mask.classList.add("hidden");
      mask.removeEventListener("click", this.hide);
   },
   clear: function() {
      getElement("news-main").innerHTML = `<h1>The Daily Indoctrination</h1>`;
   },
   setup: function() {
      getElement("news-thumbnail").addEventListener("click", () => {
         this.show();
      });
   }
};

const terminal = {
   displayed: false,
   commands: {
      help: {
         returnVal: () => {
            terminal.writeLine(['Available commands:', '#bbb']);
            Object.entries(terminal.commands).forEach(command => {
               if (command[0] === 'help') return;
               terminal.writeLine(['- ', '#777'], [command[0], '#999']);
            });
         }
      },
      hello: {
         returnVal: 'Hello there!'
      },
      give: {
         lorem: {
            anyNum: (num) => {
               terminal.writeLine(['Gave ', '#888'], [num, '#bbb'], [' lorem', '#888']);
               Game.gainLorem(num);
            }
         },
         packets: {
            anyNum: (num) => {
               terminal.writeLine(['Gave ', '#888'], [num, '#bbb'], [' packets', '#888']);
               Game.addPackets(num / Game.blackMarket.transferRate);
            }
         }
      },
      summon: {
         all: () => {
            let summonedPopups = 0;
            for (const popup of Object.entries(popupData)) {
               if (popup[1].unlocked) {
                  popups[popup[0]].show(false, true);
                  summonedPopups++;
               }
            }
            if (summonedPopups === 0) {
               terminal.writeLine(['WARNING: ', '#ffbb29'], ['No popups could be summoned!', '#888']);
               return;
            }
            terminal.writeLine([summonedPopups, '#aaa'], [' popups summoned.', '#888'])
         },
         anyStr: (arr) => {
            const name = arr.join(' ');
            if (popups[name] === undefined) {
               terminal.writeLine(['Popup ', '#888'], [`'${name}'`, '#aaa'], [' does not exist.', '#888'])
               return;
            }
            // Summon a popup
            if (!popupData[name].unlocked) {
               terminal.writeLine(['WARNING: ', '#ffbb29'], ['Popup ', '#888'], [`'${name}'`, '#aaa'], [' is not unlocked yet.', '#888'])
               return;
            }
            popups[name].show();
         }
      },
      hide: {
         all: () => {
            let popupsHidden = 0;
            for (const popup of Object.entries(popupData)) {
               const popupReference = popups[popup[0]];
               if (popup[1].unlocked && popupReference.displayed) {
                  popupReference.hide();
                  popupsHidden++;
               }
            }
            if (popupsHidden === 0) {
               terminal.writeLine(['WARNING: ', '#ffbb29'], ['There were no popups to hide!', '#888']);
               return;
            }
            terminal.writeLine([popupsHidden, '#aaa'], [' popups hidden.', '#888']);
         },
         anyStr: (arr) => {
            const name = arr.join(' ');
            if (popups[name] === undefined) {
               terminal.writeLine(['Popup ', '#888'], [`'${name}'`, '#aaa'], [' does not exist.', '#888'])
               return;
            }
            if (!popupData[name].unlocked) {
               terminal.writeLine(['WARNING: ', '#ffbb29'], ['Popup ', '#888'], [`'${name}'`, '#aaa'], [' is not unlocked yet.', '#888'])
               return;
            } else if (!popups[name].displayed) {
               terminal.writeLine(['WARNING: ', '#ffbb29'], ['Popup ', '#888'], [`'${name}'`, '#aaa'], [' is not visible.', '#888']);
               return;
            }
            popups[name].hide();
         }
      },
      unlock: {
         all: () => {
            popupsUnlocked = 0;
            for (const popup of Object.values(popupData)) {
               if (popup.unlocked) continue;
               popup.unlocked = true;
               popupsUnlocked++;
            }
            cookies.unlockedMalware.update();

            terminal.writeLine([popupsUnlocked, '#aaa'], [' popups were unlocked.', '#888']);
         }
      },
      js: {
         anyStr: arr => {
            const js = arr.join(' ');
            try {
               eval(js);
            } catch (e) {
               terminal.writeLine(['WARNING: ', '#ffbb29'], ['Command was not successfully executed.', '#888']);
               return;
            }
            terminal.writeLine(['Executed command ', '#ccc'], [js, '#59ff8b', 'bold']);
         }
      },
      clear: {
         returnVal: () => {
            // Remove all lines
            for (const line of document.querySelectorAll('.terminal-line')) line.remove();
         }
      },
      exit: {
         returnVal: () => {
            terminal.hide();
         }
      }
   },
   writeLine: function(...args) {
      const newLine = document.createElement('div');
      newLine.classList.add('terminal-line');

      const displayText = document.createDocumentFragment();
      for (const segment of args) {
         const newText = document.createElement('span');
         newText.innerHTML = segment[0];
         // Apply properties
         for (const property of segment) {
            if (property === segment[0]) continue;

            if (property === 'italic') {
               newText.style.fontStyle = 'italic';
            } else if (property === 'bold') {
               newText.style.fontWeight = 'bold';
            } else if (property.split('')[0] === '#') {
               // Hex colour
               newText.style.color = property;
            }
         }
         displayText.appendChild(newText);
      }
      newLine.appendChild(displayText);

      // Append it to the display.
      getElement('terminal-pointer').before(newLine);
   },
   searchCommand: function(searchObject, args, rootObject) {
      for (const property of Object.entries(searchObject)) {
         if (property[0] === args[0]) {
            rootObject = rootObject || property;

            // If the command is a function run it (end of branch)
            if (typeof property[1] === 'function') {
               property[1]();
               return;
            }
            
            // If the requested command has an extra parameter.
            if (args[1] !== undefined) {
               if (!isNaN(args[1])) {
                  // If it has a return param of a number
                  property[1].anyNum(parseInt(args[1]));
               } else if (property[1][args[1]] === undefined) {
                  // If the parameter doesn't exist
                  if (typeof property[1].anyStr === 'function') {
                     let subCommand = args.slice();
                     subCommand.splice(0, 1);
                     property[1].anyStr(subCommand);
                  } else {
                     this.writeLine(['ERROR: ', '#f53527'], [' The command ', '#888'], [`'${rootObject[0]}'`, '#bbb'], [' has no parameter ', '#888'], [`'${args[1]}'`, 'italic', '#bbb'], ['.', '#888']);
                  }
               } else {
                  const nextArgs = args.slice();
                  nextArgs.splice(0, 1);
                  this.searchCommand(property[1], nextArgs, rootObject);
               }
               return;
            } else {
               // If it presumably has a return value
               if (typeof property[1].returnVal === 'string') {
                  this.writeLine([property[1].returnVal]);
               } else if (typeof property[1].returnVal === 'function') {
                  property[1].returnVal();
               } else {
                  // When a parameter is missing
                  this.writeLine(['ERROR: ', '#f53527'], ['Command ', '#888'], [`'${rootObject[0]}'`, '#bbb'], [' is missing a parameter. Available parameters include:', '#888']);

                  for (const parameter of Object.entries(property[1])) {
                     this.writeLine(['- ', '#666'], [parameter[0], '#aaa'])
                  }
               }
               return;
            }
         }
      }

      this.writeLine([`'${args[0]}'`, 'italic', '#aaa'], [' is not a command.', '#888']);
   },
   getPath: function(commandName) {
      // TODO: Get the path of a command (e.g. unlock [all]/name)
   },
   enterCommand: function(command) {
      getElement('pointer-content').innerHTML = '';

      // Stop if the command does not have ascii characters
      const ascii = 'abcdefghijklmnopqrstuvwxyz';
      let hasAscii = false;
      for (const char of command.split('')) {
         if (ascii.split('').indexOf(char) !== -1) {
            hasAscii = true;
            break;
         }
      }
      if (!hasAscii) {
         return;
      }

      let subCommand = command.split(' ').slice();
      subCommand.splice(0, 1);
      this.writeLine(['> ', '#1ed93a'], [command.split(' ')[0], '#1ed93a'], [' ' + subCommand.join(' ')]);
      
      this.searchCommand(this.commands, command.split(' '));
   },
   show: function() {
      this.displayed = true;
      getElement('terminal').classList.remove('hidden');

      // Hide all previous lines
      this.commands.clear.returnVal();

      this.writeLine(['Welcome to the ', '#eee'], ['Terminal!', '#03fc28'])
      this.writeLine([`Type 'help' to get started.`, '#eee'])
   },
   hide: function() {
      this.displayed = false;
      getElement('terminal').classList.add('hidden');
   }
};

class blackMarketShop {
   constructor(shop) {
      // Create the shop DOM object
      const shopObject = getElement("shop-segment-template").cloneNode(true);
      getElement("black-market-bottom").appendChild(shopObject);
      shopObject.id = `${shop.name}-segment`;
      shopObject.classList.remove("hidden");

      shopObject.querySelector("button").id = `${shop.name}-segment-button`;
   }
}

const alerts = {
   closeAlert: function(alertBox) {
      const REMOVE_ANIMATION_DURATION_MS = 400;

      alertBox.classList.add("hiding");
      setTimeout(() => {
         alertBox.remove();
      }, REMOVE_ANIMATION_DURATION_MS);

      new Sound({
         path: "audio/close-alert.mp3",
         volume: 0.5
      });
   },
   createAlert: function({ title, iconSrc, description, caption, clickEvent }) {
      // Create the alert box
      const alertBox = document.createElement("div");
      alertBox.className = "alert-box";
      getElement("alert-container").appendChild(alertBox);

      alertBox.innerHTML = `
      <div class="close-icon"></div>
      <div class="top">
         <img src="${iconSrc}" />
         <p class="title">${title}</p>
      </div>
      <p class="description">${description}</p>`;
      if (caption) {
         alertBox.innerHTML += `
         <div class="seperator"></div>
         <p class="caption">${caption}</p>`;
      }

      alertBox.querySelector(".close-icon").addEventListener("click", () => {
         this.closeAlert(alertBox);
      });

      if (clickEvent) {
         alertBox.classList.add("clickable");
         alertBox.querySelector(".caption").addEventListener("click", () => {
            clickEvent();
            this.closeAlert(alertBox);
         });
      }
   }
}

/***** LOREM QUOTA *****/
class LoremQuota {
   constructor(quota) {
      this.quota = quota;
      this.unlocked = false;

      this.displayObj = getElement('lorem-quota');

      this.setupQuota();
      this.setQuotaProgress();
   }
   updateRewards() {
      Object.values(loremQuotaData).forEach(reward => {
         if (reward.requirement === this.quota) {
            this.updateRewardText(reward);
         }
      });
   }
   updateRewardText(quota) {
      getElement('quota-reward-title').innerHTML = quota.rewardTitle;
      getElement('quota-reward-text').innerHTML = quota.rewardText;
   }
   setupQuota() {
      this.displayObj.querySelector('h3').innerHTML = `${formatFloat(this.quota)} lorem`;
      this.updateRewards();
   }
   setQuotaProgress() {
      let progress = Game.lorem / this.quota * 100;
      if (progress > 100 && typeof Game.loremQuota !== 'undefined') {
         this.reachQuota();
         progress = Game.lorem / this.quota * 100;
      }

      getElement('quota-progress').innerHTML = `Progress: ${formatFloat(progress)}%`;
      
      this.displayObj.querySelector('.progress-bar').style.width = `${progress}%`;
   }
   reachQuota() {
      Game.currentQuota += 1;
      
      Game.updateQuotaFactor();
      this.quota = Game.nextLoremQuota;

      this.displayObj.classList.add('flashing');
      setTimeout(() => {
      this.displayObj.classList.remove('flashing');
      }, 300);

      this.setupQuota();

      const alertClickEvent = () => {
         console.log("NOTE TO FUTURE ME: MAKE THIS DO SOMETHING!!!");
      }
      alerts.createAlert({
         title: "Lorem Quota reached!",
         iconSrc: "images/scroll.png",
         description: "Go to the Corporate Overview to claim your reward.",
         caption: "Go to Quota Menu",
         clickEvent: alertClickEvent
      });
   }
}

const welcomeScreen = {
   currentView: 'main',
   viewContent: {
      main: `<p>Welcome intern.</p>
      <p>Congratulations on your entry into Lorem Corp. You have been supplied with a virtual Windows 95 machine on which to conduct your mining. Go to the Mail page for further information.</p>
      <p>You are dispensable and will be removed if you step out of line.</p>
      <p>- Lorem Corp.</p>`,
      about: `<p>Lorem Corp. is the leading corporation in the field of Lorem production.</p>
      <p>As an intern, it is your right to tirelessly produce lorem with no pay. Any behaviour which may be deemed 'unnecessary' will result in immediate action.</p>
      <p>Lorem mining can be conducted by using the letter keys on your supplied keyboard.</p>
      <p>To start your labour, press the 'Continue' button.</p>`
   },
   load: function() {
      const welcomeScreen = getElement('welcome-screen');
      for (const view of Object.entries(this.viewContent)) {
         const btn = document.createElement('button');
         btn.className = `${view[0]} button dark`;
         btn.innerHTML = capitalize(view[0]);

         btn.addEventListener('click', () => this.switchView(view[0]));

         welcomeScreen.querySelector('.seperator').before(btn);
      }

      const continueButton = getElement('welcome-screen').querySelector('.continue');
      continueButton.addEventListener('click', () => this.hide());

      this.switchView(this.currentView);
   },
   switchView: function(view) {
      if (!Object.keys(this.viewContent).includes(view)) {
         console.warn(`WARNING: View ${view} does not exist.`);
         return;
      }

      const welcomeScreen = getElement('welcome-screen');
      welcomeScreen.querySelector('.content').innerHTML = this.viewContent[view];

      for (const btn of welcomeScreen.querySelectorAll('.button:not(.continue)')) {
         btn.classList.add('dark');
      }

      welcomeScreen.querySelector(`.${view}`).classList.remove('dark');
   },
   show: function() {
      getElement('welcome-screen').classList.remove('hidden');
      getElement('mask').classList.remove('hidden');

      Game.inFocus = true;
   },
   hide: function() {
      getElement('welcome-screen').remove();
      getElement('mask').classList.add('hidden');

      mail.receiveLetter(letters.start);

      Game.inFocus = false;
   }
}

function instantiateClasses() {
   let popupNames = [];
   // Generate the popup names
   for (const popup of Object.values(popupData)) {
      const camelCaseArray = popup.name.split("-").map((string, index) => {
         return index >= 1 ? string.charAt(0).toUpperCase() + string.slice(1) : string;
      });
      popupNames.push(camelCaseArray.join(""));
   }

   function generateClasses(classObjectName, names) {
      names.forEach(name => {
         const capitalCase = name.charAt(0).toUpperCase() + name.slice(1);
         eval(`${classObjectName}["${name}"] = new ${capitalCase}("${name}")`);
      });
   }

   // Create the popups from their classes using popupNames.
   generateClasses("popups", popupNames);
   const semiPopupNames = ["chunkyMessage", "plagueOfChunky", "scourgeOfChunky", "wrathOfChunky", "hexOfChunky", "ad1", "ad2", "ad3", "ad4", "ad5", "loremWarning"];
   generateClasses("semiPopups", semiPopupNames);
}

function displayPoints(add) {
   const loremCount = formatNum(Game.lorem);
   
   // Update all listed element's text using their ID's
   const loremElements = ['total-lorem-mined', 'lorem-count', 'black-market-lorem-transfer-amount'];
   for (const elemID of loremElements) {
      getElement(elemID).innerHTML = loremCount;
   }

   getElement('corporate-lorem-count').querySelector('p').innerHTML = loremCount;
   getElement('packet-transfer-amount').innerHTML = formatFloat(Game.lorem * Game.blackMarket.transferRate);
   
   // Big lorem counter
   // updateLoremCounter(add);
   if (Game.loremQuota.unlocked) Game.loremQuota.updateProgress();
   Game.loremCorp.updatePromotionProgress();
}

function updateLoremCounter(add) {
   const text = document.createElement("div");
   text.innerHTML = add;

   text.classList.add("loremCounterAddText");
   getElement("lorem-counter-display").appendChild(text);

   let xVel = getCurve();
   let yVel = 1 - xVel;
   if (Math.random() < 0.5) xVel *= -1;
   if (Math.random() < 0.5) yVel *= -1;

   let xPos = 0;
   let yPos = 0;
   let ticks = 0;
   const moveText = setInterval(() => {
      text.style.left = `calc(50% + ${xPos}px)`;
      text.style.top = `calc(50% + ${yPos}px)`;
      xPos += xVel * 4;
      yPos += yVel * 4;

      if (ticks++ > 50) {
         clearInterval(moveText);
         text.remove();
      }
   }, 30);
}

const views = ['computer', "mail", 'black-market', 'corporate-overview', 'settings'];
const viewEvents = {
   mail: {
      open: function() {
         getElement('nav-mail').classList.remove('new-mail');

         for (const alert of document.querySelectorAll('.letter-alert')) {
            alert.remove();
         }
      },
   },
}
const setupNavBar = () => {
   // Make buttons change the screen on click.
   views.forEach(view => getElement(`nav-${view}`).addEventListener("click", () => switchView(view)));
}
function switchView(view) {
   if (Game.inFocus) return;

   Game.currentView = view;
   getElement(`nav-${view}`).classList.add("selected");
   getElement(view).classList.remove("hidden");
   // Run any functions specific to that view.
   const newViewName = view.replace('-', '');
   if (viewEvents[newViewName] !== undefined && viewEvents[newViewName].open !== undefined) {
      viewEvents[newViewName].open();
   }
   // Hide all views but the one being shown.
   views.forEach(item => {
      if (item !== view) {
         getElement(`nav-${item}`).classList.remove('selected');
         getElement(item).classList.add('hidden');

         // Run any close effects
         const viewName = item.replace('-', '');
         if (viewEvents[viewName] !== undefined && viewEvents[viewName].close !== undefined) {
            viewEvents[viewName].close();
         }
      }
   });
}

window.addEventListener('beforeunload', e => {
   // Confirmation thing if rain is open
   if (popups.rain.displayed) {
      popups.rain.hide();

      e.preventDefault();
      e.returnValue = '';
   }
});

const getTimeIdle = () => {
   const currentTime = Math.floor(new Date().getTime() / 1000);
   const lastTime = parseInt(getCookie('idle') !== '' ? getCookie('idle') : currentTime);
   return currentTime - lastTime;
}
const updateIdleTime = () => {
   const timeInSeconds = Math.floor(new Date().getTime() / 1000);
   setCookie('idle', timeInSeconds);
}
const handleIdleTime = () => {
   const timeIdle = getTimeIdle();

   const IDLE_CHECK_INTERVAL = 5;
   setInterval(updateIdleTime, IDLE_CHECK_INTERVAL * 1000);
   updateIdleTime();

   let workerSecondGain = 0;
   for (const worker of Object.entries(loremCorpData.jobs)) {
      const workerCount = Game.loremCorp.workers[worker[0]];
      workerSecondGain += worker[1].stats.loremProduction * workerCount;
   }
   const workerGain = workerSecondGain * timeIdle;

   const totalGain = workerGain;
   if (totalGain === 0) return;

   Game.gainLorem(totalGain);

   const alertClickEvent = () => {
      console.log("NOTE TO FUTURE ME: MAKE THIS DO SOMETHING!!!");
   }
   alerts.createAlert({
      title: "New idle profits",
      iconSrc: "images/scroll.png",
      description: `While you were away, your hard-working employees created ${formatNum(totalGain)} lorem.`,
      caption: "Go to Quota Menu",
      clickEvent: alertClickEvent
   });
}

const wait = (delay = 0) =>
  new Promise(resolve => setTimeout(resolve, delay));

document.addEventListener('DOMContentLoaded', () =>
  wait(1000).then(() => {
     getElement("loading-screen").classList.add("hidden");
  }));



const loadSaveData = () => {
   let saveData = ReadSaveData();
   if (saveData === "") saveData = GetDefaultSaveData();

   const sections = saveData.split("|");
   for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      switch (i) {
         case 0: {
            // Lorem count, total lorem earned, packet count

            const parts = section.split("_");
            for (let j = 0; j < parts.length; j++) {
               const part = Number(parts[j]);
               if (j === 0) {
                  Game.lorem = part;
               } else if (j === 1) {
                  Game.stats.loremEarned = part;
               } else if (j === 2) {
                  Game.packets = part;
               }
            }

            break;
         } case 1: {
            // Employees

            const employeeNames = Object.keys(loremCorpData.jobs);
            const employeeData = section.split("_");
            for (let j = 0; j < employeeData.length; j++) {
               Game.loremCorp.workers[employeeNames[j]] = Number(employeeData[j]);
            }

            break;
         } case 2: {
            // Received letters, opened letters, opened rewards

            const parts = section.split("_");

            const dictionary = parts.reduce((previousValue, currentValue) => {
               return previousValue.concat(Number(currentValue).toString(2));
            }, []);

            for (let j = 0; j < dictionary.length; j++) {
               const part = dictionary[j];

               const letterData = part.split("").reverse();
               for (let k = 0; k < letterData.length; k++) {
                  const newValue = letterData[k];
                  if (newValue === "0") continue;

                  const letter = Object.values(letters)[k];
                  if (j === 0) {
                     letter.isReceived = true;
                  } else if (j === 1) {
                     letter.isOpened = true;
                  } else if (j === 2) {
                     letter.rewards.isOpened = true;
                  }
               }
            }
            break;
         } case 3: {
            // Settings

            const parts = section.split("_");
            for (let j = 0; j < parts.length; j++) {
               const part = Number(parts[j]);
               const setting = Object.values(Game.settings.list)[j];
               if (setting.type === "range" || setting.type === "select") {
                  setting.value = part;
               } else {
                  setting.value = part === 1 ? true : false;
               }
            }

            break;
         } case 4: {
            // Owned applications, opened applications

            const parts = section.split("_");
            const dictionary = parts.reduce((previousValue, currentValue) => {
               return previousValue.concat(Number(currentValue).toString(2));
            }, []);

            for (let j = 0; j < dictionary.length; j++) {
               const applicationData = dictionary[j].split("");
               for (let k = 0; k < applicationData.length; k++) {
                  const application = Object.values(applications)[k];
                  const applicationReference = Object.values(Game.startMenu.applications["menu-application-shop"].applications)[k];

                  if (applicationData[k] === "1") {
                     if (j === 0) {
                        applicationReference.owned = true;
                     } else if (j === 1) {
                        application.isOpened = true;
                     }
                  } else {
                     if (j === 0) {
                        applicationReference.owned = false;
                     } else if (j === 1) {
                        application.isOpened = false;
                     }
                  }
               }
            }

            break;
         } case 5: {
            // Achievements

            const parts = Number(section).toString(2).split("").reverse();
            const achievements = Object.values(Game.achievements.list);
            for (let j = 0; j < achievements.length; j++) {
               if (parts[j] === "0") continue;
               if (parts[j] === undefined) break;
               
               const achievement = achievements[j];
               achievement.unlocked = true;
            }

            break;
         }
      }
   }
}

window.onload = () => {
   console.log("Welcome to the console!");
   console.log("If you're trying to modify the game, try clicking the 'Lorem Ipsum Generator' title text :)");

   instantiateClasses();

   loadSaveData();

   LoadData();

   setInterval(() => Game.tick(), 1000 / Game.tps);

   setupNavBar();

   // Unlock lorem quota. (Has to be done after LoadData because loremQuota doesn't exist until then)
   {
      const idx = Object.keys(letters).indexOf('motivationalLetter');
      const opened = getCookie('openedRewards').split('')[idx];
      if (opened === "1") {
         Game.loremQuota.unlock();
      }
   }

   Game.blackMarket.setup();
   displayPoints(0);

   changeViewHeights();
   window.addEventListener('resize', () => changeViewHeights());

   setupDevtools();

   switchView("computer");

   mail.setup();

   if (getCookie('misc').split("")[0] === "1") Game.blackMarket.unlockBlackMarket();

   // Terminal setup
   getElement('pointer-content').addEventListener('keydown', function(event) {
      const keyCode = event.keyCode;
      if (keyCode === 13) {
         // Enter key
         event.preventDefault();
         let command = getElement('pointer-content').innerHTML;
         // Remove whitespace
         command = command.trim().replace(/&nbsp;/g, '');
         terminal.enterCommand(command);
      }
   });

   welcomeScreen.load();
   if (letters.start.isReceived) {
      welcomeScreen.hide();
   } else {
      welcomeScreen.show();
   }

   Game.settings.setup();
   Game.blackMarket.minigames.setup();
   Game.startMenu.setup();

   // Sets the background image of the computer/generator
   Game.startMenu.applications["menu-preferences"].updateBackgroundImage();

   // Gives idle profits from workers
   handleIdleTime();

   dailyIndoctrination.setup();
}

function changeViewHeights() {
   const topHeight = getElement("info-bar").getBoundingClientRect().height;
   views.forEach(view => getElement(view).style.height = window.innerHeight - topHeight + "px")
}

const loremTemplate = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aliquid! Officia amet adipisci porro repellat deserunt vero quos ad id sint dolore iure odio reprehenderit dolores sed, molestias vitae dicta! ";
const adTexts = [" Full version costs $204967.235 ", " Go to www.this.is.a.site for free viruses! ", "Top 10 Top 10 list ! "];

const loremLength = loremTemplate.length;
var iterationCount = 0;
var nextText = 100;
var checkOffset = 0;

const keySwitchView = (num) => {
   // When called by a number press
   let views = [...document.querySelectorAll('.nav-element:not(.hidden)')];
   
   views = views.map(view => view.id.split('-'));
   if (num > views.length) return;

   let view = views[num - 1].slice();
   view.splice(0, 1);
   view = view.join('-');

   switchView(view);
}
document.addEventListener('keydown', function(event) {
   if (document.activeElement !== document.body) return;

   
   // Get the event key code
   const keyCode = event.keyCode;

   // Hide mail on Escape key press
   if (keyCode === 27 && !getElement("mail-inbox").classList.contains("hidden")) {
      mail.hide();
   }
   
   if (terminal.displayed) {
      getElement('pointer-content').focus();
      return;
   }
   
   // If the input is a number from 1-9 (keycodes 49-57) and the command key isn't held
   if (keyCode >= 49 && keyCode <= 57 && !event.metaKey) {
      keySwitchView(keyCode - 48);
   }
   // If the input is a letter press or space
   const key = String.fromCharCode(keyCode);
   if (keyCode >= 65 && keyCode <= 90 || keyCode === 32) keyPress(key);
});

function writeLorem(loremN = 1, giveLorem = true, pressedKey = null) {
   const currentText = getElement("current-lorem-text");
   const nextLetter = loremTemplate.split("")[iterationCount % loremLength];
   currentText.innerHTML += nextLetter;

   let loremPerWrite = 0.05;
   if (Game.loremQuota.quotaIdx >= 1) loremPerWrite *= 2;
   // Triple lorem gain if typed correct letter
   if (pressedKey !== null && (pressedKey.toLowerCase() === nextLetter.toLowerCase())) loremPerWrite *= 3;

   if (!(iterationCount % 5) && giveLorem) Game.gainLorem(loremPerWrite);

   const loremContainer = getElement("loremContainer");

   if (!giveLorem) {
      checkOffset++;
   } else {
      showPopupsAttempt();
   }
   // Create a lorem ad sometimes.
   if (iterationCount++ > nextText) {
      nextText += randomInt(60, 90);

      // Create the ad.
      const ad = document.createElement('div');
      loremContainer.appendChild(ad);
      ad.classList.add('loremAd');

      ad.innerHTML = adTexts[randomInt(0, adTexts.length)];
      ad.addEventListener("click", () => loremAdClick(ad));

      // Update the current lorem text container.
      currentText.id = '';
      const newLoremContainer = document.createElement('span');
      loremContainer.appendChild(newLoremContainer);
      newLoremContainer.id = 'current-lorem-text';
   }
}
function keyPress(key) {
   // Stop if the lurem impsir popup is blocking production.
   if (popups.luremImpsir !== undefined && !popups.luremImpsir.canLorem) return;
   if (Game.currentView !== "computer") return;

   writeLorem(1, true, key);
}
function showPopupsAttempt() {
   switch (iterationCount - checkOffset) {
      case 50:
         popups.microsoftAntivirus.show();
         break;
      case 100:
         popups.annualSurvey.show();
         break;
      case 150:
         popups.browserError.show();
         break;
      case 175:
         popups.luremImpsir.show();
         break;
      case 200:
         popups.freeIPhone.show();
         break;
      case 225:
         popups.bankDetails.show();
         break;
      case 250:
         popups.chunky.show();
         break;
      case 275:
         popups.ramDownload.show();
         break;
      case 300:
         popups.rain.show();
         break;
      case 325:
         popups.expandinator.show();
         break;
      case 350:
         popups.visitor.show();
         break;
      case 375:
         popups.devHire.show();
         break;
      case 400:
         popups.adblockBlocker.show();
         break;
   }
}
function loremAdClick(ad) {
   // Don't click if Lurem Impsir is blocking
   if (!popups.luremImpsir.canLorem) return;

   ad.remove();
   Game.gainLorem(0.3);
}


const mail = {
   selectedLetter: null,
   createInboxEntry: function(letter) {
      const inboxEntry = document.createElement("div");
      inboxEntry.className = "inbox-entry";
      getElement("mail-inbox").appendChild(inboxEntry);

      inboxEntry.innerHTML = `
      <div class="title">${letter.title}</div>
      <div class="from">${letter.from}</div>
      <div class="inbox-entry-icon-container">
         <img class="inbox-entry-icon" src="images/sealed-letter.png" />
      </div>
      <div class="inbox-entry-reward-icon"></div>`;

      if (letter.isOpened) {
         inboxEntry.classList.add("opened");
      } else if (letter.rewards !== undefined) {
         inboxEntry.classList.add('reward-available');
      }

      inboxEntry.addEventListener("click", () => {
         if (this.selectedLetter !== letter) {
            this.openLetter(letter, inboxEntry);
         } else {
            this.closeLetter();
         }
      });

      return inboxEntry;
   },
   letterIsClosed: function() {
      return getElement("letter").classList.contains("hidden");
   },
   createExistingEntries: function() {
      for (const letter of Object.values(letters)) {
         if (letter.isReceived) {
            const inboxEntry = this.createInboxEntry(letter);
            if (!letter.isOpened) this.createLetterAlert(letter, inboxEntry);
         }
      }
   },
   setup: function() {
      getElement("open-mail").addEventListener("click", () => this.open());

      // Creates the inbox entries
      this.createExistingEntries();

      getElement("mask").addEventListener("click", () => {
         if (getElement("mail-inbox").classList.contains("hidden")) return;
         this.hide();
      });
   },
   open: function() {
      Game.inFocus = true;
      getElement("mail-container").classList.remove("hidden");
      getElement("mask").classList.remove("hidden");
   },
   hide: function() {
      Game.inFocus = false;
      getElement("mail-container").classList.add("hidden");
      getElement("mask").classList.add("hidden");
   },
   openLetter: function(letter, inboxEntry) {
      letter.isOpened = true;
      this.selectedLetter = letter;

      // Remove the selected style from the previous entry.
      const previousSelected = document.querySelector(".inbox-entry.selected");
      if (previousSelected !== null) {
         previousSelected.classList.remove("selected");
      }

      inboxEntry.classList.add("selected");
      inboxEntry.classList.add("opened");
      inboxEntry.classList.remove("reward-available");

      const letterObj = getElement("letter");
      letterObj.classList.remove("hidden");

      // Links
      let body = letter.body;
      const links = [
         {
            display: "Corporate Overview",
            viewName: "corporate-overview"
         }
      ];
      for (const link of links) {
         body = body.replace(link.display, `<span class="link" onclick="mail.hide(); switchView('${link.viewName}');">${link.display}</span>`);
      }

      let rewards = "This letter has no rewards.";
      if (letter.rewards !== undefined) {
         rewards = `
         <h2 class="reward-header">Rewards</h2>
         <div class="reward-type-box ${letter.rewards.isOpened ? "opened" : ""}">
            <div class="reward-box">
               <img src="${letter.rewards.img}">
            </div>
            <div class="reward-text">${letter.rewards.text}</div>
         </div>
         `;
         rewards += letter.rewards.isOpened ? `<button class="button opened dark">Already claimed!</button>` : `<button class="button">Claim all</button>`;
      }

      letterObj.innerHTML = `
      <div class="header">
         <span>${letter.title} - Microsoft Exchange</span>
      </div>
      <table>
         <tr>
            <td>From:</td>
            <td class="from">${letter.from}</td>
         </tr>
         <tr>
            <td>To:</td>
            <td class="to">You</td>
         </tr>
         <tr>
            <td>Subject:</td>
            <td class="subject text-box">${letter.title}</td>
         </tr>
      </table>
      <div id="paper">
         <h3>${letter.title}</h3>
         ${body}
      </div>
      <div class="rewards">${rewards}</div>`;

      if (letter.rewards !== undefined) {
         letterObj.querySelector("button").addEventListener("click", () => {
            const rewardObj = letterObj.querySelector(".rewards");
            this.openReward(letter, rewardObj);
         });
      }
   },
   closeLetter: function() {
      this.selectedLetter = null;
      document.querySelector(".inbox-entry.selected").classList.remove("selected");
      getElement("letter").classList.add("hidden");
   },
   openReward: function(letter, rewardObj) {
      letter.rewards.isOpened = true;
      letter.rewards.reward();
      
      rewardObj.classList.add("opened");
      rewardObj.querySelector("button").classList.add("dark");
      rewardObj.querySelector("button").innerHTML = "Already claimed!";
   },
   receiveLetter: function(letter) {
      if (letter.isReceived) return;
      letter.isReceived = true;

      const inboxEntry = this.createInboxEntry(letter);

      if (!letter.isOpened) {
         this.createLetterAlert(letter, inboxEntry);
         new Sound({
            path: './audio/new-mail.mp3'
         });
      }
   },
   createLetterAlert: function(letter, inboxEntry) {
      getElement("nav-mail").classList.add("new-mail");
      
      const alertClickEvent = () => {
         switchView("mail");
         this.open();
         this.openLetter(letter, inboxEntry);
      };
      alerts.createAlert({
         title: letter.title,
         iconSrc: "images/scroll.png",
         description: "You've got mail!",
         caption: "Click here to open",
         clickEvent: alertClickEvent
      });
   }
}

function dragElement(elmnt, start) {
   var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
   start.onmousedown = dragMouseDown;

   function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      path = e.path || (e.composedPath && e.composedPath());
      // Check that the clicked element is the move element.
      if (path[0] == start) {
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
      // If the element is an application
      const applicationIDs = Object.keys(applications);
      if (applicationIDs.includes(elmnt.id)) {
         updateApplicationPositions();
      }
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
   }
}


/***** DEVTOOLS *****/
function setupDevtools() {
   getElement("header-title").addEventListener("click", () => getElement("devtools").classList.remove("hidden"));

   summonPopupSetup();
   miscToolsSetup();
   dataSetup();

   getElement("devtools-close").addEventListener("click", () => {
      const allTools = ["summon-popup", "misc-tools", "data-controls"];
      for (const tool of allTools) {
         getElement(tool).classList.add("hidden");
         getElement("devtools").classList.add("hidden");
      }
   });

   getElement('devtools-terminal').addEventListener('click', () => {
      terminal.show();
   })
}
function switchVisibility(elem) {
   getElement(elem).classList.contains("hidden") ? getElement(elem).classList.remove("hidden") : getElement(elem).classList.add("hidden");

   const allTools = ["summon-popup", "misc-tools", "data-controls"];
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

   getElement('summon-chunky').addEventListener("click", () => {
      popups.chunky.activate();
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
      const summonInput = newOption.querySelector(".summon-popup-input");
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
         if (selectedPopups[popupNames[i]]) popups[popupNames[i]].show(false, true);
      }
   });

   // Add the summon all button functionality.
   const summonAllButton = getElement("summon-popup-all");
   summonAllButton.addEventListener("click", () => {
      Object.values(popups).forEach(popup => popup.show(false, true));
   });
}
function dataSetup() {
   getElement("devtools-data").addEventListener("click", () => {
      switchVisibility("data-controls");
      appendToDevtools(getElement("data-controls"));
   });

   getElement('reset-button').addEventListener('click', () => {
      let workerCookies = Object.entries(loremCorpData.jobs);
      workerCookies = workerCookies.map(cookie => cookie[0]);

      // Reset cookies when the reset button is clicked
      const otherCookies = ['lorem', 'packets', 'openedLetters', 'openedRewards', 'receivedLetters', 'unlockedMalware', "unlockedShops", "misc", "settings", "applicationPositions", "ownedApplications", "unlockedAchievements", "save1"];
      const allCookies = [...workerCookies, ...otherCookies];
      // Delete cookies
      allCookies.forEach(cookie => document.cookie = cookie +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
      // Reload the page
      location.reload();
   });

   // Add lorem functionality
   getElement('add-lorem-button').addEventListener('click', () => {
      const addAmount = parseFloat(getElement('add-lorem-amount').value);
      Game.gainLorem(addAmount);
   });
}
function appendToDevtools(element) {
   let devBounds = getElement("devtools").getBoundingClientRect();
   element.style.left = devBounds.x + devBounds.width + "px";
   element.style.top = devBounds.y - getElement("computer").offsetTop + "px";
}