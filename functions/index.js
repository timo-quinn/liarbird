const admin = require('firebase-admin');
const functions = require('firebase-functions');
if (!admin.apps.length) { admin.initializeApp(functions.config().firebase); }
const authKey = functions.config().device.authkey;

const generateId = (length) => {
  var toReturn = '';
  var chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'; // base58
  var charLength = chars.length;
  for (var i = 0; i < length; i++) {
      toReturn += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return toReturn;
};

exports.registerDevice = functions.https.onRequest(async (request, response) => {
  // auth check
  if (!request.body) {
    return response.status(412).end();
  }
  if (request.body && request.body.authKey !== authKey) {
    console.log(request.body);
    return response.status(401).end();
  }

  const newId = generateId(6);
  // check the payload for sufficient info
  // generate a unique device id for it
  // add the record to the database
  try {
    await admin.firestore().collection('devices').add({ uid: newId, createdAt: Date.now() });

    return response.status(200).send({ uid: newId });
  } catch (error) {
    console.error(error);
    return response.status(500).end(); // unknown error
  }
});

exports.getConfiguration = functions.https.onRequest(async (request, response) => {
  // auth check
  if (!request.body) {
    return response.status(412).end();
  }
  if (request.body && !request.body.uid) {
    console.log(request.body);
    return response.status(412).end();
  }
  if (request.body && request.body.authKey !== authKey) {
    console.log(request.body);
    return response.status(401).end();
  }

  try {
    const querySnapshot = await admin.firestore().collection('devices').where('uid', '==', request.body.uid).limit(1).get();
    console.log(querySnapshot);
    if (querySnapshot.empty) {
      return response.status(412).end(); // failed precondition
    } else {
      let docData;
      querySnapshot.forEach(async (doc) => {
        console.log(doc.id);
        docData = doc.data();
        await admin.firestore().collection('devices').doc(doc.id).set({ checkedIn: Date.now() }, { merge: true });
      });
      return response.status(200).send(docData);
    }
  } catch (error) {
    console.error(error);
    return response.status(500).end(); // unknown error
  }
});
