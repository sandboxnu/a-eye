import React, { useState } from 'react';
import FilterByKernel from '../common/FilterByKernel';
import KernelDisplay from './KernelDisplay';
// have to use require for this bc it doesn't have a module declaration file or something
const generateGaussianKernel = require('gaussian-convolution-kernel');


const GaussianBlurDemo = (props: {labelColor: string, imgUrl: string}) => {
    const [kernel, setKernel] = useState<number[] | undefined>(undefined);
    const [kernelGrid, setKernelGrid] = useState<number[][] | undefined>(undefined);

    const configureKernel = (kernelSize: number, sigma: number) => {
        let newKernel :number[];
        if (kernelSize === 1) {
            newKernel = [1];
        } else {
            newKernel = generateGaussianKernel(kernelSize, sigma);
        }
        const newKernelGrid = newKernel.reduce((rslt: number[][], val, idx) => {
            if (idx % kernelSize === 0) rslt.push([]);
            rslt[rslt.length - 1].push(val);
            return rslt;
        }, []);
        setKernel(newKernel);
        setKernelGrid(newKernelGrid);
    }

    return (
        <div className="m-4">
            <KernelConfig onConfig={configureKernel} labelColor={props.labelColor}/>
            <KernelDisplay kernelGrid={kernelGrid} labelColor={props.labelColor}/>
            <FilterByKernel kernel={kernel} imgUrl={props.imgUrl} />
        </div>
    )
}

const KernelConfig = (props: { onConfig: (kernelSize: number, sigma: number) => void, labelColor: string}) => {
    const [kernelSize, setKernelSize] = useState<number>(5);
    const [sigma, setSigma] = useState<number>(1);

    const changeSigma = (e: any) => setSigma(parseFloat(e.target.value));
    const changeKernelSize = (e: any) => setKernelSize(parseInt(e.target.value));

    const invalidSize = (kernelSize % 2 !== 1 || kernelSize < 1 || kernelSize > 7)
    const invalidConfig = !sigma || invalidSize;
    return (
        <div>
            <div className={`font-bold m-3 ${props.labelColor}`}>
                Sigma
                <input className="mx-2 w-64"
                       type="range" min=".1" max="10" step="any"
                       value={sigma} onChange={(e) => changeSigma(e)} />
                <input className="number-input text-black"
                       type="number" min=".1" max="10"
                       value={sigma} onChange={(e) => changeSigma(e)} />
            </div>
            <div className={`font-bold m-3 h-10 ${props.labelColor}`}>
                Kernel Size
                <input className="mx-2 w-64"
                       type="range" min="1" max="7" step={2}
                       value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <input className="number-input text-black"
                       type="number" min="1" max="7" step={2}
                       value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <div className="font-light italic text-sm">
                    { invalidSize ? 'Enter an odd kernel size, between 1 and 7' : ''}
                </div>
            </div>
            <button className="basic-button" disabled={invalidConfig} onClick={e => props.onConfig(kernelSize, sigma)}>
                Generate Kernel
            </button>
        </div>
    );
}


export default GaussianBlurDemo;