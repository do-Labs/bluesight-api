const NodeGeocoder = require('node-geocoder');


const geocoderApiKey = process.env.GEOCODER_APIKEY;

const address = "1601 Elm St. Dallas, Tx";

const options = {
    provider: 'mapquest',
    // Optional depending on the providers
    httpAdapter: 'https', // Default
    apiKey: geocoderApiKey,
    formatter: null         // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

geocoder.geocode(address , function(err, res) {
    const coords = {
        longitude: res[0].longitude,
        latitude: res[0].latitude,
    };
    console.log(coords);
});

// // Or using Promise
// geocoder.geocode('29 champs elysée paris')
//     .then(function(res) {
//         console.log(res);
//     })
//     .catch(function(err) {
//         console.log(err);
//     });


// Batch geocode

// geocoder.batchGeocode(['13 rue sainte catherine', 'another adress'], function (err, results) {
//     // Return an array of type {error: false, value: []}
//     console.log(results) ;
// });
