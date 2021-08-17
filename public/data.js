const popupData = {
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
            cost: 2.5
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
            special: "Leeches 1 lorem every second. When closed, gives back 1.5x what was stolen.",
            points: 1,
            redisplayTime: 60000,
            cost: 5,
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
            special: 'Becomes enraged when closed too many times - appeasement is required.',
            points: 0,
            redisplayTime: 60000,
            cost: 20
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
            points: 4,
            redisplayTime: 35000,
            cost: 7.5
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
            special: "Creates 4-8 error popups when submitted.",
            points: {
                min: 4,
                max: 8
            },
            redisplayTime: 55000,
            cost: 20
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
            cost: 40
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
            cost: 25
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
            cost: 75
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
            cost: 60
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
            cost: 35
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
            cost: 175
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
            description: "Culls the popup population.",
            special: "Removes several popups when it appears.",
            points: 0,
            redisplayTime: 30000,
            cost: 20
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

const letters = {
   start: {
      title: "A Friendly Introduction",
      from: "Lorem Corp",
      content: `<p>Greetings employee.</p>
      <p>If you have received this letter, you have been successfully integrated into Lorem Corp. You will go to the Generator and begin mining.</p>
      <p>If you wish to see your position in the company, see the Corporate Overview tab.</p>
      <p class="from">- Lorem Corp</p>`,
      received: false
   },
   motivationalLetter: {
      title: "Motivational Letter",
      from: "Lorem Corp",
      content: `<p>Greetings employees.</p>
      <p>The Motivation Department of Lorem Corp would like to send a reminder that any suspicious activity will result in your immediate termination.</p>
      <p>We have also implemented a Lorem Quota. Those who meet the quota shall be rewarded.</p>
      <p class="from">- Lorem Corp.</p>`,
      rewards: {
         type: "box",
         text: "Lorem Quota",
         img: "images/coin-icon.png",
         reward: () => {
            Game.loremQuota.unlock();
            updateMiscCookie();
         }
      },
      received: false
   },
   greetings: {
      title: "Greetings",
      from: "0b4m4",
      content: `<p>Hello.</p>
      <p>You may or may not be aware of the malicious past of the corporation Lorem Corp.</p>
      <p>To stop things from getting out of hand, a group called the Black Market had to be created. Our connections have told us that recently Lorem Corp. has begun hiring again, and as we have tracked you as one of their new hires you are critical to our operation.</p>
      <p>You will later receive an invitation to our network.</p>
      <p>Good luck.</p>`,
      received: false
   },
   rumors: {
      title: "Addressing Rumors",
      from: "Lorem Corp",
      content: `<p>Greetings employees.</p>
      <p>It has come to our attention that there have been several fallacious claims of malware-infected computers. Disregard them - our system is perfect and flawless.</p>
      <p class="from">- Lorem Corp.</p>`,
      received: false
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
            Game.blackMarket.unlockBlackMarket();
            updateMiscCookie();
         }
      },
      received: false
   },
   internPromotion: {
      title: 'Promotion',
      from: 'Lorem Corp',
      content: `<p>Greetings Intern.</p>
      <p>It is Lorem Corp's pleasure to announce that you have been promoted from an Intern to an Employee.</p>
      <p>Your annual salary has been increased from $0 to $15.</p>
      <p>You have been given an extra 10 lorem in funding to perhaps acquire an intern in the Corporate Overview tab.</p>
      <p class="from">- Lorem Corp.</p>`,
      rewards: {
         type: 'box',
         text: 'Funding',
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            Game.addLorem(10);
         }
      },
      received: false
   },
   employeePromotion: {
      title: 'Promotion',
      from: 'Lorem Corp',
      content: `<p>Greetings Employee.</p>
      <p>It is Lorem Corp's pleasure to announce that you have been promoted from an Employee to a Lorem Technician.</p>
      <p>Your annual salary has been increased from $15 to $200.</p>
      <p>You have been given an extra 1 lorem in funding - use it wisely.</p>
      <p class="from">- Lorem Corp.</p>`,
      rewards: {
         type: 'box',
         text: 'Funding',
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            Game.addLorem(1);
         }
      },
      received: false
   },
   technicianPromotion: {
      title: 'Promotion',
      from: 'Lorem Corp',
      content: `<p>Greetings Technician.</p>
      <p>It is Lorem Corp's pleasure to announce that you have been promoted from a Lorem Technician to a Manager.</p>
      <p>Your annual salary has been increased from $200 to $2500.</p>
      <p>You have been given an extra 1 lorem in funding - use it wisely.</p>
      <p class="from">- Lorem Corp.</p>`,
      rewards: {
         type: 'box',
         text: 'Funding',
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            Game.addLorem(1);
         }
      },
      received: false
   },
   managerPromotion: {
      title: 'Promotion',
      from: 'Lorem Corp',
      content: `<p>Greetings Manager.</p>
      <p>It is Lorem Corp's pleasure to announce that you have been promoted from a Manager to a Supervisor.</p>
      <p>Your annual salary has been increased from $2500 to $17500.</p>
      <p>You have been given an extra 1 lorem in funding - use it wisely.</p>
      <p class="from">- Lorem Corp.</p>`,
      rewards: {
         type: 'box',
         text: 'Funding',
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            Game.addLorem(1);
         }
      },
      received: false
   },
   supervisorPromotion: {
      title: 'Promotion',
      from: 'Lorem Corp',
      content: `<p>Greetings Supervisor.</p>
      <p>It is Lorem Corp's pleasure to announce that you have been promoted from a Supervisor to an Executive.</p>
      <p>Your annual salary has been increased from $17500 to $52500.</p>
      <p>You have been given an extra 1 lorem in funding - use it wisely.</p>
      <p class="from">- Lorem Corp.</p>`,
      rewards: {
         type: 'box',
         text: 'Funding',
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            Game.addLorem(1);
         }
      },
      received: false
   },
   executivePromotion: {
      title: 'Promotion',
      from: 'Lorem Corp',
      content: `<p>Greetings Supervisor.</p>
      <p>It is Lorem Corp's pleasure to announce that you have been promoted from an Executive to a CEO.</p>
      <p>Your annual salary has been increased from $52500 to $215000.</p>
      <p>You have been given an extra 1 lorem in funding - use it wisely.</p>
      <p class="from">- Lorem Corp.</p>`,
      rewards: {
         type: 'box',
         text: 'Funding',
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            Game.addLorem(1);
         }
      },
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
   minigames: {
      name: "minigames",
      cost: 4,
      unlocked: false,
      clickEvent: () => {
         Game.blackMarket.minigames.open();
      },
      display: {
         title: "Minigames",
         description: "Unlock minigames to upgrade your packet production."
      }
   },
   binaries: {
      name: "binaries",
      cost: 10,
      unlocked: false,
      clickEvent: () => {
         window.location = 'html/binaries.html';
      },
      display: {
         title: "Binaries",
         description: "Download binaries to modify how your hardware runs."
      }
   }
};

const minigames = {
   phishing: {
      name: "Phishing",
      description: "Receive messages from other users.",
      open: () => {
         window.location = "./html/minigames/phishing.html";
      },
      resources: ["chunks", "notoriety", "xp"],
      viruses: {
         worm: {
            name: "WORM",
            displayName: "Worm",
            weight: 100,
            health: 10,
            text: "You have been infected by a <b>Worm</b>!",
            drops: {
               chunks: {
                  amount: [1, 2],
                  chance: 90
               },
               xp: {
                  amount: 2,
                  chance: 100
               },
               glitchedPacket: {
                  amount: 1,
                  chance: 10
               }
            },
            requirements: {
               notoriety: 1
            },
            imgSrc: "../../images/phishing/viruses/worm.png"
         },
         browserHijacker: {
            name: "BROWSER_HIJACKER",
            displayName: "Browser Hijacker",
            weight: 50,
            health: 40,
            text: "A <b>Browser Hijacker</b> has implanted itself in your browser.",
            drops: {
               chunks: {
                  amount: [1, 3],
                  chance: 100
               },
               xp: {
                  amount: 5,
                  chance: 100
               }
            },
            requirements: {
               notoriety: 2
            },
            imgSrc: "../../images/phishing/viruses/browser-hijacker.png"
         },
         trojan: {
            name: "TROJAN",
            displayName: "Trojan",
            weight: 30,
            health: 100,
            text: "Your computer has been invaded by a <b>Trojan</b>!",
            drops: {
               chunks: {
                  amount: [2, 5],
                  chance: 100
               },
               xp: {
                  amount: 10,
                  chance: 100
               }
            },
            requirements: {
               notoriety: 3
            },
            imgSrc: "../../images/phishing/viruses/trojan.png"
         },
         keyLogger: {
            name: "KEY_LOGGER",
            displayName: "Key Logger",
            weight: 20,
            health: 250,
            text: "A <b>Key Logger</b> has been imbedded in the depths of your computer.",
            drops: {
               chunks: {
                  amount: [3, 9],
                  chance: 100
               },
               xp: {
                  amount: 30,
                  chance: 100
               }
            },
            requirements: {
               notoriety: 4
            },
            imgSrc: "../../images/phishing/viruses/key-logger.png"
         },
         fileInfector: {
            name: "FILE_INFECTOR",
            displayName: "File Infector",
            weight: 10,
            health: 1500,
            text: "File Infector",
            drops: {
               chunks: {
                  amount: [5, 11],
                  chance: 100
               },
               xp: {
                  amount: 75,
                  chance: 100
               }
            },
            requirements: {
               notoriety: 5
            },
            imgSrc: "../../images/phishing/viruses/file-infector.png"
         },
         ransomware: {
            name: "RANSOMWARE",
            displayName: "Ransomware",
            weight: 5,
            health: 2500,
            text: "Ransomware",
            drops: {
               chunks: {
                  amount: [6, 14],
                  chance: 100
               },
               xp: {
                  amount: 100,
                  chance: 100
               }
            },
            requirements: {
               notoriety: 6
            },
            imgSrc: "../../images/phishing/viruses/ransomware.png"
         },
         adware: {
            name: "ADWARE",
            displayName: "Adware",
            weight: 3,
            health: 5000,
            text: "Adware",
            drops: {
               chunks: {
                  amount: [9, 15],
                  chance: 100
               },
               xp: {
                  amount: 200,
                  chance: 100
               }
            },
            requirements: {
               notoriety: 8
            },
            imgSrc: "../../images/phishing/viruses/adware.png"
         },
         botnet: {
            name: "BOTNET",
            displayName: "Botnet",
            weight: 2,
            health: 10000,
            text: "Botnet",
            drops: {
               chunks: {
                  amount: [10, 17],
                  chance: 100
               },
               xp: {
                  amount: 300,
                  chance: 100
               }
            },
            requirements: {
               notoriety: 10
            },
            imgSrc: "../../images/phishing/viruses/botnet.png"
         }
      }
   }
};

const dailyIndoctrinationEditions = {
   // HOW IT WORKS:
   // As much of the most current stage of text is generated, and then the remaining space is distributed to the other stages.

   // Default
   1: {
      1: `We would have liked to welcome today's 3782 new employees, however after further investigation it has been found that they are all far too useless to be worth mentioning.`
   },
   // After unlocking a popup
   2: {
      1: `The Lorem Corp. Department of Forensics has found that claims of "malware-infected computers" are false and evil in nature. Disregard further claims.`,
      2: `Breaking news - revolutionary new mining technique claims to increase lorem mining speed by up to 0.01%! The scientists involved have been appropriately awarded with several Nobel Peace prizes each.`,
      3: `Criminal found hoarding lorem from the Corporation for supposed "alernative currencies". The Department of Advanced Rehabilitation has issued him with the death penalty before any further damage could be caused. An investigation has been launched, and is going to find him guilty after 2 weeks.`
   }
};

const loremQuotaData = {
   0: {
      requirement: 30,
      rewardTitle: `Touch typing`,
      rewardText: `Double lorem production per key stroke.`
   },
   1: {
      requirement: 100,
      rewardTitle: `Job listing`,
      rewardText: `Hire a gang of 3 unpaid interns to mine for you.`
   },
   2: {
      requirement: 300,
      rewardTitle: `Antivirus`,
      rewardText: `Automatically remove one popup every 20 seconds.`
   },
   3: {
      requirement: 500,
      rewardTitle: `Ad campaign`,
      rewardText: `Acquire a tribe of 10 interns to mine for you.`
   },
   4: {
      requirement: 1000,
      rewardTitle: `Promotion`,
      rewardText: `Hire `
   },
   5: {
      requirement: 2500,
      rewardTitle: `Massive billboard`,
      rewardText: `Obtain a horde of unpaid interns.`
   },
   6: {
      requirement: 5000,
      rewardTitle: `Antivirus`,
      rewardText: `Automatically remove one popup every 10 seconds.`
   },
   7: {
      requirement: 10000,
      rewardTitle: `Antivirus`,
      rewardText: `Automatically remove one popup every 10 seconds.`
   }
}

const loremCorpData = {
   techTree: {
      row1: {
         betterInterns: {
            description: 'Interns upgrade from Windows 1.0 to Windows 95.',
            effect: '+50% intern production speed.',
            cost: 100,
         }
      },
      row2: {
         rigorousSelection: {
            description: 'More thorough interviews are conducted, leading to better interns.',
            effect: 'Some interns become Good interns.',
            cost: 400
         }
      },
      row3: {
         massHiring: {

         }
      },
      row4: {
         geneticModification: {
            description: 'Interns are genetically modified to produce more lorem.',
            effect: 'Interns produce 1% more per intern.',
         }
      }
   },
   jobs: {
      intern: {
         welcomeText: `<h1>Welcome</h1>
         <p>Greetings worker.</p>
         <p>This is the Corporate Overview, where you can manage your work more effectively.</p>
         <p>Being a puny intern, you are useless and will have no subordinates.</p>
         <p>To rise up the Heirarchy, you must mine more lorem.</p>
         <p>Good luck.</p>`,
         displayText: 'Intern',
         salary: '<span>🤣</span>',
         buttonText: 'Interns',
         requirement: 40,
         stats: {
            loremProduction: 0.2,
         },
         cost: {
            lorem: 10,
            workforce: 1
         },
         upgrades: {
            
         }
      },
      employee: {
         welcomeText: `<h1>Welcome</h1>
         <p>Greetings worker.</p>
         <p>As an employee, you have access to command your lesser Interns.</p>
         <p>As seen on the left-most tab, you are able to command their work by clicking on the 'Intern' button.</p>`,
         displayText: 'Employee',
         salary: '$15',
         buttonText: 'Employees',
         requirement: 250,
         letterName: 'internPromotion',
         stats: {
            loremProduction: 5
         },
         cost: {
            lorem: 250,
            workforce: 3
         },
         upgrades: {
            
         }
      },
      technician: {
         welcomeText: `<h1>Welcome</h1>
         <p>Greetings Lorem Technician.</p>
         <p>You are responsible for the finer details of lorem production, meaning that you are now an integral part of our company.</p>
         <p>You have gained the ability to hire Employees to aid your production.</p>`,
         displayText: 'Technician',
         salary: '$200',
         buttonText: 'Technicians',
         requirement: 1000,
         letterName: 'employeePromotion',
         stats: {
            loremProduction: 50
         },
         cost: {
            lorem: 1000,
            workforce: 5
         },
         upgrades: {
            
         }
      },
      manager: {
         welcomeText: `<h1>Welcome</h1>
         <p>Greetings Manager.</p>
         <p>As one of our more valuable employees, you have access to a variety of subordinates in order to more effectively manage your production.</p>`,
         displayText: 'Manager',
         salary: '$2500',
         buttonText: 'Managers',
         requirement: 5000,
         letterName: 'technicianPromotion',
         stats: {
            loremProduction: 250
         },
         cost: {
            lorem: 5000,
            workforce: 10
         },
         upgrades: {
            
         }
      },
      supervisor: {
         displayText: 'Supervisor',
         salary: '$17500',
         buttonText: 'Supervisors',
         requirement: 30000,
         letterName: 'managerPromotion',
         stats: {
            loremProduction: 1000
         },
         cost: {
            lorem: 30000,
            workforce: 15
         },
         upgrades: {
            
         }
      },
      executive: {
         displayText: 'Executive',
         salary: '$52500',
         buttonText: 'Executives',
         requirement: 100000,
         letterName: 'supervisorPromotion',
         stats: {
            loremProduction: 4000
         },
         cost: {
            lorem: 100000,
            workforce: 25
         },
         upgrades: {
            
         }
      },
      CEO: {
         displayText: 'CEO',
         salary: '$215000',
         welcomeText: `ceo of cring`,
         buttonText: 'CEOs',
         requirement: 250000,
         letterName: 'executivePromotion',
         stats: {
            loremProduction: 10000
         },
         cost: {
            lorem: 250000,
            workforce: 40
         },
         upgrades: {
            
         }
      }
   }
}