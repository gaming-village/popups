const Game = {
   tickFunctions: {},
   tick: () => {
      for (const func of Object.values(Game.tickFunctions)) {
         func();
      }
   },
   packets: null,
   setPackets: function() {
      this.packets = parseFloat(getCookie("packets"));
   },
   addPackets: function(add) {
      this.packets += add;
      setCookie("packets", this.packets, 30);
   },
   setUnlockedUpgrades: function() {
      // Set all upgrades to locked
      let currentId = 1;
      for (const upgrade of Object.values(this.menu.upgrades.upgrades)) {
         upgrade.unlocked = false;
         upgrade.id = currentId++;
      }

      const upgrades = getCookie("phishing-unlocked-upgrades");
      if (upgrades === "") {
         setCookie("phishing-unlocked-upgrades", 0);
         return;
      }

      let binary = parseInt(upgrades).toString(2);
      const upgradeCount = currentId - 1;
      while (binary.length < upgradeCount) {
         binary = "0" + binary;
      }
      binary.split("").reverse().forEach((bit, bitIdx) => {
            if (parseInt(bit)) {
            for (const upgrade of Object.values(this.menu.upgrades.upgrades)) {
               if (upgrade.id === bitIdx + 1) {
                  upgrade.unlocked = true;
               }
            }
         }
      });
   },
   updateUnlockedUpgrades: function() {
      let newCookie = 0;
      Object.values(this.menu.upgrades.upgrades).forEach((upgrade, id) => {
         if (upgrade.unlocked) {
            newCookie += Math.pow(2, id);
         }
      });
      console.log(newCookie);
      setCookie("phishing-unlocked-upgrades", newCookie);
   },
   checkXP: function() {
      while (true) {
         const xpRequirement = this.xpRequirement;
         if (this.xp < xpRequirement) break;
         this.xp -= xpRequirement;
         this.levelUp();
      }
   },
   get xpRequirement() {
      const XP_REQUIREMENTS = [5, 10, 25, 50, 100, 150, 250, 500];
      return XP_REQUIREMENTS[this.notoriety];
   },
   levelUp: function() {
      this.notoriety += 1;
      this.chat.createEntry(`You leveled up to Level ${this.notoriety}!`);
   },
   addResource: function(resource, count) {
      Game[resource] += count;

      if (resource === "xp") this.checkXP();

      this.updateResources();
   },
   updateResources: function() {
      let newCookie = "";
      for (const resource of minigames.phishing.resources) {
         newCookie += Game[resource] + ",";
      }
      newCookie = newCookie.substring(0, newCookie.length - 1);
      setCookie("phishing-resources", newCookie);

      this.displayResourceCounts();
   },
   setResources: function() {
      const resources = getCookie("phishing-resources");
      if (resources === "") {
         let newCookie = "";
         for (const resource of minigames.phishing.resources) {
            Game[resource] = 0;
            newCookie += "0,";
         }
         newCookie = newCookie.substring(0, newCookie.length - 1);
         setCookie("phishing-resources", newCookie);
         return;
      }

      resources.split(",").forEach((count, idx) => {
         const resource = minigames.phishing.resources[idx];
         Game[resource] = parseFloat(count);
      });
      this.displayResourceCounts();
   },
   displayResourceCounts: function() {
      const resources = getCookie("phishing-resources");
      resources.split(",").forEach((count, idx) => {
         const resource = minigames.phishing.resources[idx];
         if (resource === "notoriety") {
            getElement("notoriety-counter").innerHTML = `Notoriety: <span class="red"><b>${count}</b>`;
         } else if (resource === "chunks") {
            getElement("chunk-counter").innerHTML = `Chunks: <span class="drkgrn">${count}</span>`;
         } else if (resource === "xp") {
            getElement("xp-counter").innerHTML = `<span class="ong">XP</span>: <span class="lgtaqu">${count}</span><span class="gry">/${this.xpRequirement}</span>`;
         }
      });
   },
   reset: function() {
      this.notoriety = 0;
      this.xp = 0;
      this.chunks = 0;
      this.updateResources();

      // Set all slots to null
      slotNum = 0;
      while (true) {
         slotNum++;
         if (this.menu.upgrades.currentUpgrades.hasOwnProperty(slotNum.toString())) {
            this.menu.upgrades.currentUpgrades[slotNum] = null;
            continue;
         }
         break;
      }
      this.menu.upgrades.setUpgradesCookie();

      setCookie("phishing-unlocked-upgrades", 0);
   },
   setMiscCookie: () => {

   },
   updateMiscCookie: () => {
      /***
       * Bit 1: Has seen tutorial (1)
      ***/
   },
   tutorial: {
      show: () => {
         getElement("tutorial").classList.remove("hidden");
      },
      hide: function() {
         if (!this.isVisible()) return;
         getElement("tutorial").remove();
      },
      isVisible: () => {
         if (getElement("tutorial")) return true;
         return false;
      }
   },
   menu: {
      context: null,
      items: {
         almunac: {
            name: "menu-almunac",
            hoverText: "Open the almunac.",
            onClick: () => {
               Game.menu.openPanel("menu-almunac");
               Game.menu.almunac.openPage(1);
            }
         },
         upgrades: {
            name: "menu-upgrades",
            hoverText: "Open the upgrades menu.",
            onClick: () => {
               Game.menu.openPanel("menu-upgrades");
               Game.menu.upgrades.open();
            },
            setup: () => {
               getElement("menu-upgrades").querySelector("button").addEventListener("click", () => Game.menu.openPanel("menu"));
            }
         },
         quests: {
            name: "menu-quests",
            hoverText: "Open the quests menu.",
            onClick: () => {
               Game.menu.openPanel("menu-quests");
            },
            setup: () => {
               getElement("menu-quests").querySelector("button").addEventListener("click", () => Game.menu.openPanel("menu"));
            }
         }
      },
      open: function() {
         getElement("menu").classList.remove("hidden");
         this.context = "menu";
      },
      close: function() {
         getElement(this.context).classList.add("hidden");
         this.context = null;
      },
      get visible() {
         for (const menu of document.getElementsByClassName("menu-panel")) {
            if (!menu.classList.contains("hidden")) return true;
         }
         return false;
      },
      openPanel: function(panelName) {
         for (const panel of document.getElementsByClassName("menu-panel")) {
            panel.classList.add("hidden");
         }

         getElement(panelName).classList.remove("hidden");
         this.context = panelName;
      },
      setup: function() {
         // Items
         for (const item of Object.values(this.items)) {
            const itemOpener = getElement(item.name + "-opener");
            itemOpener.addEventListener("click", item.onClick);
            Game.menu.addHoverText(itemOpener, item.hoverText);

            if (typeof item.setup === "function") item.setup();
         }

         // Menu buttons
         getElement("open-menu").addEventListener("click", () => {
            if (!this.visible) this.open();
         });
         getElement("close-menu").addEventListener("click", () => this.close());

         this.upgrades.getUpgrades();
         this.upgradesShop.setup();
         this.upgradeViewer.setup();
      },
      addHoverText: (elem, text) => {
         elem.addEventListener("mouseover", () => {
            const hoverTool = document.createElement("div");
            hoverTool.id = "hover-tool";
            hoverTool.innerHTML = text;
            document.body.appendChild(hoverTool);

            const bounds = elem.getBoundingClientRect();
            hoverTool.style.left = bounds.x + bounds.width/2 + "px";
            hoverTool.style.top = bounds.y + bounds.height/2 + "px";
         });
         elem.addEventListener("mouseout", () => {
            getElement("hover-tool").remove();
         });
      },
      almunac: {
         openPage: pageNumber => {
            const almunac = getElement("menu-almunac");

            // Remove all previous items
            const children = almunac.children;
            while (children[0]) {
               children[0].remove();
            }

            const header = document.createElement("p");
            header.innerHTML = "<b>The Almunac</b>";
            almunac.appendChild(header);

            const viruses = Object.values(minigames.phishing.viruses);
            const ITEMS_IN_ROW = 5;
            for (let i = 0; i < 3; i++) {
               const row = document.createElement("div");
               row.classList.add("row");
               almunac.appendChild(row);

               for (let k = 0; k < ITEMS_IN_ROW; k++) {
                  const virus = viruses[i * ITEMS_IN_ROW + k];
                  
                  const item = document.createElement("div");
                  item.classList.add("item");
                  row.appendChild(item);

                  const img = document.createElement("div");
                  img.classList.add("img");
                  item.appendChild(img);
                  
                  if (virus !== undefined) {
                     let isUnlocked = true;
                     for (const req of Object.entries(virus.requirements)) {
                        if (req[0] === "notoriety") {
                           if (Game.notoriety < req[1]) {
                              isUnlocked = false;
                              break;
                           }
                        }
                     }

                     const label = document.createElement("div");
                     label.classList.add("label");
                     item.appendChild(label);
                     
                     if (isUnlocked) {
                        label.innerHTML = virus.displayName;
   
                        Game.menu.addHoverText(item, virus.name);
                        img.style.backgroundImage = `url(${virus.imgSrc})`;
                     } else {
                        label.innerHTML = "???";

                        Game.menu.addHoverText(item, "You have not phished this virus yet!");
                        img.style.backgroundImage = "url(../../images/phishing/unknown.png)";
                     }
                  } else {
                     item.classList.add("dark");
                     item.style.pointerEvents = "none";
                  }

                  item.addEventListener("click", () => {
                     Game.menu.openPanel("menu-almunac-viewer");
                     Game.menu.almunacViewer.open(virus);
                  });
               }
            }

            const bottomRow = document.createElement("div");
            bottomRow.classList.add("row");
            almunac.appendChild(bottomRow);

            const backButton = document.createElement("button");
            backButton.innerHTML = "Back";
            bottomRow.appendChild(backButton);
            backButton.addEventListener("click", () => Game.menu.openPanel("menu"));
         }
      },
      almunacViewer: {
         open: function(virus) {
            console.log(virus);
            const container = getElement("menu-almunac-viewer");

            container.querySelector(".name").innerHTML = virus.displayName;
            container.querySelector("img").src = virus.imgSrc;
            container.querySelector(".description").innerHTML = virus.description;

            container.querySelector(".times-phished").innerHTML = virus.stats.timesPhished;
         }
      },
      upgrades: {
         currentUpgrades: {
            1: null,
            2: null
         },
         hasUpgrade: function(upgradeName) {
            for (const upgrade of Object.values(this.currentUpgrades)) {
               if (upgrade === upgradeName) return true;
            }
            return false;
         },
         setUpgradesCookie: function() {
            let newCookie = "";
            for (const upgrade of Object.entries(this.upgrades)) {
               if (Object.values(this.currentUpgrades).includes(upgrade[0])) {
                  const idx = Object.values(this.currentUpgrades).indexOf(upgrade[0]);
                  const status = Object.keys(this.currentUpgrades)[idx];
                  newCookie += status;
               } else {
                  newCookie += "0";
               }
            }
            setCookie("phishing-upgrades", newCookie);
         },
         getUpgrades: function() {
            let upgradesCookie = getCookie("phishing-upgrades");

            if (upgradesCookie === "") {
               Object.keys(this.upgrades).forEach(() => upgradesCookie += "0");
               setCookie("phishing-upgrades", upgradesCookie);
            }

            Object.entries(this.upgrades).forEach((upgrade, idx) => {
               const status = parseInt(upgradesCookie.split("")[idx]);
               if (status !== 0) {
                  this.currentUpgrades[status] = upgrade[0];
               }
            });
         },
         upgrades: {
            phishingHole: {
               name: "Phishing Hole",
               description: "Gain increased Luck for phishing in an area.",
               imgUrl: "../../images/phishing/upgrades/phishing-hole.png",
               requirements: {
                  notoriety: 1,
                  chunks: 10
                  
               }
            },
            bait: {
               name: "Worm Bait",
               description: "The longer without a catch, the more likely a catch is to happen.",
               imgUrl: "../../images/phishing/upgrades/worm-bait.png",
               requirements: {
                  notoriety: 2,
                  chunks: 50
                  
               }
            },
            test: {
               name: "test",
               description: "Text",
               imgUrl: "../../images/phishing/upgrades/worm-bait.png",
               requirements: {
                  notoriety: 3,
                  chunks: 100
               }
            }
         },
         open: function() {
            const container = getElement("menu-upgrades-container");

            const prevItems = container.getElementsByClassName("item");
            while (prevItems[0]) {
               prevItems[0].remove();
            }

            const items = [];
            const ITEM_COUNT = 2;
            for (let i = 0; i < ITEM_COUNT; i++) {
               const item = document.createElement("div");
               item.classList.add("item");
               container.appendChild(item);
               items.push(item);

               item.addEventListener("click", () => {
                  Game.menu.upgradeViewer.currentSlot = i + 1;
                  Game.menu.upgradesShop.currentSlot = i + 1;
                  Game.menu.openPanel("menu-upgrades-shop");
                  Game.menu.upgradesShop.open();
               });
            }

            for (const currentUpgrade of Object.entries(this.currentUpgrades)) {
               const item = items[parseInt(currentUpgrade[0]) - 1];

               const label = document.createElement("div");
               label.classList.add("label");
               item.appendChild(label);

               if (currentUpgrade[1] !== null) {
                  const upgrade = this.upgrades[currentUpgrade[1]];

                  label.innerHTML = upgrade.name;

                  const img = document.createElement("img");
                  item.appendChild(img);
                  img.src = upgrade.imgUrl;

                  Game.menu.addHoverText(item, `<p class="aqu">Upgrade Slot ${currentUpgrade[0]}</p><p>Selected: <span class="ong">${upgrade.name}</span></p>`);
               } else {
                  label.innerHTML = "None";

                  Game.menu.addHoverText(item, "<p>This slot is empty.</p><p>Click to equip an upgrade.</p>");
               }
            }
         }
      },
      upgradesShop: {
         currentSlot: null,
         open: function() {
            const container = getElement("menu-upgrades-shop-container");

            // Remove previous rows
            const prevRows = container.getElementsByClassName("row");
            while (prevRows[0]) {
               prevRows[0].remove();
            }

            const MAX_ITEMS_PER_ROW = 5;
            const MAX_ROWS = 3;

            const upgradeCount = Object.keys(Game.menu.upgrades.upgrades).length;
            const maxRows = Math.min(Math.floor((upgradeCount - 1) / MAX_ITEMS_PER_ROW) + 1, MAX_ROWS);
            for (let i = 0; i < maxRows; i++) {
               const row = document.createElement("div");
               row.classList.add("row");
               container.appendChild(row);

               const itemsInRow = Math.min(upgradeCount - i * MAX_ITEMS_PER_ROW, MAX_ITEMS_PER_ROW);
               for (let k = 0; k < itemsInRow; k++) {
                  const item = document.createElement("div");
                  item.classList.add("item");
                  row.appendChild(item);

                  const upgrades = Object.entries(Game.menu.upgrades.upgrades);
                  const idx = i * MAX_ITEMS_PER_ROW + k;
                  const upgrade = upgrades[idx][1];

                  if (!upgrade.unlocked) {
                     item.classList.add("dark");
                     Game.menu.addHoverText(item, `<p class="red">You have not unlocked this upgrade!</p>`);
                  }

                  // If the upgrade is already equipped, do stuff
                  let isEquipped = false;
                  const upgradeName = upgrades[idx][0];
                  for (const currentUpgrade of Object.values(Game.menu.upgrades.currentUpgrades)) {
                     if (currentUpgrade === upgradeName) {
                        isEquipped = true;
                        break;
                     }
                  }

                  if (isEquipped) {
                     Game.menu.addHoverText(item, `<p class="red">This upgrade is already equipped!</p>`);
                     item.classList.add("dark");
                  }

                  const label = document.createElement("div");
                  label.classList.add("label");
                  label.innerHTML = upgrade.name;
                  item.appendChild(label);
                  
                  const img = document.createElement("img");
                  img.src = upgrade.imgUrl;
                  item.appendChild(img);

                  item.addEventListener("click", () => {
                     if (isEquipped) return;
                     Game.menu.upgradeViewer.open(upgrade);
                     Game.menu.openPanel("menu-upgrades-upgrade-viewer");
                  });
               }

               const clearButton = getElement("menu-upgrades-shop").querySelector(".clear");
               if (Game.menu.upgrades.currentUpgrades[this.currentSlot] === null) {
                  clearButton.classList.add("hidden");
               } else {
                  clearButton.classList.remove("hidden");
               }
            }
         },
         setup: function() {
            getElement("menu-upgrades-shop").querySelector(".close").addEventListener("click", () => {
               Game.menu.upgrades.open();
               Game.menu.openPanel("menu-upgrades");
            });

            const clearButton = getElement("menu-upgrades-shop").querySelector(".clear");
            clearButton.addEventListener("click", () => {
               Game.menu.upgrades.currentUpgrades[this.currentSlot] = null;
               Game.menu.upgrades.setUpgradesCookie();
               Game.menu.upgrades.open();
               Game.menu.openPanel("menu-upgrades");
            });
            Game.menu.addHoverText(clearButton, "<p>Clear this upgrade slot, for some reason.</p>");
         }
      },
      upgradeViewer: {
         currentUpgrade: null,
         currentSlot: null,
         open: function(upgrade) {
            this.currentUpgrade = upgrade;

            const container = getElement("menu-upgrades-upgrade-viewer");
            container.querySelector(".title").innerHTML = `<b>${upgrade.name}</b>`;

            let requirements = "";
            for (const req of Object.entries(upgrade.requirements)) {
               if (req[0] === "chunks") {
                  requirements += `<p>${req[1]} <span class="drkgrn">Chunks</span></p>`;
               } else if (req[0] === "notoriety") {
                  requirements += `<p>${req[1]} <span class="red">Notoriety</span></p>`;
               }
            }
            container.querySelector(".requirements").innerHTML = requirements;

            let stats = "<p><b>Statistics</b></p>";
            container.querySelector(".stats").innerHTML = stats;

            container.querySelector("img").src = upgrade.imgUrl;
            container.querySelector(".description").innerHTML = upgrade.description;

            const useButton = container.querySelector(".use");
            if (upgrade.unlocked) {
                // Get the upgrade name
               let upgradeName = null;
               for (const upgrade of Object.entries(Game.menu.upgrades.upgrades)) {
                  if (upgrade[1] === this.currentUpgrade) {
                     upgradeName = upgrade[0];
                     break;
                  }
               }
               
               if (Game.menu.upgrades.hasUpgrade(upgradeName)) {
                  useButton.innerHTML = "Equipped";
                  useButton.classList.add("dark");
               } else {
                  useButton.innerHTML = "Equip";
                  useButton.classList.remove("dark");
               }
            } else {
               useButton.innerHTML = "Unlock";
               if (this.canUnlockUpgrade()) {
                  useButton.classList.remove("dark");
               } else {
                  useButton.classList.add("dark");
               }
            }
         },
         canUnlockUpgrade: function() {
            let canUnlock = true;
            for (const req of Object.entries(this.currentUpgrade.requirements)) {
               if (Game[req[0]] < req[1]) {
                  canUnlock = false;
                  break;
               }
            }
            return canUnlock;
         },
         use: function() {
            // Get the upgrade name
            let upgradeName = null;
            for (const upgrade of Object.entries(Game.menu.upgrades.upgrades)) {
               if (upgrade[1] === this.currentUpgrade) {
                  upgradeName = upgrade[0];
                  break;
               }
            }

            if (!this.currentUpgrade.unlocked) {
               if (this.canUnlockUpgrade()) {
                  this.unlockUpgrade();
               }
               return;
            }

            const useButton = getElement("menu-upgrades-upgrade-viewer").querySelector(".use");
            if (!Game.menu.upgrades.hasUpgrade(upgradeName)) {
               useButton.innerHTML = "Equipped";
               useButton.classList.add("dark");
               this.selectUpgrade(upgradeName, this.currentSlot);
            }
         },
         unlockUpgrade: function() {
            this.currentUpgrade.unlocked = true;
            Game.updateUnlockedUpgrades();

            for (const req of Object.entries(this.currentUpgrade.requirements)) {
               if (req[0] === "notoriety") continue;
               Game.addResource(req[0], -req[1]);
            }

            const useButton = getElement("menu-upgrades-upgrade-viewer").querySelector(".use");
            useButton.innerHTML = "Equip";
         },
         selectUpgrade: function(name, slot) {
            Game.menu.upgrades.currentUpgrades[slot] = name;
            console.log(Game.menu.upgrades.currentUpgrades);
            Game.menu.upgrades.setUpgradesCookie();
         },
         setup: function() {
            getElement("menu-upgrades-upgrade-viewer").querySelector(".back").addEventListener("click", () => {
               Game.menu.upgradesShop.open();
               Game.menu.openPanel("menu-upgrades-shop");
            });

            getElement("menu-upgrades-upgrade-viewer").querySelector(".use").addEventListener("click", () => {
               this.use();
            });
         }
      }
   },
   chat: {
      createEntry: (text) => {
         return new Promise(resolve => {
            const entry = document.createElement("div");
            entry.classList.add("entry");
            entry.innerHTML = text;
            getElement("chat").appendChild(entry);

            resolve();
         });
      }
   },
   lootNotice: {
      createEntry: text => {
         const lootEntry = document.createElement("div");
         lootEntry.classList.add("loot-entry");
         lootEntry.innerHTML = text;

         getElement("loot-notice").appendChild(lootEntry);
      }
   },
   combat: {
      setup: function() {
         getElement("combat-box").querySelector("button").addEventListener("click", () => this.attack());
      },
      virus: {},
      visible: false,
      setVirusStatsCookie: function() {
         let virusStatsCookie = getCookie("phishing-virus-stats");
         if (virusStatsCookie === "") {
            let newCookie = "";
            for (const virus of Object.keys(minigames.phishing.viruses)) {
               newCookie += "0,";
            }
            newCookie = newCookie.slice(0, -1);
            setCookie("phishing-virus-stats", newCookie);
            virusStatsCookie = newCookie;
         }

         for (let i = 0; i < Object.keys(minigames.phishing.viruses).length; i++) {
            const virusData = virusStatsCookie.split(",")[i].split("-");
            const virus = Object.values(minigames.phishing.viruses)[i];
            virus.stats = {};
            virus.stats.timesPhished = parseInt(virusData[0]);
         }
      },
      updateVirusesPhishedCookie: function() {
         let newCookie = "";
         for (const virus of Object.values(minigames.phishing.viruses)) {
            const stats = virus.stats;
            newCookie += `${stats.timesPhished},`;
         }
         newCookie = newCookie.slice(0, -1);
         setCookie("phishing-virus-stats", newCookie);
      },
      show: function() {
         getElement("combat-box").classList.remove("hidden");
         this.visible = true;

         this.texts = [];
         Game.tickFunctions.combatText = () => {
            for (const fallingText of this.texts) {
               fallingText[1] += 3;
               fallingText[0].style.top = fallingText[1] + "%";

               if (fallingText[1] >= 100) {
                  fallingText[0].remove();
                  delete fallingText;
               }
            }

            if (Math.random() < 0.7) return;

            const text = document.createElement("div");
            text.classList.add("combat-text");
            text.innerHTML = randomSign() === 1 ? "1" : "0";
            text.style.left = randomFloat(0, 100) + "%";

            const hexval = randomInt(128, 256);
            text.style.color = `rgb(${hexval}, ${hexval}, ${hexval})`;
            
            this.texts.push([text, 0]);

            getElement("virus-box").appendChild(text);
         };
      },
      hide: function() {
         getElement("combat-box").classList.add("hidden");
         this.visible = false;

         delete Game.tickFunctions.combatText;
      },
      summonVirus: function(virus) {
         getElement("virus-name").innerHTML = virus.name;
         getElement("virus-health").innerHTML = virus.health;
         const virusImg = getElement("virus-img");
         virusImg.src = virus.imgSrc;

         let flipDirection = 1;
         Game.tickFunctions.moveVirus = () => {
            if (Math.random() < 0.97) return;
            virusImg.style.transform = `translate(-50%, -50%) scaleX(${flipDirection})`;
            flipDirection = flipDirection === 1 ? -1 : 1;
         };

         this.virus.name = virus.name;
         this.virus.health = virus.health;

         virus.stats.timesPhished++;
         this.updateVirusesPhishedCookie();
      },
      attack: function() {
         this.virus.health -= 5;
         getElement("virus-health").innerHTML = this.virus.health;

         const virusImg = getElement("virus-img");
         virusImg.classList.remove("hit");
         void virusImg.offsetWidth;
         virusImg.classList.add("hit");

         if (this.virus.health <= 0) this.kill();
      },
      kill: async function() {
         delete Game.tickFunctions.moveVirus;

         this.hide();

         // Kill all virus text
         const virusTexts = document.getElementsByClassName("combat-text");
         while (virusTexts[0]) {
            virusTexts[0].remove();
         }

         await this.getLoot()
         .then(async drops => await this.giveLoot(drops));
      },
      getLoot: function() {
         return new Promise(resolve => {
            const name = this.virus.name;
            
            let virus;
            for (const currentVirus of Object.values(minigames.phishing.viruses)) {
               if (currentVirus.name === name) {
                  virus = currentVirus;
                  break;
               }
            }

            const drops = {};
            for (const drop of Object.entries(virus.drops)) {
               if (Math.random() * 100 > drop[1].chance) continue;

               const dropAmount = Array.isArray(drop[1].amount) ? randomInt(drop[1].amount[0], drop[1].amount[1], true) : drop[1].amount;
               drops[drop[0]] = dropAmount;
            }

            resolve(drops);
         });
      },
      giveLoot: drops => {
         if (Object.keys(drops).length === 0) return;

         for (const drop of Object.entries(drops)) {
            Game.lootNotice.createEntry(`+${drop[1]} ${drop[0]}`);
            if (drop[0] === "chunks") {
               Game.addResource("chunks", drop[1]);
            } else if (drop[0] === "xp") {
               Game.addResource("xp", drop[1]);
            }
         }
      }
   },
   phishing: {
      virusChance: 70,
      thrown: false,
      thrownTime: 0,
      waitingForCatch: false,
      fishComing: false,
      catchable: false,
      throw: async function(pos) {
         const bobber = getElement("bobber");
         if (this.thrown || (typeof bobber === "undefined" && bobber === null)) return;

         Game.tutorial.hide();

         this.phishingHole.handleCast(pos);
      
         this.thrown = true;
         this.waitingForCatch = true;
         this.createBobber(pos);
         this.createSplash(pos);

         await this.waitForCatch();

         this.createPath(pos)
         .then(async path => await this.moveFish(path))
         .then(async pos => await this.bob(pos))
         .then(() => console.log("Done!"))
         .catch(e => console.log(e));
      },
      waitForCatch: () => {
         return new Promise((resolve) => {
            Game.tickFunctions.waitForCatch = () => {
               if (Game.phishing.thrown) {
                  if (Math.random() < 0.005 + 0.005 * (1 + Game.phishing.thrownTime)) {
                     delete Game.tickFunctions.waitForCatch;
                     console.log("Catch found!");
                     resolve();
                  }
                  Game.phishing.thrownTime += 0.1;
               }
            }
         });
      },
      createPath: function(pos) {
         return new Promise((resolve) => {
            const dist = randomInt(350, 450, true);
            let xRel = randomInt(0, dist, true);
            let yRel = Math.sqrt(Math.pow(dist, 2) - Math.pow(xRel, 2));
            xRel *= randomSign();
            yRel *= randomSign();

            const path = [];
            const WAYPOINT_COUNT = 18;
            for (let i = 0; i < WAYPOINT_COUNT; i++) {
               let x = pos.x + xRel * i / WAYPOINT_COUNT;
               let y = pos.y + yRel * i / WAYPOINT_COUNT;
               if (i > 0) {
                  x += randomInt(-7, 7);
                  y += randomInt(-7, 7);
               }
               const currentPos = {
                  x: x,
                  y: y
               };
               path.unshift(currentPos);
            }

            resolve(path);
         });
      },
      moveFish: function(waypoints) {
         return new Promise(async (resolve, reject) => {
            const fish = document.createElement("fish");
            fish.id = "fish";
            fish.style.left = waypoints[0].x + "px";
            fish.style.top = waypoints[0].y + "px";

            document.body.appendChild(fish);

            this.fishComing = true;

            const PROG_STEPS_PER_WAYPOINT = 5;
            for (let i = 0; i < waypoints.length - 1; i++) {
               for (let k = 1; k <= PROG_STEPS_PER_WAYPOINT; k++) {
                  if (!this.fishComing) {
                     reject();
                     return;
                  }

                  await timer(randomInt(10, 60, true));
                  const xDif = waypoints[i + 1].x - waypoints[i].x;
                  const yDif = waypoints[i + 1].y - waypoints[i].y;
                  fish.style.left = waypoints[i].x + xDif * (k / PROG_STEPS_PER_WAYPOINT) + "px";
                  fish.style.top = waypoints[i].y + yDif * (k / PROG_STEPS_PER_WAYPOINT) + "px";
               }
            }

            this.fishComing = false;
            resolve(waypoints[waypoints.length - 1]);
         });
      },
      removeFish: () => {
         getElement("fish").remove();

         const dots = document.getElementsByClassName("dot");
         while (dots[0]) dots[0].parentNode.removeChild(dots[0]);
      },
      bob: function(pos) {
         return new Promise(resolve => {
            const bobber = getElement("bobber");
            bobber.classList.add("bobbing");
            this.catchable = true;

            this.createSplash(pos);
            resolve();

            setTimeout(() => {
               bobber.classList.remove("bobbing");
               this.catchable = false;
            }, 900);
         });
      },
      createBobber: pos => {
         const bobber = document.createElement("div");
         bobber.id = "bobber";
         bobber.classList.add("splash");
         bobber.style.left = pos.x + "px";
         bobber.style.top = pos.y + "px";

         document.body.appendChild(bobber);

         setTimeout(() => {
            bobber.classList.remove("splash");
         }, 800);
      },
      createSplash: (pos) => {
         const splash = document.createElement("div");
         splash.id = "splash";
         splash.style.top = pos.y + "px";
         splash.style.left = pos.x + "px";

         document.body.appendChild(splash);

         setTimeout(() => {
            splash.remove();
         }, 1000);
      },
      phishingHole: {
         handleCast: function(pos) {
            if (document.querySelector(".phishing-hole") === null) return;

            const isInHole = this.isInHole(pos);
            console.log("Phished in the Phishing Hole: " + isInHole);
         },
         isInHole: function(pos) {
            // Distance from the cast spot to the phishing hole
            const dist = Math.sqrt(Math.pow(this.transform.x - pos.x, 2) + Math.pow(this.transform.y - pos.y, 2)) - this.transform.r;
            return dist <= 0;
         },
         create: function() {
            // Delete previous phishing hole
            this.remove();

            const r = randomInt(20, 100);
            const bounds = 20;
            const w = window.innerWidth;
            const x = randomFloat(bounds + r, w - bounds - r);
            const h = window.innerHeight;
            const y = randomFloat(bounds + r, h - bounds - r);
            this.transform = {
               x: x,
               y: y,
               r: r
            };

            const hole = document.createElement("div");
            hole.classList.add("phishing-hole");
            document.body.appendChild(hole);
            hole.style.width = r * 2 + "px";
            hole.style.height = r * 2 + "px";
            hole.style.left = x + "px";
            hole.style.top = y + "px";
         },
         remove: function() {
            const phishingHole = document.querySelector(".phishing-hole");
            if (phishingHole === null) return;
            phishingHole.remove();
         }
      },
      reel: function(pos) {
         if (!this.thrown) return;

         if (Game.menu.upgrades.hasUpgrade("phishingHole")) {
            this.phishingHole.create();
         }

         const bobber = getElement("bobber");
         bobber.classList.add("exit");
         this.thrown = false;

         this.thrownTime = 0;

         if (this.fishComing) {
            this.fishComing = false;
            this.removeFish();
         }

         if (this.catchable) {
            this.catch();
            this.removeFish();
         }
         setTimeout(bobber.remove(), 800);
      },
      catch: async function() {
         await this.getRandomCatch()
         .then(async item => await this.handleCatch(item))
      },
      hasUnlockedVirus: function(name) {
         const virus = minigames.phishing.viruses[name];
         for (const req of Object.entries(virus.requirements)) {
            if (req[0] === "notoriety") {
               if (Game.notoriety < parseInt(req[1])) {
                  return false;
               }
            }
         }
         return true;
      },
      getVirusLootTable: function() {
         const lootTable = new LootTable();
         for (const virus of Object.entries(minigames.phishing.viruses)) {
            if (this.hasUnlockedVirus(virus[0])) {
               lootTable.addItem(virus[1].name, virus[1].weight);
            }
         }
         return lootTable;
      },
      getRandomCatch: function() {
         return new Promise(resolve => {
            if (Math.random() * 100 < this.virusChance) {
               const lootTable = this.getVirusLootTable();
               const randomVirus = lootTable.getRandom();
               // If the user can fish no viruses, do packets
               if (randomVirus === undefined) {
                  resolve("PACKETS")
                  return;
               }
               resolve(randomVirus);
               return;
            }
            resolve("PACKETS");
         });
      },
      handleCatch: function(caughtItem) {
         return new Promise(resolve => {
            if (caughtItem === "PACKETS") {
               const packetAddCount = randomFloat(1, 5);
               Game.addPackets(packetAddCount);
               Game.chat.createEntry(`You phished up ${formatFloat(packetAddCount, 2)} packets.`);
               Game.lootNotice.createEntry(`+${formatFloat(packetAddCount, 2)} packets`);
               Game.addResource("xp", 1);

               resolve("PACKETS");
               return;
            }

            console.log(caughtItem);
            for (const virus of Object.values(minigames.phishing.viruses)) {
               if (virus.name === caughtItem) {
                  Game.chat.createEntry(virus.text);
                  Game.combat.summonVirus(virus);
               }
            }

            Game.combat.show();

            resolve(caughtItem);
         });
      }
   }
};

const handleClick = (clickType, pos) => {
   if (clickType === 1) {
      // Left click
      Game.phishing.throw(pos);
   } else if (clickType === 2) {
      // Right click
      Game.phishing.reel(pos);
   }
}

// Stop right click from opening that context menu
window.addEventListener("contextmenu", event => event.preventDefault());

document.addEventListener("mousedown", event => {
   if (event.target.tagName !== "HTML") return;
   if (Game.combat.visible || Game.menu.visible) return;

   event = event || window.event;
   let clickType;
   if ("buttons" in event) {
      clickType = event.buttons;
   } else {
      const button = event.which || event.button;
      clickType = button;
   }
   const pos = {
      x: event.clientX,
      y: event.clientY
   };
   handleClick(clickType, pos);
});

document.addEventListener("keydown", event => {
   switch (event.key) {
      case "Escape":
         Game.menu.visible ? Game.menu.close() : Game.menu.open();
         break;
   }
});

window.onload = () => {
   const TICKS_PER_SECOND = 10;
   setInterval(Game.tick, 1000 / TICKS_PER_SECOND);

   Game.setPackets();
   Game.setUnlockedUpgrades();
   Game.combat.setVirusStatsCookie();

   Game.combat.setup();
   Game.menu.setup();
   Game.setResources();
   Game.displayResourceCounts();
}