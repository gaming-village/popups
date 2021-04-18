const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

// // app.use(express.json());

// app.get("/", (req, res) => {
//   // res.send("OOGA BOOGA OOGA");
//   console.log("Recieved POST request.");
// });

// app.post("/popupView.html", (req, res) => {
//   // res.send("MEGA GAMING LAD");
//   console.log("Recieved GET request.");
//   console.log(req.body);
//   console.log(req.query);
//   // res.send("A");
// });

app.listen(process.env.port || 3000);

console.log('Running at Port 3000');