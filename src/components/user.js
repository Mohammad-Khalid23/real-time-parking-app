import React, { Component } from 'react'
import * as firebase from 'firebase'
import Carousel from "./carousel";

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