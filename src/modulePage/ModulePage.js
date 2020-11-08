import React from "react";
import ModuleSection from "./ModuleSection";
import module8 from '../media/modules/module_8.json';
import module9 from '../media/modules/module_9.json';
import module10 from '../media/modules/module_10.json';
import module11 from '../media/modules/module_11.json';
const modules = {'computer-vision': module8, 'classification' : module9, 'perceptrons' : module10, 'neural-nets' : module11}

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
            <p className={`w-screen p-4 text-5xl font-bold font-opensans bg-modulePaleBlue text-moduleNavy`}>{module[props.match.params.module].title}</p>
            <ul>
                {
                    module[props.match.params.module].sections.map((section) =>    
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