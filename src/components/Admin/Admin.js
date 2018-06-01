import React, { Component,Fragment } from 'react';
import checkAuth from '../../checkAuth';
import { Redirect } from 'react-router-dom';
class Admin extends Component{
    state = {
        redirect:false
    }
    componentDidMount() {
        checkAuth().then((data) => {
            console.log("admin :", data.admin !== 1);
            if (data.admin !== 1)
                this.setState({
                    ...this.state,
                    redirect: true
                });
        });
    }
    render() {
        let renderItem = this.state.redirect ? <Redirect to="/" /> : null;
        return (
            <Fragment>
                {renderItem}
                Admin component
            </Fragment>
        );
    }
}
export default Admin;