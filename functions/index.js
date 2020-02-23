const functions = require('firebase-functions');

exports.registerDevice = functions.https.onRequest((request, response) => {
  // check the payload for sufficient info
  // generate a unique device id for it
  // add the record to the database
  // return the device id to the device for it to store in itself
});
