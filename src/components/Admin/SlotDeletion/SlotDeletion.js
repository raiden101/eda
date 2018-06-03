import React, { Component, Fragment } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import Modal from '../../Modal/Modal';
import './SlotDeletion.css';
import RenderTableSelectable from '../../RenderTable/RenderTableSelectable';
import Panel from '../../Panel/Panel';
import IconButton from '@material-ui/core/IconButton';

class SlotDeletion extends Component {
    state = {
        duration: 0,
        table: {
            morning: [],
            afternoon: []
        }
    }

    constructor(props) {
        super(props);
        this.token = JSON.parse(localStorage.getItem("auth")).token;
        this.tableHeads = [
            "Date",
            "Total slots",
            "Remaining Slots",
            "Selected Members"
        ];
        this.unmounted = false;
    }

    changeDuration = ({ target: { name, value } }) => {
        !this.unmounted && this.setState({
            ...this.state,
            [name]: value
        })
    }

    removeElements = (elements, duration) => {
        let durationTable = "";
        if (!duration) durationTable = "morning"
        else durationTable = "afternoon"
        let slots = [...this.state.table[durationTable]];
        elements.forEach((element, index) => {
            let elIndex = -1;
            slots.forEach((e, i) => {
                if (e._id === element)
                    elIndex = i;
            })
            slots.splice(elIndex, 1);
        })
        this.setState({
            ...this.state,
            table: {
                ...this.state.table,
                [durationTable]:slots
            }
        });
        axios.post('http://localhost:5000/api/admin/delete_slots', {
            token: this.props.token,
            slots_to_delete: elements,
            session:durationTable
        });
        return true;
    }
    translateSlotData(obj) {
        let date = new Date(obj.date)
        let dateString = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        return [
            dateString,
            obj.total_slot,
            obj.remaining_slot,
            <Modal
                trigger={
                    <Fragment>
                        see details (
                        <span className="fake-link">
                            {obj.selected_members.length}
                        </span>)
                    </Fragment>
                }
                title={"Selected members"}
                content={obj.selected_members.map((element, index) => {
                    return <span className="wid-10 cell" key={"selected" + index}>{element}</span>
                })}
            />
        ]
    }
    componentDidMount() {
        axios.post('http://localhost:5000/api/admin/', {
            token: this.token
        }).then((data) => {
            data = data.data;
            if (data.error !== null) {
                !this.unmounted && this.setState({
                    ...this.state
                });
            } else {
                !this.unmounted && this.setState({
                    ...this.state,
                    table: {
                        morning: data.data[0],
                        afternoon: data.data[1]
                    }
                })
            }
        })
    }
    componentWillUnmount() {
        this.unmounted = true;
    }

    selectedAction = (elements, duration) => {
        return (
            <Modal
                trigger={
                    <IconButton>
                        <i className="fa fa-trash" style={{ fontSize: "19px" }}></i>
                    </IconButton>
                }
                title={"Delete Slots"}
                content={
                    <Fragment>
                        Are you sure you want to delete these Slots ?
                        <Panel
                            title="See details"
                            content={
                                <Fragment>
                                    {
                                        elements.map((element, index) => {
                                            return (
                                                <div className="cell-full" key={"cell" + index}>
                                                    {element}
                                                </div>
                                            );
                                        })
                                    }
                                </Fragment>
                            }
                        />
                    </Fragment>
                }
                cancel={true}
                handleOk={() => this.removeElements(elements,duration)}
            />
        );
    }

    render() {
        return (
            <Fragment>
                <div className="controls">
                    <FormControl className="select-duration">
                        <InputLabel>Duration</InputLabel>
                        <Select
                            value={this.state.duration}
                            onChange={this.changeDuration}
                            inputProps={{
                                name: 'duration'
                            }}>
                            <MenuItem value={0}>Morning</MenuItem>
                            <MenuItem value={1}>Afternoon</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {(this.state.table.morning.length || this.state.table.afternoon.length) ? this.state.duration ? <RenderTableSelectable
                    data={this.state.table.afternoon}
                    translate={this.translateSlotData}
                    heads={this.tableHeads}
                    onSelectConfirm={this.handleSelect}
                    title={"Afternoon Slots"}
                    selectedAction={(e) => this.selectedAction(e, 1) }
                    selectionId="_id"
                /> : <RenderTableSelectable
                        data={this.state.table.morning}
                        translate={this.translateSlotData}
                        heads={this.tableHeads}
                        onSelectConfirm={this.handleSelect}
                        title={"Morning Slots"}
                        selectedAction={(e) => this.selectedAction(e,0) }
                        selectionId="_id"
                    /> :
                    <div className="loading">
                        Loading..
                    </div>
                }
            </Fragment>
        );
    }
}
export default SlotDeletion;