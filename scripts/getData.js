let request = require("request");
require('dotenv').config();
const fs = require('fs');

let options = {
    method: 'GET',
    url: 'https://www.dallasopendata.com/resource/9fxf-t2tr.json',
    headers:
        {
            'cache-control': 'no-cache'
        }
};

request(options, function (error, response, incidents) {
    if (error) throw new Error(error);
    else {
        // console.log("Body: ", incidents);
    }
});



async function getData() {

    console.log("RUNNING....");


    await request(options, function (error, response, body) {
        if (error) throw new Error(error);
        else {
            // console.log(body);
            writeFile(body);
        }
    });

}

async function writeFile (data){
    fs.writeFile(`../data/activeCalls.json`, data, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
}

/***************************************************************/

getData().catch();


module.exports = getData;




