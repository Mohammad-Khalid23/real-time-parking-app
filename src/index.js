import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase'


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB9K3HchnKWS-3zUU8apc1YpkyF-hazcmM",
    authDomain: "khalid-car-parking-area.firebaseapp.com",
    databaseURL: "https://khalid-car-parking-area.firebaseio.com",
    projectId: "khalid-car-parking-area",
    storageBucket: "khalid-car-parking-area.appspot.com",
    messagingSenderId: "800148986811"
  };
  firebase.initializeApp(config);

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
