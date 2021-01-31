import React from 'react';
import ModuleDropdown from './ModuleDropdown';
import logo from './media/landingPage/logo_blink.svg';

export default function Navbar() {
  return (
    <nav className="flex justify-between px-2 bg-navbar" id="navbar-container">
      <div className="flex my-1 ml-6 sm:ml-12 lg:ml-40" id="logo-container">
        <a href="/">
          <object className="pointer-events-none py-2 w-24 h-10" type="image/svg+xml" data={logo}>Logo</object>
        </a>
      </div>
      <div className="my-3 justify-between" id="links-container">
        <ul className="flex sm:mr-6 lg:mr-40" id="nav-list">
          <li className="mr-8 border-b-2 border-transparent hover:border-teal-a-eye duration-300 ease-in-out">
            <a className="" href="/"><p className="text-xs text-white uppercase font-opensans font-bold">Home</p></a>
          </li>
          <li className="mx-8 -mt-1 border-b-2 border-transparent hover:border-teal-a-eye duration-300 ease-in-out">
            {/* <a className="" href="/modules"><p className="text-xs text-white uppercase font-opensans font-bold">Modules</p></a> */}
            <ModuleDropdown />
          </li>
          <li className="mx-8 border-b-2 border-transparent hover:border-teal-a-eye duration-300 ease-in-out">
            <a className="" href="/about"><p className="text-xs text-white uppercase font-opensans font-bold">About</p></a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
