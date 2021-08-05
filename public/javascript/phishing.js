const Game = {
   tickFunctions: {},
   tick: () => {
      for (const func of Object.values(Game.tickFunctions)) {
         func();
      }
   },
   phishing: {
      thrown: false,
      thrownTime: 0,
      waitingForCatch: false,
      catchable: false,
      throw: async function(pos) {
         if (this.thrown) return;
      
         this.thrown = true;
         this.waitingForCatch = true;
         this.createBobber(pos);
         this.createSplash(pos);

         await this.waitForCatch();

         this.createPath(pos)
         .then(async path => await this.moveFish(path))
         .then(async pos => await this.bob(pos))
         .then(() => console.log("Done!"));
      },
      waitForCatch: () => {
         return new Promise((resolve) => {
            Game.tickFunctions.waitForCatch = () => {
               if (Game.phishing.thrown) {
                  if (Math.random() < 0.005 + 0.005 * (1 + Game.phishing.thrownTime)) {
                     delete Game.tickFunctions.waitForCatch;
                     console.log("Catch found!");
                     resolve();
                  }
                  Game.phishing.thrownTime += 0.1;
               }
            }
         });
      },
      createPath: function(pos) {
         return new Promise((resolve) => {
            const dist = randomInt(300, 400, true);
            let xRel = randomInt(0, dist, true);
            let yRel = Math.sqrt(Math.pow(dist, 2) - Math.pow(xRel, 2));
            xRel *= randomSign();
            yRel *= randomSign();

            const path = [];
            const WAYPOINT_COUNT = 20;
            for (let i = 0; i < WAYPOINT_COUNT; i++) {
               let x = pos.x + xRel * i / WAYPOINT_COUNT;
               let y = pos.y + yRel * i / WAYPOINT_COUNT;
               if (i > 0) {
                  x += randomInt(-7, 7);
                  y += randomInt(-7, 7);
               }
               const currentPos = {
                  x: x,
                  y: y
               };
               path.unshift(currentPos);
               this.createDot(currentPos);
            }

            resolve(path);
         });
      },
      moveFish: (waypoints) => {
         return new Promise(async (resolve) => {
            const fish = document.createElement("fish");
            fish.id = "fish";
            fish.style.left = waypoints[0].x + "px";
            fish.style.top = waypoints[0].y + "px";

            document.body.appendChild(fish);

            const PROG_STEPS_PER_WAYPOINT = 5;
            for (let i = 0; i < waypoints.length - 1; i++) {
               for (let k = 1; k <= PROG_STEPS_PER_WAYPOINT; k++) {
                  await timer(randomInt(10, 60, true));
                  const xDif = waypoints[i + 1].x - waypoints[i].x;
                  const yDif = waypoints[i + 1].y - waypoints[i].y;
                  fish.style.left = waypoints[i].x + xDif * (k / PROG_STEPS_PER_WAYPOINT) + "px";
                  fish.style.top = waypoints[i].y + yDif * (k / PROG_STEPS_PER_WAYPOINT) + "px";
               }
            }

            console.log(waypoints[waypoints.length - 1]);
            resolve(waypoints[waypoints.length - 1]);
         });
      },
      removeFish: () => {
         getElement("fish").remove();

         const dots = document.getElementsByClassName("dot");
         while (dots[0]) dots[0].parentNode.removeChild(dots[0]);
      },
      bob: function(pos) {
         return new Promise((resolve) => {
            const bobber = getElement("bobber");
            bobber.classList.add("bobbing");
            this.catchable = true;

            this.createSplash(pos);
            resolve();

            setTimeout(() => {
               bobber.classList.remove("bobbing");
               this.catchable = false;
               this.removeFish();
         }, 500);
         });
      },
      createDot: (pos) => {
         const dot = document.createElement("div");
         dot.classList.add("dot");
         dot.style.left = pos.x + "px";
         dot.style.top = pos.y + "px";

         document.body.appendChild(dot);
      },
      createBobber: (pos) => {
         const bobber = document.createElement("div");
         bobber.id = "bobber";
         bobber.classList.add("splash");
         bobber.style.left = pos.x + "px";
         bobber.style.top = pos.y + "px";

         document.body.appendChild(bobber);

         setTimeout(() => {
            bobber.classList.remove("splash");
         }, 800);
      },
      createSplash: (pos) => {
         const splash = document.createElement("div");
         splash.id = "splash";
         splash.style.top = pos.y + "px";
         splash.style.left = pos.x + "px";

         document.body.appendChild(splash);

         setTimeout(() => {
            splash.remove();
         }, 1000);
      },
      reel: function(pos) {
         if (!this.thrown) return;

         const bobber = getElement("bobber");
         bobber.classList.add("exit");
         this.thrown = false;

         this.thrownTime = 0;

         setTimeout(() => bobber.remove(), 800);

         if (this.catchable) {

         }
      },
      catch: () => {

      }
   }
};

const handleClick = (clickType, pos) => {
   console.log(clickType);
   if (clickType === 1) {
      // Left click
      Game.phishing.throw(pos);
   } else if (clickType === 2) {
      // Right click
      Game.phishing.reel(pos);
   }
}

// Stop right click from opening that context menu
window.addEventListener("contextmenu", (event) => {
   event.preventDefault();
});

document.addEventListener("mousedown", (event) => {
   event = event || window.event;
   let clickType;
   if ("buttons" in event) {
      clickType = event.buttons;
   } else {
      const button = event.which || event.button;
      clickType = button;
   }
   const pos = {
      x: event.clientX,
      y: event.clientY
   };
   handleClick(clickType, pos);
});

window.onload = () => {
   const TICKS_PER_SECOND = 10;

   setInterval(Game.tick, 1000 / TICKS_PER_SECOND);
}