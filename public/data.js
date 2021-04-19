const data = {
    microsoftAntivirus: {
        name: "microsoft-antivirus",
        stats: {
            description: "An omen of what to come.",
            special: "",
            points: 1,
            redisplayTime: Math.random() * 10000 + 20000,
            cost: ""
        },
        display: {
            top: "2em",
            left: "50%",
            transform: "translateX(-50%)",
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
            cost: 15
        },
        display: {
            top: "7em",
            left: "35%",
            transform: "translateX(-50%)",
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
            cost: 20,

            sapAmount: 0.5
        },
        display: {
            top: "14em",
            left: "52.5%",
            transform: "translateX(-50%)",
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
            // redisplayTime: 2000,
            cost: 101
        },
        display: {
            top: "5em",
            left: "68%",
            transform: "translateX(-50%)",
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
            cost: 50
        },
        display: {
            top: "10em",
            left: "20%",
            transform: "translateX(-50%)",
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 5,
        from: 2
    },
    adblockBlocker: {
        name: "adblock-blocker",
        stats: {
            description: "Blocks adblockers which block ads.",
            special: "",
            points: 5,
            redisplayTime: 60000,
            cost: 50
        },
        display: {
            top: "22.5em",
            left: "27.5%",
            transform: "translateX(-50%)",
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 6,
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
            cost: 100
        },
        display: {
            top: "27.5em",
            left: "42.5%",
            transform: "translateX(-50%)",
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 7,
        from: 3
    },
    luremImpsir: {
        name: "lurem-impsir",
        stats: {
            description: "Progress demands sacrifice.",
            special: "Stops production of lorem ipsum until closed.",
            points: 6,
            redisplayTime: Math.random() * 20000 + 25000,
            cost: 100
        },
        display: {
            top: "30em",
            left: "57.5%",
            transform: "translateX(-50%)",
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
            cost: 50
        },
        display: {
            top: "15em",
            left: "77.5%",
            transform: "translateX(-50%)",
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
            points: 0,
            redisplayTime: 60000,
            cost: 120
        },
        display: {
            top: "2em",
            left: "50%",
            transform: "translateX(-50%)",
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 10,
        from: 5
    },
    chunkyPlantation: {
        name: "chunky-plantation",
        stats: {
            description: "Chunky's banana plantation.",
            special: "Generates 10-20 bananas which explode into points.",
            points: 0,
            redisplayTime: 45000,
            cost: 150
        },
        display: {
            top: "2em",
            left: "50%",
            transform: "translateX(-50%)",
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
            special: "",
            points: 8,
            redisplayTime: 30000,
            cost: 350
        },
        display: {
            top: "8em",
            left: "80%",
            transform: "translateX(-50%)",
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 12,
        from: 5
    },
    bankDetails: {
        name: "bank-details",
        stats: {
            description: "",
            special: "",
            points: 20,
            redisplayTime: 45000,
            cost: 500
        },
        display: {
            top: "8em",
            left: "20%",
            transform: "translateX(-50%)",
            imgSrc: "images/popup-schema-icons/rain-icon.png"
        },
        unlocked: false,
        id: 13,
        from: 6
    }
}