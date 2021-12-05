/* eslint-disable */
import React from "react";
import HistogramOfGradDemo from "modules/computerVision/histOfGrad/HistogramOfGradDemo";
import GaussianBlurDemo from "../modules/computerVision/gaussianBlur/GaussianBlurDemo";
import GaborDemo from "../modules/computerVision/gaborFilter/gaborFilter";
import DiffOfGaussianDemo from "../modules/computerVision/diffofgaussian/DiffOfGaussian";
import HaarWaveletDemo from "../modules/computerVision/haarWavelet/HaarWaveletDemo";
import { ImageSelectableDemo } from "../modules/computerVision/imageSelector/ImageSelectableDemo";
import PCADemo, {
  RawDataTable,
  SelectableAxisChart,
  StaticAxisChart,
  config as pcaConfig,
} from "../modules/stateSpaces/pca/PCA";

import KMeans, {
  KMeansStepExample,
  InteractiveClusteringExample,
} from "../modules/stateSpaces/kmeans";
import blank from "../media/modules/blank.png";
import animation1 from "../media/modules/computerVision/animation-1.gif";
import animation2 from "../media/modules/computerVision/animation-2.gif";
import animation3 from "../media/modules/computerVision/animation-3.gif";
import combinedSobelKernelExampleLight from "../media/modules/computerVision/combinedSobelKernelExampleLight.png";
import combinedSobelKernelExampleDark from "../media/modules/computerVision/combinedSobelKernelExampleDark.png";
import vertSobelExampleLight from "../media/modules/computerVision/sobelKernels/vertical_lighttodark.png";
import vertSobelExampleDark from "../media/modules/computerVision/sobelKernels/vertical_darktolight.png";
import MPNeuronDemo from "modules/perceptrons/mpNeuron/MPNeuronDemo";
import MLPNeuronDemo from "modules/perceptrons/mlpNeuron/MLPNeuronDemo";
import ComputerVisionList from "modules/computerVision/ComputerVisionList";
import hogBoatExample from "../media/modules/computerVision/hogBoatExample.png";
import { StandableSobelFilterDemo } from "modules/computerVision/sobelFilter/StandaloneSobelFilterDemo";
import RblattVectorsDemo from '../modules/perceptrons/rblattVectors/RblattVectorsDemo';
import RosenBlattDemo from "../modules/perceptrons/rosenblatt/RosenblattDemo";

const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

interface ColorScheme {
  bgColor: string;
  titleColor: string;
  headingColor: string;
  bodyColor: string;
  labelColorHex: string;
}

interface ModuleSubsection {
  title: string;
  body: string;
  imgSrc: string;
}

const imageDictionary: {[key: string]: any} = {
  "blank": blank,
  "animation1": animation1,
  "animation2": animation2,
  "animation3": animation3,
  "sobelKernelLight": vertSobelExampleLight,
  "sobelKernelDark": vertSobelExampleDark,
  "combinedSobelKernelLight": combinedSobelKernelExampleLight,
  "combinedSobelKernelDark": combinedSobelKernelExampleDark,
  "hogBoatExample": hogBoatExample,
}; 

function GetImage(imgName: string) {
  return imageDictionary[imgName];
}

function getImageSelectableDemo(demoType:any, image: string, demoArgs: any) {
  return (
    <ImageSelectableDemo
      Demo={demoType}
      initImg={image}
      demoProps={demoArgs}
    />
  ); 
}

function getStaticAxisChart(scheme: ColorScheme) {
  return (
    <StaticAxisChart
      labelColorHex={scheme.labelColorHex}
    />
  );
}
function getSelectableAxisChart(comp: string, xIndx: number, yIndx: number, scheme: ColorScheme) {
  return (<SelectableAxisChart
    columnSet={(comp == "SelectableAxisChart") ? pcaConfig.columns : pcaConfig.pcaColumns}
    initXIdx={xIndx}
    initYIdx={yIndx}
    labelColor={scheme.titleColor}
    labelColorHex={scheme.labelColorHex}
  />);
}

function getDemo(comp: string, scheme: ColorScheme) {
  const demoArgs = { labelColor: scheme.titleColor};
  const demoDictionary: {[key: string]: any} = {
    "GaussianBlurDemo": getImageSelectableDemo(GaussianBlurDemo, "purpleFlowers.jpeg", demoArgs),
    "GaborDemo": getImageSelectableDemo(GaborDemo, "zebra.jpg", demoArgs ),
    "DiffOfGaussian": getImageSelectableDemo(DiffOfGaussianDemo, "tabbyCat.jpg", demoArgs),
    "HaarWaveletDemo": getImageSelectableDemo(HaarWaveletDemo, "bwWoman.jpg", demoArgs),
    "SobelFilterDemo": getImageSelectableDemo(StandableSobelFilterDemo, "stopSign.jpeg", demoArgs),
    "HistogramOfGradDemo": getImageSelectableDemo(HistogramOfGradDemo, "stopSign.jpeg", demoArgs),
    "PCADemo": (<PCADemo {...demoArgs} />),
    "RawDataTable": (<RawDataTable />),
    "StaticAxisChart": getStaticAxisChart(scheme),
    "SelectableAxisChart": getSelectableAxisChart("SelectableAxisChart", 4, 5, scheme),
    "PCASelectableAxisChart": getSelectableAxisChart("PCASelectableAxisChart", 0, 1, scheme),
    "InteractiveKMeans": (<div><InteractiveClusteringExample hidden={false} /></div>),
    "StepKMeans": (<div><KMeansStepExample hidden={false} /></div>),
    "KMeans": (<KMeans />),
    "MPNeuronDemo": (<MPNeuronDemo labelColor={demoArgs.labelColor} canAddInputs={true} /> ),
    "MLPNeuronDemo": (<MLPNeuronDemo labelColor={demoArgs.labelColor}/>),
    "RblattVectorsDemo": (<RblattVectorsDemo labelColor={demoArgs.labelColor} />),
    "RblattDemo": (<RosenBlattDemo {...demoArgs}/>),
    "ComputerVisionList": (<ComputerVisionList />)
  };
  if (comp in demoDictionary){
    return demoDictionary[comp];
  }
  return <div />;
}

/**
 * Renders a single section on the module page.
 *
 * @param props.title section title
 * @param props.sections subsections of the section
 * @param props.colorScheme configuration for the section's color scheme, see ColorScheme interface
 * @param props.demoComp name of the React component used as a demo
 */
type ModuleSectionType = {
  title: string;
  sections: ModuleSubsection[];
  colorScheme: string;
  key: string;
  demoComp: string;
};
const ModuleSection: React.FC<ModuleSectionType> = ({
  title,
  sections,
  colorScheme,
  demoComp,
}) => {
  const scheme =
    colorScheme === "dark"
      ? {
          bgColor: "bg-moduleDarkBlue",
          titleColor: "text-modulePaleBlue",
          headingColor: "text-moduleTeal",
          bodyColor: "text-moduleOffwhite",
          labelColorHex: "#CBD9F2",
        }
      : {
          bgColor: "bg-modulePaleBlue",
          titleColor: "text-moduleNavy",
          headingColor: "text-moduleDarkBlue",
          bodyColor: "text-moduleNavy",
          labelColorHex: "#394D73",
        };

  return (
    <div className={`flex flex-col w-screen ${scheme.bgColor}`}>
      <div className="mx-12 md:mx-40">
            <p
              className={`my-12 text-3xl md:text-6xl italic font-bold font-opensans ${scheme.titleColor}`}
            >
              {title}
            </p>
        <ul className="">
          {/* eslint-disable-next-line */}
          {sections.map((section, index) => (
            <div
              className={`flex flex-col md:flex-row mx-2 md:my-5 ${
                section.imgSrc === "/blank.png" && "my-10"
              } ${section.body ? "" : "hidden"}`}
              // eslint-disable-next-line
              key={index}
            >
              <img
                src={GetImage(section.imgSrc)}
                alt=""
                className={`hidden ${index % 2 !== 0 && "md:flex"} ${
                  section.imgSrc === "/blank.png"
                    ? "hidden md:object-none"
                    : "object-contain"
                } md:w-1/4 md:mr-16 md:-mt-12`}
              />
              <div className="md:w-2/3 flex-col">
                {section.body?.includes("<strong>") ? (
                  <p
                    className={`my-2 text-left text-lg font-medium font-mono ${scheme.bodyColor}`}
                    dangerouslySetInnerHTML={{__html: section.body}}
                  >
                  </p>
                ) : (
                  <p
                    className={`my-2 text-left text-lg font-medium font-mono ${scheme.bodyColor}`}
                  >
                    {section.body || lorem}
                  </p>
                )}
              </div>
              <img
                src={GetImage(section.imgSrc)}
                alt=""
                className={`${index % 2 !== 0 && "md:hidden"} ${
                  section.imgSrc === "/blank.png"
                    ? "hidden md:object-none"
                    : "object-contain"
                } md:w-1/4 md:mr-16 md:-mt-12`}
              />
            </div>
          ))}
        </ul>
      </div>
      {getDemo(demoComp, scheme)}
    </div>
  );
};

export default ModuleSection;