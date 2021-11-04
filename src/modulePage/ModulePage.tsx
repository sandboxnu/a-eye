import React from 'react';
import { RouteComponentProps } from 'react-router';
import ModuleSection from './ModuleSection';
import module8 from '../media/modules/module_8.json';
import module9 from '../media/modules/module_9.json';
import module10 from '../media/modules/module_10.json';
import module11 from '../media/modules/module_11.json';

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
  number: number;
  title: string;
  sections: ModuleSectionType[];
}

const modules: Record<string, Module> = {
  'computer-vision': module8,
  classification: module9,
  perceptrons: module10,
  'neural-nets': module11,
};

/* eslint-disable */

/**
 * Renders the entire module page.
 * @param props.match.params.module name of the current module (route has path /modules/module)
 */
export default function ModulePage(
  props: RouteComponentProps<{ module: string }>,
) {
  const {
    match: {
      params: { module },
    },
  } = props;

  const curModule = modules[module];

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
