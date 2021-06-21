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
            special: "Leeches 1 lorem every second. When closed, gives back 1.5x what was stolen.",
            points: 1,
            redisplayTime: 60000,
            cost: 3.5,

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
            description: "Culls the popup population.",
            special: "Removes several popups when it appears.",
            points: 0,
            redisplayTime: 30000,
            cost: 25
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
      <p>If you have received this letter, you have been successfully integrated into Lorem Corp. You will go to the Generator and begin mining.</p>
      <p>If you wish to see your position in the company, see the Corporate Overview tab.</p>
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
      <p>We have also implemented a Lorem Quota. Those who meet the quota shall be rewarded.</p>
      <p>- Lorem Corp.</p>`,
      rewards: {
         type: "box",
         text: "Lorem Quota",
         img: "images/coin-icon.png",
         reward: () => {
            Game.unlockLoremQuota();
            updateMiscCookie();
         }
      },
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
            Game.blackMarket.unlockBlackMarket();
            updateMiscCookie();
         }
      },
      received: false,
      opened: false,
      reference: 5
   },
   internPromotion: {
      title: 'Promotion',
      from: 'Lorem Corp',
      content: `<p>Greetings Intern.</p>
      <p>It is Lorem Corp's pleasure to announce that you have been promoted from an Intern to an Employee.</p>
      <p>Your annual salary has been increased from $0 to $15.</p>
      <p>You have been given an extra 10 lorem in funding to perhaps acquire an intern in the Corporate Overview tab.</p>
      <p>- Lorem Corp.</p>`,
      rewards: {
         type: 'box',
         text: 'Funding',
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            Game.addLorem(10);
         }
      },
      received: false,
      opened: false,
      reference: 6
   },
   employeePromotion: {
      title: 'Promotion',
      from: 'Lorem Corp',
      content: `<p>Greetings Employee.</p>
      <p>It is Lorem Corp's pleasure to announce that you have been promoted from an Employee to a Lorem Technician.</p>
      <p>Your annual salary has been increased from $15 to $200.</p>
      <p>You have been given an extra 100 lorem in funding - use it wisely.</p>
      <p>- Lorem Corp.</p>`,
      rewards: {
         type: 'box',
         text: 'Funding',
         img: "images/coin-icon.png",
         opened: false,
         reward: () => {
            Game.addLorem(100);
         }
      },
      received: false,
      opened: false,
      reference: 7
   }
}

const prompts = {
   admission: {
      title: "Application",
      from: "Lorem Corp",
      content: `
      <p>Welcome intern.</p>
      <p>Congratulations on your entry into Lorem Corp. You have been supplied with a virtual Windows 95 machine on which to conduct your mining. See the About page for further information.</p>
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
         window.location = 'html/binaries.html';
      },
      display: {
         title: "Binaries",
         description: "Download binaries to modify how your hardware runs."
      }
   }
};

dailyIndoctrinationEditions = {
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
      rewardText: `Gain double lorem per key stroke.`
   },
   1: {
      requirement: 100,
      rewardTitle: `Branching out`,
      rewardText: `Hire an unpaid intern to mine for you.`
   },
   2: {
      requirement: 300,
      rewardTitle: `Antivirus`,
      rewardText: `Automatically remove one popup every 20 seconds.`
   },
   3: {
      requirement: 500,
      rewardTitle: `More interns`,
      rewardText: `Hire a tribe of interns to mine for you.`
   },
   4: {
      requirement: 1000,
      rewardTitle: `Promotion`,
      rewardText: `Hire `
   },
   5: {
      requirement: 2500,
      rewardTitle: `Antivirus`,
      rewardText: `Purchase a lorem generation machine`
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
         requirement: 20,
         stats: {
            loremProduction: 1,
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
         requirement: 50,
         letterName: 'internPromotion',
         stats: {
            loremProduction: 10
         },
         cost: {
            lorem: 140,
            workforce: 3
         },
         upgrades: {
            
         }
      },
      technician: {
         displayText: 'Technician',
         buttonText: 'Technicians',
         requirement: 250,
         letterName: 'employeePromotion',
         stats: {
            loremProduction: 100
         },
         cost: {
            lorem: 610,
            workforce: 1
         },
         upgrades: {
            
         }
      },
      manager: {
         displayText: 'Manager',
         buttonText: 'Managers',
         requirement: 500,
         letterName: 'technicianPromotion',
         stats: {
            loremProduction: 200
         },
         cost: {
            lorem: 1000,
            workforce: 1
         },
         upgrades: {
            
         }
      },
      supervisor: {
         displayText: 'Supervisor',
         buttonText: 'Supervisors',
         requirement: 1000,
         letterName: 'managerPromotion',
         stats: {
            loremProduction: 1000
         },
         cost: {
            lorem: 2300,
            workforce: 1
         },
         upgrades: {
            
         }
      },
      executive: {
         displayText: 'Executive',
         buttonText: 'Executives',
         requirement: 2500,
         letterName: 'supervisorPromotion',
         stats: {
            loremProduction: 10000
         },
         cost: {
            lorem: 7310,
            workforce: 1
         },
         upgrades: {
            
         }
      },
      CEO: {
         displayText: 'CEO',
         welcomeText: `ceo of cring`,
         buttonText: 'CEOs',
         requirement: 10000,
         letterName: 'executivePromotion',
         stats: {
            loremProduction: 100000
         },
         cost: {
            lorem: 31600,
            workforce: 1
         },
         upgrades: {
            
         }
      }
   }
}