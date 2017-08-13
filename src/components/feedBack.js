import React, { Component } from "react"
import '../App.css';
import * as firebase from 'firebase'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
// import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';


const style = {
    width: 400,
    margin: 20,
    textAlign: 'left',
    paddingLeft: 60,
    paddingTop: 10,
    display: 'inline-block',
}


class FeedBack extends Component {
    constructor() {
        super()
        this.state = {
            message: [],
            users: []
        }

    }
    componentDidMount() {
        const feedRef = firebase.database().ref('feedbacks')
        feedRef.on('value', snap => {
            var obj = snap.val();
            var array = []
            console.log(obj, "object")
            for (let key in obj) {
                array.push(obj[key])
            }
            this.setState({
                users: array
            })
            // console.log(this.state.users[0].message, "attaa")
        })



    }
    feedBacks() {
        const feedRef = firebase.database().ref('feedbacks')
        const userId = firebase.auth().currentUser.uid;
        const rooRef = firebase.database().ref('users/' + userId)
        var obj = null
        rooRef.on('value', snap => {
            console.log(snap.val().name, "sufafkasfkhaslk")
            obj = snap.val()
        })
        var msg = {
            userName: obj.name,
            userEmail: obj.email,
            message: this.state.message
        }
        feedRef.push(msg)
        this.setState({ message: '' })

    }


    render() {
        return (
            <div>
                <h1>FeedBacks</h1>
                <TextField
                    multiLine={true}
                    rows={1}
                    rowsMax={4}
                    onChange={(e) => {
                        this.setState({
                            message: e.target.value
                        })
                    }}
                    value={this.state.message}
                    floatingLabelText="Your Feedback"
                /><br />
                <RaisedButton
                    onClick={this.feedBacks.bind(this)}
                    label='Send'
                    primary={true}
                />

                <div>


                    {
                        this.state.users.map((data, index) => (
                            <div key={index}>
                                <Paper style={style} zDepth={3}>
                                    <span ><strong>Name :</strong>{data.userName}</span>
                                    <br />
                                    <span ><strong>Email :</strong>{data.userEmail}</span>
                                    <br />
                                    <span ><strong>FeedBack :</strong>{data.message}</span>
                                    <br />
                                    <br />
                                </Paper>
                            </div>

                        ))
                    }
                </div>
            </div>
        );

    }
}
export default FeedBack;