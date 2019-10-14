import React, { Component } from 'react'
import App from '../App.js'
import * as firebase from 'firebase'
import NavBar from './appBar.js'
import Paper from 'material-ui/Paper';
import Carousel from "./carousel";

const style = {
    width: 400,
    margin: 20,
    textAlign: 'left',
    paddingLeft: '60',
    paddingTop: '10',
    display: 'inline-block',
}


class User extends Component {
    constructor() {
        super()
        this.state = {
            info: []
        }
    }



    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            const userId = firebase.auth().currentUser.uid;
            const userRef = firebase.database().ref('users/' + userId);
            console.log(userRef, "ref")
            userRef.on('value', snap => {
                var user = snap.val();
                var info = []

                info.push(user)

                this.setState({
                    info: info
                })
                console.log(user, "user info")
                console.log(info, " info")
                console.log(this.state.info, " info")

            })
        })
    }


    render() {



        return (
            <div>
                <Carousel />

                {
                    this.state.info.map((data, index) => (
                        <h1>{data.name}</h1>

                    ))
                }
            </div>

        )
    }


}
export default User;