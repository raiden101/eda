import React, { Component,Fragment } from 'react';
import './SlotAddition.css';
import TextField from '@material-ui/core/TextField';
import RenderTableSelectable from '../../RenderTable/RenderTableSelectable';

import Modal from '../../Modal/Modal';
import Panel from '../../Panel/Panel';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
class SlotAddition extends Component{
    state = {
        incrementer:1,
        slots: [
            {
                slot_id:0,
                date: new Date(),
                session: 'morning',
                total_slot:20
            }
        ],
        tempSlotData: {
            slot_id: 1,
            date: new Date(),
            session: 'morning',
            total_slot: 1
        },
        validated:true
    }
    constructor(props) {
        super(props);
        this.props = props;
        this.tableHeads = [
            "Date",
            "Session",
            "Total slots"
        ];
    }
    translateSlotData = (obj) => {
        let date = new Date(obj.date);
        let dateString = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear();
        return [dateString, obj.session, obj.total_slot];
    }

    removeElements = (elements) => {
        let slots = [...this.state.slots];
        elements.forEach(element => {
            let elIndex = -1;
            slots.forEach((slot, i) => {
                if (slot.slot_id === element.slot_id) {
                    elIndex = i;
                    return;
                }
            });
            slots.splice(elIndex, 1);
        })
        this.setState({
            slots: slots
        });
    }

    findById = (id) => {
        let actualDuration = this.state.slots
        let elIndex = -1;
        actualDuration.forEach((e, i) => {
            if (e.slot_id === id) { elIndex = i; return; }
        });
        return actualDuration[elIndex];
    }

    selectedAction = (elements) => {
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
                                            let date = this.findById(element) && new Date(this.findById(element).date);
                                            let dateString = date && (date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear());
                                            return (
                                                <div className="cell-full" key={"cell" + index}>
                                                    <div className="half">{dateString}</div>
                                                    <div className="half">{element.session==='morning' ? 'Morning':'Afternoon'}</div>
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
                handleOk={() => this.removeElements(elements)}
            />
        );
    }
    addSlot = () => {
        if (!this.state.validated) return false;
        let slots = [...this.state.slots];
        slots.push(this.state.tempSlotData);
        this.setState(prevState => ({
            ...this.state,
            incrementer: prevState.incrementer + 1,
            slots:slots,
            tempSlotData: {
                slot_id: prevState.incrementer+1,
                date: new Date(),
                session: 'morning',
                total_slot: 1
            }
        }));
        return true;
    }
    dashSeperatedDateString = (date) => {
        let dateObj = new Date(date);
        let year = dateObj.getFullYear();
        let month = dateObj.getMonth();
        month.toString().length === 1 && (month = "0" + month);
        let dated = dateObj.getDate();
        dated.toString().length === 1 && (dated = "0" + dated);
        return year + "-" + month + "-" + dated;
    }
    changeTempDate = ({ target: { value:date } }) => {
        date = date.split("-");
        let dateObj = new Date(date[0] * 1, date[1] * 1, date[2]);
        this.setState({
            tempSlotData: {
                ...this.state.tempSlotData,
                date: dateObj
            }
        });
    }
    changeTempDuration = ({ target: { value } }) => {
        this.setState({
            tempSlotData: {
                ...this.state.tempSlotData,
                session: value
            }
        });
    }
    changeTempSlots = ({ target: { value } }) => {
        if (value <= 0) {
            this.setState({
                validated: false
            });
        }
        else {
            this.setState({
                validated: true
            });
        }
        this.setState({
            tempSlotData: {
                ...this.state.tempSlotData,
                total_slots: value
            }
        });
    }
    render() {
        return (
            <div className="slot-addition">
                {this.state.slots.length > 0 && <RenderTableSelectable
                    data={this.state.slots}
                    translate={this.translateSlotData}
                    heads={this.tableHeads}
                    onSelectConfirm={this.handleSelect}
                    title={"Slots"}
                    selectedAction={this.selectedAction}
                    selectionId="slot_id"
                />}
                <Modal
                    trigger={
                        <div className="new-item">
                            Add slots <i className="fa fa-plus"></i>
                        </div>
                    }
                    title={"Create Slot"}
                    content={
                        <Fragment>
                            <div className="input-field full">
                                <TextField
                                    type="date"
                                    label="Date"
                                    defaultValue={this.dashSeperatedDateString(this.state.tempSlotData.date)}
                                    onChange={this.changeTempDate}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    fullWidth/>
                            </div>

                            <div className="input-field full">
                                <FormControl fullWidth>
                                    <InputLabel>Session</InputLabel>
                                    <Select
                                        value={this.state.tempSlotData.session}
                                        onChange={this.changeTempDuration}
                                        inputProps={{
                                            name: 'session'
                                        }}>
                                        <MenuItem value={'morning'}>Morning</MenuItem>
                                        <MenuItem value={'afternoon'}>Afternoon</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="input-field full">
                                <TextField
                                    type="number"
                                    defaultValue={this.state.tempSlotData.total_slot}
                                    label="Total Slots"
                                    onChange={this.changeTempSlots}
                                    error={!this.state.validated}
                                    fullWidth/>
                            </div>
                        </Fragment>
                    }
                    cancel={true}
                    handleOk={this.addSlot}
                />
            </div>
        );
    }
}
export default SlotAddition;