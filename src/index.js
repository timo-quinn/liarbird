import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux';
import {
  firebaseReducer,
  getFirebase,
  ReactReduxFirebaseProvider,
} from 'react-redux-firebase';
import {
  firestoreReducer,
  createFirestoreInstance,
} from 'redux-firestore';
import firebase from 'firebase/app';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import * as serviceWorker from './serviceWorker';
import App from './App';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';
import theme from './theme';

const middleware = [
  thunk.withExtraArgument({ getFirebase }),
];

const createStoreWithMiddleware = compose(
  applyMiddleware(...middleware),
)(createStore);

const store = createStoreWithMiddleware(combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
}));

const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true,
};

firebase.initializeApp({
  apiKey: "AIzaSyBrGfNv_jNC7ugoRjpiplOBxLwhjKNeiAY",
  authDomain: "liarbird-1df1e.firebaseapp.com",
  databaseURL: "https://liarbird-1df1e.firebaseio.com",
  projectId: "liarbird-1df1e",
  storageBucket: "liarbird-1df1e.appspot.com",
  messagingSenderId: "1070514150844",
  appId: "1:1070514150844:web:4c70e9e299dda852389fb9",
  measurementId: "G-X6K2R7XXBR"
});

firebase.firestore();
firebase.functions();

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider
      firebase={firebase}
      config={rrfConfig}
      dispatch={store.dispatch}
      createFirestoreInstance={createFirestoreInstance}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
        {/* <CookieConsent>
          This website uses cookies to provide authentication services, and to assist
          in fraud detection for payments. More information can be found in the
          <a target="_blank" rel="noopener noreferrer" href="https://firebasestorage.googleapis.com/v0/b/screwnotes.appspot.com/o/Privacy%20Policy.pdf?alt=media&token=9452d4c4-0e32-42aa-a38c-4946430655ff"> Privacy Policy</a>
          .
        </CookieConsent> */}
      </ThemeProvider>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
