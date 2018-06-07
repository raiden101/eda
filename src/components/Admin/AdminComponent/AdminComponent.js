import React, { Component, Fragment } from 'react';
import './AdminComponent.css';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SelectedSlots from '../SelectedSlots/SelectedSlots';
import DeleteUsers from '../DeleteUsers/DeleteUsers';
import SlotDeletion from '../SlotDeletion/SlotDeletion';
import SlotAddition from '../SlotAddition/SlotAddition';
import UserRegistration from '../UserRegistration/UserRegistration';
import Reports from '../Reports/Reports';
import PendingFaculty from '../PendingFaculty/PendingFaculty';
class AdminComponent extends Component{
    constructor(props) {
        super(props);
        this.token = JSON.parse(localStorage.getItem("auth")).token;
    }
    state = {
        type:6
    }
    changeDuration = ({ target: { name, value } }) => {
        this.setState({
            ...this.state,
            [name]: value
        })
    }

    render() {
        let type = this.state.type;
        return (
            <Fragment>
                <div className="admin-component">
                    <div className="controls">
                        <FormControl className="data-functions">
                            <InputLabel>Operation</InputLabel>
                            <Select
                                value={this.state.type}
                                onChange={this.changeDuration}
                                inputProps={{
                                    name: 'type'
                                }}>
                                <MenuItem value={0}>Display Slot Selection</MenuItem>
                                <MenuItem value={1}>Delete Users</MenuItem>
                                <MenuItem value={2}>Slot Deletion</MenuItem>
                                <MenuItem value={3}>Slot Addition</MenuItem>
                                <MenuItem value={4}>User Registration</MenuItem>
                                <MenuItem value={5}>Reports</MenuItem>
                                <MenuItem value={6}>Pending Faculty</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    <div className="details">
                        {!type && <SelectedSlots token={this.token}/>}
                        {type === 1 && <DeleteUsers token={this.token} />}
                        {type === 2 && <SlotDeletion token={this.token} />}
                        {type === 3 && <SlotAddition token={this.token} />}
                        {type === 4 && <UserRegistration token={this.token} />}
                        {type === 5 && <Reports token={this.token} />}
                        {type === 6 && <PendingFaculty token={this.token} />}
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default AdminComponent;