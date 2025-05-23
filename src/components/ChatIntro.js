import React from 'react';
import './ChatIntro.css';
import logo from '../assets/logo.png';

export default () => {
    return(
        <div className="chatIntro">
            <img src={logo} alt="" />
            <h1>Utilize o whatsgram 2 com moderação</h1>
        </div>
    )
}