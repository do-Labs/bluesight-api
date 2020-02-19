const express = require('express');
const bodyParser = require('body-parser');
const ingestor = require('../scripts/ingestor');
const getData = require('../scripts/getData');
// const addData = require('./scripts/addData');


// const port = process.argv.slice(2)[0];
const port = "8080";
const app = express();
app.use(bodyParser.json());

app.get('/activecalls', async (req, res) => {
    console.log('GET /activecalls');
    await getData();
    await ingestor();
    await res.send('OK \n');
});

app.post('/activecalls', async (req, res) => {
    console.log('POST /activecalls');
    // addData(req.body);
    console.log('done');
    await res.send('200 \n');
});

// List all Endpoints

console.log(`___________Local Endpoints________\n`);
console.log(`curl -i --request GET localhost:${port}/ENDPOINT \n`);
console.log(`GET \tlocalhost:{port}/activecalls`);
console.log(`POST\tlocalhost:{port}/activecalls`);
console.log(`___________________ \n\n\n\n`);


// Wait then Proceed operations
setTimeout(() => console.log('waiting\n'), 50000);
console.log(`BlueSight service listening on port {port}`);



app.listen(port);