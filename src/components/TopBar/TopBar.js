import React, { Component } from 'react';
import './TopBar.css';
import logo from './logo.png';
import { Link } from 'react-router-dom';
class TopBar extends Component{
    render() {
        return <div className="top-bar">
				<img src={logo} height="50px" alt="logo" className="topbar-icon" />
                <Link to="/login" className="action action-right">
                        <i className="fa fa-sign-out-alt" /> Logout
                </Link>
                <Link to="/login" className="action action-right">
                    <i className="fa fa-info-circle" /> About
                </Link>
			</div>;
    }
}
export default TopBar;