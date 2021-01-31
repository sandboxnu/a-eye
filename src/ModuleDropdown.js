import React from 'react';
import descriptions from './media/modules/module_descriptions.json';

export default class ModuleDropdown extends React.Component {
  state = {
    buttonHover: false,
    dropdownHover: false,
  };

  render() {
    return (
      <div className="">
        <button
          onMouseOver={() =>
            this.setState(prevState => ({
              buttonHover: true,
              dropdownHover: prevState.dropdownHover,
            }))}
          onMouseOut={() =>
            this.setState(prevState => ({
              buttonHover: false,
              dropdownHover: prevState.dropdownHover,
            }))}
        >
          <p className="text-xs text-white uppercase font-opensans font-bold">
            Modules
          </p>
        </button>
        <div
          className={`absolute ${
            !(this.state.buttonHover || this.state.dropdownHover) && 'hidden'
          } -mt-1 -ml-10 justify-start rounded-b divide-y divide-moduleDarkBlue bg-navbar`}
          onMouseOver={() =>
            this.setState(prevState => ({
              buttonHover: prevState.buttonHover,
              dropdownHover: true,
            }))}
          onMouseOut={() =>
            this.setState(prevState => ({
              buttonHover: prevState.buttonHover,
              dropdownHover: false,
            }))}
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
}
