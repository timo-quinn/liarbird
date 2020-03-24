const axios = require('axios').default;
const fs = require('fs');

const authKey = ''; // get the auth key out of lastpass, or pull it from the firestore config

let configFileCreated;
let createConfigFile;
let alreadyRegistered;
let config;

// check if we've already configured the device first
try {
  console.log('reading config')
  const configFile = fs.readFileSync('config.json', 'utf8');
  config = JSON.parse(configFile);
  configFileCreated = true;
  if (config.uid) {
    console.log('already registered');
    alreadyRegistered = true;
  } else {
    console.log('not yet registered');
  }
} catch (error) {
  if (error.code === 'ENOENT') {
    createConfigFile = true;
  } else {
    console.error(error.message);
  }
}

// create the config file if it doesn't exist
if (!configFileCreated && createConfigFile) {
  console.log('creating config file');
  try {
    config = {
      uid: undefined,
      createdAt: Date.now(),
    };
    fs.writeFileSync('config.json', JSON.stringify(config), 'utf8');
    configFileCreated = true;
    alreadyRegistered = false;
    console.log('config file created');
  } catch (error) {
    console.log('create config file failed');
    console.error(error.message);
  }
}

// otherwise call the register method, using the authKey
if (!alreadyRegistered) {
  console.log('attempting registration of device');
  axios.post('https://us-central1-liarbird-1df1e.cloudfunctions.net/registerDevice', {
    authKey,
  }).then((response) => {
    if (response.data && response.data.uid) {
      const newUid = response.data.uid;
      console.log(`uid: ${newUid}`);
      config.uid = newUid;
      config.registeredAt = Date.now();
      fs.writeFileSync('config.json', JSON.stringify(config), 'utf8');
      alreadyRegistered = true;
      console.log('device registered with server');
    }
  }).catch((error) => {
    console.error(error.message);
  });
}

// if we're already registered, phone home to show the updated timestamp for the device
if (alreadyRegistered) {
  console.log('phoning home with server');
  axios.post('https://us-central1-liarbird-1df1e.cloudfunctions.net/phoneHome', {
    authKey,
    uid: config.uid,
  }).then((response) => {
    if (response.status === 200) {
      console.log('phoned home successfully');
    }
    console.log('fetching the latest device config');
  // and finally fetch all the latest config for the device
  }).then(() => axios.post('https://us-central1-liarbird-1df1e.cloudfunctions.net/getConfiguration', {
    authKey,
    uid: config.uid,
  }).then((response) => {
    if (response.data) {
      console.log(response.data);
      if (response.data.sampleUri) {
        // we have a sample file to use - download it if it's different
        console.log('sample assigned to device')
        if (config.sampleUri === response.data.sampleUri) {
          console.log('sample has not changed, not downloading it');
        } else {
          console.log('downloading sample');
          const writer = fs.createWriteStream('sample.mp3');
          axios({
            url: response.data.sampleUri,
            method: 'GET',
            responseType: 'stream',
          }).then((resp) => {
              resp.data.pipe(writer); // this will overwrite the file if it already exists
              writer.on('finish', () => {
                console.log('sample file saved to file system');
                config.sampleInstalled = Date.now();
                config.sampleUri = response.data.sampleUri;
                config.sampleName = response.data.sampleName;
                config.sampleFile = response.data.sampleFile;
                config.playbackFrequency = response.data.playbackFrequency;
                fs.writeFileSync('config.json', JSON.stringify(config), 'utf8');
              })
              writer.on('error', () => {
                console.error('error writing sample to file system');
              })
            })
            .catch((error) => {
              console.error(error.message);
            })
        }
        if (config.playbackFrequency !== response.data.playbackFrequency) {
          console.log('playback frequency has changed, updating config');
          config.playbackFrequency = response.data.playbackFrequency;
          fs.writeFileSync('config.json', JSON.stringify(config), 'utf8');
        }
      } else {
        console.warn('no sample assigned to device');
      }
    }
  })).catch((error) => {
    console.error(error.message);
  });
}
