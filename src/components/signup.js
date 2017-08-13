import React, { Component } from "react"
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


class Signup extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    signup() {

        var name = this.state.name;
        var email = this.state.email;
        var password = this.state.password;
        var number = this.state.number;


        if (name === undefined || email === undefined || password === undefined) {
            alert("Please fill Complete Form!!")
        } else {
            const auth = firebase.auth();
            auth.createUserWithEmailAndPassword(email, password).catch(function (err) {
                console.log(err.message)
                console.log(err.code)
                alert(err.code)
            })
            auth.onAuthStateChanged((user) => {
                if (user) {
                    const userId = auth.currentUser.uid

                    var userObj = {
                        name: this.state.name,
                        email: this.state.email,
                        password: this.state.password,
                        number: this.state.number,
                        type: 'user'
                    }
                    const rootRef = firebase.database().ref()
                    rootRef.child('users/' + userId).set(userObj)
                    console.log(this.state.user, "svaed in data base")
                    this.props.history.push('/')
                }
            })

        }

    }




    render() {
        return (
            <div>
                <Paper style={style} zDepth={3}>
                    <h1>Register yourSelf..</h1>
                    <TextField
                        onChange={(e) => {
                            this.setState({
                                name: e.target.value
                            })
                        }}
                        floatingLabelText="Name"
                        hintText="Enter Your Name..."
                    /><br />
                    <TextField
                        onChange={(e) => {
                            this.setState({
                                email: e.target.value
                            })
                        }}
                        floatingLabelText="Email"
                        hintText="Enter Your Email...."
                    />
                    <br />
                    <PasswordField
                        onChange={(e) => {
                            this.setState({
                                password: e.target.value
                            })
                        }}
                        floatingLabelText="Password"
                    /><br />
                    <TextField
                        onChange={(e) => {
                            this.setState({
                                number: e.target.value
                            })
                        }}
                        floatingLabelText="Number"
                        hintText="Enter Your Number...."
                    /> <br />
                    <RaisedButton label='Register' primary={true} onClick={this.signup.bind(this)} />
                     {/* <Link to="/">Already have Account??</Link>  */}
                     <p>Already</p>
                    <br/><br/>
                </Paper>
            </div>
        );

    }
}
export default Signup;