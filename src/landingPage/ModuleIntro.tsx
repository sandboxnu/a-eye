import React from 'react';
import mod8 from '../media/modules/mod8.png';
import mod9 from '../media/modules/mod9.png';
import mod10 from '../media/modules/mod10.png';
import mod11 from '../media/modules/mod11.png';

function getCoverImage(imgName: string) {
  switch (imgName) {
    case 'mod8':
      return mod8;
    case 'mod9':
      return mod9;
    case 'mod10':
      return mod10;
    case 'mod11':
      return mod11;
    default:
      return undefined;
  }
}

/**
 * Renders one of the module previews on the landing page.
 *
 * @param props.title module title
 * @param props.body module description
 * @param props.bgColor background color of module (as a tailwind class)
 * @param props.textColor text color of module (as a tailwind class)
 * @param props.margin x-margin of module (as a tailwind class), either left or right margin
 * @param props.imgSrc name of image on module
 */
type ModuleIntroType = {
  title: string;
  body: string;
  bgColor: string;
  textColor: string;
  margin: string;
  imgSrc: string;
};
const ModuleIntro: React.FC<ModuleIntroType> = ({
  title,
  body,
  bgColor,
  textColor,
  margin,
  imgSrc,
}) => (
  <div
    className={`flex-col w-full md:w-2/3 mx-4 md:mx-0 py-6 shadow-module rounded-module ${bgColor} ${textColor} md:${margin}`}
  >
    <h1 className="text-3.5xl float-left italic font-bold font-opensans mt-5 ml-10">
      {title}
    </h1>
    <div className="flex-col md:flex-row inline-flex justify-between m-8 mt-4">
      <img
        src={getCoverImage(imgSrc)}
        className="md:w-1/4 ml-4 object-contain"
        alt="img"
      />
      <p className="md:w-2/3 text-base font-mono my-4 text-left">{body}</p>
    </div>
  </div>
);

export default ModuleIntro;
