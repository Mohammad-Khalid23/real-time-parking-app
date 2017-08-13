import React, { Component } from 'react'
import App from '../App'
import * as firebase from 'firebase'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PasswordField from 'material-ui-password-field'
import { BrowserRouter as Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';


const style = {
    width: 400,
    margin: 20,
    textAlign: 'left',
    paddingLeft: 60,
    paddingTop: 10,
    display: 'inline-block',
}


class Login extends Component {
    constructor() {
        super()
        this.state = {
            drawerOpened: false


        }
    }
    loginUser() {
        var email = this.state.email;
        var password = this.state.password;

        if (email === undefined || password === undefined) {
            alert("fill the Form Completly")
        } else {

            const auth = firebase.auth();
            auth.signInWithEmailAndPassword(email, password).catch(function (err) {
                console.log(err.code)
                console.log(err.message)

            });

            //checking  login user
            auth.onAuthStateChanged((user) => {
                setTimeout(() => {
                    if (user) {
                        // alert("kuch bhi");
                        if (email === "admin@gmail.com" && password === "admin12345") {
                            const userId = firebase.auth().currentUser.uid;
                            localStorage.setItem('activeUser', userId)
                            this.props.history.push('/admin')
                        }
                        else {
                            const userId = firebase.auth().currentUser.uid;
                            localStorage.setItem('activeUser', userId)
                            const userRef = firebase.database().ref().child('users/' + userId)
                            userRef.on('value', snap => {
                                var user = snap.val();
                                console.log(user)

                                console.log(user.type) // it give me type of user

                                if (user.type === "user") {
                                    this.props.history.push('/user')

                                }
                            })
                        }
                    }
                }, 300)



            })

        }
        var obj = {
            email: this.state.email,

        }
        console.log(this.state.email)

    }

    signOut() {
        firebase.auth().signOut().then(function () {
            alert("Logout")
            this.props.history.push('/')
        }).catch(function (err) {
            console.log(err.message);
        })

    }

    render() {
        return (
            <div>

                <Paper style={style} zDepth={3}>
                    <h1>Login</h1>

                    <TextField
                        onChange={(e) => {
                            this.setState({
                                email: e.target.value
                            })
                        }}
                        hintText="Enter Your Email"
                        floatingLabelText="Email"
                    /><br />
                    <br />
                    <PasswordField
                        onChange={(e) => {
                            this.setState({
                                password: e.target.value
                            })
                        }}
                        floatingLabelText="Password"
                    /> <br /><br />
                    <RaisedButton label='Login' primary={true} onClick={this.loginUser.bind(this)} />
                    <br /><br />
                </Paper>
            </div>

        )
    }

}
export default Login;