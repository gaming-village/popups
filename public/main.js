/**
 * Gets an HTML element using an ID.
 * @param {string} id The ID of the element.
 * @returns {HTMLElement} The element with the ID.
 */
function getElement(id) {
   const element = document.querySelector(`#${id}`);
   return element;
}

/**
 * Formats a number to a given number of decimal point places.
 * @param {Number} float The number to be formatted.
 * @param {Number} dpp The decimal point places for the formatted number to contain.
 * @returns {Number} The number rounded to the supplied number of decimal point places.
 */
function formatFloat(float, dpp = Game.settings.dpp) {
   const significantFigures = Math.pow(10, dpp);
   const formattedFloat = Math.round((float + Number.EPSILON) * significantFigures) / significantFigures;
   return formattedFloat;
}


function formatProg(current, target, preventOverflow = false) {
   const progressType = Game.settings.progressType;
   let progress = current / target * 100;
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
         return type + formatFloat(current) + "</span>/" + formatFloat(target);
      case 3:
         return formatFloat(current) + "/" + formatFloat(target) + type + " (" + formatFloat(progress) + "%)</span>";
      default:
         console.warn(`WARNING! Progress type "${progressType}"" not found.`);
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
   const first = str.split("")[0].toUpperCase();
   const rest = str.substring(1, str.length);
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
const numToWords = (num, dpp) => {
   if (num === 0) return "zero";

   // If the number is a float
   let decimalPlaces = null;
   if (num % 1 !== 0) {
      const parts = num.toString().split(".");
      num = Number(parts[0]);
      const exp = Math.pow(10, dpp);
      decimalPlaces = Math.round((Number("0." + parts[1]) + Number.EPSILON) * exp) / exp;
      decimalPlaces = decimalPlaces.toString().substring(2, decimalPlaces.toString().length);
   }

   function convertToSections(num) {
      let wordSections = [];
      num.toString().split("").reverse().forEach((letter, idx) => {
         if (idx % 3 === 0) {
            wordSections.unshift(letter);
         } else {
            wordSections[0] = letter + wordSections[0];
         }
      });
      return wordSections;
   }

   const wordSections = convertToSections(num);

   const bigSuffixes = ["thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];
   const units = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
   const teens = ["eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
   const tens = ["ten", "twenty", "thirty", "fourty", "fifty", "sixty", "seventy", "eighty", "ninety"];

   let result = "";
   let i = 0;
   for (let section of wordSections) {
      while (section.length < 3) section = "0" + section;
      const parts = section.split("");

      let newSection = "";
      if (parts[0] !== "0") {
         newSection += units[parseInt(parts[0]) - 1] + " hundred ";
         if (parts[1] !== "0" && parts[2] !== "0") newSection += "and ";
      }
      if (parseInt(parts[1]) === 1 && parseInt(parts[2]) > 0) {
         newSection += teens[parseInt(parts[2]) - 1] + " ";
      } else {
         if (parts[1] !== "0") {
            newSection += tens[parseInt(parts[1]) - 1] + " ";
         }
         if (parts[2] !== "0") {
            newSection += units[parseInt(parts[2]) - 1] + " ";
         }
      }

      const n = wordSections.length - i - 2;
      if (n >= 0) {
         newSection += bigSuffixes[n] + ", ";
      }

      result += newSection;
      i++;
   }

   if (decimalPlaces !== null && decimalPlaces !== 0) {
      result += "point ";
      for (const decimal of decimalPlaces.toString().split("")) {
         if (Number(decimal) === 0) {
            result += "zero ";
         } else { 
            result += units[Number(decimal) - 1] + " ";
         }
      }
   }

   return result;
};
const numToSuffix = (num, dpp) => {
   const bigSuffixes = ["million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion"];

   const n = Math.floor((Math.floor(num).toString().length - 1) / 3);
   if (n >= 2) {
      const suffix = bigSuffixes[n - 2];
      const newNum = num / Math.pow(1000, n);
      const exp = Math.pow(10, dpp);
      const roundedNum = Math.round((newNum + Number.EPSILON) * exp) / exp;
      return `${roundedNum} ${suffix}`;
   } else {
      return num.toLocaleString();
   }
};
const numToLetter = (num, dpp) => {
   const letters = ["m", "b", "t", "q", "Q", "s", "S", "o", "n", "d"];

   const n = Math.floor((Math.floor(num).toString().length - 1) / 3);
   if (n >= 2) {
      const suffix = letters[n - 2];
      const newNum = num / Math.pow(1000, n);
      const exp = Math.pow(10, dpp);
      const roundedNum = Math.round((newNum + Number.EPSILON) * exp) / exp;
      return roundedNum + suffix;
   } else {
      return num.toLocaleString();
   }
};
function formatNum(num) {
   const dpp = Number(Game.settings.list.decimalPointPrecision.value);
   const displayType = Number(Game.settings.list.displayType.value) + 1;

   /*
    * (1) Standard: 1.23 million
    * (2) Letter: 1.23m
    * (3) Scientific Notation: 1.23e6
    * (4) Decimal: 1,230,000
    * (5) Words: One million, two hundred and thirty thousand
   */

  switch (displayType) {
      case 1:
         return numToSuffix(num, dpp);
      case 2:
         return numToLetter(num, dpp);
      case 3:
         return num.toExponential(dpp);
      case 4:
         return num.toLocaleString();
      case 5:
         return numToWords(num, dpp);
      default:
         console.warn(`Unknown display type: "${displayType}".`);
         return null;
  }
}



/*****  SOUNDS  *****/
class Sound {
   constructor({ path, volume = 1 }) {
      this.audio = new Audio(path);

      const masterVolume = parseFloat(Game.settings.list.masterVolume.value / 100);
      this.audio.volume = volume * masterVolume;

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
function LoadData() {
   cookies.unlockedShops = new CookieObjectManager('unlockedShops', blackMarketShops, 'unlocked');
   cookies.unlockedMalware = new CookieObjectManager("unlockedMalware", popupData, "unlocked");

   setMiscCookie();
   if (typeof Game !== "undefined") {
      setApplicationPositions();
   }
}


function setMiscCookie() {
   if (typeof Game === 'undefined') return;

   // Bit 1: Black market (binary) (0/1 unlocked/locked)
   // Bits 2-3: Lorem Promotion Status (hexadecimal)
   // Bit 4: Job (0 = intern, etc.)
   // Bits 5-6: Background image (generator)

   let miscCookie = getCookie("misc");
   const MISC_COOKIE_LENGTH = 6;
   if (miscCookie === "") {
      miscCookie = "0".repeat(MISC_COOKIE_LENGTH);
      setCookie('misc', miscCookie);
   }

   const bits = miscCookie.split('');
   let promotionHex = "";
   let currentBackgroundImage = "";
   bits.forEach((bit, idx) => {
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
         case 5:
            currentBackgroundImage += bit;
            break;
         case 6:
            currentBackgroundImage += bit;
            Game.startMenu.applications["menu-preferences"].currentBackgroundImage = parseInt(currentBackgroundImage);
            break;
         default:
            console.warn('Bit ' + (idx + 1) + ' not accessed in misc cookie!')
      }
   });
}
function updateMiscCookie() {
   let newCookie = "";

   // Black market
   newCookie += Game.blackMarket.unlocked ? '1' : '0';

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

   let currentBackgroundImage = Game.startMenu.applications["menu-preferences"].currentBackgroundImage.toString();
   if (currentBackgroundImage.length === 1) {
      currentBackgroundImage = "0" + currentBackgroundImage;
   }
   newCookie += currentBackgroundImage;

   setCookie("misc", newCookie, 31);
}

function setApplicationPositions() {
   let cookie = getCookie("applicationPositions");
   if (cookie === "") {
      for (const applicationCategory of Object.values(Game.startMenu.applications["menu-application-shop"].applications)) {
         Object.keys(applicationCategory).forEach(() => cookie += "0x0,");
      }
      cookie = cookie.substring(0, cookie.length - 1);
   }

   const applicationPositions = cookie.split(",");
   let i = 0;
   for (const { objID } of Object.values(Game.startMenu.applications["menu-application-shop"].applications)) {
      if (objID === "") return;

      const applicationPosition = applicationPositions[i];
      i++;
      const parts = applicationPosition.split("x");
      const obj = getElement(objID);
      const x = parseFloat(parts[0]),
      y = parseFloat(parts[1]);
      obj.style.left = `${x}px`;
      obj.style.top = `${y}px`;
   }
}
function updateApplicationPositions() {
   let previousCookie = getCookie("applicationPositions");
   if (previousCookie === "") {
      const applicationCount = Object.keys(Game.startMenu.applications["menu-application-shop"].applications).length;
      previousCookie = "0x0,".repeat(applicationCount);
      previousCookie = previousCookie.substring(0, previousCookie.length - 1);
   }

   let newCookie = "";
   let i = 0;
   for (const application of Object.values(Game.startMenu.applications["menu-application-shop"].applications)) {
      const objID = application.objID;
      if (objID === "") {
         newCookie += "0x0,";
         continue;
      }

      const obj = getElement(objID);
      const bounds = obj.getBoundingClientRect();

      const previousCookieSegment = previousCookie.split(",")[i];
      
      if (bounds.y === 0) {
         const x = previousCookieSegment.split("x")[0];
         const y = previousCookieSegment.split("x")[1];
         newCookie += `${x}x${y},`;
         continue;
      }
      
      // const applicationData = applications[objID];
      // const isVisible = applicationData.isOpened ? "1" : "0";
      const x = Math.max(bounds.x, 0);
      const y = Math.max(bounds.y - topHeight(), 0);
      newCookie += `${x}x${y},`;
      i++;
   }
   newCookie = newCookie.substring(0, newCookie.length - 1);
   setCookie("applicationPositions", newCookie);
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


function updateSave() {
   const saveName = "save1";

   // Adapted from Cookie Clicker's system: https://cookieclicker.fandom.com/wiki/Save

   // Each save is organised into the sections outlined below.
   // Each section is seperated by a "|" character.

   // Lorem count, total lorem earned, packet count
   // Employees
   // Received letters, opened letters, opened rewards
   // Settings
   // Owned applications, opened applications
   // Achievements

   let saveData = Game.lorem + "_" + Game.stats.loremEarned + "_" + Game.packets + "|";

   const workers = Object.values(Game.loremCorp.workers);
   for (let i = 0; i < workers.length; i++) {
      const worker = workers[i];
      saveData += worker;
      if (i < workers.length - 1) {
         saveData += "_";
      } else {
         saveData += "|";
      }
   }

   const letterData = Object.values(letters);
   let receivedLettersTotal = 0;
   let openedLettersTotal = 0;
   let openedRewardsTotal = 0;
   for (let i = 0; i < letterData.length; i++) {
      const letter = letterData[i];
      if (letter.isReceived) {
         receivedLettersTotal += Math.pow(2, i);

         if (letter.isOpened) openedLettersTotal += Math.pow(2, i);

         if (letter.rewards !== undefined) {
            if (letter.rewards.isOpened) openedRewardsTotal += Math.pow(2, i);
         }
      }
   }
   saveData += receivedLettersTotal + "_" + openedLettersTotal + "_" + openedRewardsTotal + "|";

   const settings = Object.values(Game.settings.list);
   for (let i = 0; i < settings.length; i++) {
      const setting = settings[i];
      if (setting.type === "range" || setting.type === "select") {
         saveData += setting.value;
      } else if (setting.type === "checkbox") {
         saveData += setting.value ? "1" : "0";
      }

      if (i < settings.length - 1) {
         saveData += "_";
      } else {
         saveData += "|";
      }
   }

   let ownedApplicationsTotal = 0;
   let openedApplicationsTotal = 0;
   const applicationReferences = Object.values(Game.startMenu.applications["menu-application-shop"].applications);
   for (let i = 0; i < applicationReferences.length; i++) {
      const application = applicationReferences[i];
      if (application.owned) ownedApplicationsTotal += Math.pow(2, i);
      if (applications.hasOwnProperty(application.objID) && applications[application.objID].isOpened) openedApplicationsTotal += Math.pow(2, i);
   }
   saveData += ownedApplicationsTotal + "_" + openedApplicationsTotal + "|";

   let unlockedAchievementsTotal = 0
   const achievements = Game.achievements.getAchievements();
   for (const achievement of achievements) {
      if (achievement[1].unlocked) {
         unlockedAchievementsTotal += Math.pow(2, achievement[1].id - 1);
      }
   }
   saveData += unlockedAchievementsTotal + "|";

   setCookie(saveName, saveData);

   console.log(saveData);
}

function ReadSaveData() {
   const saveName = "save1";
   const saveData = getCookie(saveName);
   return saveData;
}

function GetDefaultSaveData() {
   // Lorem count, total lorem earned, packet count
   let saveData = "0_0_0|";

   // Employees
   const employeeNames = Object.keys(loremCorpData.jobs);
   for (let i = 0; i < employeeNames.length; i++) {
      saveData += "0";
      if (i < employeeNames.length - 1) {
         saveData += "_";
      } else {
         saveData += "|";
      }
   }

   // Received letters, opened letters, opened rewards
   saveData += "0_0_0|";

   // Settings
   const settings = Object.values(Game.settings.list);
   for (let i = 0; i < settings.length; i++) {
      const setting = settings[i];

      if (setting.type === "range" || setting.type === "select") {
         saveData += setting.defaultValue;
      } else if (setting.type === "checkbox") {
         saveData += setting.defaultValue === true ? "1" : "0";
      }
      
      if (i < settings.length - 1) {
         saveData += "_";
      } else {
         saveData += "|";
      }
   }

   // Owned applications, opened applications
   let ownedApplicationsTotal = 0;
   let openedApplicationsTotal = 0;
   const applicationData = Object.entries(Game.startMenu.applications["menu-application-shop"].applications);
   for (let i = 0; i < applicationData.length; i++) {
      const application = applicationData[i];
      if (application[1].isDefaultApplication) {
         ownedApplicationsTotal += Math.pow(2, i);
      }
      
      const DEFAULT_VISIBLE_APPLICATIONS = ["loremCounter"];
      if (DEFAULT_VISIBLE_APPLICATIONS.includes(application[0])) {
         openedApplicationsTotal += Math.pow(2, i);
      }
   }
   saveData += ownedApplicationsTotal + "_" + openedApplicationsTotal + "|";

   // Achievements
   saveData += "0|";

   return saveData;
}