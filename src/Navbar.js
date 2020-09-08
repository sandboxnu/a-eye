import React from 'react';
import './Navbar.css';

function Navbar() {
    return (
        <div className="navbar">
            <a className="active" href="/home">HOME</a>
            <a href="/modules">MODULES</a>
            <a href="/about">ABOUT</a>
        </div>
    );
}

export default Navbar;