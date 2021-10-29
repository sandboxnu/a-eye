import React from 'react';
import SobelFilterDemo from '../modules/computerVision/sobelFilter/SobelFilterDemo';
import GaussianBlurDemo from '../modules/computerVision/gaussianBlur/GaussianBlurDemo';
import GaborDemo from '../modules/computerVision/gaborFilter/gaborFilter';
import DiffOfGaussianDemo from '../modules/computerVision/diffofgaussian/DiffOfGaussian';
import HaarWaveletDemo from '../modules/computerVision/haarWavelet/HaarWaveletDemo';
import { ImageSelectableDemo } from '../modules/computerVision/imageSelector/ImageSelectableDemo';
import PCADemo, {
  RawDataTable,
  SelectableAxisChart,
  StaticAxisChart,
  config as pcaConfig,
} from '../modules/stateSpaces/pca/PCA';

import KMeans, {
  KMeansStepExample,
  InteractiveClusteringExample,
} from '../modules/stateSpaces/kmeans';
import blank from '../media/modules/blank.png';
import animation1 from '../media/modules/computerVision/animation-1.gif';
import animation2 from '../media/modules/computerVision/animation-2.gif';
import animation3 from '../media/modules/computerVision/animation-3.gif';

const lorem =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

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

function GetImage(imgName: string) {
  switch (imgName) {
    case 'blank':
      return blank;
    case 'animation1':
      return animation1;
    case 'animation2':
      return animation2;
    case 'animation3':
      return animation3;
    default:
  }
}

function getDemo(comp: string, scheme: ColorScheme) {
  const demoArgs = { labelColor: scheme.titleColor };

  switch (comp) {
    case 'GaussianBlurDemo':
      return (
        <ImageSelectableDemo
          Demo={GaussianBlurDemo}
          initImg="purpleFlowers.jpeg"
          demoProps={demoArgs}
        />
      );
    case 'GaborDemo':
      return (
        <ImageSelectableDemo
          Demo={GaborDemo}
          initImg="zebra.jpg"
          demoProps={demoArgs}
        />
      );
    case 'DiffOfGaussian':
      return (
        <ImageSelectableDemo
          Demo={DiffOfGaussianDemo}
          initImg="tabbyCat.jpg"
          demoProps={demoArgs}
        />
      );
    case 'HaarWaveletDemo':
      return (
        <ImageSelectableDemo
          Demo={HaarWaveletDemo}
          initImg="bwWoman.jpg"
          demoProps={demoArgs}
        />
      );
    case 'SobelFilterDemo':
      return (
        <ImageSelectableDemo
          Demo={SobelFilterDemo}
          initImg="stopSign.jpeg"
          demoProps={demoArgs}
        />
      );
    case 'PCADemo':
      return <PCADemo {...demoArgs} />;
    case 'RawDataTable':
      return <RawDataTable />;
    case 'StaticAxisChart':
      return (
        <StaticAxisChart
          xIdx={4}
          yIdx={5}
          columnSet={pcaConfig.columns}
          classes={['versicolor', 'setosa']}
          labelColorHex={scheme.labelColorHex}
        />
      );
    case 'SelectableAxisChart':
      return (
        <SelectableAxisChart
          columnSet={pcaConfig.columns}
          initXIdx={4}
          initYIdx={5}
          labelColor={scheme.titleColor}
          labelColorHex={scheme.labelColorHex}
        />
      );
    case 'PCASelectableAxisChart':
      return (
        <SelectableAxisChart
          columnSet={pcaConfig.pcaColumns}
          initXIdx={0}
          initYIdx={1}
          labelColor={scheme.titleColor}
          labelColorHex={scheme.labelColorHex}
        />
      );
    case 'InteractiveKMeans':
      return (
        <div>
          <InteractiveClusteringExample hidden={false} />
        </div>
      );
    case 'StepKMeans':
      return (
        <div>
          <KMeansStepExample hidden={false} />
        </div>
      );
    case 'KMeans':
      return <KMeans />;
    default:
      return <div />;
  }
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
    colorScheme === 'dark'
      ? {
          bgColor: 'bg-moduleDarkBlue',
          titleColor: 'text-modulePaleBlue',
          headingColor: 'text-moduleTeal',
          bodyColor: 'text-moduleOffwhite',
          labelColorHex: '#CBD9F2',
        }
      : {
          bgColor: 'bg-modulePaleBlue',
          titleColor: 'text-moduleNavy',
          headingColor: 'text-moduleDarkBlue',
          bodyColor: 'text-moduleNavy',
          labelColorHex: '#394D73',
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
                section.imgSrc === '/blank.png' && 'my-10'
              } ${section.body ? '' : 'hidden'}`}
              // eslint-disable-next-line
              key={index}
            >
              <img
                src={GetImage(section.imgSrc)}
                alt=""
                className={`hidden ${index % 2 !== 0 && 'md:flex'} ${
                  section.imgSrc === '/blank.png'
                    ? 'hidden md:object-none'
                    : 'object-contain'
                } md:w-1/4 md:mr-16 md:-mt-12`}
              />
              <div className="md:w-2/3 flex-col">
                <p
                  className={`my-2 text-left text-lg font-medium font-mono ${scheme.bodyColor}`}
                >
                  {section.body || lorem}
                </p>
              </div>
              <img
                src={GetImage(section.imgSrc)}
                alt=""
                className={`${index % 2 !== 0 && 'md:hidden'} ${
                  section.imgSrc === '/blank.png'
                    ? 'hidden md:object-none'
                    : 'object-contain'
                } md:w-1/4 md:mr-16 md:-mt-12`}
              />
            </div>
          ))}
        </ul>
        {getDemo(demoComp, scheme)}
      </div>
    </div>
  );
};

export default ModuleSection;
