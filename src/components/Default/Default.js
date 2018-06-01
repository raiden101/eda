import React, { Component, Fragment } from 'react';
import checkAuth from '../../checkAuth';
import { Redirect } from 'react-router-dom';

class Default extends Component {
    state = {
        status: {
            status: 2
        }
    };
    refetch = () => {
        checkAuth().then((data) => {
            this.setState({
                ...this.state,
                ...data
            });
        }).catch(err => console.log);
    }
    componentDidMount() {
        this.refetch();
    }
    render() {
    
        let renderItem = <b>Loading...</b>
        if (this.state.status.status === 0) {
            renderItem = <Redirect to="/login" />
            this.setState({
                ...this.state,
                fetch: true
            })
        }
        else if (this.state.status.status === 1) {
            if (this.state.status.admin === 1) {
                renderItem = <Redirect to="/admin" />
            }
            else
                renderItem = <b>Normal route</b>
        }
        return (
            <Fragment>
                {renderItem}
            </Fragment>
        )
    }
}
export default Default;