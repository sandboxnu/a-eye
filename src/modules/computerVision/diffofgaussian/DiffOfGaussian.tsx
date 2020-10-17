import React, { useRef, useState } from 'react';
import jellyfish from '../gaussianBlur/jellyfish.png';
import InteractiveFilter from '../gaussianBlur/InteractiveFilter';
import DifferenceFilter from '../gaussianBlur/InteractiveFilter';
// have to use require for this bc it doesn't have a module declaration file or something
const generateGaussianKernel = require('gaussian-convolution-kernel');

const DoG = () => {
    const [kernel, setKernel] = useState<number[] | undefined>(undefined);
    const [kernel2, setKernel2] = useState<number[] | undefined>(undefined);
    const [kernelGrid, setKernelGrid] = useState<number[][] | undefined>(undefined);
    const [kernelGrid2, setKernelGrid2] = useState<number[][] | undefined>(undefined);


    const configureKernel = (kernelSize: number, sigma: number, sigma2: number) => {
        
        const newKernel: number[] = generateGaussianKernel(kernelSize, sigma);
        const newKernel2: number[] = generateGaussianKernel(kernelSize, sigma2);
        const newKernelGrid = newKernel.reduce((rslt: number[][], val, idx) => {
            if (idx % kernelSize === 0) rslt.push([]);
            rslt[rslt.length - 1].push(val);
            return rslt;
        }, []);
        const newKernelGrid2 = newKernel2.reduce((rslt: number[][], val, idx) => {
            if (idx % kernelSize === 0) rslt.push([]);
            rslt[rslt.length - 1].push(val);
            return rslt;
        }, []);
        

        // take difference of the two filters
        // dog = difference of gaussians
        // let dog = newKernel.map((inner, i) => (inner - newKernel2[i]));
        
        // let dogGrid = newKernelGrid.map((inner, i) => inner.map((v, j) => (v - newKernelGrid2[i][j])));

        setKernel(newKernel);
        setKernel2(newKernel2);
        setKernelGrid(newKernelGrid);
        setKernelGrid2(newKernelGrid2);
    }

    return (
        <div>
            <div className="m-4">
                <KernelConfig onConfig={configureKernel}/>
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
                <div className="mx-auto my-4 max-w-5xl max-h-lg overflow-auto">
                    <table className="m-auto"><tbody>
                        {kernelGrid2?.map((row, i) => (
                            <tr key={i}>
                                {row.map((val, j) => (
                                    <td key={j}
                                        style={getBg(val, kernel2)}
                                        className="border border-charcoal p-2"
                                        title={`${val}`}>
                                        {val.toFixed(5)}
                                    </td>))}
                            </tr>
                        ))}
                    </tbody></table>
                </div>
                <InteractiveFilter kernel={kernel} imgUrl={jellyfish} />
                <InteractiveFilter kernel={kernel2} imgUrl={jellyfish} />
                <DifferenceFilter kernel={kernel} imgUrl={jellyfish} />
            </div>
            
        </div>
    )
}

const KernelConfig = (props: { onConfig: (kernelSize: number, sigma: number, sigma2: number) => void }) => {
    const [kernelSize, setKernelSize] = useState<number>(5);
    const [sigma, setSigma] = useState<number>(1);
    const [sigma2, setSigma2] = useState<number>(3);

    const changeSigma = (e: any) => setSigma(parseFloat(e.target.value));
    const changeSigma2 = (e: any) => setSigma2(parseFloat(e.target.value));
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
            <div className="font-bold m-3">
                Sigma 2
                <input className="mx-2 w-64"
                    type="range" min=".1" max="10" step="any"
                    value={sigma2} onChange={(e) => changeSigma2(e)} />
                <input className="number-input"
                    type="number" min=".1" max="10"
                    value={sigma2} onChange={(e) => changeSigma2(e)} />
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
            <button className="basic-button" disabled={invalidConfig} onClick={e => props.onConfig(kernelSize, sigma, sigma2)}>
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

export default DoG;