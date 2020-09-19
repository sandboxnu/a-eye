import React from 'react';

export default function Navbar() {
    return (
        <nav id="navbar-container" className="flex justify-between bg-navygreen py-3 px-2">
            <div id="logo-container" className="flex px-40">
                <p className="text-lg font-bold text-white uppercase">
                    Logo
                </p>
            </div>
            <div id="links-container" className="justify-between list-none">
                <ul id="nav-list" className="flex px-40">
                    <li id="nav-item" className="mx-8 border-b-2 border-transparent hover:border-teal duration-300 ease-in-out">
                        <a className="" href="/home">
                            <p className="text-xs font-bold text-white uppercase">
                                Home
                            </p>
                        </a>
                    </li>
                    <li id="nav-item" className="mx-8 border-b-2 border-transparent hover:border-teal-300 duration-300 ease-in-out">
                        <a className="" href="/modules">
                            <p className="text-xs font-bold text-white uppercase">
                                Modules
                            </p>
                        </a>
                    </li>
                    <li id="nav-item" className="mx-8 border-b-2 border-transparent hover:border-teal-300 duration-300 ease-in-out">
                        <a className="" href="/about">
                            <p className="text-xs font-bold text-white uppercase">
                                About
                            </p>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
