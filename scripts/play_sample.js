const fs = require('fs');
const player = require('play-sound')();

let noConfigFile = false;
let frequency = 10;
const sample = 'sample.mp3';

// check if we've already configured the device first
try {
  console.log('reading config')
  const configFile = fs.readFileSync('config.json', 'utf8');
  const config = JSON.parse(configFile);
  if (config.playbackFrequency) { frequency = config.playbackFrequency }
} catch (error) {
  if (error.code === 'ENOENT') {
    noConfigFile = true;
  } else {
    console.error(error.message);
  }
}

if (!noConfigFile) {
  // play the sample immediately
  console.log('playing sample');
  console.log(`frequency: ${frequency}`);
  player.play(sample, (err) => {
    if (err) {
      console.log(`could not play sound: ${err}`);
    }
  })
  // then kick off the interval
  setInterval(() => {
    console.log('playing sample');
    player.play(sample, (err) => {
      if (err) {
        console.log(`could not play sound: ${err}`);
      }
    })
  }, frequency * 60 * 1000);
}
