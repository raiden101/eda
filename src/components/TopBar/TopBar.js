import React, { Component } from 'react';
import './TopBar.css';
import { Link } from 'react-router-dom';
class TopBar extends Component{
    render() {
        return (
            <div className="top-bar">
                Nitte logo
                <div className="action action-right"><Link to="/login">Logout</Link></div>
            </div>
        );
    }
}
export default TopBar;