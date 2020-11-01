import React from "react";
import GaussianBlurDemo from "../modules/computerVision/gaussianBlur/GaussianBlurDemo";
import GaborDemo from "../modules/computerVision/gaborFilter/gaborFilter";
import DiffOfGaussian from "../modules/computerVision/diffofgaussian/DiffOfGaussian";
import HaarWaveletDemo from "../modules/computerVision/haarWavelet/HaarWaveletDemo";
import { ImageSelectableDemo } from "../modules/computerVision/imageSelector/ImageSelectableDemo";
import  { PCADemoIris } from "../modules/stateSpaces/pca/PCAIris";

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

export default function ModuleSection(props) {
    const scheme = props.colorScheme === 'dark' ? {
        "bgColor": "bg-moduleDarkBlue",
        "titleColor": "text-modulePaleBlue",
        "headingColor": "text-moduleTeal",
        "bodyColor": "text-moduleOffwhite"
    } : {
        "bgColor": "bg-modulePaleBlue",
        "titleColor": "text-moduleNavy",
        "headingColor": "text-moduleDarkBlue",
        "bodyColor": "text-moduleNavy"
    };
    const DemoComp = props.demoComp;

    return (
        <div className={`flex flex-col w-screen ${scheme.bgColor}`}>
            <div className="mx-40">
                <p className={`my-12 text-6xl italic font-bold font-opensans ${scheme.titleColor}`}>{props.title}</p>
                <ul className="">
                    {
                        props.sections.map((section, index) => {
                            const imgL = <img src={process.env.PUBLIC_URL + section.imgSrc}
                                             className={section.imgSrc === '/blank.png' ? 'object-none' : 'object-contain w-1/4 mr-16 -mt-4'} alt=""/>;
                            const imgR = <img src={process.env.PUBLIC_URL + section.imgSrc}
                                              className={section.imgSrc === '/blank.png' ? 'object-none' : 'object-contain w-1/4 mr-16 -mt-4'} alt=""/>;
                            return (
                                <div className="flex flex-row mx-2" key={index}>
                                    {section.imgSrc !== "" && index % 2 !== 0 && imgL}
                                    <div className="w-2/3 flex-col">
                                        {/*<p className={`my-4 text-left text-5xl font-extrabold font-opensans uppercase ${scheme.headingColor}`}>{section.heading}</p>*/}
                                        <p className={`my-2 text-left text-lg font-medium font-mono ${scheme.bodyColor}`}>{section.body || lorem}</p>
                                    </div>
                                    {section.imgSrc !== "" && index % 2 === 0 && imgR}
                                </div>
                            );
                        })
                    }
                </ul>
                {
                    getDemo(DemoComp, scheme)
                }
            </div>
        </div>
    );
}

function getDemo(comp, scheme) {
    const demoArgs = {labelColor: scheme.titleColor}
    switch (comp) {
        case "GaussianBlurDemo": 
            return <ImageSelectableDemo Demo={GaussianBlurDemo} initImg='purpleFlowers.jpeg' demoProps={demoArgs}/>
        case "GaborDemo": 
            return <ImageSelectableDemo Demo={GaborDemo} initImg='zebra.jpg' demoProps={demoArgs}/>
        case "DiffOfGaussian": 
            return <ImageSelectableDemo Demo={DiffOfGaussian} initImg='tabbyCat.jpg' demoProps={demoArgs}/>
        case "HaarWaveletDemo": 
            return <ImageSelectableDemo Demo={HaarWaveletDemo} initImg='bwWoman.jpg' demoProps={demoArgs}/>
        case "PCADemo":
            return <PCADemoIris {...demoArgs}/>
        default: return <div></div>
    }
}
