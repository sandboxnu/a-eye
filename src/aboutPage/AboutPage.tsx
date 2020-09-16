import React from 'react';
import ProfileCard from './ProfileCard';
import "./AboutPage.css";

const AboutPage = () => {
    return (
        <div className="about-page">
            <div className="page-title">
                <h1>ABOUT US</h1>
                <h2>Team Description</h2>
            </div>
            <div className="profile-cards-section">
                <ProfileCard image="https://i.pinimg.com/originals/eb/7b/f6/eb7bf67ef70d555c77dff38e01daba8d.jpg" name="Kevin" title="Lord Eternal"
                    linkedin="https://www.linkedin.com/in/iris-liu-curiously/" 
                    email="liu.i@northeastern.edu" />
            </div>
        </div>
    );
}

export default AboutPage;