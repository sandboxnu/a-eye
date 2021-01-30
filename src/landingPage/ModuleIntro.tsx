import React from 'react';

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
export default function ModuleIntro(props:
    {title: string, body: string, bgColor: string, textColor: string, margin: string, imgSrc: string}) {
    return (
        <div className={`flex-col w-full md:w-2/3 mx-4 md:mx-0 py-6 shadow-module rounded-module ${props.bgColor} ${props.textColor} md:${props.margin}`}>
            <h1 className="text-3.5xl float-left italic font-bold font-opensans mt-5 ml-10">{props.title}</h1>
            <div className="flex-col md:flex-row inline-flex justify-between m-8 mt-4">
                <img src={process.env.PUBLIC_URL + props.imgSrc} className="md:w-1/4 ml-4 object-contain" alt="img"/>
                <p className="md:w-2/3 text-base font-mono my-4 text-left">{props.body}</p>
            </div>
        </div>
    );
};