import React from 'react';
import ProfileCard from './ProfileCard';
import kevin from './profileAssets/kevin.jpg';

const AboutPage = () => {
    const KevinProfile = () =>
        <ProfileCard image={kevin} name="Kevin" title="Lord Eternal"
            linkedin="https://www.linkedin.com/in/iris-liu-curiously/"
            email="liu.i@northeastern.edu" />
    return (
        <div className="absolute w-full min-h-full bg-offwhite bg-about bg-no-repeat bg-scroll bg-bottom bg-stretchBottom">
            <div>
                <h1 className="mt-24 text-6xl font-sans text-teal font-bold italic">
                    ABOUT US
                </h1>
                <h2 className="text-navy text-xl">
                    Team Description
                </h2>
            </div>
            <div id="profile-cards-section" className="m-auto mt-32 w-3/4 flex flex-wrap justify-center">
                <KevinProfile/> <KevinProfile/> <KevinProfile/> <KevinProfile/> <KevinProfile/> <KevinProfile/> <KevinProfile/>
            </div>
        </div>
    );
}

export default AboutPage;