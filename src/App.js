import React, { Component } from 'react';
import './App.css';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin';
import * as firebase from 'firebase'
import FeedBack from './components/feedBack.js'
import ViewSlots from './components/viewSlots.js'
import Admin from './components/admin.js'
import Login from './components/login.js'
import Signup from './components/signup.js'
import AddSlots from './components/addSlots.js'
import BookParking from './components/bookParking.js'
import ViewBooking from './components/viewBooking.js'
import MyParking from './components/myParking.js'
import User from './components/user.js'
import NavBar from './components/appBar.js'
import Slots from './components/slots.js'
import Reciept from './components/reciept.js'


import { BrowserRouter as Router, Route } from 'react-router-dom';
injectTapEventPlugin();
class App extends Component {

  constructor() {
    super()
    this.state = {
      drawerOpened: false,
      type: null

    }
  }
  componentWillMount() {

    const auth = firebase.auth();
    auth.onAuthStateChanged((user) => {
      const userId = firebase.auth().currentUser.uid;
      if (user) {
        this.setState({
          active: true
        })

        const userRef = firebase.database().ref().child('users/' + userId)
        userRef.on('value', snap => {
          var user = snap.val();
          // console.log(user)

          // console.log(user.type)

          // it give me type of 
          this.setState({
            type: user.type
          })

        })

      } else {
        this.setState({
          active: false
        })

      }

    })

  }

  _toggelDrawer() {
    this.setState({
      drawerOpened: !this.state.drawerOpened
    })
  }
  render() {

    return (

      <Router>
        <MuiThemeProvider>
          <div className="App">
            <div>
              <Route path='/' component={NavBar}/>
              <Route exact path="/" component={Login} />
              <Route path="/addSlots" component={AddSlots} />
              <Route path="/location" component={ViewSlots} />
              <Route path="/feedBacks" component={FeedBack} />
              <Route path="/viewBooking" component={ViewBooking} />
              <Route path="/myParking" component={MyParking} />
              <Route path="/bookParking" component={BookParking} />
              <Route path="/admin" component={Admin} />
              <Route path="/user" component={User} />
              <Route path="/signup" component={Signup} />
              <Route path="/slots" component={Slots} />
              <Route path="/reciept" component={Reciept} />
            </div>
          </div>
        </MuiThemeProvider>
      </Router>


    );
  }
}

export default App;
