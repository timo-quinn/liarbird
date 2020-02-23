import React from 'react';
import { useSelector } from 'react-redux';
import {
  isEmpty,
  isLoaded,
  useFirebase,
} from 'react-redux-firebase';
// import Alert from '@material-ui/lab/Alert';
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

import useStyles from './styles';

function About() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth="sm">
        
      </Container>
    </div>
  );
}

export default About;
