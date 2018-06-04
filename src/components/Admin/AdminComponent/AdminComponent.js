import React, { Component, Fragment } from 'react';
import './AdminComponent.css';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import SelectedSlots from '../SelectedSlots/SelectedSlots';
import DeleteUsers from '../DeleteUsers/DeleteUsers';
import SlotDeletion from '../SlotDeletion/SlotDeletion';

class AdminComponent extends Component{
    constructor(props) {
        super(props);
        this.token = JSON.parse(localStorage.getItem("auth")).token;
    }
    state = {
        type:2
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
                            </Select>
                        </FormControl>
                    </div>
                    <div className="details">
                        {!type && <SelectedSlots token={this.token}/>}
                        {type === 1 && <DeleteUsers token={this.token} />}
                        {type === 2 && <SlotDeletion token={this.token} />}
                        
                    </div>
                </div>
            </Fragment>
        );
    }
}
export default AdminComponent;