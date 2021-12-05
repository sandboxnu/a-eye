/* eslint-disable */

import React, { useLayoutEffect, useRef, useState, useEffect } from "react";
import {
    gradientImages,
    GradientsType
} from "./sobelFilter";
import SobelFilterDemo from "./SobelFilterDemo";

type StandaloneSobelFilterDemoType = {
    labelColor: string;
    imgUrl: string;
};

export const StandableSobelFilterDemo: React.FC<StandaloneSobelFilterDemoType> = ({
    labelColor,
    imgUrl,
}) => {

    const [gradients, setGradients] = useState<GradientsType>();

    useEffect(() => {
        setGradients(undefined)
        gradientImages(imgUrl).then((newGradients) => {
            setGradients(newGradients);
        })
    }, [imgUrl])


    return (

        <div>
            {!gradients &&
                <p className="my-6">Loading...</p>
            }
            {gradients &&
                <SobelFilterDemo
                    labelColor={labelColor}
                    imgUrl={imgUrl}
                    gradients={gradients}
                />
            }

        </div>
    );
};

export default SobelFilterDemo;
