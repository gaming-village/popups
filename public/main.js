/*
GENERAL HELPER FUNCTIONS
*/
function getElement(elementName) {
   const element = document.querySelector(`#${elementName}`);
   return element;
}
function formatFloat(input) {
   const formattedFloat = Math.round((input + Number.EPSILON) * 100) / 100;
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
      case "vw":
         return 100 / window.innerWidth * px;
      case "vh":
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




/*
COOKIE STUFF
*/
function LoadData() {
   setUnlockedMalware();
   setReceivedMessages();
   setOpenedMessages();
   setReceivedPrompts();
   setOpenedRewards();
   setUnlockedShops();
   setMiscCookie();
}

function setMiscCookie() {
   // Break if in other pages (e.g. Malware Tree)
   if (typeof Game === 'undefined') {
      return;
   }

   // Bit 1: Black market (binary) (0/1 unlocked/locked)
   // Bit 2: Lorem quota unlocked
   // Bits 3-4: Lorem Promotion Status (hexadecimal)
   // Bit 5: Job (0 = intern, etc.)
   

   let miscCookie = getCookie('misc');
   if (miscCookie == '') {
      miscCookie = '00000';
      setCookie('misc', miscCookie);
   }

   const bits = miscCookie.split('');
   bits.forEach((bit, idx) => {
      console.log('bit ' + idx);
      let promotionHex = '';
      switch (idx + 1) {
         case 1:
            // Black Market
            if (bit == '1') {
               Game.blackMarket.unlockBlackMarket();
            }
            break;
         case 2:
            // Lorem quota unlocked

            // (Handled elsewhere)
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
            if (quotaIndex >= Object.keys(loremQuotaData).length) {
               quotaIndex = Object.keys(loremQuotaData).length - 1;
            }
            Game.nextLoremQuota = loremQuotaData[quotaIndex].requirement;
            break;
         case 5:
            const idx = parseInt(bit);
            const jobArr = Object.entries(loremCorpData.jobs);
            Game.loremCorp.job = jobArr[idx][0];
            break;
         default:
            console.warn('Bit not found!')
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

function setReceivedMessages() {
   /*
   Supplies a default value for the received messages cookie if it does not exist.
   Also updates the messages object to the value supplied by the cookie.
   */
   if (getCookie("receivedMessages") == "") {
      let resultCookie = "";
      Object.keys(messages).forEach(() => resultCookie += "0");
      setCookie("receivedMessages", resultCookie, 31);
   }

   Object.keys(messages).forEach((message, index) => {
      messages[message].received = parseInt(getCookie("receivedMessages").split("")[index]) == 0 ? false : true;
   });
}
function updateReceivedMessagesCookie() {
   let newCookie = "";
   for (const message of Object.values(messages)) {
      newCookie += message.received ? "1" : "0";
   }

   setCookie("receivedMessages", newCookie, 31);
}

function setOpenedMessages() {
   if (getCookie("openedMessages") == "") {
      let resultCookie = "";
      Object.keys(messages).forEach(() => resultCookie += "0");
      setCookie("openedMessages", resultCookie, 31);
   }

   Object.keys(messages).forEach((message, index) => {
      messages[message].opened = parseInt(getCookie("openedMessages").split("")[index]) == 1 ? true : false;
   });
}
function updateOpenedMessagesCookie() {
   let newCookie = "";
   for (const message of Object.values(messages)) {
      newCookie += message.opened ? "1" : "0";
   }

   setCookie("openedMessages", newCookie, 31);
}

function setUnlockedShops() {
   if (getCookie("unlockedShops") == "") {
      let resultCookie = "";
      Object.keys(blackMarketShops).forEach(() => resultCookie += "0");
      setCookie("unlockedShops", resultCookie, 31);
   }

   Object.keys(blackMarketShops).forEach((shop, index) => {
      blackMarketShops[shop].unlocked = parseInt(getCookie("unlockedShops").split("")[index]) == 1 ? true : false;
   });
}
function updateUnlockedShopsCookie() {
   let newCookie = "";
   for (const shop of Object.values(blackMarketShops)) {
      newCookie += shop.unlocked ? "1" : "0";
   }

   setCookie("unlockedShops", newCookie, 31);
}

function setOpenedRewards() {
   if (getCookie("openedRewards") == "") {
      let resultCookie = "";
      Object.keys(messages).forEach(() => resultCookie += "0");
      setCookie("openedRewards", resultCookie, 31);
   }

   Object.keys(messages).forEach((letter, index) => {
      console.log(messages[letter].rewards);
      if (messages[letter].rewards != undefined) {
         messages[letter].rewards.opened = parseInt(getCookie("openedRewards").split("")[index]) == 1 ? true : false;
      }
   });
}
function updateOpenedRewardsCookie() {
   let newCookie = "";
   for (const letter of Object.values(messages)) {
      if (letter.rewards == undefined) {
         newCookie += "0";
      } else {
         newCookie += letter.rewards.opened ? "1" : "0";
      }
   }

   setCookie("openedRewards", newCookie, 31);
}

function setReceivedPrompts() {
   if (getCookie("receivedPrompts") == "") {
      let resultCookie = "";
      Object.keys(prompts).forEach(() => resultCookie += "0");
      setCookie("receivedPrompts", resultCookie, 31);
   }

   Object.keys(prompts).forEach((prompt, index) => {
      prompts[prompt].received = parseInt(getCookie("receivedPrompts").split("")[index]) == 1 ? true : false;
   });
}
function updateReceivedPromptsCookie() {
   let newCookie = "";
   for (const prompt of Object.values(prompts)) {
      newCookie += prompt.received ? "1" : "0";
      console.log(newCookie);
   }

   setCookie("receivedPrompts", newCookie, 31);
}

function setUnlockedMalware() {
   /*
   Updates the unlocked malware cookie, supplying a default value if it does not exist.
   */
   let unlockedCookie = getCookie("unlockedMalware");
   if (unlockedCookie == "") {
      let resultCookie = "";
      Object.keys(data).forEach(() => resultCookie += "0");
      unlockedCookie = resultCookie;
      setCookie("unlockedMalware", unlockedCookie, 31);
   }

   Object.entries(data).forEach((popup, index) => {
      popup[1].unlocked = parseInt(unlockedCookie.split("")[index]) == 0 ? false : true;
   });
}

function setCookie(cname, cvalue, exdays) {
   if (exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toGMTString();
   } else {
      var expires = "";
   }
   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
   var name = cname + "=";
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
   return "";
}