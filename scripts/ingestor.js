const NodeGeocoder = require('node-geocoder');
const activeCalls = require('../data/activeCalls');
const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();

const geocoderApiKey = process.env.GEOCODER_APIKEY;


const options = {
    method: 'GET',
    url: 'https://www.dallasopendata.com/resource/9fxf-t2tr.json',
    headers:
        {
            'cache-control': 'no-cache'
        },
    provider: 'mapquest',
    httpAdapter: 'https', // Default
    apiKey: geocoderApiKey,
    formatter: null         // 'gpx', 'string', ...
};
const geocoder = NodeGeocoder(options);

function count(inputs) {
    let counter = 0;
    for (const obj of inputs) {
        if (obj.incident_number != null) counter += 1;
    }
    return counter
}

function getAddress(input) {
    const address = input.block + " " + input.location;
    if (!input.block) {
        return "XXXX " + input.location
    }
    return address
}

function assembleOutput(data, address, coordinates) {

    if (!data.reporting_area){
        data.reporting_area = "XXXX";
        console.log("UPDATED")
    }

    return({
        timeStamp: data.date_time,
        id: data.incident_number,
        incident: {
            incidentId: data.incident_number,
            status: data.status,
            nature: data.nature_of_call,
            priority: data.priority,
            respondingUnit: data.unit_number,
            reportingArea: data.reporting_area,
            beat: data.beat,
        },
        location: {
            address: address,
            division: data.division,
            coordinates: {
                latitude: coordinates[0].latitude,
                longitude: coordinates[0].longitude,
            }
        }
    })

}

async function writeData(data) {
    await firestore.collection('activeCalls').doc(data.id).set(data)
        .catch((err) => {
            console.log("err: ", err)
        })
}

async function getFromFileActiveCalls(){
    return activeCalls
}


//  MAIN SERVICE // *****************
async function ingestor() {
    const outputList = [];
    const header = "ID \t\t Time \t\t\t\t Lat: \t\t Lon: \t\t Address:";

    const data = await getFromFileActiveCalls().then(async (res)=> {
        return res
    }).catch((err)=> {
        console.log("Error: ", err)
    });

    // Get data length
    const length = count(data);

    console.log("length: ", length);
    console.log(header);

    for (let i = 0; i < length; i++) {
        // Reference current address
        const address = getAddress(data[i]);
        // Get Coordinates
        const coordinates = await geocoder.geocode(address, function (err, res) {
            const obj = {
                longitude: res[0].longitude,
                latitude: res[0].latitude,
            };
            return obj;
        });
        await console.log(data[i].incident_number, "\t", data[i].date_time  ,"\t", coordinates[0].latitude, "\t", coordinates[0].longitude, "\t", address);
        // Assemble output object
        const dataOutput = assembleOutput(data[i], address, coordinates);

        // Check if data exists in db  if !exist then create else skip
        // POST data to db
        await writeData(dataOutput).catch();
        outputList.push(dataOutput);
    }
}


/***************************************************************/

ingestor().catch();


module.exports = ingestor;