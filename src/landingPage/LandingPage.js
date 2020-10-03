import React from 'react';
import background_img from '../media/background.jpeg';
import landing_background from '../media/background_landing_page.svg';
import descriptions from '../media/module_descriptions.json';
import ModuleIntro from "./ModuleIntro";

let top_style = {backgroundImage: `url(${background_img})`};
let bot_style = {backgroundImage: `url(${landing_background})`};

export default function LandingPage() {
  return (
      <div className="container w-screen">
        <div className="bg-fixed bg-cover w-screen h-screen" style={top_style}>

        </div>
        <div className="flex items-center bg-cover w-screen h-auto" style={bot_style}>
            <ul className="list-none">
                {
                    descriptions.modules.map((module) =>
                        <li className="flex justify-center my-10">
                            <ModuleIntro title={module.title} body={module.body} bgColor={module.bgColor} textColor={module.textColor} />
                        </li>
                    )
                }
            </ul>
        </div>
      </div>
  );
};