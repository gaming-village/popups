const popups = {};
const semiPopups = {};
const applications = {};

const Game = {
   loremCorp: {
      corporateOverview: {
         unlocked: false
      },
      interns: 0
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
         updateUnlockedShopsCookie();

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
      }
   },
   setup: {
      setupLorem: () => {
         const loremCookie = getCookie("lorem");
         if (loremCookie == "") {
            setCookie("lorem", 0, 31);
         } else {
            Game.loremCount = parseFloat(loremCookie);
            // displayPoints(Game.loremCount);
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
            
            Game.addPackets(Game.loremCount);
            Game.addLorem(-Game.loremCount);
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
         // Game.changeTransferRate();

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
         })
      }
   },
   loremCount: 0,
   addLorem: (add, force = false) => {
      if (semiPopups.scourgeOfChunky.activated && !force) return;

      Game.loremCount += add;
      Game.stats.totalLoremMined += add;
      Game.updateLorem(add);
   },
   multLorem: (mult, force = false) => {
      if (semiPopups.scourgeOfChunky.activated && !force) return;

      const loremBefore = Game.loremCount;
      Game.loremCount *= mult;
      Game.stats.totalLoremMined *= mult;

      // Find the difference in points.
      const difference = Game.loremCount - loremBefore;
      Game.updateLorem(difference);
   },
   updateLorem: (add) => {
      createMiningEntry(add);
      displayPoints(add);
      applications.eventViewer.createEvent(['Gained ', '#888'], [add, '#555'], [' lorem', '#888']);
      setCookie("lorem", Game.loremCount, 31);
      Game.checkLoremLetters();

      new PointIncrementText(add);
   },

   transferRate: 0.1,
   // transferIdeal: 0.03,
   // transferBias: 3, // MAX OF 100
   // changeTransferRate: () => {
   //    const randomBias = randomFloat(Game.transferBias/10, Game.transferBias);
   //    Game.transferRate = Game.transferIdeal + randomFloat(0.2, 3) * randomBias / 100;
   //    getElement("transfer-rate").innerHTML = formatFloat(Game.transferRate);
   // },

   packetCount: 0,
   addPackets: (add, directAdd = false) => {
      const packets = add * (directAdd ? 1 : Game.transferRate);
      Game.packetCount += packets;
      Game.updatePackets();
      applications.eventViewer.createEvent(['Gained ', '#888'], [add, '#555'], [' packets', '#888'])
   },
   updatePackets: () => {
      getElement("packet-count").innerHTML = formatFloat(Game.packetCount);
      setCookie("packets", Game.packetCount, 31);
   },

   nextLoremQuota: 50,
   get quotaPromotions () {
      let returnArr = [];
      for (const quotaReward of Object.values(loremQuotaData)) {
         returnArr.push(quotaReward.requirement)
      }
      return returnArr;
   },
   updateQuotaFactor: () => {
      console.trace();
      // Increment the lorem quota by 1 from the quotaPromotions array
      if (!Game.loremQuota.unlocked) return;

      const quotaIndex = Game.quotaPromotions.indexOf(Game.nextLoremQuota);

      Game.nextLoremQuota = Game.quotaPromotions[quotaIndex + 1];

      updateMiscCookie();
   },
   unlockLoremQuota: () => {
      Game.loremQuota.unlocked = true;
      getElement('lorem-quota').classList.remove('hidden');
   },

   newLetterCount: 0,
   updateLetterCount: () => {
      if (Game.newLetterCount > 0) {
         getElement("nav-about").classList.add("new-mail");
      } else {
         getElement("nav-about").classList.remove("new-mail");
      }
   },
   checkLoremLetters: () => {
      if (Game.loremCount >= 3) receiveLetter('motivationalLetter');
      if (Game.loremCount >= 6) receiveLetter('rumors');
      if (Game.loremCount >= 8) receiveLetter('invitation');
      if (Game.loremCount >= 30) receiveLetter('promotion');
   },

   loremPerWrite: 0.05,

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
         anyStr: (arr) => {
            const name = arr.join(' ');
            if (popups[name] === undefined) {
               terminal.writeLine(['Popup ', '#888'], [`'${name}'`, '#aaa'], [' does not exist.', '#888'])
               return;
            }
            // Summon a popup
            if (!data[name].unlocked) {
               terminal.writeLine(['WARNING: ', '#ffbb29'], ['Popup ', '#888'], [`'${name}'`, '#aaa'], [' is not unlocked yet.', '#888'])
               return;
            }
            popups[name].showPopup();
         }
      },
      killall: {
         returnVal: () => {
            for (const popup of Object.values(popups)) {
               if (popup.displayed) popup.hidePopup();
            }
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

class alertBox {
   constructor(title = "", content = "") {
      // Create the alert box
      const alertBox = getElement("alert-box-template").cloneNode(true);
      getElement("alert-container").appendChild(alertBox);
      alertBox.classList.remove("hidden");
      alertBox.id = "";

      alertBox.querySelector("h3").innerHTML = title;
      alertBox.querySelector("h2").innerHTML = content;

      alertBox.querySelector("img").addEventListener("click", () => {
         alertBox.remove();
         delete this;
      });
   }
}


class LoremQuota {
   constructor(quota) {
      this.quota = quota;
      this.unlocked = false;

      this.displayObj = getElement('lorem-quota');

      this.setupQuota();
      this.setQuotaProgress();

      console.log('soadasjldasjkda');
      console.log(this.quota);

      Object.values(loremQuotaData).forEach(reward => {
         if (reward.requirement === this.quota) {
            this.updateRewardText(reward);
         }
      })
   }
   updateRewardText(quota) {
      getElement('quota-reward-title').innerHTML = quota.rewardTitle;
      getElement('quota-reward-text').innerHTML = quota.rewardText;
   }
   setupQuota() {
      this.displayObj.querySelector('h3').innerHTML = `${formatFloat(this.quota)} lorem`;
   }
   setQuotaProgress() {
      let progress = Game.loremCount / this.quota * 100;
      if (progress > 100 && typeof Game.loremQuota !== 'undefined') {
         console.log('success! ' + progress)
         this.reachQuota();
         progress = Game.loremCount / this.quota * 100;
      }

      getElement('quota-progress').innerHTML = `Progress: ${formatFloat(progress)}%`;
      
      this.displayObj.querySelector('.progress-bar').style.width = `${progress}%`;
   }
   reachQuota() {
      Game.updateQuotaFactor();
      this.quota = Game.nextLoremQuota;

      this.displayObj.classList.add('flashing');
      setTimeout(() => {
      this.displayObj.classList.remove('flashing');
      }, 300);

      this.setupQuota();
   }
}


function showPrompt(prompt) {
   if (prompts[prompt].received) return;

   getElement("mask").classList.remove("hidden");
   getElement("message-container").classList.remove("hidden");

   getElement("message-title").innerHTML = prompts[prompt].title;
   getElement("message-from").innerHTML = prompts[prompt].from;
   getElement("message").innerHTML = prompts[prompt].content;

   prompts[prompt].received = true;
   updateReceivedPromptsCookie();
}
function closePrompt() {
   getElement("mask").classList.add("hidden");
   getElement("message-container").classList.add("hidden");
}

function instantiateClasses() {
   let popupNames = [];
   // Generate the popup names
   for (const popup of Object.values(data)) {
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
   getElement("total-lorem-mined").innerHTML = formatFloat(Game.stats.totalLoremMined);

   const loremCount = formatFloat(Game.loremCount);

   getElement("pointCounter").innerHTML = loremCount;
   getElement("pointCounterContainer").classList.remove("hidden");

   getElement("lorem-count").innerHTML = loremCount;
   updateLoremCounter(add);

   getElement("black-market-lorem-transfer-amount").innerHTML = loremCount;

   getElement("packet-transfer-amount").innerHTML = formatFloat(Game.loremCount * Game.transferRate);

   Game.loremQuota.setQuotaProgress();
}

function updateLoremCounter(add) {
   const text = document.createElement("div");
   text.innerHTML = add;

   text.classList.add("loremCounterAddText");
   getElement("lorem-counter-display").appendChild(text);

   const xVel = getCurve();
   const yVel = 1 - xVel;

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

const views = ['computer', "about", 'black-market', 'corporate-overview'];
function setupNavBar() {
   // Make buttons change the screen on click.
   views.forEach(view => getElement(`nav-${view}`).addEventListener("click", () => switchView(view)));
}
function keySwitchView(num) {
   // When called by a number press
   let views = [ ...document.querySelectorAll('.nav-element:not(.hidden)')];
   
   views = views.map(view => view.id.split('-'));
   if (num > views.length) return;

   let view = views[num - 1].slice();
   view.splice(0, 1)
   view = view.join('-');

   switchView(view);
}
function switchView(view) {
   getElement(`nav-${view}`).classList.add("selected");
   getElement(view).classList.remove("hidden");
   // Hide all views but the one being shown.
   views.forEach(item => {
      if (item != view) {
         getElement(`nav-${item}`).classList.remove('selected');
         getElement(item).classList.add('hidden');
      }
   });
}

window.addEventListener('beforeunload', e => {
   // Confirmation thing if rain is open
   if (popups.rain.displayed) {
      popups.rain.hidePopup();

      e.preventDefault();
      e.returnValue = '';
   }
});

window.onload = () => {
   instantiateClasses();

   LoadData();
   setupNavBar();

   // Set the Game lorem count
   Game.setup.setupLorem();

   // Setup the lorem quota
   // Game.updateQuotaFactor();
   Game.loremQuota = new LoremQuota(Game.nextLoremQuota);

   // Unlock lorem quota. (Has to be done after LoadData because loremQuota doesn't exist until then)
   {
      const miscCookie = getCookie('misc');
      if (miscCookie.split('')[1] === '1') {
         console.warn('sdhfkhdsakhjlhfg kldahdglkmdghbklj');
         Game.unlockLoremQuota();
      }
   }

   Game.setup.setupPackets();
   Game.setup.setupBlackMarket();
   displayPoints(0);

   // Show the admission message and the starting letter.
   showPrompt("admission");
   receiveLetter("start");

   dragElement(getElement("pointCounterContainer"), getElement("point-counter-title"));

   changeViewHeights();
   window.addEventListener("resize", () => changeViewHeights());

   setupDevtools();

   getElement("header-title").addEventListener("click", () => getElement("devtools").classList.remove("hidden"));

   switchView("computer");

   setupMailbox();

   if (getCookie('misc').split('')[0] == '1') messages.invitation.rewards.reward();

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

   // File system setup
   fileSystem.startApplications();
}

function changeViewHeights() {
   const topHeight = getElement("info-bar").getBoundingClientRect().height;
   views.forEach(view => getElement(view).style.height = window.innerHeight - topHeight + "px")
}

const loremTemplate = "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, aliquid! Officia amet adipisci porro repellat deserunt vero quos ad id sint dolore iure odio reprehenderit dolores sed, molestias vitae dicta! ";
const adTexts = [" Full version costs $204967.235 ", " Go to www.this.is.a.site for free viruses! ", "Top 10 Top 10 list ! "];
const loremBlockSize = 500;

const loremLength = loremTemplate.split("").length;
var iterationCount = 0;
var nextText = 100;
var checkOffset = 0;

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
   if (keyCode >= 65 && keyCode <= 90 || keyCode === 32) keyPress();
});

function writeLorem(loremN = 1, giveLorem = true) {
   const currentText = getElement("current-lorem-text");
   currentText.innerHTML += loremTemplate.split("")[iterationCount % loremLength];

   if (!(iterationCount % 5) && giveLorem) Game.addLorem(Game.loremPerWrite);

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

   // Reset the block if block size is reached
   if (iterationCount >= loremBlockSize) {
      Game.addLorem(10);
      iterationCount = 0;

      for (const text of loremContainer.querySelectorAll('*')) text.remove();

      // Recreate the current-lorem-text
      const currentLoremText = document.createElement('span');
      currentLoremText.id = 'current-lorem-text';
      loremContainer.appendChild(currentLoremText);
   }
}
function keyPress() {
   if (!popups.luremImpsir.canLorem) return; // Stop if the lurem impsir popup is blocking production.

   writeLorem();
}
function showPopupsAttempt() {
   switch (iterationCount - checkOffset) {
      case 50:
         popups.microsoftAntivirus.showPopup();
         break;
      case 100:
         popups.annualSurvey.showPopup();
         break;
      case 150:
         popups.browserError.showPopup();
         break;
      case 175:
         popups.luremImpsir.showPopup();
         break;
      case 200:
         popups.freeIPhone.showPopup();
         break;
      case 225:
         popups.bankDetails.showPopup();
         break;
      case 250:
         popups.chunky.showPopup();
         break;
      case 275:
         popups.ramDownload.showPopup();
         break;
      case 300:
         popups.rain.showPopup();
         break;
      case 325:
         popups.expandinator.showPopup();
         break;
      case 350:
         popups.visitor.showPopup();
         break;
      case 375:
         popups.devHire.showPopup();
         break;
      case 400:
         popups.adblockBlocker.showPopup();
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
   getElement("mail-inbox").classList.remove("hidden");
   getElement("mask").classList.remove("hidden");

   // Show any selected letters.
   if (selectedMessage >= 0) {
      const newSelectedMessage = Object.values(messages)[selectedMessage];

      changeSelectedLetter(newSelectedMessage);
      switchLetterVisibility(newSelectedMessage);
   }
}
function hideInbox() {
   getElement("mail-inbox").classList.add("hidden");
   // getElement("mask").classList.add("hidden");
   hideLetter();
}
function createInboxEntry(letter, existingEntry = false) {
   // If the entry has already been created
   if (getElement(`inbox-entry-${letter.reference}`) != undefined) {
      return;
   }
   const newEntry = getElement("inbox-entry-template").cloneNode(true);
   getElement("mail-inbox").appendChild(newEntry);
   newEntry.id = `inbox-entry-${letter.reference}`;
   newEntry.classList.remove("hidden");

   if (letter.opened) {
      newEntry.classList.add("opened");
   } else if (existingEntry) {
      console.log("inc");
      Game.newLetterCount++;
      Game.updateLetterCount();

      new alertBox("New letter received!", letter.title);
   }

   newEntry.querySelector(".inbox-entry-title").innerHTML = letter.title;
   newEntry.querySelector(".inbox-entry-from").innerHTML = letter.from;

   newEntry.addEventListener("click", () => {
      console.log('u');

      changeSelectedLetter(letter);
      // switchLetterVisibility(letter);
   });
}
function showExistingEntries() {
   for (const message of Object.values(messages)) {
      if (message.received) {
         createInboxEntry(message, true);
      }
   }
}
function setupMailbox() {
   getElement("mail-container").addEventListener("click", () => openLetter());
   getElement("open-mail").addEventListener("click", () => showInbox());

   showExistingEntries();
   hideLetter();

   getElement("mask").addEventListener("click", () => {
      if (getElement("about").classList.contains("hidden")) return;
      getElement("mask").classList.add("hidden");
      hideInbox();
   });
}
function changeSelectedLetter(letter) {
   console.log('a: ' + letter.reference)
   // console.log(selectedLetter);
   selectedMessage = letter.reference - 1;
   console.log('a: ' + selectedMessage)
   const selectedEntry = getElement(`inbox-entry-${letter.reference}`);
   console.log('selected:');
   console.log(selectedEntry);
   console.log('selected2:');
   console.log(document.querySelector('.selected-letter'));
   const previousSelected = document.querySelector('.selected-letter');

   console.log(previousSelected !== selectedEntry);
   selectedEntry.classList.add("selected-letter");
   
   for (const entry of document.getElementsByClassName("inbox-entry")) {
      if (entry !== selectedEntry) {
         entry.classList.remove("selected-letter");
      }
   }
   switchLetterVisibility(letter, previousSelected !== selectedEntry);
}
function openReward(letter) {
   letter.rewards.opened = true;
   updateOpenedRewardsCookie();
   getElement(`letter-${letter.reference}-reward`).classList.add("opened");

   letter.rewards.reward();

   const claimAllButton = getElement('paper').querySelector('.paper-button');
   claimAllButton.classList.add('opened');
}
function showLetter(letter) {
   console.log(letter);

   getElement('mail-container').classList.remove('hidden');
   getElement('paper').innerHTML = `<h3>${letter.title}</h3> ${letter.content}`;
   if (letter.rewards != undefined) {
      getElement("paper").innerHTML += `
      <h2 class="reward-header">Rewards</h2>
      `;

      if (letter.rewards.type == "box") {
         const boxId = `letter-${letter.reference}-reward`;
         getElement('paper').innerHTML += `
         <div id="${boxId}" class="reward-type-box">
            <div class="reward-box"><img src="${letter.rewards.img}"></div>
            <div class="reward-text">${letter.rewards.text}</div>
         </div>
         <button class='paper-button'>Claim all</button>
         `;

         const claimAllButton = getElement('paper').querySelector('.paper-button');
         if (letter.rewards.opened) {
            claimAllButton.classList.add('opened');
            getElement(boxId).classList.add('opened');
         }
         // Add claim all button functionality
         claimAllButton.addEventListener('click', () => {
            openReward(letter)
         });

         getElement(boxId).addEventListener('click', () => {
            openReward(letter);
         });
      }
   }

   if (letter.opened) {
      getElement("mail-container").classList.add("opened");
      getElement("mail-container").classList.remove("opening");
   } else {
      getElement("mail-container").classList.remove("opened");
      getElement("mail-container").classList.remove("opening");
   }
}
function hideLetter() {
   getElement("mail-container").classList.add("hidden");
}
function switchLetterVisibility(letter, forceShow = false) {
   console.log('switch');
   if (getElement("mail-container").classList.contains("hidden") || forceShow) {
      showLetter(letter);
   } else {
      hideLetter();
      const selectedLetter = document.querySelector('.selected-letter');
      console.log(selectedLetter);
      selectedLetter.classList.remove('selected-letter');
      console.log('oeuf');
      selectedMessage = -1;
   }
}
function openLetter(letter = false) {
   let currentLetter = letter;
   if (!letter) {
      console.log(selectedMessage);
      for (const letter of Object.values(messages)) {
         console.log(letter.reference);
         if (letter.reference == selectedMessage + 1) {
            console.log("AEF");
            console.log(letter);
            currentLetter = letter;
            break;
         }
      }
   }

   console.log(currentLetter);

   if (currentLetter.opened) {
      getElement("mail-container").classList.add("opened");
      getElement("mail-container").classList.remove("opening");
   } else {
      console.log("dec");
      Game.newLetterCount--;
      Game.updateLetterCount();
      getElement("mail-container").classList.remove("opened");
      getElement("mail-container").classList.add("opening");
   }

   currentLetter.opened = true;
   console.log(document.querySelectorAll('.inbox-entry'));
   console.log(currentLetter);
   console.log(currentLetter.reference);
   console.log(selectedMessage);
   // getElement(`inbox-entry-${currentLetter.reference}`).classList.add("opened");
   getElement(`inbox-entry-${selectedMessage + 1}`).classList.add("opened");
   updateOpenedMessagesCookie();
}
function receiveLetter(letterName) {
   const letter = messages[letterName];
   if (letter.received) return;

   letter.received = true;
   createInboxEntry(letter);
   updateReceivedMessagesCookie();

   if (!letter.opened) {
      console.log("inc");
      Game.newLetterCount++;
      Game.updateLetterCount();

      new alertBox("New letter received!", letter.title);
   }
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
      // Check that the clicked element is the move element.
      if (e.path[0] == start) {
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
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
   }
}


// DEVTOOLS
function setupDevtools() {
   // Devtools won't be draggable.

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

   getElement("summon-chunky").addEventListener("click", () => {
      popups.chunky.activateChunky();
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
         if (selectedPopups[popupNames[i]]) popups[popupNames[i]].showPopup(false, true);
      }
   });

   // Add the summon all button functionality.
   const summonAllButton = getElement("summon-popup-all");
   summonAllButton.addEventListener("click", () => { 
      Object.values(popups).forEach(popup => popup.showPopup(false, true));
   });
}
function dataSetup() {
   getElement("devtools-data").addEventListener("click", () => {
      switchVisibility("data-controls");
      appendToDevtools(getElement("data-controls"));
   });

   getElement('reset-button').addEventListener('click', () => {
      // Reset cookies when the reset button is clicked
      const cookies = ['lorem', 'packets', 'recievedPrompts', 'openedMessages', 'openedRewards', 'receivedMessages', 'unlockedMalware', 'receivedPrompts', 'unlockedShops', 'misc'];
      // Delete cookies
      cookies.forEach(cookie => document.cookie = cookie +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;');
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