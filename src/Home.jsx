import React from 'react';
import { useSelector } from 'react-redux';
import {
  isEmpty,
  isLoaded,
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from 'react-redux-firebase';
import Alert from '@material-ui/lab/Alert';
// import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
// import CloseIcon from '@material-ui/icons/Close';
import Container from '@material-ui/core/Container';
// import Dialog from '@material-ui/core/Dialog';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import SaveIcon from '@material-ui/icons/Save';
// import Snackbar from '@material-ui/core/Snackbar';
// import TextField from '@material-ui/core/TextField';
// import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import Typography from '@material-ui/core/Typography';
// import Paper from '@material-ui/core/Paper';
// import UpdateIcon from '@material-ui/icons/Update';
// import useMediaQuery from '@material-ui/core/useMediaQuery';

import About from './About';
import Login from './Login';

import useStyles from './styles';

function Home() {
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

  const onClickDeleteSample = (e, sample) => {
    e.preventDefault();
    console.log('onClickDeleteSample');
    console.log(sample);
  };

  const onClickAssignSample = (e, device) => {
    e.preventDefault();
    console.log('onClickAssignSample');
    console.log(device);
  };

  const onClickDeleteDevice = (e, device) => {
    e.preventDefault();
    console.log('onClickDeleteDevice');
    console.log(device);
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
        <Grid>
          <Grid item xs={12}>
            <Typography variant="h2" component="h1">
              <b>LIARBIRD</b>
            </Typography>
            <Typography variant="h5" component="p" gutterBottom className={classes.subtitle}>
              FIELD PLAYBACK SYSTEM
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" component="h2" gutterBottom>
              <b>Registered Devices</b>
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
                <Typography className={classes.pos} color="textSecondary">
                  {/* {new Date(device.createdAt).toISOString()} */}
                </Typography>
                <Typography variant="body2" component="p">
                  Sample: {device.sample || 'None'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={(e) => onClickAssignSample(e, device)}
                  color="primary"
                >
                  Assign Sample
                </Button>
                <Button
                  size="small"
                  onClick={(e) => onClickDeleteDevice(e, device)}
                  color="secondary"
                >
                  Delete Device
                </Button>
              </CardActions>
            </Card>
          </Grid>
          ))}
          <Grid item xs={12}>
            <Typography variant="h4" component="h3" gutterBottom>
              <b>Adding Devices</b>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3" component="h2" gutterBottom>
              <b>Audio Samples</b>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" component="h3" gutterBottom>
              <b>Saved Samples</b>
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
                <Typography className={classes.pos} color="textSecondary">
                  {/* {new Date(sample.createdAt).toISOString()} */}
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
          <Grid item xs={12}>
            <Typography variant="h4" component="h3" gutterBottom>
              <b>Upload Sample</b>
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <form className={classes.formFields} noValidate autoComplete="off">
              <Button
                variant="contained"
                component="label"
                color="primary"
              >
                Choose File
                <input
                  type="file"
                  style={{ display: "none" }}
                />
              </Button>
            </form>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
