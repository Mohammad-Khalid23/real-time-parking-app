import React, { Component } from "react"
import * as firebase from 'firebase'
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Dialog from 'material-ui/Dialog';

const style = {
    width: 400,
    margin: 20,
    textAlign: 'left',
    paddingLeft: 60,
    paddingTop: 10,
    display: 'inline-block',
}

class BookParking extends Component {
    constructor() {
        super()


        this.state = {
            areaName: [],
            value: 1,
            parking: {},
            open: false

        }
    }
    componentDidMount() {
        const rootRef = firebase.database().ref().child('area');


        rootRef.on('value', snap => {
            var areaName = [];

            var obj = snap.val();
            for (var key in obj) {
                areaName.push(obj[key].areaName)
            }
            this.setState({
                areaName: areaName
            })
        })

    }

    bookParking() {

        if (this.state.bookingDate === undefined ||
            this.state.endTime === undefined || this.state.startTime === undefined) {
            alert("please Fill Complete form")

        } else {
            var start = new Date(this.state.startTime)
            start = start.getTime() + 3600000;
            console.log(start)

            var end = new Date(this.state.endTime)
            end = end.getTime();
            console.log(end)

            if (end <= start) {
                this.setState({
                    open: true
                })
            } else {
                const bookRef = firebase.database().ref('bookings');
                bookRef.on('value', snap => {
                    var obj = snap.val()
                    console.log(obj, "snap value")

                })
                var parking = {

                    bookDate: this.state.bookingDate,
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                    userId: firebase.auth().currentUser.uid
                }


                console.log(parking, "Parking")

                this.setState({
                    parking: parking
                })

                localStorage.setItem('park', JSON.stringify(parking))
                this.props.history.push('/slots')

            }

        } //kjgk




    }

    bookingDate = (event, bookingDate) => {
        this.setState({
            bookingDate: String(bookingDate)
        })
    }
    handleStartTime = (event, startTime) => {
        this.setState({
            startTime: String(startTime)

        })
    }
    handleEndTime = (event, endTime) => {
        this.setState({
            endTime: String(endTime)
        })
    }
    handleClose = () => {
        this.setState({ open: false });
        // this.props.history.push('/myParking')
    };

    render() {
        return (
            <div>
                <Dialog
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                    ><span id="close" onTouchTap={this.handleClose}>X</span>

                    <h1>Time Error!!</h1>
                    <p>Note:Booking must be atleast 1 hour</p>
                </Dialog>
                <Paper style={style} zDepth={3}>
                    <h1>Booking Details</h1>

                    <DatePicker
                        minDate={new Date()}
                        floatingLabelText="Date"
                        onChange={this.bookingDate}
                    />

                    <TimePicker
                        autoOk={true}

                        floatingLabelText="Start Time.."
                        onChange={this.handleStartTime}
                    />

                    <TimePicker
                        autoOk={true}
                        floatingLabelText="End Time.."
                        onChange={this.handleEndTime}
                    />
                    <RaisedButton label='Check >>' primary={true} onClick={this.bookParking.bind(this)} />
                    <br /><br />
                </Paper>

            </div>
        );

    }
}
export default BookParking;