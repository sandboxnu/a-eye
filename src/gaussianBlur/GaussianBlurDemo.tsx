import React, { ChangeEvent, useLayoutEffect, useRef, useState } from 'react';
import jellyfish from './jellyfish.png';
import InteractiveFilter from './InteractiveFilter';

const GaussianBlurDemo = () => {
    const [kernelSize, setKernelSize] = useState(5);
    const [sigma, setSigma] = useState(1);

    const kernel =
        // [[0.077847,	0.123317,	0.077847],
        //     [0.123317,	0.195346,	0.123317],
        //     [0.077847,	0.123317,	0.077847]]
        [[0.036894, 0.039167, 0.039956, 0.039167, 0.036894],
        [0.039167, 0.041581, 0.042418, 0.041581, 0.039167],
        [0.039956, 0.042418, 0.043272, 0.042418, 0.039956],
        [0.039167, 0.041581, 0.042418, 0.041581, 0.039167],
        [0.036894, 0.039167, 0.039956, 0.039167, 0.036894]];
    const max = kernel[Math.floor(kernelSize / 2)][Math.floor((kernelSize / 2))];
    const min = kernel[0][0];



    return (
        <div className="m-4">
            <KernelConfig initSigma={sigma} initSize={kernelSize} />
            <div className="m-4">
                Gaussian Kernel
                <table className="m-auto"><tbody>
                    {kernel.map((row, i) => (
                        <tr key={i}>
                            {row.map((val, j) => (
                                <td key={j}
                                    style={getBg(val, max, min)}
                                    className="border-2 border-charcoal p-2"
                                    title={`${val}`}>
                                    {val}
                                </td>))}
                        </tr>
                    ))}
                </tbody></table>
            </div>
            <InteractiveFilter kernel={kernel.reduce((list, row) => list.concat(row), [])} imgUrl={jellyfish} />
        </div>
    )
}

const KernelConfig = (props: { initSize: number, initSigma: number }) => {
    const [kernelSize, setKernelSize] = useState(props.initSize);
    const [sigma, setSigma] = useState(props.initSigma);

    const changeSigma = (e: any) => setSigma(e.target.value);
    const changeKernelSize = (e: any) => setKernelSize(e.target.value);

    return (
        <div>
            <div className="font-bold m-3">
                Sigma
                <input className="mx-2 w-64"
                    type="range" min=".1" max="10"
                    value={sigma} onChange={(e) => changeSigma(e)} />
                <input className="number-input"
                    type="number" min=".1" max="10"
                    value={sigma} onChange={(e) => changeSigma(e)} />
            </div>
            <div className="font-bold m-3">
                Kernel Size
                <input className="mx-2 w-64"
                    type="range" min="1" max="105" step={2}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <input className="number-input"
                    type="number" min="1" max="105" step={2}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
            </div>
            <button className="basic-button">Apply</button>
        </div>
    );
}

function getBg(val: number, max: number, min: number) {
    const red = 200 - ((val - min) / (max - min) * 200);
    return { background: `rgb(${red}, 212, 192)` };
}

export default GaussianBlurDemo;