const NodeGeocoder = require('node-geocoder');
let request = require("request");
const sample = require('../data/sample');
const activeCalls = require('../data/activeCalls');

const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();
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
    await request(options, function (error, response, activeCalls) {
        if (error) throw new Error(error);
        else {
            // console.log("activeCalls: ", activeCalls)
            return activeCalls
        }
    });
}

async function getSampleActiveCalls(){
    await request(options, function (error, response, activeCalls) {
        if (error) throw new Error(error);
        else {
            // console.log("activeCalls: ", activeCalls)
            return activeCalls
        }
    });
    return sample
}

async function getFromFileActiveCalls(){
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
    if(!input.block){
        return "XXXX " + input.location
    }
    return address
}

async function getCoords(address){
    await geocoder.geocode(address)
        .then(function(res) {
            // console.log("COORDS:" , res);
            const coords = {
                latitude: res[0].latitude,
                longitude: res[0].longitude,
            };
            // console.log("Infunc:", coords);
            return coords
        })
        .catch(function(err) {
            console.log(err);
        });
}

async function setEmergency(activeCall){
}

async function writeData(data){
    await firestore.collection('activeCalls').doc(data.id).set(data)
        .catch((err)=> {
            console.log("err: ", err)
    })
}


//  MAIN LOOP
async function ingest() {
    const outputList = [];
    const header = "ID  \t\t Address:   \t\t Lat: \t Lon: ";

    // Get Data
    const data = await getFromFileActiveCalls().then(async (res)=> {
        return res
    }).catch((err)=> {
        console.log("Error: ", err)
    });


    // Get data length
    const length = count(data);
    await console.log(header);

    // For Each
    for (let i = 0; i < length; i++) {

        // Get addresses and coordinates
        const address = getAddress(data[i]);
        const coordinates = await geocoder.geocode(address , function(err, res) {
            const obj = {
                longitude: res[0].longitude,
                latitude: res[0].latitude,
            };
            return obj;
        });
        await console.log(data[i].incident_number, "\t", address, "\t", coordinates[0].latitude, "\t", coordinates[0].longitude);

        // Assemble output object
        const dataOutput =
            {
                // raw: sample[i],
                id: data[i].incident_number,
                timeStamp: data[i].date_time,
                incident: {
                    status: data[i].status,
                    nature: data[i].nature_of_call,
                    priority: data[i].priority,
                    respondingUnit: data[i].unit_number,
                    reportingArea: data[i].reporting_area,
                    beat: data[i].beat,
                },
                location: {
                    address: address,
                    division: data[i].division,
                    coordinates: {
                        latitude: coordinates[0].latitude,
                        longitude: coordinates[0].longitude,
                    }
                }
            };

        // Check if data exists in db  if !exist then create else skip

        // POST data to db
        await writeData(dataOutput)
            .catch((err)=> {
                console.log("err writing to db: ", err)
            });
        // outputList.push(dataOutput);
    } // End Loop
}


/***************************************************************/

if (require.main === module) {
    ingest().catch()

    // setInterval(function(){
    //     run().catch()
    // }, 10000);

}