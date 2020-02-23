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
// import CardContent from '@material-ui/core/CardContent';
// import CardHeader from '@material-ui/core/CardHeader';
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

  // if (isEmpty(auth)) {
  //   return (
  //     <div className={classes.root}>
  //       <Container maxWidth="md">
  //         <Typography variant="h1" component="h1" gutterBottom>
  //           <b>LIARBIRD</b>
  //         </Typography>
  //         <Login
  //           classes={classes}
  //         />
  //         <About classes={classes} />
  //       </Container>
  //     </div>
  //   );
  // }

  return (
    <div className={classes.root}>
      <Container maxWidth="md">
        <Typography variant="h1" component="h1" gutterBottom>
          <b>LIARBIRD</b>
        </Typography>
        <Typography variant="h2" component="h2" gutterBottom>
          <b>Registered Devices</b>
        </Typography>
        {devices && devices.length === 0 && (
          <Alert severity="warning">
            No Devices Registered Yet
          </Alert>
        )}
        {devices && devices.map((device) => (
          <div key={device.id}>

          </div>
        ))}
        <Typography variant="h3" component="h3" gutterBottom>
          <b>Adding Devices</b>
        </Typography>
        <Typography variant="h2" component="h2" gutterBottom>
          <b>Audio Samples</b>
        </Typography>
        <Typography variant="h3" component="h3" gutterBottom>
          <b>Saved Samples</b>
        </Typography>
        {samples && samples.length === 0 && (
          <Alert severity="warning">
            No Samples Uploaded Yet
          </Alert>
        )}
        {samples && samples.map((sample) => (
          <div key={sample.id}>

          </div>
        ))}
        <Typography variant="h3" component="h3" gutterBottom>
          <b>Upload Sample</b>
        </Typography>
      </Container>
    </div>
  );
}

export default Home;
