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
        <div className="flex justify-center items-center bg-fixed bg-cover w-screen h-screen" style={top_style}>
            <div className="mb-16">
                <p className="text-center text-white text-7xl italic font-semibold font-mono my-4">Your Eye and AI</p>
                <p className="text-center text-white text-3.5xl font-medium font-mono my-4">Professor Mingolla</p>
            </div>
            <div className="absolute bottom-0 mb-20">
                <p className="text-white text-2xl italic font-mono font-micro">Developed by Sandbox</p>
            </div>
        </div>
        <div className="flex items-center bg-cover w-screen h-auto" style={bot_style}>
            <ul className="list-none">
                {
                    descriptions.modules.map((module) =>
                        <a href={`/modules/${module.path}`}>
                            <li className="flex justify-center my-48">
                                <ModuleIntro title={module.title} body={module.body} bgColor={module.bgColor}
                                             textColor={module.textColor} margin={module.margin} imgSrc={module.imgSrc}/>
                            </li>
                        </a>
                    )
                }
            </ul>
        </div>
      </div>
  );
};