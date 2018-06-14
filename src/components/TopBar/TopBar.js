import React, { Component } from 'react';
import './TopBar.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';
class TopBar extends Component{
    render() {
        return (
            <div className="top-bar">
                <img src={logo} height="50px" alt="logo" className="topbar-icon"/>
                <div className="action action-right"><Link to="/login"><i className="fa fa-sign-out-alt"></i>Logout</Link></div>
                <div className="action action-right"><Link to="/about"><i className = "fa fa-info-circle"></i>About</Link></div>
            </div>
        );
    }
}
export default TopBar;