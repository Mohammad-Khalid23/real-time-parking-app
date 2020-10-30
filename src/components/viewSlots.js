import React, { Component } from 'react';
import * as firebase from 'firebase'
import RaisedButton from 'material-ui/RaisedButton';

class ViewSlots extends Component {
    constructor() {
        super()
        this.state = {
            area: []

        }
    }


    componentWillMount() {
        const rootRef = firebase.database().ref().child('area');


        rootRef.on('value', snap => {
            var name = [];
            var slots = [];
            var keys = []
            console.log(snap.val(), "snap value")

            var obj = snap.val();

            for (var key in obj) {
                keys.push(key)
                name.push(obj[key].areaName) // location name
                slots.push(obj[key].slot)  // array of object of slot

            }

            console.log(name)
            console.log(slots, "Slots")

            this.setState({
                area: name,
                keys: keys
            })
            console.log(this.state.area, "state")
        })


    }

    slots(index) {
        const userId = firebase.auth().currentUser.uid;
        const userRef = firebase.database().ref('users/' + userId);
        console.log(userRef, "ref")
        userRef.on('value', snap => {
            var user = snap.val().type
            console.log(user, "snap")

            if (user === 'user') {
                localStorage.setItem('key', this.state.keys[index])
                localStorage.setItem('name', this.state.area[index])
                this.props.history.push('/bookParking')

            } else {
                localStorage.setItem('key', this.state.keys[index])
                localStorage.setItem('name', this.state.area[index])
                this.props.history.push('/slots')
            }
        })


    }

    render() {
        return (
            <div>

                <h1>Parking Locations</h1>
                {
                    this.state.area.map((data, index) => (
                        <RaisedButton
                            onClick={this.slots.bind(this, index)}
                            key={index}
                            label={data}
                            primary={true}
                        />

                    ))
                }
            </div>
        )
    }
}
export default ViewSlots;