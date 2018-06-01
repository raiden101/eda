import React, { Component, Fragment } from 'react';
import './AdminComponent.css';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import RenderTable from '../../RenderTable/RenderTable';
import Modal from '../../Modal/Modal';

class AdminComponent extends Component{
    state = {
        duration: 0,
        table: {
            morning: [],
            afternoon:[]
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
    }
    componentDidMount() {
        axios.post('http://localhost:5000/api/admin/', {
            token:this.token
        }).then((data) => {
            data = data.data;
            if (data.error !== null) {
                this.setState({
                    ...this.state,
                    redirect: true
                });
            } else {
                this.setState({
                    ...this.state,
                    table: {
                        morning: data.data[0],
                        afternoon:data.data[1]
                    }
                })
            }
        })
    }
    changeDuration = ({target:{name,value}}) => {
        this.setState({
            ...this.state,
            [name]:value
        })
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
                    return <span className="wid-10 cell" key={"selected"+index}>{element}</span>
                })}
            />]
    }
    render() {
        let redirect = this.state.redirect ? <Redirect to="/" /> : null;
        return (
            <Fragment>
                {redirect}
                <div className="admin-component">
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
                    {this.state.table.morning.length?this.state.duration ? <RenderTable
                        data={this.state.table.afternoon}
                        translate={this.translateSlotData}
                        heads={this.tableHeads}
                        /> : <RenderTable
                            data={this.state.table.morning}
                            translate={this.translateSlotData}
                            heads={this.tableHeads}
                        /> :
                        <div className="loading">
                            Loading..
                        </div>
                    }
                </div>
            </Fragment>
        );
    }
}
export default AdminComponent;