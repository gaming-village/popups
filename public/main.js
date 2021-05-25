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
function randomInt(min, max, inclusive) {
   inclusive = inclusive || false;
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