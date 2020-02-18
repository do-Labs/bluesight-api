const NodeGeocoder = require('node-geocoder');
const activeCalls = require('../data/activeCalls');

const geocoderApiKey = process.env.GEOCODER_APIKEY;

const options = {
    method: 'GET',
    url: 'https://www.dallasopendata.com/resource/9fxf-t2tr.json',
    provider: 'mapquest',
    httpAdapter: 'https', // Default
    apiKey: geocoderApiKey,
    formatter: null         // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

async function getActiveCalls(){
    // console.log("sample:", sample);
    return activeCalls
}

function count(inputs){
    let counter = 0;
    for (const obj of inputs) {
        if (obj.incident_number != null) counter += 1;
    }
    return counter
}

function getAddress(input){
   const address = input.block + " " + input.location;
   // console.log(address);
   return address
}

function getCoords(address){
    geocoder.geocode(address)
        .then(function(res) {
            console.log("COORDS:" , res);
        })
        .catch(function(err) {
            console.log(err);
        });
}

//  MAIN
async function getCoordinates() {
    console.log("RUNNING....");
    const incidents = await getActiveCalls().then(async (res)=> {
        return res
    });

    const length = count(incidents);
    await console.log("length:", length);

    for (let i = 0; i < length; i++) {
        const address = getAddress(activeCalls[i]);
        const coords = await getCoords(address);
        await console.log("address:", address);
        await console.log("coords:", coords)
    }
}

/***************************************************************/


getCoordinates().catch((err)=> {
    console.log("Error getting coordinates: ", err)
});

module.exports = getCoordinates;