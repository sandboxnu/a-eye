/* eslint-disable */

import React from 'react';
import CSS from 'csstype';
import background_img from '../media/landingPage/background.jpeg';
import landing_background from '../media/landingPage/background_landing_page.svg';
import descriptions from '../media/modules/module_descriptions.json';
import ModuleIntro from './ModuleIntro';

const topStyle: CSS.Properties = { backgroundImage: `url(${background_img})` };
const botStyle: CSS.Properties = {
  backgroundImage: `url(${landing_background})`,
};

/**
 * Renders the landing page.
 */
export default function LandingPage() {
  return (
    <div className="container w-screen">
      <div
        className="flex justify-center items-center bg-fixed bg-cover w-screen h-screen"
        style={topStyle}
      >
        <div className="mb-16">
          <p className="text-center text-white text-7xl italic font-semibold font-mono my-4">
            Your Eye and AI
          </p>
          <p className="text-center text-white text-3.5xl font-medium font-mono my-4">
            Professor Mingolla
          </p>
        </div>
        <div className="absolute bottom-0 mb-20">
          <p className="text-white text-2xl italic font-mono font-micro">
            Developed by Sandbox
          </p>
        </div>
      </div>
      <div
        className="flex items-center bg-cover w-screen h-auto"
        style={botStyle}
      >
        <ul className="list-none">
          {descriptions.modules
            .filter(module => module.parentModule === "")
            .map(module =>
              module.active ? (
                <a href={`/modules/${module.path}`}>
                  <li className="flex justify-center my-48">
                    <ModuleIntro
                      title={module.title}
                      body={module.body}
                      bgColor={module.bgColor}
                      key={module.number.toString()}
                      textColor={module.textColor}
                      margin={module.margin}
                      imgSrc={module.imgSrc}
                      active={module.active}
                    />
                  </li>
                </a>
              ) : (
                <div>
                  <li className="flex justify-center my-48">
                    <ModuleIntro
                      title={module.title}
                      body={module.body}
                      bgColor={module.bgColor}
                      key={module.number.toString()}
                      textColor={module.textColor}
                      margin={module.margin}
                      imgSrc={module.imgSrc}
                      active={module.active}
                    />
                  </li>
                </div>
              ),
            )
          }
        </ul>
      </div>
    </div>
  );
}
