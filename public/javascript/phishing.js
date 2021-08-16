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
   updateResources: () => {
      let newCookie = "";
      for (const resource of minigames.phishing.resources) {
         newCookie += Game[resource] + ",";
      }
      newCookie = newCookie.substring(0, newCookie.length - 1);
      setCookie("phishing-resources", newCookie);

      getElement("notoriety-counter").innerHTML = `Notoriety: <span class="red"><b>${count}</b>`;
      getElement("chunk-counter").innerHTML = `Chunks: <span class="drkgrn">${count}</span>`;
   },
   setResources: () => {
      const resources = getCookie("phishing-resources");
      console.log(resources);
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
         if (resource === "notoriety") {
            getElement("notoriety-counter").innerHTML = `Notoriety: <span class="red"><b>${count}</b>`;
         } else if (resource === "chunks") {
            getElement("chunk-counter").innerHTML = `Chunks: <span class="drkgrn">${count}</span>`;
         }
      });
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
         getElement("menu").classList.add("hidden");
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
         getElement("close-menu").addEventListener("click", this.close);

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
         })
      },
      almunac: {
         openPage: (pageNumber) => {
            const almunac = getElement("menu-almunac");

            // Kill all previous children
            const children = almunac.children;
            while (children[0]) {
               children[0].remove();
            }

            const header = document.createElement("p");
            header.innerHTML = "<b>The Almunac</b>";
            almunac.appendChild(header);

            const viruses = Object.values(minigames.phishing.viruses);
            console.log(viruses);
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
                     const label = document.createElement("div");
                     label.classList.add("label");
                     label.innerHTML = virus.displayName;
                     item.appendChild(label);

                     Game.menu.addHoverText(item, virus.name);
                     img.style.backgroundImage = `url(${virus.imgSrc})`;
                  } else {
                     Game.menu.addHoverText(item, "You have not phished this virus yet!");
                     img.style.backgroundImage = "url(../../images/phishing/unknown.png)";
                  }
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
      upgrades: {
         currentUpgrades: {
            1: null,
            2: null
         },
         setUpgrades: function() {
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
                  chunks: 10,
                  notoriety: 1
               }
            },
            bait: {
               name: "Worm Bait",
               description: "The longer without a catch, the more likely a catch is to happen.",
               imgUrl: "../../images/phishing/upgrades/worm-bait.png",
               requirements: {
                  chunks: 50,
                  notoriety: 2
               }
            },
            test: {
               name: "test",
               description: "Text",
               imgUrl: "../../images/phishing/upgrades/worm-bait.png",
               requirements: {
                  chunks: 100,
                  notoriety: 3
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
               console.log(currentUpgrade);
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

                  // If the upgrade is already equipped, become sad
                  let isEquipped = false;
                  const upgradeName = upgrades[idx][0];
                  console.log(upgradeName);
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
               Game.menu.openPanel("menu-upgrades");
            });

            const clearButton = getElement("menu-upgrades-shop").querySelector(".clear");
            clearButton.addEventListener("click", () => {
               Game.menu.upgrades.currentUpgrades[this.currentSlot] = null;
               Game.menu.upgrades.setUpgrades();
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

            Game.menu.upgrades.currentUpgrades[this.currentSlot] = upgradeName;
            Game.menu.upgrades.setUpgrades();
            Game.menu.upgrades.open();
            Game.menu.openPanel("menu-upgrades");
         },
         setup: function() {
            getElement("menu-upgrades-upgrade-viewer").querySelector(".back").addEventListener("click", () => {
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
         console.log(this);
      },
      attack: function() {
         this.virus.health -= 5;
         getElement("virus-health").innerHTML = this.virus.health;

         const virusImg = getElement("virus-img");
         virusImg.classList.remove("hit");
         virusImg.classList.add("hit");

         if (this.virus.health <= 0) {
            this.kill();
         }
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
            console.log(drops);
            for (const drop of Object.entries(virus.drops)) {
               if (Math.random() * 100 > drop[1].chance) continue;

               const dropAmount = Array.isArray(drop[1].amount) ? randomInt(drop[1].amount[0], drop[1].amount[1], true) : drop[1].amount;
               console.log(dropAmount);

               drops[drop[0]] = dropAmount;
            }
            console.log(drops);

            resolve(drops);
         });
      },
      giveLoot: drops => {
         console.log(drops);

         if (Object.keys(drops).length === 0) return;

         for (const drop of Object.entries(drops)) {
            Game.lootNotice.createEntry(`+${drop[1]} ${drop[0]}`);
            console.log(drop);
            if (drop[0] === "chunks") {
               
            }
         }
      }
   },
   phishing: {
      virusChance: 70,

      setupLootTable: function() {
         this.lootTable = new LootTable();
         for (const virus of Object.values(minigames.phishing.viruses)) {
            this.lootTable.addItem(virus.name, virus.weight);
         }
      },

      thrown: false,
      thrownTime: 0,
      waitingForCatch: false,
      fishComing: false,
      catchable: false,
      throw: async function(pos) {
         const bobber = getElement("bobber");
         if (this.thrown || (typeof bobber === "undefined" && bobber === null)) return;
      
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
               this.createDot(currentPos);
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
                  if (this.fishComing === false) {
                     console.log("cringing!");
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
               this.removeFish();
            }, 900);
         });
      },
      createDot: (pos) => {
         const dot = document.createElement("div");
         dot.classList.add("dot");
         dot.style.left = pos.x + "px";
         dot.style.top = pos.y + "px";

         document.body.appendChild(dot);
      },
      createBobber: (pos) => {
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
      reel: function(pos) {
         console.log(this.thrown);
         if (!this.thrown) return;

         const bobber = getElement("bobber");
         bobber.classList.add("exit");
         this.thrown = false;

         this.thrownTime = 0;

         console.log(this.fishComing);
         if (this.fishComing) {
            this.fishComing = false;
            console.log("fish coming!");
            this.removeFish();
         }

         if (this.catchable) {
            console.log("caught!");
            this.catch();
         }
         setTimeout(bobber.remove(), 800);
      },
      catch: async function() {
         await this.getRandomCatch()
         .then(async item => await this.handleCatch(item))
         // .then(async item => await Game.chat.createEntry(item));
      },
      getRandomCatch: function() {
         return new Promise(resolve => {
            if (Math.random() * 100 < this.virusChance) {
               const randomVirus = this.lootTable.getRandom();
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
   console.log(clickType);
   if (clickType === 1) {
      // Left click
      Game.phishing.throw(pos);
   } else if (clickType === 2) {
      // Right click
      Game.phishing.reel(pos);
   }
}

// Stop right click from opening that context menu
window.addEventListener("contextmenu", event => {
   event.preventDefault();
});

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

window.onload = () => {
   const TICKS_PER_SECOND = 10;
   setInterval(Game.tick, 1000 / TICKS_PER_SECOND);

   Game.setPackets();
   Game.phishing.setupLootTable();
   Game.phishing.lootTable.listItems();
   Game.combat.setup();
   Game.menu.setup();
   Game.setResources();
}