import React from 'react';
import ProfileCard from './ProfileCard';
import kevin from './profileAssets/kevin.jpg'
import './AboutPage.css';

const AboutPage = () => {
    const KevinProfile = () =>
        <ProfileCard image={kevin} name="Kevin" title="Lord Eternal"
            linkedin="https://www.linkedin.com/in/iris-liu-curiously/"
            email="liu.i@northeastern.edu" />
    return (
        <div className="about-page">
            <div className="page-title">
                <h1>ABOUT US</h1>
                <h2>Team Description</h2>
            </div>
            <div className="profile-cards-section">
                <KevinProfile/> <KevinProfile/> <KevinProfile/> <KevinProfile/> <KevinProfile/> <KevinProfile/> <KevinProfile/>
            </div>
        </div>
    );
}

export default AboutPage;