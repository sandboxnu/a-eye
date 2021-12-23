/* eslint-disable */
import React, { useState, useEffect } from "react";
import InteractiveMLP from "./InteractiveMLP";
import { MLPConfig, defaultMLPConfig, defaultMLPConfigInput } from "./mlpConfig"



type MLPDemoType = {
    labelColor: string,
    initialMLPConfig?: MLPConfig,
    initialMLPInputs?: number[]
}

export const MLPDemo: React.FC<MLPDemoType> = ({
    labelColor,
    initialMLPConfig,
    initialMLPInputs,
}) => {
    if (!initialMLPConfig || !initialMLPInputs) {
        initialMLPConfig = defaultMLPConfig;
        initialMLPInputs = defaultMLPConfigInput;
    }


    const [mlpConfig, setMLPConfig] = useState(initialMLPConfig);
    const [mlpInputs, setMLPInputs] = useState(initialMLPInputs);


    return (
        <div className="justify-center mx-auto">
            <InteractiveMLP
                labelColor={labelColor}
                mlpConfig={mlpConfig}
                setMLPConfig={setMLPConfig}
                inputs={mlpInputs}
                setInputs={setMLPInputs}
                />
        </div>

    )
};

export default MLPDemo;
