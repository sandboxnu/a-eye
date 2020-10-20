import React from "react";
import ModuleSection from "./ModuleSection";
import modules from '../media/modules.json';

export default function ModulePage(props) {
    const module = modules[props.match.params.module];
    if (!module) {
        return (
            <div>
                <p>This module does not exist.</p>
                <a href="/">Return to home</a>
            </div>
        )
    }
    return (
        <div className="container w-screen">
            <p className={`w-screen p-4 text-5xl font-bold font-opensans bg-modulePaleBlue text-moduleNavy`}>{module.title}</p>
            <ul>
                {
                    module.sections.map((section) =>
                        <ModuleSection title={section.title}
                                       sections={section.subsections}
                                       colorScheme={section.colorScheme}
                                       key={section.title}
                                       demoComp={section.demoComp}/>
                    )
                }
            </ul>
        </div>
    );
}