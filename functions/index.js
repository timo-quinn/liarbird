const functions = require('firebase-functions');
const admin = require('firebase-admin');

// const authKey = functions.config().deviceAuthKey;
const authKey = '12345';

const generateId = (length) => {
  var toReturn = '';
  var chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; // base58
  var charLength = chars.length;
  for (var i = 0; i < length; i++) {
      toReturn += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return toReturn;
};

exports.registerDevice = functions.https.onRequest((request, response) => {
  // auth check
  if (!request.body) {
    return response.status(412).end();
  }
  if (request.body && request.body.authKey !== authKey) {
    return response.status(401).end();
  }

  const newId = generateId(6);
  // check the payload for sufficient info
  // generate a unique device id for it
  // add the record to the database
  admin.firestore().collection('devices')
    .add({
      uid: newId,
      createdAt: Date.now(),
    })
    .then(() => {
      // return the device id to the device for it to store in itself
      return response.status(200).send({ uid: newId });
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).end();
    });
});

exports.getConfiguration = functions.https.onRequest((request, response) => {
  // auth check
  if (!request.body) {
    return response.status(412).end();
  }
  if (request.body && request.body.authKey !== authKey) {
    return response.status(401).end();
  }
  
  // check the payload for sufficient info
  // look for device record
  // if found, return the configuration data
  // log the timestamp of retrieval
  return response.status(200).end();
});

exports.phoneHome = functions.https.onRequest((request, response) => {
  // auth check
  if (!request.body) {
    return response.status(412).end(); // failed precondition
  }
  if (request.body && request.body.authKey !== authKey) {
    return response.status(401).end(); // unauthorized
  }
  admin.firestore().collection('devices')
    .where('uid', '==', request.body.uid)
    .limit(1)
    .get((querySnapshot) => {
      if (querySnapshot) {
        return response.status(412).end(); // failed precondition
      } else {
        let docId = undefined;
        querySnapshot.forEach((doc) => {
          docId = doc.id;
        });
        return admin.firestore().collection('devices').doc(docId).update({ checkedIn: Date.now() })
      }
    })
    .then(() => {
      return response.status(200).end();
    })
    .catch((error) => {
      console.error(error);
      return response.status(500).end(); // unknown error
    })
});
