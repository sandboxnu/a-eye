import React, { useState } from 'react';
import descriptions from './media/modules/module_descriptions.json';

export default function ModuleDropdown() {
  const [buttonHover, setButtonHover] = useState(false);
  const [dropdownHover, setDropdownHover] = useState(false);

  return (
    <div className="">
      <button
        type="button"
        onMouseOver={() => setButtonHover(true)}
        onBlur={() => setButtonHover(true)}
        onMouseOut={() => setButtonHover(false)}
        onFocus={() => setButtonHover(false)}
      >
        <p className="text-xs text-white uppercase font-opensans font-bold">
          Modules
        </p>
      </button>
      <div
        className={`absolute ${
          !(buttonHover || dropdownHover) && 'hidden'
        } -mt-1 -ml-10 justify-start rounded-b divide-y divide-moduleDarkBlue bg-navbar`}
        onMouseOver={() => setDropdownHover(true)}
        onBlur={() => setDropdownHover(true)}
        onMouseOut={() => setDropdownHover(false)}
        onFocus={() => setDropdownHover(false)}
      >
        <br />
        {descriptions.modules.map(module => (
          <div className="py-1 mx-2 text-left">
            <a
              className="text-xs uppercase font-opensans font-bold text-white hover:text-moduleTeal"
              href={`/modules/${module.path}`}
              key={module.number.toString()}
            >
              {module.dropdownTitle}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
