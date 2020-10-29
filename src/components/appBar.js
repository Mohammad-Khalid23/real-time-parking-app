import React, { Component } from 'react'
import * as firebase from 'firebase'
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import '../App.css';
import MenuItem from 'material-ui/MenuItem';
import * as mat from 'material-ui'
import Divider from 'material-ui/Divider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { Link } from 'react-router-dom';
let style = {
    button: {
        color: '#fafbfc'
    },
    appBar: {
        backgroundColor: 'rgb(0, 188, 212)',
        color: '#fafbfc'
    }
}

class Navbar extends Component {
    constructor() {
        super()
        this.state = {
            drawerOpened: false,
            type: null,
            active: null,
            btn: false

        }
    }

    _toggelDrawer() {
        this.setState({
            drawerOpened: !this.state.drawerOpened
        })
    }
    close() {
        this.setState({
            drawerOpened: !this.state.drawerOpened
        })
    }
    signOut() {
        this.props.history.push('/')
        firebase.auth().signOut().then(function () {
            alert("Logout")
            // localStorage.clear();
            localStorage.setItem('activeUser', 'offline')
        }).catch(function (err) {
            console.log(err.message);
        })
        this.setState({
            active: false,
            btn: false
        })
        // this.setState({active: null})
    }
    componentDidMount() {
        var check = localStorage.getItem('activeUser')
        if (check == null || check === 'offline') {
            localStorage.setItem('activeUser', 'offline')
            this.props.history.push('/')
        } else if (check !== 'offline') {
            console.log(check, "local sotarfe")

            var userRef = firebase.database().ref('users/' + check)
            userRef.on('value', snap => {
                if (snap.val().type === 'user') {
                    this.props.history.push('/user') // now it is oof
                    this.setState({
                        active: true,
                        btn: true
                    })

                }
                else if (snap.val().type === 'admin') {
                    this.props.history.push('/admin')
                    this.setState({
                        active: true,
                        btn: true
                    })

                }
            })
        }



        const auth = firebase.auth();
        auth.onAuthStateChanged(() => {
            const userId = firebase.auth().currentUser.uid;
            if (userId) {
                this.setState({
                    active: true,
                    btn: true
                })

                const userRef = firebase.database().ref().child('users/' + userId)
                userRef.on('value', snap => {
                    var user = snap.val();
                    this.setState({
                        type: user.type,
                        btn: true
                    })

                })

            } else {
                this.setState({
                    active: null
                })
                alert("else")

            }

        })

    }

    render() {
        if (localStorage.getItem('activeUser') === "offline") {
            return (

                <AppBar title="Car Parking Sytem" showMenuIconButton={this.state.btn} onClick={() => this._toggelDrawer()} >
                    {this.state.active ?
                        <FlatButton label="SignOut" default={true} style={style.button} onClick={this.signOut.bind(this)} />
                        :
                        <Link to="/signup"> <FlatButton label="Register" style={style.button} default={true} /></Link>
                    }

                </AppBar>

            )

        } else {
            return (
                <div>
                    <MuiThemeProvider>

                        <AppBar title="Real Time Parking Sytem" showMenuIconButton={this.state.btn} onClick={() => this._toggelDrawer()}
                            iconElementRight={
                                <span>
                                    {this.state.active ?
                                        <mat.FlatButton label="SignOut" style={style.button} style={style.button} default={true} onClick={this.signOut.bind(this)} />
                                        :
                                        <Link to="/signup"> <mat.FlatButton label="Register" style={style.button} primary={true} /></Link>
                                    }
                                </span>
                            }
                        />
                    </MuiThemeProvider>
                    <Drawer open={this.state.drawerOpened} docked={false} onRequestChange={(drawerOpened) => this._toggelDrawer()}>
                        <MenuItem style={style.appBar}>Real Time Parking System</MenuItem>
                        {this.state.type !== 'user' ?
                            <div>
                                <MenuItem><Link to="/addSlots" onClick={this._toggelDrawer.bind(this)}>Add Slots</Link></MenuItem>
                                <Divider />
                                <MenuItem><Link to="/location" onClick={this._toggelDrawer.bind(this)}>Locations</Link></MenuItem>
                                <Divider />
                                <MenuItem><Link to="/viewBooking" onClick={this._toggelDrawer.bind(this)}>View Bookings</Link></MenuItem>
                                <Divider />
                                <MenuItem ><Link to="/feedBacks" onClick={this._toggelDrawer.bind(this)}>Feedbacks</Link></MenuItem>
                                <Divider />
                            </div>
                            :
                            <div>
                                <MenuItem className="app-bar"><Link to="/location" onClick={this._toggelDrawer.bind(this)}>Book parking</Link></MenuItem>
                                <Divider />
                                <MenuItem><Link to="/myParking" onClick={this._toggelDrawer.bind(this)}>My parkings</Link></MenuItem>
                                <Divider />
                                <MenuItem><Link to="/feedbacks" onClick={this._toggelDrawer.bind(this)}>FeedBacks</Link></MenuItem>
                                <Divider />
                            </div>
                        }
                    </Drawer>

                </div>
            )
        }

    }
}
export default Navbar