const {Firestore} = require('@google-cloud/firestore');
const firestore = new Firestore();



const data = {};


async function writeData(data) {
    await firestore.collection('activeCalls').doc(data.id).set(data)
        .catch((err) => {
            console.log("err: ", err)
        })
}


//  MAIN  //
async function addData(data) {

    console.log("ADDING DATA...");
    console.log(data);

    // Check if data exists in db  if !exist then create else skip

    // POST data to db
    await writeData(data).catch();

}


/***************************************************************/

addData().catch();


module.exports = addData;