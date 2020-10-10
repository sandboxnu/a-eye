import React, { useState } from 'react';
import jellyfish from './jellyfish.png';
import InteractiveFilter from './InteractiveFilter';
import KernelDisplay from './KernelDisplay';
// have to use require for this bc it doesn't have a module declaration file or something
const generateGaussianKernel = require('gaussian-convolution-kernel');

const GaussianBlurDemo = () => {
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
            <KernelConfig onConfig={configureKernel}/>
            <KernelDisplay kernelGrid={kernelGrid} />
            <InteractiveFilter kernel={kernel} imgUrl={jellyfish} />
        </div>
    )
}

const KernelConfig = (props: { onConfig: (kernelSize: number, sigma: number) => void }) => {
    const [kernelSize, setKernelSize] = useState<number>(5);
    const [sigma, setSigma] = useState<number>(1);

    const changeSigma = (e: any) => setSigma(parseFloat(e.target.value));
    const changeKernelSize = (e: any) => setKernelSize(parseInt(e.target.value));

    const invalidSize = (kernelSize % 2 !== 1 || kernelSize < 3 || kernelSize > 7)
    const invalidConfig = !sigma || invalidSize;
    return (
        <div>
            <div className="font-bold m-3">
                Sigma
                <input className="mx-2 w-64"
                    type="range" min=".1" max="10" step="any"
                    value={sigma} onChange={(e) => changeSigma(e)} />
                <input className="number-input"
                    type="number" min=".1" max="10"
                    value={sigma} onChange={(e) => changeSigma(e)} />
            </div>
            <div className="font-bold m-3 h-10">
                Kernel Size
                <input className="mx-2 w-64"
                    type="range" min="3" max="7" step={2}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <input className="number-input"
                    type="number" min="3" max="7" step={2}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <div className="font-light italic text-sm">
                    { invalidSize ? 'Enter an odd kernel size, between 3 and 7' : ''}
                </div>
            </div>
            <button className="basic-button" disabled={invalidConfig} onClick={e => props.onConfig(kernelSize, sigma)}>
                Generate Kernel
            </button>
        </div>
    );
}


export default GaussianBlurDemo;