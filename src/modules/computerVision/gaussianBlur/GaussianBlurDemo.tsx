import React, { useState } from 'react';
import jellyfish from './jellyfish.png';
import InteractiveFilter from './InteractiveFilter';
// have to use require for this bc it doesn't have a module declaration file or something
const generateGaussianKernel = require('gaussian-convolution-kernel');

const GaussianBlurDemo = (props: {labelColor: string}) => {
    const [kernel, setKernel] = useState<number[] | undefined>(undefined);
    const [kernelGrid, setKernelGrid] = useState<number[][] | undefined>(undefined);

    const configureKernel = (kernelSize: number, sigma: number) => {
        console.log(kernelSize, sigma);
        const newKernel: number[] = generateGaussianKernel(kernelSize, sigma);
        const newKernelGrid = newKernel.reduce((rslt: number[][], val, idx) => {
            if (idx % kernelSize === 0) rslt.push([]);
            rslt[rslt.length - 1].push(val);
            return rslt;
        }, []);
        console.log(newKernel, newKernelGrid)
        setKernel(newKernel);
        setKernelGrid(newKernelGrid);
    }

    return (
        <div className="m-4">
            <KernelConfig onConfig={configureKernel} labelColor={props.labelColor}/>
            <div className="mx-auto my-4 max-w-5xl max-h-lg overflow-auto">
                <table className="m-auto"><tbody>
                    {kernelGrid?.map((row, i) => (
                        <tr key={i}>
                            {row.map((val, j) => (
                                <td key={j}
                                    style={getBg(val, kernel)}
                                    className="border border-charcoal p-2"
                                    title={`${val}`}>
                                    {val.toFixed(5)}
                                </td>))}
                        </tr>
                    ))}
                </tbody></table>
            </div>
            <InteractiveFilter kernel={kernel} imgUrl={jellyfish} />
        </div>
    )
}

const KernelConfig = (props: { onConfig: (kernelSize: number, sigma: number) => void, labelColor: string}) => {
    const [kernelSize, setKernelSize] = useState<number>(5);
    const [sigma, setSigma] = useState<number>(1);

    const changeSigma = (e: any) => setSigma(parseFloat(e.target.value));
    const changeKernelSize = (e: any) => setKernelSize(parseInt(e.target.value));

    const invalidSize = (kernelSize % 2 !== 1 || kernelSize < 3 || kernelSize > 101)
    const invalidConfig = !sigma || invalidSize;
    return (
        <div>
            <div className={`font-bold m-3 ${props.labelColor}`}>
                Sigma
                <input className="mx-2 w-64 text-black"
                    type="range" min=".1" max="10" step="any"
                    value={sigma} onChange={(e) => changeSigma(e)} />
                <input className="number-input text-black"
                    type="number" min=".1" max="10"
                    value={sigma} onChange={(e) => changeSigma(e)} />
            </div>
            <div className={`font-bold m-3 h-10 ${props.labelColor}`}>
                Kernel Size
                <input className="mx-2 w-64 text-black"
                    type="range" min="3" max="101" step={2}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <input className="number-input text-black"
                    type="number" min="3" max="101" step={2}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <div className="font-light italic text-sm">
                    { invalidSize ? 'Enter an odd kernel size, between 3 and 101' : ''}
                </div>
            </div>
            <button className="basic-button" disabled={invalidConfig} onClick={e => props.onConfig(kernelSize, sigma)}>
                Generate Kernel
            </button>
        </div>
    );
}

function getBg(val: number, kernel?: number[]) {
    if (!kernel) return;
    const max = kernel[Math.floor(kernel.length / 2)];
    const min = kernel[0];
    const red = 200 - ((val - min) / (max - min) * 200);
    return { background: `rgb(${red}, 212, 192)` };
}

export default GaussianBlurDemo;