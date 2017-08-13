import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import * as firebase from 'firebase'



class AddSlots extends Component {


    addArea() {

        var array = []
        var slot = parseInt(this.state.slot)
        for (var i = 1; i <= slot; i++) {
            array.push({ label: "Slot " + i })

        }
        const areaObj = {
            areaName: this.state.area,
            slot: array
        }

        firebase.database().ref('area').push(areaObj)
        this.props.history.push('/location')

    }
    render() {



        return (
            <div>
                <h1>Add Slots</h1>

                <TextField
                    onChange={(e) => {
                        this.setState({
                            area: e.target.value
                        })
                    }}
                    floatingLabelText="Area"
                /> <br />
                <TextField
                    onChange={(e) => {
                        this.setState({
                            slot: e.target.value
                        })
                    }}
                    floatingLabelText="Slote"
                /> <br />
                <RaisedButton label='Add Slot' primary={true} onClick={this.addArea.bind(this)} />
            </div>

        )
    }


}
export default AddSlots;