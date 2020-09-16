import React, { useState } from 'react';
import './ProfileCard.css';

/**
 * 
 * @param props 
 * @param props.image filepath to the image
 * @param props.name name of the person
 * @param props.title position title of the person
 * @param props.email email address of the person
 * @param props.linkedin linkedin url of the person
 */
const ProfileCard = (props:
    { image: string, name: string, title: string, email: string, linkedin: string }) => {
    const [hovered, setHovered] = useState(false);

    //TODO all these images need to be hosted somewhere?
    const Overlay = () => (
        <div className="image-overlay">
            <a href={props.linkedin} target="_blank">
                <div className="icon">
                    <img src="https://www.iconsdb.com/icons/preview/white/linkedin-xxl.png" />
                </div>
            </a>
            <a href={`mailto:${props.email}`}>
                <div className="icon">
                    <img src="https://www.iconsdb.com/icons/preview/white/envelope-closed-xxl.png" />
                </div>
            </a>
        </div>
    )
    return (
        <div className="profile-card">
            <div className="image"
                onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                {hovered && <Overlay />}
                <img src={props.image} />
            </div>
            <div className="caption">
                <p className="name">{props.name}</p>
                <p className="title">{props.title}</p>
            </div>
        </div>
    );
}

export default ProfileCard;