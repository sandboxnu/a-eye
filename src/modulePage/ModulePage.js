import React from "react";
import Module from "./Module";
import descriptions from '../media/modules.json';

export default function ModulePage() {
    return (
        <div className="container w-screen">
            <ul>
                {
                    descriptions.modules.map((module) =>
                        <Module title={module.title} sections={module.sections}
                                colorScheme={module.colorScheme} imgSrc={module.imgSrc}/>
                    )
                }
            </ul>
        </div>
    );
}