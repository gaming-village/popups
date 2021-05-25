const data = {
    microsoftAntivirus: {
        name: "microsoft-antivirus",
        stats: {
            description: "An omen of what to come.",
            special: "",
            points: 2,
            redisplayTime: 20000 + Math.random() * 10000,
            cost: 0.5
        },
        display: {
            top: 0,
            left: 0,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 1,
        from: undefined
    },
    browserError: {
        name: "browser-error",
        stats: {
            description: "Mostly just made to annoy you.",
            special: "Moves around the screen randomly.",
            points: 2,
            redisplayTime: Math.random() * 8000 + 13000,
            cost: 1
        },
        display: {
            top: 7,
            left: 10,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 2,
        from: 1
    },
    rain: {
        name: "rain",
        stats: {
            description: "Designed just in case users don't know their browser has occurred.",
            special: "Leeches 1 point every 2 seconds. When closed, gives back 1.5x what was stolen.",
            points: 1,
            redisplayTime: 60000,
            cost: 2,

            sapAmount: 0.5
        },
        display: {
            top: -5.5,
            left: -10,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 3,
        from: 1
    },
    chunky: {
        name: "chunky",
        stats: {
            description: "The Lord, precursor of His peoples.",
            special: "",
            points: 0,
            redisplayTime: 60000,
            cost: 10
        },
        display: {
            top: -18,
            left: -4,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 4,
        from: 1
    },
    freeIPhone: {
        name: "free-iPhone",
        stats: {
            description: "I wonder how effective these popups actually are...",
            special: "Tries to evade being clicked.",
            points: 3,
            redisplayTime: 35000,
            cost: 5
        },
        display: {
            top: 17,
            left: 4,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 5,
        from: 2
    },
    annualSurvey: {
        name: "annual-survey",
        stats: {
            description: "The survey is cold. Unfeeling. It does not care for your input. It cares only for hard, efficient autonomy.",
            special: "Creates 3-8 error popups when submitted.",
            points: {
                min: 3,
                max: 8
            },
            redisplayTime: 45000,
            cost: 10
        },
        display: {
            top: 10,
            left: -7,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 6,
        from: 1
    },
    adblockBlocker: {
        name: "adblock-blocker",
        stats: {
            description: "Blocks adblockers which block ads.",
            special: "",
            points: 5,
            redisplayTime: 60000,
            cost: 5
        },
        display: {
            top: 9,
            left: -16,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 7,
        from: 6
    },
    luremImpsir: {
        name: "lurem-impsir",
        stats: {
            description: "Progress demands sacrifice.",
            special: "Stops production of lorem ipsum until closed.",
            points: 6,
            redisplayTime: Math.random() * 20000 + 25000,
            cost: 10
        },
        display: {
            top: -1.5,
            left: -17.5,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 8,
        from: 3
    },
    chunkyVirus: {
        name: "chunky-virus",
        stats: {
            description: "Chunky grows angry.",
            special: "Duplicates itself when closed, automatically closes within a time limit when not closed.",
            points: 3,
            redisplayTime: Math.random() * 10000 + 15000,
            cost: 5
        },
        display: {
            top: -27,
            left: -8,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 9,
        from: 4
    },
    visitor: {
        name: "visitor",
        stats: {
            description: "",
            special: "Gives a random reward each appearance.",
            points: undefined,
            redisplayTime: 60000,
            cost: 12
        },
        display: {
            top: -18,
            left: -13,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 10,
        from: 3
    },
    chunkyPlantation: {
        name: "chunky-plantation",
        stats: {
            description: "Chunky's banana plantation.",
            special: "Generates 10-20 bananas which explode into points.",
            points: 0,
            redisplayTime: 45000,
            cost: 15
        },
        display: {
            top: -29,
            left: -0.5,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 11,
        from: 4
    },
    ramDownload: {
        name: "ram-download",
        stats: {
            description: "The first implementation of digital RAM download. Viruses not sold seperately.",
            special: "Takes several seconds to process.",
            points: 8,
            redisplayTime: 30000,
            cost: 35
        },
        display: {
            top: -12,
            left: -18.5,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 12,
        from: 3
    },
    bankDetails: {
        name: "bank-details",
        stats: {
            description: "Your password is not strong enough.",
            special: "Requires precise input to close.",
            points: 20,
            redisplayTime: 45000,
            cost: 50
        },
        display: {
            top: 23,
            left: -4.5,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 13,
        from: 6
    },
    expandinator: {
        name: "expandinator",
        stats: {
            description: "Expande.",
            special: "Expands to fill the screen if not clicked fast enough.",
            points: 30,
            redisplayTime: 40000,
            cost: 55
        },
        display: {
            top: 20,
            left: 15,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 14,
        from: 2
    },
    devHire: {
        name: "dev-hire",
        stats: {
            description: "",
            special: "Shows multiple prompts when you try to close it. Made as a practical joke by the Devil to run the days of aspiring web developers.",
            points: 40,
            redisplayTime: 50000,
            cost: 75
        },
        display: {
            top: 20,
            left: -11.5,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 15,
        from: 6
    },
    clippy: {
        name: "clippy",
        stats: {
            description: "gamer",
            special: "Removes several popups when it appears.",
            points: -20,
            redisplayTime: 30000,
            cost: 40
        },
        display: {
            top: -12,
            left: 7.5,
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 16,
        from: 1
    }
}

const messages = {
   start: {
      title: "A Friendly Introduction",
      from: "Lorem Corp",
      content: `<p>Greetings employee.</p>
      <p>If you have received this letter, you have been successfully integrated into Lorem Corp. You will go to the Generator and begin mining. You will do so until you are told to stop.</p>
      <p>- Lorem Corp</p>`,
      received: false,
      opened: false,
      reference: 1
   },
   motivationalLetter: {
      title: "Motivational Letter",
      from: "Lorem Corp",
      content: `<p>Greetings employees.</p>
      <p>The Motivation Department of Lorem Corp would like to send a reminder that any suspicious activity will result in your immediate termination.</p>
      <p>We have also implemented a Lorem Quota. Those who fail to meet it will be terminated, and their presence expunged.</p>
      <p>- Lorem Corp.</p>`,
      received: false,
      opened: false,
      reference: 2
   },
   greetings: {
      title: "Greetings",
      from: "0b4ma",
      content: `<p>Hello.</p>`,
      received: false,
      opened: false,
      reference: 3
   },
   rumors: {
      title: "Addressing Rumors",
      from: "Lorem Corp",
      content: `<p>Greetings employees.</p>
      <p>It has come to our attention that there have been several fallacious claims of malware-infected computers. Disregard them - our system is perfect and flawless.</p>
      <p>- Lorem Corp.</p>`,
      received: false,
      opened: false,
      reference: 4
   },
   invitation: {
      title: "Invitation",
      from: "blackmarket.org",
      content: `<p>...</p>`,
      rewards: {
         type: "box",
         text: "Black Market",
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            getElement("nav-black-market").classList.remove("hidden");
            setCookie("bm", "true", 31);
         }
      },
      received: false,
      opened: false,
      reference: 5
   }
}

const prompts = {
   admission: {
      title: "Application",
      from: "Lorem Corp",
      content: `
      <p>Welcome new employee.</p>
      <p>Congratulations on your entry into Lorem Corp. You have been supplied with a virtual machine on which to conduct your mining. See the About page for further information.</p>
      <p>You are dispensable and will be removed if you step out of line.</p>
      <p>- Lorem Corp.</p>
      `,
      received: false
   }
}

const blackMarketShops = {
   malware: {
      name: "malware",
      cost: 1,
      unlocked: false,
      clickEvent: () => {
         window.location = "html/malware-tree.html";
      },
      display: {
         title: "Malware",
         description: "Purchase malware to corrupt your device."
      }
   },
   applications: {
      name: "applications",
      cost: 4,
      unlocked: false,
      clickEvent: () => {

      },
      display: {
         title: "Applications",
         description: "Purchase additional programs to aid your cause."
      }
   },
   binaries: {
      name: "binaries",
      cost: 10,
      unlocked: false,
      clickEvent: () => {

      },
      display: {
         title: "Binaries",
         description: "Download binaries to modify how your hardware runs."
      }
   }
};