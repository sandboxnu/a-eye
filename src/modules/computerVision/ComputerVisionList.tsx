/* eslint-disable */

import React from 'react';
import landing_background from '../../media/landingPage/background_landing_page.svg';
import descriptions from '../../media/modules/module_descriptions.json';
import ModuleIntro from 'landingPage/ModuleIntro';

export default function ComputerVisionList() {
    return (
      <div
        className="flex items-center bg-cover w-screen h-auto"
        style={{ backgroundImage: `url(${landing_background})` }}
      >
        <ul className="list-none">
          {descriptions.modules
            .filter(module => module.parentModule === "Computer Vision")
            .map(module => (
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
            ))
          }
        </ul>
      </div>
    )
}