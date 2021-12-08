/* eslint-disable */
import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import descriptions from './media/modules/module_descriptions.json';

export default function ModuleDropdown() {
  const [cookies, setCookies] = useCookies(['isAuthenticated']);
  const [hover, setHover] = useState({ button: false, dropdown: false });

  return (
    <div className="">
      <button onMouseOver={() => setHover({ button: cookies.isAuthenticated === "true", dropdown: hover.dropdown })}
              onMouseOut={() => setHover({ button: false, dropdown: hover.dropdown })}
              onClick={() => {
                  if (cookies.isAuthenticated !== 'true') {
                      const response = prompt('Enter The Modules Password');
                      setCookies('isAuthenticated', response === 'SandboxNU', {path: '/'});
                  }
              }}>
          <p className={`text-xs ${cookies.isAuthenticated === 'true' ? "text-white" : ""} uppercase font-opensans font-bold`}>Modules</p>
      </button>
      <div className={`absolute ${!(hover.button || hover.dropdown) && "hidden"} -mt-1 -ml-10 justify-start rounded-b divide-y divide-moduleDarkBlue bg-navbar`}
              onMouseOver={() => setHover({ button: hover.button, dropdown: cookies.isAuthenticated === "true"})}
              onMouseOut={() => setHover({ button: hover.button, dropdown: false})}>
          <br />
          {
              descriptions.modules.map((module) =>
                  <div className="py-1 mx-2 text-left whitespace-pre" key={module.dropdownTitle}>
                      <a className="text-xs uppercase font-opensans font-bold text-white hover:text-moduleTeal" href={`/modules/${module.path}`} key={module.number.toString()}>
                          {(module.parentModule ? "\t" : "") + module.dropdownTitle}
                      </a>
                  </div>
              )
          }
      </div>
    </div>
  );
}