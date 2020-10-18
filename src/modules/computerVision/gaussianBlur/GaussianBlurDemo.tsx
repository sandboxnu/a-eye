import React, { useState } from 'react';
import jellyfish from './jellyfish.png';
import FilterByKernel from '../common/FilterByKernel';
import KernelDisplay from './KernelDisplay';
// have to use require for this bc it doesn't have a module declaration file or something
const generateGaussianKernel = require('gaussian-convolution-kernel');

const GaussianBlurDemo = (props: {labelColor: string}) => {
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
<<<<<<< HEAD
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
=======
            <KernelConfig onConfig={configureKernel}/>
            <KernelDisplay kernelGrid={kernelGrid} />
            <FilterByKernel kernel={kernel} imgUrl={jellyfish} />
>>>>>>> origin/module-computer-vision
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
                <input className="mx-2 w-64 text-black"
                    type="range" min=".1" max="10" step="any"
                    value={sigma} onChange={(e) => changeSigma(e)} />
                <input className="number-input text-black"
                    type="number" min=".1" max="10"
                    value={sigma} onChange={(e) => changeSigma(e)} />
            </div>
            <div className={`font-bold m-3 h-10 ${props.labelColor}`}>
                Kernel Size
<<<<<<< HEAD
                <input className="mx-2 w-64 text-black"
                    type="range" min="3" max="101" step={2}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <input className="number-input text-black"
                    type="number" min="3" max="101" step={2}
=======
                <input className="mx-2 w-64"
                    type="range" min="1" max="7" step={2}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <input className="number-input"
                    type="number" min="1" max="7" step={2}
>>>>>>> origin/module-computer-vision
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