import React from 'react';
import logo from './sandbox_logo.png';

export default function Navbar() {
    return (
        <nav id="navbar-container" className="flex justify-between bg-navbar px-2 font-opensans font-bold">
            <div id="logo-container" className="flex px-40 py-1">
                <img src={logo} className="h-10" alt="logo" />
            </div>
            <div id="links-container" className="py-3 justify-between list-none">
                <ul id="nav-list" className="flex px-40">
                    <li id="nav-item" className="mx-8 border-b-2 border-transparent hover:border-teal duration-300 ease-in-out">
                        <a className="" href="/home">
                            <p className="text-xs text-white uppercase">
                                Home
                            </p>
                        </a>
                    </li>
                    <li id="nav-item" className="mx-8 border-b-2 border-transparent hover:border-teal duration-300 ease-in-out">
                        <a className="" href="/modules">
                            <p className="text-xs text-white uppercase">
                                Modules
                            </p>
                        </a>
                    </li>
                    <li id="nav-item" className="mx-8 border-b-2 border-transparent hover:border-teal duration-300 ease-in-out">
                        <a className="" href="/about">
                            <p className="text-xs text-white uppercase">
                                About
                            </p>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
