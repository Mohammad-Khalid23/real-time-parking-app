import React, { Component } from 'react'
import App from '../App.js'
import * as firebase from 'firebase'
import NavBar from './appBar.js'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


const style = {
    width: 400,
    margin: 20,
    textAlign: 'left',
    paddingLeft: 60,
    paddingTop: 10,
    display: 'inline-block',
}
class MyParking extends Component {

    constructor() {
        super()
        this.state = {
            parking: []
        }

    }

    componentWillMount() {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const userId = firebase.auth().currentUser.uid
                const bookRef = firebase.database().ref('bookings').orderByChild('userId').equalTo(userId);
                var parking = [];
                var keys = []
                bookRef.on('value', snap => {
                    for (let key in snap.val()) {
                        keys.push(key)
                        parking.push(snap.val()[key])
                    }
                    this.setState({
                        parking: parking,
                        keys: keys
                    })
                    // alert("wrorking")
                    // console.log(this.state.parking[0].name, "parking")
                })


            }
        })

    }
    remove(index) {
        const deleteParking = firebase.database().ref('bookings/' + this.state.keys[index])
        deleteParking.remove()


    }

    render() {



        return (
            <div>
                <h1>My parking</h1>
                {
                    this.state.parking.map((data, index) => {
                        var startDate = new Date(data.bookDate)
                         startDate = startDate.getDate()+':'+startDate.getMonth()+':'+startDate.getFullYear()

                        var startTime = new Date(data.startTime)
                         startTime = startTime.getHours()+':'+startTime.getMinutes()+':'+startTime.getSeconds()

                        var endTime = new Date(data.endTime)
                         endTime = endTime.getHours()+':'+endTime.getMinutes()+':'+endTime.getSeconds()
                         

                        return (
                            <div key={index}>
                                <Paper style={style} zDepth={3}>
                                    <strong>Location: </strong><span>{data.location}</span><br /><br />
                                    <strong>Slot: </strong><span>{data.slot}</span><br /><br />
                                    <strong>Date: </strong><span>{startDate}</span><br /><br />
                                    <strong>Start Time: </strong><span>{startTime}</span><br /><br />
                                    <strong>End Time: </strong><span>{endTime}</span><br /><br />
                                    <RaisedButton label='Delete' primary={true} onClick={this.remove.bind(this, index)} /> <br /><br />
                                </Paper>
                            </div>
                        )


                    }
                    )
                }
            </div>

        )
    }


}
export default MyParking;