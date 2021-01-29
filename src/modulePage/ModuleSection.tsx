import React from "react";
import GaussianBlurDemo from "../modules/computerVision/gaussianBlur/GaussianBlurDemo";
import GaborDemo from "../modules/computerVision/gaborFilter/gaborFilter";
import DiffOfGaussianDemo from "../modules/computerVision/diffofgaussian/DiffOfGaussian";
import HaarWaveletDemo from "../modules/computerVision/haarWavelet/HaarWaveletDemo";
import { ImageSelectableDemo } from "../modules/computerVision/imageSelector/ImageSelectableDemo";
import PCADemo from "../modules/stateSpaces/pca/PCA";
import {RawDataTable, SelectableAxisChart, StaticAxisChart, AxisSelector, config as pcaConfig} from "../modules/stateSpaces/pca/PCA";
import KMeans, {MyDemo, MyScatter2, config as kmeansConfig} from '../modules/stateSpaces/kmeans/kmeans';
import {ModuleSubsection} from "./ModulePage";

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
interface ColorScheme {
    "bgColor": string,
    "titleColor": string,
    "headingColor": string,
    "bodyColor": string,
    "labelColorHex": string
}

export default function ModuleSection(props:
    {title: string, sections: ModuleSubsection[], colorScheme: string, key: string, demoComp: string}) {
    const scheme = props.colorScheme === 'dark' ? {
        "bgColor": "bg-moduleDarkBlue",
        "titleColor": "text-modulePaleBlue",
        "headingColor": "text-moduleTeal",
        "bodyColor": "text-moduleOffwhite",
        "labelColorHex": "#CBD9F2"
    } : {
        "bgColor": "bg-modulePaleBlue",
        "titleColor": "text-moduleNavy",
        "headingColor": "text-moduleDarkBlue",
        "bodyColor": "text-moduleNavy",
        "labelColorHex": "#394D73"
    };

    return (
        <div className={`flex flex-col w-screen ${scheme.bgColor}`}>
            <div className="mx-12 md:mx-40">
                <p className={`my-12 text-3xl md:text-6xl italic font-bold font-opensans ${scheme.titleColor}`}>{props.title}</p>
                <ul className="">
                    {
                        props.sections.map((section, index) => {
                            return (
                                <div className={`flex flex-col md:flex-row mx-2 md:my-5 ${section.imgSrc === '/blank.png' && "my-10"} ${section.body ? "" : "hidden"}`} key={index}>
                                    <img src={process.env.PUBLIC_URL + section.imgSrc} alt=""
                                         className={`hidden ${index % 2 !== 0 && "md:flex"} ${section.imgSrc === '/blank.png' ? "hidden md:object-none" : "object-contain"} md:w-1/4 md:mr-16 md:-mt-12`}/>
                                    <div className="md:w-2/3 flex-col">
                                        <p className={`my-2 text-left text-lg font-medium font-mono ${scheme.bodyColor}`}>{section.body || lorem}</p>
                                    </div>
                                    <img src={process.env.PUBLIC_URL + section.imgSrc} alt=""
                                         className={`${index % 2 !== 0 && "md:hidden"} ${section.imgSrc === '/blank.png' ? "hidden md:object-none" : "object-contain"} md:w-1/4 md:mr-16 md:-mt-12`}/>
                                </div>
                            );
                        })
                    }
                </ul>
                {
                    getDemo(props.demoComp, scheme)
                }
            </div>
        </div>
    );
}

function getDemo(comp: string, scheme: ColorScheme) {
    const demoArgs = {labelColor: scheme.titleColor}

    switch (comp) {
        case "GaussianBlurDemo": 
            return <ImageSelectableDemo Demo={GaussianBlurDemo} initImg='purpleFlowers.jpeg' demoProps={demoArgs}/>
        case "GaborDemo": 
            return <ImageSelectableDemo Demo={GaborDemo} initImg='zebra.jpg' demoProps={demoArgs}/>
        case "DiffOfGaussian": 
            return <ImageSelectableDemo Demo={DiffOfGaussianDemo} initImg='tabbyCat.jpg' demoProps={demoArgs}/>
        case "HaarWaveletDemo": 
            return <ImageSelectableDemo Demo={HaarWaveletDemo} initImg='bwWoman.jpg' demoProps={demoArgs}/>
        case "PCADemo":
            return <PCADemo {...demoArgs} labelColorHex=''/>
        case "RawDataTable":
            return <RawDataTable />
        case "StaticAxisChart":
            return <StaticAxisChart xIdx={4} yIdx={5} columnSet={pcaConfig.columns} classes={["versicolor", "setosa"]} labelColorHex={scheme.labelColorHex}/>
        case "SelectableAxisChart":
            return <SelectableAxisChart columnSet={pcaConfig.columns} initXIdx={4} initYIdx={5} labelColor={scheme.titleColor} labelColorHex={scheme.labelColorHex}/>
        case "PCASelectableAxisChart":
            return <SelectableAxisChart columnSet={pcaConfig.pcaColumns} initXIdx={0} initYIdx={1} labelColor={scheme.titleColor} labelColorHex={scheme.labelColorHex}/>
        case "InteractiveKMeans":
            return <div><MyScatter2 clstrs ={kmeansConfig.ans1['clusters']} cntrds = {kmeansConfig.ans0['centroids']} hidden = {false} /></div>
        case "StepKMeans":
            return <div><MyDemo kmeans_gen={kmeansConfig.ans2} hidden = {false}/></div>
        case "KMeans":
            return <KMeans />
        default: return <div></div>
    }
}