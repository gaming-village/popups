/*
GENERAL HELPER FUNCTIONS
*/
function getElement(elementName) {
   const element = document.querySelector(`#${elementName}`);
   return element;
}
function formatFloat(float, dp = Game.settings.dpp) {
   const mult = Math.pow(10, dp);
   const formattedFloat = Math.round((float + Number.EPSILON) * mult) / mult;
   return formattedFloat;
}
function formatProg(current, goal, preventOverflow = false) {
   const progressType = Game.settings.progressType;
   let progress = current / goal * 100;
   if (preventOverflow) progress = Math.min(progress, 100);

   let type;
   if (progress >= 100) {
      type = `<span class="progress-green">`;
   } else if (progress >= 50) {
      type = `<span class="progress-orange">`;
   } else {
      type = `<span class="progress-red">`;
   }

   switch (progressType) {
      case 1:
         return type + formatFloat(progress) + "%</span>";
      case 2:
         return type + formatFloat(current) + "</span>/" + formatFloat(goal);
      case 3:
         return formatFloat(current) + "/" + formatFloat(goal) + type + " (" + formatFloat(progress) + "%)</span>";
      default:
         console.warn(`WARNING! Progress type ${progressType} not found.`);
   }
}
function randomInt(min, max, inclusive = false) {
   const add = inclusive ? 1 : 0;
   const randomInt = Math.floor(Math.random() * (max - min + add)) + min;
   return randomInt;
}
function randomFloat(min, max) {
   const randomFloat = Math.random() * (max - min) + min;
   return randomFloat;
}
function randomSign() {
   const sign = Math.sign(randomFloat(1, -1));
   return sign;
}
function scalePX(px, scaleType) {
   switch (scaleType) {
      case 'vw':
         return 100 / window.innerWidth * px;
      case 'vh':
         return 100 / window.innerHeight * px;
      default:
         return 0;
   }
}
function getCurve() {
   const rand = randomFloat(-1, 1);
   const result = Math.sin((rand * Math.PI + Math.PI) / 2);
   return result;
}
function randElem(arr) {
   const elem = arr[randomInt(0, arr.length)];
   return elem;
}
function capitalize(str) {
   const first = str.split('')[0].toUpperCase();
   const rest = str.substring(1, str.split('').length);
   return first + rest;
}
function plural(str) {
   return str + 's';
}
function slugCase(str) {
   const slug = str.replace(/([A-Z])/g, '-$1').toLowerCase();
   return slug;
}
function topHeight() {
   return getElement("info-bar").getBoundingClientRect().height;
}
function randomiseArray(arr) {
   copyArr = arr.slice();
   returnArr = [];
   const len = copyArr.length;
   for (let i = 0; i < len; i++) {
      const randIdx = Math.floor(Math.random() * copyArr.length);
      returnArr.push(copyArr[randIdx]);
      copyArr.splice(randIdx, 1);
   }
   return returnArr;
}
function timer(ms) {
   return new Promise(res => setTimeout(res, ms));
}



/***** SOUNDS  *****/
class Sound {
   constructor({ path, volume = 1 }) {
      this.audio = new Audio(path);
      this.audio.volume = volume;
      this.audio.play();
   }
}



/***** LOOT TABLES *****/
class LootTable {
   constructor() {
      this.items = {};
   }
   addItem(item, weight) {
      if (this.items.hasOwnProperty(item)) {
         return new Error("Item already exists!");
      }

      this.items[item] = weight;
   }
   removeItem(item) {
      if (!this.items.hasOwnProperty(item)) {
         return new Error("Item does not exist!");
      }

      delete this.items[item];
   }
   listItems() {
      console.table(this.items);
   }
   getRandom() {
      let totalWeight = 0;
      for (const weight of Object.values(this.items)) {
         totalWeight += weight;
      }
      
      const itemWeight = randomInt(0, totalWeight) + 1;
      let currentWeight = 0;
      for (const item of Object.entries(this.items)) {
         currentWeight += item[1];
         if (itemWeight <= currentWeight) {
            return item[0];
         }
      }
   }
}



/***** COOKIE STUFF *****/
class CookieObjectManager {
   constructor(name, obj, prop) {
      this.name = name;
      this.obj = obj;
      this.prop = prop;
      this.set();
   }
   set() {
      // If the value of the cookie is not set, make it a default value.
      if (getCookie(this.name) === '') {
         let newCookie = '';
         Object.keys(this.obj).forEach(() => newCookie += '0');
         setCookie(this.name, newCookie, 31);
      }
      // Set the values of the supplied object
      Object.keys(this.obj).forEach((propName, idx) => {
         this.obj[propName][this.prop] = parseInt(getCookie(this.name).split('')[idx]) === 0 ? false : true;
      });
   }
   update() {
      let newCookie = '';
      for (const item of Object.values(this.obj)) {
         newCookie += item[this.prop] ? '1' : '0';
      }
      setCookie(this.name, newCookie, 31);
   }
}

const cookies = {};
const LoadData = () => {
   cookies.unlockedMalware = new CookieObjectManager('unlockedMalware', popupData, 'unlocked');
   cookies.receivedLetters = new CookieObjectManager('receivedLetters', letters, 'received');
   cookies.openedLetters = new CookieObjectManager('openedLetters', letters, 'opened');
   cookies.unlockedShops = new CookieObjectManager('unlockedShops', blackMarketShops, 'unlocked');
   cookies.unlockedMalware = new CookieObjectManager("unlockedMalware", popupData, "unlocked");

   setSettingsCookie();
   setMiscCookie();
   setOpenedRewards();
   if (typeof Game !== "undefined") {
      setApplicationPositions();
   }
}

const getSettingsCookie = () => {
   const dpp = Game.settings.dpp.toString();
   const progressType = Game.settings.progressType.toString();
   const animatedBGs = Game.settings.animatedBGs ? '1' : '0';
   const rainLetters = Game.settings.rainLetters ? '1' : '0';
   return dpp + progressType + animatedBGs + rainLetters;
}
function setSettingsCookie() {
   if (typeof Game === 'undefined') return;

   // Char 1: DPP (0-9) decimal
   // Char 2: Progress type (1-3)
   // Char 3: Animated BGs (0/1)
   // Char 4: Rain letters (0/1)

   let settingsCookie = getCookie('settings');
   if (settingsCookie === "") {
      settingsCookie = getSettingsCookie();
      setCookie('settings', settingsCookie);
      return;
   }

   settingsCookie.split('').forEach((char, idx) => {
      switch (idx + 1) {
         case 1:
            Game.settings.dpp = parseInt(char);
            break;
         case 2:
            Game.settings.progressType = parseInt(char);
            break;
         case 3:
            const animatedBGs = char === '1' ? true : false;
            Game.settings.animatedBGs = animatedBGs;
            break;
         case 4:
            const rainLetters = char === '1' ? true : false;
            Game.settings.rainLetters = rainLetters;
            break;
         default:
            console.warn(`WARNING! Char ${idx + 1} not found in the settings cookie.`);
      }
   });
}
function updateSettingsCookie() {
   setCookie('settings', getSettingsCookie());
}


function setMiscCookie() {
   if (typeof Game === 'undefined') return;

   // Bit 1: Black market (binary) (0/1 unlocked/locked)
   // Bits 2-3: Lorem Promotion Status (hexadecimal)
   // Bit 4: Job (0 = intern, etc.)

   let miscCookie = getCookie('misc');
   if (miscCookie === "") {
      miscCookie = "0000";
      setCookie('misc', miscCookie);
   }

   const bits = miscCookie.split('');
   bits.forEach((bit, idx) => {
      let promotionHex = "";
      switch (idx + 1) {
         case 1:
            // Black Market
            if (bit === '1') {
               Game.blackMarket.unlockBlackMarket();
            }
            break;
         case 2:
            // Lorem promotion status
            promotionHex += bit;
            break;
         case 3:
            // Lorem promotion status
            promotionHex += bit;
            const quotaIndex = parseInt(promotionHex, 16);
            Game.loremQuota.quotaIdx = quotaIndex;
            
            const quota = loremQuotaData[quotaIndex].requirement;
            Game.loremQuota.setup(quota);
            break;
         case 4:
            const jobIdx = parseInt(bit);
            const jobArr = Object.entries(loremCorpData.jobs);
            const job = jobArr[jobIdx][0];

            Game.loremCorp.setup(job);
            break;
         default:
            console.warn('Bit ' + (idx + 1) + ' not accessed in misc cookie!')
      }
   });
}
function updateMiscCookie() {
   let newCookie = '';

   // Black market
   newCookie += Game.blackMarket.unlocked ? '1' : '0';

   // Lorem quota unlocked
   // newCookie += Game.loremQuota.unlocked ? '1' : '0';

   // Lorem promotion status
   // Find index of current quota
   let quotaIndex = 0;
   for (const quota of Object.values(loremQuotaData)) {
      if (quota.requirement == Game.loremQuota.quota) {
         break;
      }
      quotaIndex++;
   }
   let quotaHex = quotaIndex.toString(16);
   // Add additional 0 if malformed length
   if (quotaHex.length === 1) {
      quotaHex = '0' + quotaHex;
   }
   newCookie += quotaHex;
   console.log(newCookie);

   // Lorem Corp Job
   let jobIndex = -1;
   Object.keys(loremCorpData.jobs).every((position, idx) => {
      if (position === Game.loremCorp.job) {
         jobIndex = idx;
         return false;
      }
      return true;
   });
   newCookie += jobIndex;

   setCookie('misc', newCookie, 31);
}

function setOpenedRewards() {
   if (getCookie("openedRewards") == "") {
      let resultCookie = "";
      Object.keys(letters).forEach(() => resultCookie += "0");
      setCookie("openedRewards", resultCookie, 31);
   }

   Object.keys(letters).forEach((letter, index) => {
      if (letters[letter].rewards != undefined) {
         letters[letter].rewards.opened = parseInt(getCookie("openedRewards").split("")[index]) == 1 ? true : false;
      }
   });
}
function updateOpenedRewardsCookie() {
   let newCookie = "";
   for (const letter of Object.values(letters)) {
      if (letter.rewards == undefined) {
         newCookie += "0";
      } else {
         newCookie += letter.rewards.opened ? "1" : "0";
      }
   }

   setCookie("openedRewards", newCookie, 31);
}

function setApplicationPositions() {
   let cookie = getCookie("applicationPositions");
   if (cookie === "") {
      console.log("SETTING DEFAULT VALUES");
      for (const application of Object.values(applications)) {
         cookie += `${application.id}.0x${topHeight()}*1,`;
      }
      cookie = cookie.substring(0, cookie.length - 1);
      setCookie("applicationPositions", cookie, 30);
   }

   cookie.split(",").forEach(applicationData => {
      const id = parseInt(applicationData.split(".")[0]);
      let currentApplication = null;
      for (const application of Object.values(applications)) {
         if (application.id === id) {
            currentApplication = application;
            break;
         }
      }
      console.log("-==---=--=--=-=-=");
      console.log(`Name: ${currentApplication.name}`);

      const pos = applicationData.split(".")[1].split("x").join("*").split("*");
      console.log(`Position: ${pos[0]}x ${pos[1]}y`);
      currentApplication.position = {
         x: pos[0],
         y: pos[1]
      };

      const vis = parseInt(applicationData.split("*")[1]) === 1 ? true : false;
      if (vis) {
         currentApplication.open(false);
      }
   });
}
function updateApplicationPositions() {
   console.log("updating positions");
   let posStr = "";
   for (const application of Object.values(applications)) {
      console.log(`Name: ${application.name}`);
      const id = application.id;
      const pos = application.position;
      console.log(`pos: ${pos.x}x ${pos.y}y`);
      const x = Math.round(scalePX(pos.x, "vw"));
      const y = scalePX(pos.y - topHeight(), "vh");
      const vis = application.opened ? "1" : "0";

      let newStr = `${id}.${x}x${y}*${vis},`;
      posStr += newStr;
   }
   posStr = posStr.substring(0, posStr.length - 1);
   setCookie("applicationPositions", posStr, 30);
}

function setCookie(cname, cvalue, exdays) {
   if (exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = 'expires=' + d.toGMTString();
   } else {
      var expires = "";
   }
   document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
   var name = cname + '=';
   var decodedCookie = decodeURIComponent(document.cookie);
   var ca = decodedCookie.split(';');
   for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
         c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
         return c.substring(name.length, c.length);
      }
   }
   return '';
}