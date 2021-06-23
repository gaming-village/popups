/*
NOTE:
JUST USED TO TEST ON A LOCALHOST.
*/

const express = require('express');
const app = express();
app.use(express.static(__dirname + '/public'));
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');