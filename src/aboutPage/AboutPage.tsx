import React from 'react';
import ProfileCard from './ProfileCard';
import krishPic from './profileAssets/krishPic.png';
import liliPic from './profileAssets/liliPic.png';
import cassiePic from './profileAssets/cassiePic.png';
import danPic from './profileAssets/danPic.jpg';
import irisPic from './profileAssets/irisPic.jpg';
import maxPic from './profileAssets/maxPic.png';

const AboutPage = () => {
    return (
        <div className="relative inline-block w-full min-h-full bg-offwhite bg-about bg-no-repeat bg-scroll bg-bottom bg-stretchBottom">
            <div>
                <h1 className="mt-24 text-6xl font-sans text-teal-a-eye font-bold italic">
                    ABOUT US
                </h1>
                <h2 className="text-navy text-xl">
                    Team Description
                </h2>
            </div>
            <div id="profile-cards-section" className="m-auto mt-32 w-3/4 flex flex-wrap justify-center">
                <ProfileCard image={krishPic} name="Krish Sharma" title="Project Lead"
                    linkedin="https://www.linkedin.com/in/krish-sharma/"
                    email="sharma.kri@northeastern.edu" />
                <ProfileCard image={liliPic} name="Lili Kobayashi" title="Designer"
                    linkedin="http://linkedin.com/in/lili-kobayashi"
                    email="Kobayashi.l@northeastern.edu" />
                <ProfileCard image={cassiePic} name="Cassie Harbour" title="Developer"
                    linkedin=""
                    email="harbour.c@northeastern.edu" />
                <ProfileCard image={danPic} name="Dan Krasnonosenkikh" title="Developer"
                    linkedin="https://www.linkedin.com/in/dankrasno/"
                    email="krasnonosenkikh.d@northeastern.edu" />
                <ProfileCard image={irisPic} name="Iris Liu" title="Developer"
                    linkedin="https://www.linkedin.com/in/iris-liu-curiously"
                    email="liu.i@northeastern.edu" />
                <ProfileCard image={maxPic} name="Max Pinheiro" title="Developer"
                    linkedin="https://www.linkedin.com/in/max-pinheiro-4a5b11181/"
                    email="pinheiro.m@northeastern.edu" />
            </div>
        </div>
    );
}

export default AboutPage;