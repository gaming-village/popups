/*
GENERAL HELPER FUNCTIONS
*/
function getElement(elementName) {
   const element = document.querySelector(`#${elementName}`);
   return element;
}
function formatFloat(float, dp = 2) {
   const mult = Math.pow(10, dp);
   const formattedFloat = Math.round((float + Number.EPSILON) * mult) / mult;
   return formattedFloat;
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



/***** SOUNDS  *****/
class Sound {
   constructor(path) {
      this.audio = new Audio(path);
      this.audio.play();
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
   cookies.receivedMessages = new CookieObjectManager('receivedMessages', letters, 'received');
   cookies.openedMessages = new CookieObjectManager('openedMessages', letters, 'opened');
   cookies.unlockedShops = new CookieObjectManager('unlockedShops', blackMarketShops, 'unlocked');

   setOpenedRewards();
   setMiscCookie();
}


function setMiscCookie() {
   if (typeof Game === 'undefined') return;

   // Bit 1: Black market (binary) (0/1 unlocked/locked)
   // Bit 2: Lorem quota unlocked
   // Bits 3-4: Lorem Promotion Status (hexadecimal)
   // Bit 5: Job (0 = intern, etc.)

   let miscCookie = getCookie('misc');
   if (miscCookie === '') {
      miscCookie = '00000';
      setCookie('misc', miscCookie);
   }

   const bits = miscCookie.split('');
   bits.forEach((bit, idx) => {
      let promotionHex = '';
      switch (idx + 1) {
         case 1:
            // Black Market
            if (bit === '1') {
               Game.blackMarket.unlockBlackMarket();
            }
            break;
         case 3:
            // Lorem promotion status
            promotionHex += bit;
            break;
         case 4:
            // Lorem promotion status
            promotionHex += bit;
            let quotaIndex = parseInt(promotionHex, 16);

            // If index is out of bounds
            const lgh = Object.keys(loremQuotaData).length;
            if (quotaIndex >= lgh) {
               quotaIndex = lgh - 1;
            }
            Game.nextLoremQuota = loremQuotaData[quotaIndex].requirement;
            break;
         case 5:
            // Lorem corp setup
            Game.loremCorp.setup();

            const idx = parseInt(bit);
            const jobArr = Object.entries(loremCorpData.jobs);
            Game.loremCorp.job = jobArr[idx][0];
            break;
         default:
            console.warn('Bit ' + bit + ' not accessed in misc cookie!')
      }
   });
}
function updateMiscCookie() {
   let newCookie = '';

   // Black market
   newCookie += Game.blackMarket.unlocked ? '1' : '0';

   // Lorem quota unlocked
   newCookie += Game.loremQuota.unlocked ? '1' : '0';

   // Lorem promotion status
   // Find index of current quota
   let quotaIndex = 0;
   for (const quota of Object.values(loremQuotaData)) {
      if (quota.requirement == Game.nextLoremQuota) {
         break;
      }
      quotaIndex++;
   }
   let quotaHex = quotaIndex.toString(16);
   // Add additional 0 if malformed length
   if (quotaHex.split('').length == 1) {
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

function setCookie(cname, cvalue, exdays) {
   if (exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = 'expires=' + d.toGMTString();
   } else {
      var expires = '';
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