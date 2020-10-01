import React from 'react';
import background_img from '../media/background.jpeg';
import landing_background from '../media/background_landing_page.svg';
import ModuleIntro from "./ModuleIntro";

let top_style = {backgroundImage: `url(${background_img})`};

let bot_style = {backgroundImage: `url(${landing_background})`};

let lorem = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod';

export default function LandingPage() {
  return (
      <div className="container w-screen">
        <div className="bg-fixed bg-cover w-screen h-screen" style={top_style}></div>
        <div className="flex items-center bg-cover w-screen h-auto" style={bot_style}>
            <ul className="list-none">
                <li className="flex justify-center my-10">
                    <ModuleIntro title="Week 1: State Spaces" body={lorem} color="bg-lightblue"/>
                </li>
                <li className="flex justify-center my-10">
                    <ModuleIntro title="Week 1: State Spaces" body={lorem} color="bg-darkblue"/>
                </li>
                <li className="flex justify-center my-10">
                    <ModuleIntro title="Week 1: State Spaces" body={lorem} color="bg-offwhite"/>
                </li>
                <li className="flex justify-center my-10">
                    <ModuleIntro title="Week 1: State Spaces" body={lorem} color="bg-darkblue"/>
                </li>
            </ul>
        </div>
      </div>
  );
};