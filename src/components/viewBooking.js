import React, { Component } from 'react'
import * as firebase from 'firebase'
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';


const style = {
    width: 400,
    margin: '0 auto',
    textAlign: 'left',
    paddingLeft: 60,
    paddingTop: 10,
    paddingBottom: 10
}


class ViewBooking extends Component {

    constructor() {
        super()
        this.state = {
            parking: [],
            keys:[]
        }
    }
    componentWillMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                const bookRef = firebase.database().ref('bookings');
                var parking = [];
                var keys = []
                bookRef.on('value', snap => {
                    // console.log(snap.val())
                     var obj = snap.val()
                    for (let key in obj) {
                        keys.push(key)
                        parking.push(obj[key])
                    }
                    this.setState({
                        parking: parking,
                        keys:keys
                    })
                    console.log(this.state.parking, "parking")
                })


            }
        })
    }

    remove(index) {
        console.log(this.state.keys,"keys")
        const deleteParking = firebase.database().ref('bookings/' + this.state.keys[index])
        deleteParking.remove()



    }
    render() {



        return (
            <div>
                <h1>All Parkings</h1>
                {
                    this.state.parking.map((data, index) => {
                        var startDate = new Date(data.bookDate)
                        startDate = startDate.getDate() + ':' + startDate.getMonth() + ':' + startDate.getFullYear()

                        var startTime = new Date(data.startTime)
                        startTime = startTime.getHours() + ':' + startTime.getMinutes() + ':' + startTime.getSeconds()

                        var endTime = new Date(data.endTime)
                        endTime = endTime.getHours() + ':' + endTime.getMinutes() + ':' + endTime.getSeconds()


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
                                <br/>
                            </div>
                        )


                    }
                    )
                }
            </div>

        )
    }


}
export default ViewBooking;