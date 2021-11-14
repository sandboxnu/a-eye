/* eslint-disable */
import React from "react";
import {RouteComponentProps} from 'react-router';
import ModuleSection from "./ModuleSection";
import module8 from '../media/modules/module_8.json';
import module9 from '../media/modules/module_9.json';
import module10 from '../media/modules/module_10.json';
import module11 from '../media/modules/module_11.json';
import cvIntroModule from '../media/modules/text/computer-vision-intro.json';
import gaborModule from '../media/modules/text/gabor-filter.json';
import gaussianModule from '../media/modules/text/gaussian-blur.json';
import sobelModule from '../media/modules/text/sobel-filter.json';
import hogModule from '../media/modules/text/histogram-of-gradients.json';
import perceptronModule from '../media/modules/text/perceptrons.json';

export interface ModuleSubsection {
  "title": string,
  "body": string,
  "imgSrc": string
}
interface ModuleSectionType {
  "title": string,
  "colorScheme": string,
  "subsections": ModuleSubsection[],
  "demoComp": string
}
interface Module {
  title: string;
  sections: ModuleSectionType[];
}

// eslint-disable-next-line
type moduleName = 'computer-vision' | 'images-and-kernels' | 'gaussian-blur' | 'gabor-filter' | 'sobel-filter' | 'histogram-of-gradients' | 'classification' | 'perceptrons' | 'neural-nets';
const modules: Record<moduleName, Module | null> = {
  'computer-vision': module8,
  'images-and-kernels': cvIntroModule,
  'gaussian-blur': gaussianModule,
  'gabor-filter': gaborModule,
  'sobel-filter': sobelModule,
  'histogram-of-gradients': hogModule,
  // eslint-disable-next-line
  'classification': module9,
  // eslint-disable-next-line
  'perceptrons': perceptronModule,
  'neural-nets': module11,
};

/* eslint-disable */

/**
 * Renders the entire module page.
 * @param props.match.params.module name of the current module (route has path /modules/module)
 */
export default function ModulePage(
  props: RouteComponentProps<{ module: moduleName }>,
) {
  // eslint-disable-next-line
  const module = props.match.params.module;
  const curModule: Module | null = modules[module];

  if (!curModule) {
    return (
      <div className="container w-screen h-screen">
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
        {curModule.sections.map((section, index) =>
          <div id={section.title.split(' ').join('-')}>
            <ModuleSection
              title={section.title}
              sections={section.subsections}
              colorScheme={section.colorScheme}
              key={section.title}
              demoComp={section.demoComp}
            />
          </div>,
        )}
      </ul>
    </div>
  );
}