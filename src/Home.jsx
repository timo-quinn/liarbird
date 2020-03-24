import React from 'react';
import { useSelector } from 'react-redux';
import FileUploader from 'react-firebase-file-uploader';
import {
  // isEmpty,
  isLoaded,
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import Alert from '@material-ui/lab/Alert';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import FormControl from '@material-ui/core/FormControl';
import Dialog from '@material-ui/core/Dialog';
import { DialogContent } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import InputLabel from '@material-ui/core/InputLabel';

// import About from './About';
// import Login from './Login';

import useStyles from './styles';

function Home() {
  const [sampleName, setSampleName] = React.useState('');
  const [uploadProgress, setUploadProgess] = React.useState(0);
  const [showUploadProgress, setShowUploadProgress] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState(undefined);
  const [showEditDeviceDialog, setShowEditDeviceDialog] = React.useState(false);
  const [playbackFrequency, setPlaybackFrequency] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(undefined);
  const classes = useStyles();
  const firebase = useFirebase();
  const firestore = useFirestore();
  const auth = useSelector((state) => state.firebase.auth);
  useFirestoreConnect([{
    collection: 'devices',
    orderBy: ['createdAt', 'desc'],
    storeAs: 'myDevices',
  }, {
    collection: 'samples',
    orderBy: ['createdAt', 'desc'],
    storeAs: 'mySamples',
  }]);
  const samples = useSelector((state) => state.firestore.ordered.mySamples);
  const devices = useSelector((state) => state.firestore.ordered.myDevices);

  const onClickDeleteSample = async (e, sample) => {
    e.preventDefault();
    console.log('onClickDeleteSample');
    setErrorMessage(undefined);
    console.log(sample);
    try {
      await firestore.delete(`samples/${sample.id}`);
      // await firebase.storage().ref('samples').child(sample.filename).delete();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };

  const onCloseAssignSampleDialog = () => {
    console.log('onCloseAssignSampleDialog');

    setShowEditDeviceDialog(false);
    setSelectedDevice(undefined);
  };

  const onClickSelectSample = async (e, device, sample) => {
    e.preventDefault();
    console.log('onClickSelectSample');

    setErrorMessage(undefined);
    try {
      await firestore.update(`devices/${device.id}`, {
        sampleUri: sample.sampleUri,
        sampleName: sample.title,
        sampleFile: sample.filename,
      });
      setShowEditDeviceDialog(false);
      setSelectedDevice(undefined);
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const onSubmitPlaybackFrequency = async (e, device) => {
    e.preventDefault();
    console.log('onSubmitPlaybackFrequency');
    setErrorMessage(undefined);
    try {
      if (Number.isNaN(playbackFrequency)) {
        setErrorMessage('Please provide a valid number and try again.');
      } else if (parseInt(playbackFrequency) < 1) {
        setErrorMessage('Please provide a positive whole number.');
      } else if (parseInt(playbackFrequency) > 1440) {
        setErrorMessage('Please provide a number smaller than a whole day');
      } else {
        await firestore.update(`devices/${device.id}`, {
          playbackFrequency: playbackFrequency,
        });
        setShowEditDeviceDialog(false);
        setSelectedDevice(undefined);
        setErrorMessage(undefined);
      }
    } catch (error) {
      console.error(error.message);
      setErrorMessage(error.message);
    }
  };

  const onClickEditDevice = (e, device) => {
    e.preventDefault();
    console.log('onClickEditDevice');
    setSelectedDevice(device);
    setPlaybackFrequency(device.playbackFrequency);
    setShowEditDeviceDialog(true);
  };

  const onUploadStart = () => {
    console.log('onUploadStart');
    setShowUploadProgress(true);
    setUploadProgess(0);
  };

  const onProgress = (progress) => {
    setUploadProgess(progress);
  };

  const onUploadError = (error) => {
    console.log('onUploadError');
    setShowUploadProgress(false);
    console.error(error);
    setErrorMessage(error.message);
  };

  const onUploadSuccess = async (filename) => {
    setErrorMessage(undefined);
    try {
      const url = await firebase.storage().ref("samples").child(filename).getDownloadURL();
      await firebase.storage().ref('samples').child(filename).updateMetadata({ customMetadata: { 'name': sampleName }});
      console.log(url);
      // create a new sample firestore record with the url and name
      await firestore.add('samples', {
        title: sampleName,
        filename,
        createdAt: Date.now(),
        sampleUri: url,
      })
      setSampleName('');
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }

    setUploadProgess(0);
    setShowUploadProgress(false);
  };

  if (!isLoaded(auth)) {
    return (
      <div className={classes.root}>
        {/* <StaticMenu /> */}
        <Container maxWidth="md">
          <Card
            style={{ textAlign: 'center' }}
            className={classes.card}
          >
            <CircularProgress />
            <Typography variant="h6" gutterBottom>
              Loading...
            </Typography>
          </Card>
        </Container>
        {/* <PageFooter classes={classes} /> */}
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography variant="h2" component="h1">
              <b>LIARBIRD</b>
            </Typography>
            <Typography variant="h5" component="p" gutterBottom className={classes.subtitle}>
              FIELD PLAYBACK SYSTEM
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h2" gutterBottom>
              <b>Registered Devices</b>
            </Typography>
            <Typography variant="body1" component="p">
              Please note that the devices won't pick up any changes until they are restarted whilst connected to the internet.
            </Typography>
          </Grid>
          {devices && devices.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="warning">
                No Devices Registered Yet
              </Alert>
            </Grid>
          )}
          {devices && devices.map((device) => (
            <Grid item xs={12} sm={6} md={4} key={device.id}>
              <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {device.uid}
                </Typography>
                {device.createdAt ? (
                  <Typography variant="body2" component="p">
                    Registered: {new Date(device.createdAt).toDateString()} {new Date(device.createdAt).toLocaleTimeString()}
                  </Typography>
                ) : (
                  <Typography variant="body2" component="p">
                    Registered: <b>Never</b>
                  </Typography>
                )}
                <Typography variant="body2" component="p">
                  {device.checkedIn ? (
                    `Last Seen: ${new Date(device.checkedIn).toDateString()} ${new Date(device.checkedIn).toLocaleTimeString()}`
                  ) : (
                    `Last Seen: Never!`
                  )}
                </Typography>
                <Typography variant="body2" component="p">
                  {device.sampleName ? (
                    `Sample: ${device.sampleName}`
                  ) : (
                    `Sample: No Sample Assigned!`
                  )}
                </Typography>
                  <Typography variant="body2" component="p">
                    {device.playbackFrequency ? (
                      `Frequency: ${device.playbackFrequency}`
                    ) : (
                      'Frequency: 10'
                    )}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={(e) => onClickEditDevice(e, device)}
                  color="primary"
                >
                  Edit Device
                </Button>
              </CardActions>
            </Card>
          </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant="h4" component="h2">
              <b>Audio Samples</b>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" component="h3">
              <b>Saved Samples</b>
            </Typography>
            <Typography variant="subtitle1" component="p">
              Manage all current samples.
            </Typography>
          </Grid>
          {samples && samples.length === 0 && (
            <Grid item xs={12}>
              <Alert severity="warning">
                No Samples Uploaded Yet
              </Alert>
            </Grid>
          )}
          {samples && samples.map((sample) => (
            <Grid item xs={12} sm={6} md={4} key={sample.id}>
              <Card className={classes.card}>
              <CardContent>
                <Typography variant="h5" component="h2">
                  {sample.title}
                </Typography>
                <Typography variant="body2" component="p">
                  <i>{sample.filename}</i>
                </Typography>
                <Typography variant="body2" component="p">
                  Uploaded: {new Date(sample.createdAt).toDateString()} {new Date(sample.createdAt).toLocaleTimeString()}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={(e) => onClickDeleteSample(e, sample)}
                  color="secondary"
                >
                  Delete Sample
                </Button>
              </CardActions>
            </Card>
          </Grid>
          ))}
          {errorMessage && (
            <Grid item xs={12}>
              <Alert severity="error">
                {errorMessage}
              </Alert>
            </Grid>
          )}
          <Grid item xs={12}>
            <Typography variant="h5" component="h3">
              <b>Upload New Sample</b>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" component="p">
              Specify a name for the sample and then choose the .mp3 file to upload.
            </Typography>
            <form className={classes.formFields} noValidate autoComplete="off">
              <TextField
                label="New Sample Name"
                margin="normal"
                fullWidth
                required
                variant="filled"
                value={sampleName}
                onChange={(e) => setSampleName(e.target.value)}
              />
              {sampleName && (
                <FormControl>
                  <FileUploader
                    id="upload-input"
                    accept=".mp3"
                    name="sample"
                    randomizeFilename
                    storageRef={firebase.storage().ref("samples")}
                    onUploadStart={onUploadStart}
                    onUploadError={onUploadError}
                    onUploadSuccess={onUploadSuccess}
                    onProgress={onProgress}
                  />
                </FormControl>
              )}
              {showUploadProgress && (<LinearProgress variant="determinate" value={uploadProgress} />)}
            </form>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="overline" display="block" gutterBottom>
              &copy; 2020 Matt Chaumont &amp; Timothy Quinn
            </Typography>
          </Grid>
        </Grid>
      </Container>

      {selectedDevice && (
        <Dialog
          open={showEditDeviceDialog}
          onClose={onCloseAssignSampleDialog}
        >
          <DialogContent>
            <Typography variant="h4" component="h1">
              Editing {selectedDevice && (selectedDevice.uid)}
            </Typography>
            <Typography variant="body1" component="p">
              Select a Sample:
            </Typography>
            <List component="nav" aria-label="samples">
              {samples && samples.map((sample) => (
                <ListItem
                  button
                  key={sample.id}
                  onClick={(e) => onClickSelectSample(e, selectedDevice, sample)}
                  selected={selectedDevice.sampleFile === sample.filename}
                >
                  <ListItemText primary={sample.title} secondary={sample.filename} />
                </ListItem>
              ))}
            </List>
          <DialogContent>
          </DialogContent>
            
            <Typography variant="body1" component="p">
              Set Playback Frequency (in Minutes):
            </Typography>
            <form onSubmit={(e) => onSubmitPlaybackFrequency(e, selectedDevice)}>
              <TextField
                label="Playback Frequency"
                placeholder="10"
                margin="dense"
                fullWidth
                variant="standard"
                value={playbackFrequency}
                onChange={(e) => setPlaybackFrequency(e.target.value)}
              />
              <Button
                type="submit"
                color="primary"
                variant="contained"
              >
                Save Frequency
              </Button>
            </form>
            {errorMessage && (
              <Alert severity="error">
                {errorMessage}
              </Alert>
            )}

          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Home;
