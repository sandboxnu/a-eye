import React from 'react';
import { RouteComponentProps } from 'react-router';
import ModuleSection from './ModuleSection';
import module8 from '../media/modules/module_8.json';
import module9 from '../media/modules/module_9.json';
import module10 from '../media/modules/module_10.json';
import module11 from '../media/modules/module_11.json';
import cvIntroModule from '../media/modules/text/computer-vision-intro.json';
import gaborModule from '../media/modules/text/gabor-filter.json';
import gaussianModule from '../media/modules/text/gaussian-blur.json';
import sobelModule from '../media/modules/text/sobel-filter.json';
import hogModule from '../media/modules/text/histogram-of-gradients.json';

export interface ModuleSubsectionType {
  title: string;
  body: string;
  imgSrc: string;
}

interface ModuleSectionType {
  title: string;
  colorScheme: string;
  subsections: ModuleSubsectionType[];
  demoComp: string;
}

interface Module {
  title: string;
  sections: ModuleSectionType[];
}

// eslint-disable-next-line
type moduleName = 'computer-vision' | 'images-and-kernels' | 'gaussian-blur' | 'gabor-filter' | 'sobel-filter' | 'histogram-of-gradients' | 'classification' | 'perceptron' | 'neural-nets';
const modules: Record<moduleName, Module> = {
  'computer-vision': module8,
  'images-and-kernels': cvIntroModule,
  'gaussian-blur': gaussianModule,
  'gabor-filter': gaborModule,
  'sobel-filter': sobelModule,
  'histogram-of-gradients': hogModule,
  // eslint-disable-next-line
  'classification': module9,
  // eslint-disable-next-line
  'perceptron': module10,
  'neural-nets': module11,
};

/**
 * Renders the entire module page.
 * @param props.match.params.module name of the current module (route has path /modules/module)
 */

export default function ModulePage(
  props: RouteComponentProps<{ module: moduleName }>,
) {
  // eslint-disable-next-line
  const module = props.match.params.module;
  const curModule: Module = modules[module];

  if (!curModule) {
    return (
      <div>
        <p>This module does not exist.</p>
        <a href="/">Return to home</a>
      </div>
    );
  }

  return (
    <div className="container w-screen">
      <p className="w-screen p-4 text-5xl font-bold font-opensans bg-modulePaleBlue text-moduleNavy">
        {curModule.title}
      </p>
      <ul>
        {curModule.sections.map(section => (
          <ModuleSection
            title={section.title}
            sections={section.subsections}
            colorScheme={section.colorScheme}
            key={section.title}
            demoComp={section.demoComp}
          />
        ))}
      </ul>
    </div>
  );
}
