import React, { useState } from 'react';
import linkedinIcon from '../media/aboutPage/iconmonstr-linkedin-1.svg';
import emailIcon from '../media/aboutPage/mail-24px.svg';

/**
 *
 * @param props
 * @param props.image filepath to the image
 * @param props.name name of the person
 * @param props.title position title of the person
 * @param props.email email address of the person
 * @param props.linkedin linkedin url of the person
 */
type ProfileCardType = {
  image: string;
  name: string;
  title: string;
  email: string;
  linkedin: string;
};
const ProfileCard: React.FC<ProfileCardType> = ({
  image,
  name,
  title,
  email,
  linkedin,
}) => {
  const [hovered, setHovered] = useState(false);

  // TODO all these images need to be hosted somewhere?
  const Overlay = () => (
    <div
      id="image-overlay"
      className="bg-transteal absolute flex justify-center items-center h-48 w-48 rounded-full"
    >
      <a href={linkedin} target="_blank" rel="noopener noreferrer">
        <div
          id="icon linkedin"
          className="rounded-full bg-navy h-10 w-10 flex items-center justify-around m-3"
        >
          <img className="h-4" alt="LinkedIn Address" src={linkedinIcon} />
        </div>
      </a>
      <a href={`mailto:${email}`}>
        <div
          id="icon linkedin"
          className="rounded-full bg-navy h-10 w-10 flex items-center justify-around m-3"
        >
          <img
            className="relative -top-1 h-6"
            alt="Email Address"
            src={emailIcon}
          />
        </div>
      </a>
    </div>
  );
  return (
    <div id="profile-card" className="m-8">
      <div
        id="image"
        className="inline-block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {hovered && <Overlay />}
        <img className="h-48 w-48 rounded-full" alt="Profile" src={image} />
      </div>
      <div className="caption">
        <p id="name" className="font-bold text-bgdiff mb-0 blend-difference">
          {name}
        </p>
        <p id="title" className="italic text-teal-a-eye">
          {title}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
