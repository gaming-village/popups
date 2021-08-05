const popups = {};
const semiPopups = {};
const applications = {};

const setApplicationIDs = () => {
   let id = 1;
   for (const application of Object.values(applications)) {
      application.id = id;
      id++;
   }
};

const Game = {
   currentView: "",
   inFocus: false,
   settings: {
      dpp: 2,
      progressType: 2,
      animatedBGs: false,
      rainLetters: true,
      getContainerElems: function(containerID) {
         return [
            getElement(containerID),
            getElement(containerID).querySelector(".selected-val")
         ];
      },
      setup: function() {
         {
            const [ container, selectedVal ] = this.getContainerElems('settings-dpp');
            const dppSlider = container.querySelector('input');
            dppSlider.addEventListener('input', () => {
               this.dpp = parseInt(dppSlider.value);
               selectedVal.innerHTML = dppSlider.value;
               updateSettingsCookie();
            });
            dppSlider.value = this.dpp;
            selectedVal.innerHTML = this.dpp;
         }
         {
            const [ container, selectedVal ] = this.getContainerElems('settings-progress-type');
            const progressTypeBox = container.querySelector('select');
            const progressTypes = ['Percentage', 'Current/Total', 'Current/Total (Percentage)'];
            progressTypeBox.addEventListener('input', () => {
               this.progressType = progressTypes.indexOf(progressTypeBox.value) + 1;
               selectedVal.innerHTML = progressTypeBox.value;
               updateSettingsCookie();
            });
            progressTypeBox.value = progressTypes[this.progressType - 1];
            selectedVal.innerHTML = progressTypes[this.progressType - 1];
         }
         {
            const [ container, selectedVal ] = this.getContainerElems('settings-animated-bgs');
            const animatedBGBox = container.querySelector('input');
            animatedBGBox.addEventListener('click', () => {
               this.animatedBGs = animatedBGBox.checked;
               selectedVal.innerHTML = animatedBGBox.checked ? 'On' : 'Off';
               if (animatedBGBox.checked) {
                  getElement('black-market-stars').classList.remove('hidden');
               } else {
                  getElement('black-market-stars').classList.add('hidden');
               }
               updateSettingsCookie();
            });
            animatedBGBox.checked = this.animatedBGs;
            selectedVal.innerHTML = this.animatedBGs ? 'On' : 'Off';
            if (!this.animatedBGs) getElement('black-market-stars').classList.add('hidden');
         }
         {
            const [ container, selectedVal ] = this.getContainerElems('settings-rain-letters');
            const rainLettersBox = container.querySelector('input');
            rainLettersBox.addEventListener('click', () => {
               this.rainLetters = rainLettersBox.checked;
               selectedVal.innerHTML = rainLettersBox.checked ? 'On' : 'Off';
               updateSettingsCookie();
            });
            rainLettersBox.checked = this.rainLetters;
            selectedVal.innerHTML = this.rainLetters ? 'On' : 'Off';
         }
      }
   },
   loremQuota: {
      quota: 0,
      quotaIdx: -1,
      unlocked: false,
      unlock: function() {
         this.unlocked = true;
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
         const quotaStage = this.quotaIdx + 1;
         getElement("lorem-quota-stage").innerHTML = `Current quota stage: ${quotaStage}`;
         const rewardContainer = getElement("lorem-quota-claimed-rewards");

         for (const child of rewardContainer.children) {
            console.log(child)
            child.remove();
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
            Game.addLorem(loremGain);
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
         getElement("promote-button").addEventListener('click', () => {
            if (Game.lorem < loremCorpData.jobs[this.job].requirement) return;

            getElement("promote-button").classList.add("dark");

            // Promote
            if (this.jobIdx + 1 >= Object.keys(loremCorpData.jobs).length) return;
            const nextJob = Object.entries(loremCorpData.jobs)[this.jobIdx + 1];
            const nextJobName = nextJob[0];
            this.job = nextJobName;
            updateMiscCookie();
            this.updatePromotionProgress();

            Game.addLorem(-Game.lorem);

            // Receive the promotion letter
            const letterName = nextJob[1].letterName;
            receiveLetter(letterName);
         });

         const quotaMenuButton = getElement('quota-menu-button');
         quotaMenuButton.addEventListener('click', () => {
            this.showView('quota-menu', quotaMenuButton);
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
         button.addEventListener("mouseout", () => {
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

            // Buy button functionality
            jobView.querySelector('.buy-button').addEventListener('click', () => {
               const currentWorkerCount = this.workers[job[0]];
               const cost = this.getWorkerCost(job[0], currentWorkerCount);

               if (Game.lorem >= cost) {
                  this.workers[job[0]] += 1;
                  Game.addLorem(-cost);

                  this.updateWorkerData(job[0]);
                  this.updateWorkerInfo(jobView, job);
               }
            });
         }
      },
      set job(newJob) {
         this.job_internal = newJob;
         const jobData = loremCorpData.jobs[newJob];
         console.log(jobData);

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
      unlocked: false,
      unlockBlackMarket: () => {
         getElement("nav-black-market").classList.remove("hidden");
         Game.blackMarket.unlocked = true;
      },
      unlockShopAttempt: (shop) => {
         if (!shop.unlocked && Game.packetCount >= shop.cost) {
            Game.addPackets(-shop.cost, true);

            Game.blackMarket.unlockShop(shop);
         }
      },
      unlockShop: (shop) => {
         getElement(`${shop.name}-segment`).classList.remove("locked");

         shop.unlocked = true;
         cookies.unlockedShops.update();

         const shopObject = getElement(`${shop.name}-segment`);
         shopObject.querySelector("h2").innerHTML = shop.display.title;
         shopObject.querySelector("p").innerHTML = shop.display.description;
         shopObject.querySelector("button").innerHTML = "GO";
      },
      lockShop: (shop) => {
         // Update the shop text to show it as locked.
         const shopObject = getElement(`${shop.name}-segment`);
         shopObject.querySelector("h2").innerHTML = "LOCKED";

         const suffix = shop.cost == 1 ? "" : "s";
         shopObject.querySelector("p").innerHTML = `You require <b>${shop.cost} packet${suffix}</b> to unlock this shop.`;

         shopObject.querySelector("button").innerHTML = "BUY";
      },
      clickShop: (shop) => {
         shop.clickEvent();
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
   setup: {
      setupLorem: () => {
         const loremCookie = getCookie("lorem");
         if (loremCookie == "") {
            setCookie("lorem", 0, 31);
         } else {
            Game.lorem = parseFloat(loremCookie);
         }
      }, 
      setupPackets: () => {
         getElement("transfer-rate").innerHTML = Game.transferRate;
         
         const transferButton = getElement("transfer-button");
         transferButton.addEventListener("click", () => {
            if (transferButton.classList.contains("blocked")) return;
            
            transferButton.classList.add("blocked");
            setTimeout(() => {
               transferButton.classList.remove("blocked");
            }, 5000);
            
            Game.addPackets(Game.lorem);
            Game.addLorem(-Game.lorem);
         });
         
         const packetCookie = getCookie("packets");
         if (packetCookie == "") {
            setCookie("packets", 0, 31);
         } else {
            Game.packetCount = parseFloat(packetCookie);
         }

         Game.updatePackets();
      },
      setupBlackMarket: () => {
         // Setup each black market shop.
         Object.values(blackMarketShops).forEach(shop => {
            new blackMarketShop(shop);

            const shopObject = getElement(`${shop.name}-segment`);
            // Initialise all shops.
            if (shop.unlocked) {
               Game.blackMarket.unlockShop(shop);
            } else {
               Game.blackMarket.lockShop(shop);
            }

            shopObject.querySelector("button").addEventListener("click", () => {
               if (!shop.unlocked) {
                  Game.blackMarket.unlockShopAttempt(shop);
                  return;
               }
               Game.blackMarket.clickShop(shop);
            });
         });
      }
   },
   lorem: 0,
   addLorem: (add, force = false) => {
      if (semiPopups.scourgeOfChunky.activated && add > 0 && !force) return;

      if (popups.visitor.tripleLorem) {
         add *= 3;
      }

      Game.lorem += add;
      Game.stats.totalLoremMined += add;
      Game.updateLorem(formatFloat(add));
   },
   multLorem: (mult, force = false) => {
      if (semiPopups.scourgeOfChunky.activated && !force) return;

      const loremBefore = Game.lorem;
      Game.lorem *= mult;
      Game.stats.totalLoremMined *= mult;

      // Find the difference in points.
      const difference = Game.lorem - loremBefore;
      Game.updateLorem(formatFloat(difference));
   },
   updateLorem: (add) => {
      createMiningEntry(add);
      displayPoints(add);
      applications.eventViewer.createEvent(['Gained ', '#ccc'], [add, '#fff'], [' lorem', '#ccc']);
      setCookie("lorem", Game.lorem, 31);
      Game.checkLoremLetters();

      new PointIncrementText(add);
   },

   transferRate: 0.1,

   packetCount: 0,
   addPackets: (add, directAdd = false) => {
      const packets = add * (directAdd ? 1 : Game.transferRate);
      Game.packetCount += packets;
      Game.updatePackets();
      applications.eventViewer.createEvent(['Gained ', '#ccc'], [add, '#fff'], [' packets', '#ccc']);
   },
   updatePackets: () => {
      getElement("packet-count").innerHTML = formatFloat(Game.packetCount);
      setCookie("packets", Game.packetCount, 31);
   },

   // nextLoremQuota: 50,
   // currentQuota: -1,
   // get quotaPromotions () {
   //    let returnArr = [];
   //    for (const quotaReward of Object.values(loremQuotaData)) {
   //       returnArr.push(quotaReward.requirement);
   //    }
   //    return returnArr;
   // },
   // updateQuotaFactor: () => {
   //    // Increment the lorem quota by 1 from the quotaPromotions array
   //    if (!Game.loremQuota.unlocked) return;

   //    const quotaIndex = Game.quotaPromotions.indexOf(Game.nextLoremQuota);

   //    Game.nextLoremQuota = Game.quotaPromotions[quotaIndex + 1];
   //    console.log(quotaIndex + 1);

   //    updateMiscCookie();
   // },
   // unlockLoremQuota: () => {
   //    Game.loremQuota.unlocked = true;
   //    getElement('lorem-quota').classList.remove('hidden');
   // },

   checkLoremLetters: () => {
      if (Game.lorem >= 2) receiveLetter('motivationalLetter');
      if (Game.lorem >= 5) receiveLetter('greetings')
      if (Game.lorem >= 8) receiveLetter('invitation');
      if (Game.lorem >= 15) receiveLetter('rumors');
   },

   maxPopups: 7,
   popupQueue: [],
   get maxPopupCount() {
      let visibleCount = 0;
      for (const bit of getCookie('unlockedMalware')) {
         if (bit === '1') {
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
   stats: {
      totalLoremMined: 0
   }
};

const fileSystem = {
   files: [],
   addApplication: function(application) {
      const newFile = getElement('file-template').cloneNode(true);
      newFile.id = '';
      newFile.classList.remove('hidden');
      newFile.querySelector('span').innerHTML = `${application.name}.app`;

      getElement('file-system').appendChild(newFile);
      console.log(application);
   },
   startApplications: function() {
      for (const application of Object.values(applications)) {
         this.addApplication(application);
      }
   }
}

const terminal = {
   displayed: false,
   commands: {
      help: {
         returnVal: () => {
            terminal.writeLine(['Available commands:', '#bbb']);
            Object.entries(terminal.commands).forEach(command => {
               if (command[0] === 'help') return;
               terminal.writeLine(['- ', '#777'], [command[0], '#999']);
            })
         }
      },
      hello: {
         returnVal: 'Hello there!'
      },
      give: {
         lorem: {
            anyNum: (num) => {
               terminal.writeLine(['Gave ', '#888'], [num, '#bbb'], [' lorem', '#888']);
               Game.addLorem(num);
            }
         },
         packets: {
            anyNum: (num) => {
               terminal.writeLine(['Gave ', '#888'], [num, '#bbb'], [' packets', '#888']);
               Game.addPackets(num / Game.transferRate);
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
         anyStr: (arr) => {
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
                  console.log('e!');
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

class AlertBox {
   constructor({ title, body }) {
      // Create the alert box
      const alertBox = getElement("alert-box-template").cloneNode(true);
      getElement("alert-container").appendChild(alertBox);
      alertBox.classList.remove("hidden");
      alertBox.id = "";
      this.displayObj = alertBox;

      alertBox.querySelector("h3").innerHTML = title;
      alertBox.querySelector("h2").innerHTML = body;

      alertBox.querySelector('.close-icon').addEventListener("click", () => {
         alertBox.remove();
         delete this;
      });
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
         console.log('success! ' + progress)
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
      const alertBox = new AlertBox({
         title: 'Quota reached!',
         body: 'Go to the Corporate Overview to claim your reward!'
      });
   }
}

const welcomeScreen = {
   currentView: 'main',
   viewContent: {
      main: `<p>Welcome intern.</p>
      <p>Congratulations on your entry into Lorem Corp. You have been supplied with a virtual Windows 95 machine on which to conduct your mining. Go to the About page for further information.</p>
      <p>You are dispensable and will be removed if you step out of line.</p>
      <p>- Lorem Corp.</p>`,
      about: `<p>Lorem Corp. is the leading corporation in the field of Lorem production.</p>
      <p>As an intern, it is your right to tirelessly produce lorem with no pay. Any behaviour which may be deemed 'unnecessary' will result in immediate action.</p>
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
   const applicationNames = ["loremController", "loremCounter", 'eventViewer'];
   generateClasses("applications", applicationNames);
}

function displayPoints(add) {
   const loremCount = formatFloat(Game.lorem);
   
   // Update all listed element's text using their ID's
   const loremElements = ['total-lorem-mined', 'pointCounter', 'lorem-count', 'black-market-lorem-transfer-amount'];
   for (const elemID of loremElements) {
      getElement(elemID).innerHTML = loremCount;
   }

   getElement('corporate-lorem-count').querySelector('p').innerHTML = loremCount;
   getElement('packet-transfer-amount').innerHTML = formatFloat(Game.lorem * Game.transferRate);
   
   updateLoremCounter(add);
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

const views = ['computer', 'about', 'black-market', 'corporate-overview', 'settings'];
const viewEvents = {
   about: {
      open: function() {
         getElement('nav-about').classList.remove('new-mail');

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

   Game.addLorem(totalGain);
   const alertBox = new AlertBox({
      title: 'New idle profits.',
      body: `Your workers generated ${formatFloat(totalGain)} lorem.`
   });
}

const wait = (delay = 0) =>
  new Promise(resolve => setTimeout(resolve, delay));

document.addEventListener('DOMContentLoaded', () =>
  wait(1000).then(() => {
     getElement("loading-screen").classList.add("hidden");
  }));

window.onload = () => {
   console.log("Welcome to the console!");
   console.log("If you're trying to modify the game, try clicking the 'Lorem Ipsum Generator' title text :)");

   instantiateClasses();

   setApplicationIDs();
   LoadData();

   setupNavBar();
   setupComputerBar();

   Game.setup.setupLorem();

   // Unlock lorem quota. (Has to be done after LoadData because loremQuota doesn't exist until then)
   {
      const idx = Object.keys(letters).indexOf('motivationalLetter');
      const opened = getCookie('openedRewards').split('')[idx];
      if (opened === "1") {
         // Game.unlockLoremQuota();
         Game.loremQuota.unlock();
      }
   }

   Game.setup.setupPackets();
   Game.setup.setupBlackMarket();
   displayPoints(0);

   dragElement(getElement("pointCounterContainer"), getElement("point-counter-title"));

   changeViewHeights();
   window.addEventListener('resize', () => changeViewHeights());

   setupDevtools();

   switchView("computer");

   setupMailbox();

   if (getCookie('misc').split("")[0] === '1') letters.invitation.rewards.reward();

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

   // fileSystem.startApplications();

   document.body.classList.add('ct-95');

   welcomeScreen.load();
   const received = getCookie('receivedLetters').split('')[0];
   if (received === '0') {
      welcomeScreen.show();
   } else {
      welcomeScreen.hide();
   }

   receiveLetter('start');

   Game.settings.setup();

   Game.blackMarket.minigames.setup();

   handleIdleTime();
}

function setupComputerBar() {
   getElement('start-icon').addEventListener('click', () => {
      new Sound({
         path: './audio/windows-xp-startup.mp3'
      });
   });
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
   
   if (terminal.displayed) {
      getElement('pointer-content').focus();
      return;
   }
   
   // If the input is a number (49 57) excluding 0
   if (keyCode >= 49 && keyCode <= 57) {
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

   if (!(iterationCount % 5) && giveLorem) Game.addLorem(loremPerWrite);

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
   if (!popups.luremImpsir.canLorem) return;
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
   Game.addLorem(0.3);
}


var selectedMessage = -1;
function showInbox() {
   Game.inFocus = true;
   getElement("mail-inbox").classList.remove("hidden");
   getElement('mask').classList.remove('hidden');

   // Show any selected letters.
   if (selectedMessage >= 0) {
      const newSelectedMessage = Object.values(letters)[selectedMessage];
      console.log(Object.entries(letters)[selectedMessage]);

      changeSelectedLetter(newSelectedMessage);
      switchLetterVisibility(newSelectedMessage);
   }
}
function hideInbox() {
   Game.inFocus = false;
   getElement("mail-inbox").classList.add("hidden");
   hideLetter();
}
function createInboxEntry(letterObj, existingEntry = false) {
   const letter = letterObj[1];
   // If the entry has already been created
   if (getElement(`inbox-entry-${letterObj[0]}`) != undefined) {
      return;
   }
   const newEntry = getElement("inbox-entry-template").cloneNode(true);
   getElement("mail-inbox").appendChild(newEntry);
   newEntry.id = `inbox-entry-${letterObj[0]}`;
   newEntry.classList.remove("hidden");

   if (letter.opened) {
      newEntry.classList.add('opened');
   } else {
      if (letter.rewards !== undefined) {
         newEntry.classList.add('reward-available');
      }
      if (existingEntry) {
         // Entry already exists but has not been opened.
         newLetterAlert(letter);
      }
   }

   newEntry.querySelector('.inbox-entry-title').innerHTML = letter.title;
   newEntry.querySelector('.inbox-entry-from').innerHTML = letter.from;

   newEntry.addEventListener('click', () => {
      changeSelectedLetter(letterObj);
   });
}
function showExistingEntries() {
   for (const letter of Object.entries(letters)) {
      if (letter[1].received) {
         createInboxEntry(letter, true);
      }
   }
}
function setupMailbox() {
   getElement("open-mail").addEventListener("click", () => showInbox());

   showExistingEntries();
   hideLetter();

   getElement("mask").addEventListener("click", () => {
      if (getElement("about").classList.contains("hidden")) return;
      hideMailbox();
   });
}
function hideMailbox() {
   getElement("mask").classList.add("hidden");
   hideInbox();
}
function changeSelectedLetter(letterObj) {
   const selectedEntry = getElement(`inbox-entry-${letterObj[0]}`);
   const previousSelected = document.querySelector('.selected-letter');

   selectedEntry.classList.add('selected-letter');
   
   for (const entry of document.getElementsByClassName("inbox-entry")) {
      if (entry !== selectedEntry) {
         entry.classList.remove("selected-letter");
      }
   }
   switchLetterVisibility(letterObj, previousSelected !== selectedEntry);
}
function openReward(letter) {
   letter.rewards.opened = true;
   updateOpenedRewardsCookie();
   getElement(`letter-${letter.reference}-reward`).classList.add("opened");

   letter.rewards.reward();

   const claimAllButton = getElement('paper').querySelector('.paper-button');
   claimAllButton.classList.add('opened');
}
function showLetter(letterObj) {
   const letter = letterObj[1];

   // Show the paper
   const paper = getElement('paper');
   paper.classList.remove('hidden');

   const letterEntry = getElement(`inbox-entry-${letterObj[0]}`);
   letterEntry.classList.add('opened');
   letterEntry.classList.remove('reward-available');
   
   // Remember it as opened
   letter.opened = true;
   cookies.openedLetters.update();

   let content = letter.content;
   const textNames = ["Corporate Overview"];
   const viewNames = ["corporate-overview"];
   let idx = 0;
   for (const textName of textNames) {
      content = content.replace(textName, `<span class="link" onclick="hideMailbox(); switchView('${viewNames[idx]}');">${textName}</span>`);
      idx++;
   }

   // Update the paper's text
   paper.innerHTML = `<h3>${letter.title}</h3> ${content}`;
   if (letter.rewards != undefined) {
      paper.innerHTML += `
      <h2 class="reward-header">Rewards</h2>
      `;

      if (letter.rewards.type == "box") {
         const boxId = `letter-${letter.reference}-reward`;
         paper.innerHTML += `
         <div id="${boxId}" class="reward-type-box">
            <div class="reward-box"><img src="${letter.rewards.img}"></div>
            <div class="reward-text">${letter.rewards.text}</div>
         </div>
         <button class='paper-button button'>Claim all</button>
         `;

         const claimAllButton = paper.querySelector("button");
         if (letter.rewards.opened) {
            claimAllButton.classList.add("opened", "dark");
            claimAllButton.innerHTML = "Already claimed!";
            getElement(boxId).classList.add('opened');
         }
         
         claimAllButton.addEventListener('click', () => {
            claimAllButton.classList.add("opened", "dark");
            claimAllButton.innerHTML = "Already claimed!";
            openReward(letter);
         });
      }
   }
}
function hideLetter() {
   getElement('paper').classList.add('hidden');
}
function switchLetterVisibility(letterObj, forceShow = false) {
   if (getElement("paper").classList.contains("hidden") || forceShow) {
      // Show the letter and update the letter text.
      showLetter(letterObj);
   } else {
      hideLetter();
      const selectedLetter = document.querySelector('.selected-letter');
      selectedLetter.classList.remove('selected-letter');
      selectedMessage = -1;
   }
}
function receiveLetter(letterName) {
   const letter = letters[letterName];
   if (letter.received) return;

   letter.received = true;
   createInboxEntry([letterName, letters[letterName]]);
   cookies.receivedLetters.update();

   if (!letter.opened) {
      newLetterAlert(letter);
   }

   applications.eventViewer.createEvent(['Received letter ', '#ccc'], [letterName, '#fff']);
}
function newLetterAlert(letter) {
   getElement('nav-about').classList.add('new-mail');
   const alertBox = new AlertBox({
      title: 'New letter received!',
      body: letter.title
   });

   const letterAlert = alertBox.displayObj;
   letterAlert.querySelector('.close-icon').remove();
   letterAlert.classList.add('letter-alert');

   letterAlert.addEventListener('click', () => {
      switchView('about');
      showInbox();
   });
}


/*
MINING FEED
*/
const miningEntries = {};
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
      if (elmnt.classList.contains("popup-container-3")) {
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
      console.log('hiding');
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
      const otherCookies = ['lorem', 'packets', 'openedLetters', 'openedRewards', 'receivedLetters', 'unlockedMalware', 'unlockedShops', 'misc', 'settings'];
      const allCookies = [...workerCookies, ...otherCookies];
      // Delete cookies
      allCookies.forEach(cookie => document.cookie = cookie +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
      // Reload the page
      location.reload();
   });

   // Add lorem functionality
   getElement('add-lorem-button').addEventListener('click', () => {
      const addAmount = parseFloat(getElement('add-lorem-amount').value);
      Game.addLorem(addAmount);
   });
}
function appendToDevtools(element) {
   let devBounds = getElement("devtools").getBoundingClientRect();
   element.style.left = devBounds.x + devBounds.width + "px";
   element.style.top = devBounds.y - getElement("computer").offsetTop + "px";
}