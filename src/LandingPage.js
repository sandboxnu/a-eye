import React from 'react';
import background_img from './media/background.jpeg';

let div_style = {
    backgroundImage: `url(${background_img})`
};

export default function LandingPage() {
  return (
    <div className="bg-fixed bg-cover w-screen h-screen" style={div_style}>

    </div>
  );
};