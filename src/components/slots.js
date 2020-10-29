import React, { Component } from 'react'
import * as firebase from 'firebase'
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';

const style = {
    width: 400,
    margin: 20,
    textAlign: 'left',
    paddingLeft: 60,
    paddingTop: 10,
    display: 'inline-block',
}



class Slots extends Component {
    constructor() {
        super()
        this.state = {
            slots: [],
            info: [],
            bookedSlot: [],
            array: [],
            open: false
        }
    }
    componentWillMount() {

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {

                const bookInfo = localStorage.getItem('park')
                console.log(JSON.parse(bookInfo), "bookINfo")
                const info = []
                info.push(JSON.parse(bookInfo))
                this.setState({
                    info: info
                })
                // console.log(this.state.info, "state valeu")

                const userId = firebase.auth().currentUser.uid;
                const userRef = firebase.database().ref('users/' + userId)
                userRef.on('value', snap => {
                    const type = snap.val().type
                    console.log(snap.val().type)

                    if (type === 'user') {

                        var key = localStorage.getItem('key') // key
                        if (key) {
                            const rootRef = firebase.database().ref('area/' + key);

                            rootRef.on('value', snap => {
                                var obj = snap.val().slot
                                this.setState({
                                    slots: obj
                                })

                            })

                        }
                        var name = localStorage.getItem('name');
                        const bookRef = firebase.database().ref('bookings').orderByChild('location').equalTo(name)
                        bookRef.on('value', snap => {
                            if (snap.val() !== null) {

                                var obj = snap.val();
                                console.log(snap.val(), "areaname")

                                var array = [];
                                var keys = [];
                                for (let key in obj) {
                                    keys.push(key)
                                    array.push(obj[key]) // array of object in which booking
                                }
                                this.setState({
                                    array: array,
                                    keys: keys
                                })
                                console.log(array)

                                //info of booker
                                var parkingInfo = localStorage.getItem('park');
                                parkingInfo = JSON.parse(parkingInfo);

                                var start = parkingInfo.startTime; //booking start time
                                var end = parkingInfo.endTime; // booking end time
                                var sdate = parkingInfo.bookDate; //booking date
                                console.log(parkingInfo.startTime)
                                start = new Date(start).getTime()
                                end = new Date(end).getTime()
                                sdate = new Date(sdate)


                                var bookStart;
                                var bookEnd;
                                var bookDate;
                                for (var i = 0; i < array.length; i++) {
                                    bookStart = new Date(array[i].startTime).getTime()
                                    bookEnd = new Date(array[i].endTime).getTime()
                                    bookDate = new Date(array[i].bookDate)




                                    if ((sdate.getFullYear() === bookDate.getFullYear()) && (sdate.getMonth() === bookDate.getMonth()) && (sdate.getDate() === bookDate.getDate())) {
                                        console.log('date matched')
                                        if ((start < bookStart && end > bookStart) || (start < bookEnd && end > bookEnd)) {
                                            console.log(array[i].slot + " cannot book")

                                            this.setState({
                                                bookedSlot: this.state.bookedSlot.concat(array[i].slot)
                                            })
                                        } else {
                                            console.log(array[i].slot + " can be book")
                                        }

                                    } else {
                                        console.log("data not matced")
                                    }
                                }
                            }
                        })

                        // var key = localStorage.getItem('key')
                        // const rootRef = firebase.database().ref('area/' + key);

                        // rootRef.on('value', snap => {
                        //     var obj = snap.val().slot
                        //     this.setState({
                        //         slots: obj
                        //     })

                        // })
                        //     } else {
                        //         var key = localStorage.getItem('key')
                        //         const rootRef = firebase.database().ref('area/' + key);

                        //         rootRef.on('value', snap => {
                        //             var obj = snap.val().slot
                        //             this.setState({
                        //                 slots: obj
                        //             })

                        //         })
                        //     }

                        // })
                    }
                    else {
                        var key = localStorage.getItem('key')
                        const rootRef = firebase.database().ref('area/' + key);
                        rootRef.on('value', snap => {
                            var obj = snap.val().slot
                            this.setState({
                                slots: obj
                            })

                        })


                    }
                    console.log(this.state.bookedSlot, "booked slots")

                }



                )
            }
        })





    }




    //booking function
    bookIt(index) {
        const userId = firebase.auth().currentUser.uid;
        const userRef = firebase.database().ref('users/' + userId);
        console.log(userRef, "ref")
        userRef.on('value', snap => {
            var user = snap.val().type
            console.log(user, "snap")

            if (user === 'user') {
                var key = localStorage.getItem('key')
                var name = localStorage.getItem('name')

                const labelRef = firebase.database().ref('area/' + key)

                labelRef.on('value', snap => {
                    var slotNumber = snap.val().slot[index].label;
                    this.setState({
                        slotNumber: slotNumber
                    })
                    console.log(snap.val().slot[index].label, "button label")
                    console.log(slotNumber, "slot number in state")

                    var parkingInfo = localStorage.getItem('park');
                    parkingInfo = JSON.parse(parkingInfo);
                    parkingInfo.slot = slotNumber;
                    parkingInfo.location = name;
                    const bookRef = firebase.database().ref('bookings');
                    bookRef.push(parkingInfo);
                        this.setState({ open: true });
                    

                })

            } else {

                this.props.history.push('/slots')
            }
        })


    }
    handleClose = () => {
        this.setState({ open: false });
        this.props.history.push('/myParking')
    };


    render() {
        return (
            <div>

                {
                    this.state.info.map((data, index) => {
                        var startDate = new Date(data.bookDate)
                        startDate = startDate.getDate() + ':' + startDate.getMonth() + ':' + startDate.getFullYear()

                        var startTime = new Date(data.startTime)
                        startTime = startTime.getHours() + ':' + startTime.getMinutes() + ':' + startTime.getSeconds()

                        var endTime = new Date(data.endTime)
                        endTime = endTime.getHours() + ':' + endTime.getMinutes() + ':' + endTime.getSeconds()

                        return (
                            <div>
                                <div>
                                    <RaisedButton label="Alert" onTouchTap={this.handleOpen} />
                                    <Dialog
                                        modal={false}
                                        open={this.state.open}
                                        onRequestClose={this.handleClose}
                                    ><span id="close"onTouchTap={this.handleClose}>X</span>
                                        <h1>Boooked Successfully</h1>

                                    </Dialog>
                                </div>
                                < Paper style={style}>
                                    {startDate}
                                    {startTime}
                                    {endTime}
                                </Paper>
                            </div>
                        )

                    })
                }

                <h1>Slots</h1>
                {
                    this.state.slots.map((data, index) => (
                        this.state.bookedSlot.indexOf(data.label) === -1 ?
                            <RaisedButton
                                key={index}
                                onClick={this.bookIt.bind(this, index)}
                                label={data.label} primary={true}
                            />
                            :
                            <RaisedButton
                                key={index}
                                onClick={this.bookIt.bind(this, index)}
                                label={data.label} disabled={true}
                            />

                    ))
                }
            </div >
        )
    }
}
export default Slots; 