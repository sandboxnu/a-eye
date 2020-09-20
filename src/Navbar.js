import React from 'react';
//import logo from './sandbox_logo.png';
import logo from './media/logo.svg';

export default function Navbar() {
    return (
        <nav className="flex justify-between px-2 bg-navbar" id="navbar-container">
            <div className="flex my-1 ml-6 sm:ml-12 lg:ml-40" id="logo-container">
                <object className="w-24 h-10" type="image/svg+xml" data={logo}>Logo</object>
            </div>
            <div className="my-3 justify-between" id="links-container">
                <ul className="flex sm:mr-6 lg:mr-40" id="nav-list">
                    <li className="mr-8 border-b-2 border-transparent hover:border-teal-300 duration-300 ease-in-out">
                        <a className="" href="/home"><p className="text-xs text-white uppercase font-opensans font-bold">Home</p></a>
                    </li>
                    <li className="mx-8 border-b-2 border-transparent hover:border-teal-300 duration-300 ease-in-out">
                        <a className="" href="/modules"><p className="text-xs text-white uppercase font-opensans font-bold">Modules</p></a>
                    </li>
                    <li className="mx-8 border-b-2 border-transparent hover:border-teal-300 duration-300 ease-in-out">
                        <a className="" href="/about"><p className="text-xs text-white uppercase font-opensans font-bold">About</p></a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
