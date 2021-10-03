import React from 'react';
import ProfileCard from './ProfileCard';
import krishSharmaPic from '../media/aboutPage/krishSharmaPic.png';
import liliKobayashiPic from '../media/aboutPage/liliKobayashiPic.png';
import cassieHarbourPic from '../media/aboutPage/cassieHarbourPic.png';
import danKrasnonosenkikhPic from '../media/aboutPage/danKrasnonosenkikhPic.jpg';
import irisLiuPic from '../media/aboutPage/irisLiuPic.jpg';
import maxPinheiroPic from '../media/aboutPage/maxPinheiroPic.png';
import jakeChvatalPic from '../media/aboutPage/jakeChvatalPic.jpeg';
import stanWuPic from '../media/aboutPage/stanWuPic.jpg';
import angelaLinPic from '../media/aboutPage/angelaLinPic.jpg';
import connorBarkerPic from '../media/aboutPage/connorBarkerPic.jpg';
import michaelBriggsPic from '../media/aboutPage/michaelBriggsPic.jpg';
import johnCiolfiPic from '../media/aboutPage/johnCiolfiPic.png';
import jakeDuffyPic from '../media/aboutPage/jakeDuffyPic.jpg';
import lindaZengPic from '../media/aboutPage/lindaZengPic.jpg';

const AboutPage = () => (
  <div className="relative inline-block w-full min-h-full bg-offwhite bg-about bg-no-repeat bg-scroll bg-bottom bg-stretchBottom">
    <div>
      <h1 className="mt-24 text-6xl font-sans text-teal-a-eye font-bold italic">
        ABOUT US
      </h1>
      <h2 className="text-navy text-xl">Team Description</h2>
    </div>
    <h2 className="text-navy text-4xl mt-16">Current Members</h2>
    <div
      id="current-profile-cards-section"
      className="m-auto mb-16 w-3/4 flex flex-wrap justify-center"
    >
      <ProfileCard
        image={maxPinheiroPic}
        name="Max Pinheiro"
        title="Project Lead"
        linkedin="https://www.linkedin.com/in/max-pinheiro-4a5b11181/"
        email="pinheiro.m@northeastern.edu"
      />
      <ProfileCard
        image={cassieHarbourPic}
        name="Cassie Harbour"
        title="Developer"
        linkedin=""
        email="harbour.c@northeastern.edu"
      />
      <ProfileCard
        image={connorBarkerPic}
        name="Connor Barker"
        title="Developer"
        linkedin="https://www.linkedin.com/in/connorlbark/"
        email="barker.co@northeastern.edu"
      />
      <ProfileCard
        image={michaelBriggsPic}
        name="Michael Briggs"
        title="Developer"
        linkedin="https://www.linkedin.com/in/owanari-briggs-b9871819b/"
        email="briggs.ow@northeastern.edu"
      />
      <ProfileCard
        image={johnCiolfiPic}
        name="John Ciolfi"
        title="Developer"
        linkedin="https://www.linkedin.com/in/johnciolfi/"
        email="ciolfi.j@northeastern.edu"
      />
      <ProfileCard
        image={jakeDuffyPic}
        name="Jake Duffy"
        title="Developer"
        linkedin="https://www.linkedin.com/in/jake-duffy/"
        email="duffy.jak@northeastern.edu"
      />
      <ProfileCard
        image={lindaZengPic}
        name="Linda Zeng"
        title="Designer"
        linkedin=""
        email=""
      />
    </div>
    <h2 className="text-navy text-4xl mt-16">Former Members</h2>
    <div
      id="former-profile-cards-section"
      className="m-auto mb-16 w-3/4 flex flex-wrap justify-center"
    >
      <ProfileCard
        image={krishSharmaPic}
        name="Krish Sharma"
        title="Former Project Lead"
        linkedin="https://www.linkedin.com/in/krish-sharma/"
        email="sharma.kri@northeastern.edu"
      />
      <ProfileCard
        image={liliKobayashiPic}
        name="Lili Kobayashi"
        title="Former Designer"
        linkedin="http://linkedin.com/in/lili-kobayashi"
        email="Kobayashi.l@northeastern.edu"
      />
      <ProfileCard
        image={danKrasnonosenkikhPic}
        name="Dan Krasnonosenkikh"
        title="Former Developer"
        linkedin="https://www.linkedin.com/in/dankrasno/"
        email="krasnonosenkikh.d@northeastern.edu"
      />
      <ProfileCard
        image={irisLiuPic}
        name="Iris Liu"
        title="Former Developer"
        linkedin="https://www.linkedin.com/in/iris-liu-curiously"
        email="liu.i@northeastern.edu"
      />
      <ProfileCard
        image={jakeChvatalPic}
        name="Jake Chvatal"
        title="Former Developer"
        linkedin="https://linkedin.com/in/jacob-chvatal"
        email="jacob@chvatal.com"
      />
      <ProfileCard
        image={stanWuPic}
        name="Stanley Wu"
        title="Former Developer"
        linkedin="https://www.linkedin.com/in/stanleykywu"
        email="wu.sta@northeastern.edu"
      />
      <ProfileCard
        image={angelaLinPic}
        name="Angela Lin"
        title="Former Designer"
        linkedin="https://www.linkedin.com/in/angelalinzm"
        email="lin.angel@northeastern.edu"
      />
    </div>
  </div>
);

export default AboutPage;
