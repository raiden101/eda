import React, { Component, Fragment } from 'react';
import axios from 'axios';
import './DeleteUsers.css';
import IconButton from '@material-ui/core/IconButton';
import RenderTableSelectable from '../../RenderTable/RenderTableSelectable';
class DeleteUsers extends Component{
    constructor(props) {
        super(props);
        this.state = {
            users:[]
        }
        this.tableHeads = [
            "Username",
            "User ID",
            "Email",
            "Branch"
        ];
        this.unmounted = false;
    }
    removeElements = (elements) => {
        let users = [...this.state.users];
        elements.forEach((element, index) => {
            let elIndex = -1;
            users.forEach((e, i) => {
                if (e.fac_id === element)
                    elIndex = i;
            })
            users.splice(elIndex, 1);
        })
        this.setState({
            users: users
        });
        axios.post('http://localhost:5000/api/admin/delete_faculties', {
            token: this.props.token,
            fac_ids: elements
        }).then(console.log);
        return true;
    }
    selectedAction = (elements) => {
        return (
            <IconButton onClick={() => this.removeElements(elements)}>
                <i className="fa fa-trash" style={{fontSize:"19px"}}></i>
            </IconButton>
        );
    }
    componentDidMount() {
        console.log("getting data");
        axios.post('http://localhost:5000/api/admin/get_all_faculties', {
            token:this.props.token
        }).then((data) => {
            data = data.data;
            if (data.error === null) {
                !this.unmounted && this.setState({
                    ...this.state,
                    users:data.data
                })
            }
        })
    }


    translateSlotData(obj) {
        return [obj.fac_name.toLowerCase(),
            obj.fac_id,
            obj.email,
            obj.branch
        ];
    }
    render() {
        return (
            <Fragment>
                <RenderTableSelectable
                    data={this.state.users}
                    translate={this.translateSlotData}
                    heads={this.tableHeads}
                    onSelectConfirm={this.handleSelect}
                    title={"Faculty"}
                    selectedAction={this.selectedAction}
                />
            </Fragment>
        );
    }
}
export default DeleteUsers;