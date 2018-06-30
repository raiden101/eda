import React from 'react';
import './About.css';
import logo from './logo.png';

export default () => {
    return (
        <div className = "about">
            <img src={logo} alt="logo" />
            <h3>A Finite loop product.</h3>
        </div>
    )
}