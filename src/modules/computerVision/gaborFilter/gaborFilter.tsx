import React, { useState } from 'react';
import jellyfish from '../gaussianBlur/jellyfish.png';
import FilterByKernel from '../common/FilterByKernel';
import KernelDisplay from '../gaussianBlur/KernelDisplay';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AngleSelector from './AngleSelector';


// mimics np.meshgrid in python
function makeMeshgrid(sz: number[]) {

    var radius = [Math.floor(sz[0] / 2.0), Math.floor(sz[1] / 2.0)]

    var result_x = [];
    var result_y = [];

    for (let i = 0; i < (2 * Math.floor(sz[1] / 2)) + 1; i++) {
        let x_row = []
        for (let j = -radius[0]; j < radius[0] + 1; j++) {
            x_row.push(j)
        }
        result_x.push(x_row)
    }

    for (let i = -Math.floor(sz[1] / 2); i < Math.floor(sz[1] / 2) + 1; i++) {
        let y_row = []
        for (let j = 0; j < sz[0] + 1; j++) {
            y_row.push(i)
        }
        result_y.push(y_row)
    }

    return [result_x, result_y]
}

//http://vision.psych.umn.edu/users/kersten/kersten-lab/courses/Psy5036W2017/Lectures/17_PythonForVision/Demos/html/2b.Gabor.html
function gaborFilter(sz: number,
    omega: number,
    theta: number,
    func = Math.cos,
    K = Math.PI) {

    // EXAMPLE INPUTS 

    // let sz = [4,4]
    // let omega = 0.3
    // let theta = Math.PI/4
    // let func = Math.cos
    // let K = Math.PI
    const sz1 = [sz, sz]
    let xy = makeMeshgrid(sz1)
    let x = xy[0]
    let y = xy[1]

    let x1 = x.map((inner, i) => inner.map((v, j) => (v * Math.cos(theta)) + (y[i][j] * Math.sin(theta))));
    let y1 = x.map((inner, i) => inner.map((v, j) => (-v * Math.sin(theta)) + (y[i][j] * Math.cos(theta))));

    let p = Math.pow(omega, 2) / (4 * Math.PI * Math.pow(K, 2))
    let gaussian = x1.map((inner, i) => inner.map((v, j) => p * Math.exp(-Math.pow(omega, 2) / (8 * Math.pow(K, 2)) * (4 * Math.pow(v, 2) + Math.pow(y1[i][j], 2)))));
    let sinusoid = x1.map((inner, i) => inner.map((v, j) => (func(omega * v) * Math.exp(Math.pow(K, 2) / 2))));
    let gabor = sinusoid.map((inner, i) => inner.map((v, j) => (v * gaussian[i][j])));
    return gabor;
}

const GaborDemo = (props: {labelColor: string}) => {
    const [kernel, setKernel] = useState<number[] | undefined>(undefined);
    const [kernelGrid, setKernelGrid] = useState<number[][] | undefined>(undefined);
    const [kernel_num, setKernelNum] = useState<number>(0);
    

    const configureKernel = (kernelSize: number,
                             omega: number,
                             theta: number,
                             K: number,
                             math: string) => {
        let func;
        if (math == "Even Symmetric") {
            func = Math.cos;
        } else {
            // math == "Odd Symmetric"
            func = Math.sin;
        }
        

        const gabor = gaborFilter(kernelSize, omega, theta, func, K)
        const newKernel = gabor.flat();
        const newKernelGrid = gabor;
        setKernel(newKernel);
        setKernelGrid(newKernelGrid);
    }

    const buttonPressed = (num: number) => {
        let casezero = [[1,2,1], [0,0,0], [-1,-2,-1]];
        let caseone = [[0,1,2], [-1,0,1], [-2,-1,0]];
        let casetwo = [[-1,0,1], [-2,0,2], [-1,0,1]];
        let casethree = [[-2,-1,0], [-1,0,1], [0,1,2]];
        switch (num) {
            case 0:
                setKernel(casezero.flat());
                setKernelGrid(casezero);
                break;
            case 1:
                setKernel(caseone.flat());
                setKernelGrid(caseone);
                break;
            case 2:
                setKernel(casetwo.flat());
                setKernelGrid(casetwo);
                break;
            default:
                setKernel(casethree.flat());
                setKernelGrid(casethree);
                break;
            
        }
    }

    const PresetButton = (props: {num: number, label: string}) => {

        return (
            <button className="basic-button" onClick = {() => buttonPressed(props.num)}> 
                {props.label}
            </button>
        )
    }

    return (
        <div className="m-4">
            
            <KernelConfig onConfig={configureKernel} labelColor={props.labelColor}/>
            <PresetButton num={0} label={"0 °"}/>
            <PresetButton num={1} label={"45 °"}/>
            <PresetButton num={2} label={"90 °"}/>
            <PresetButton num={3} label={"135 °"}/>
            <KernelDisplay kernelGrid={kernelGrid} labelColor={props.labelColor}/>
            <FilterByKernel kernel={kernel} imgUrl={jellyfish} />
        </div>
    )
}

const KernelConfig = (props: { onConfig: (kernelSize: number, omega: number, theta: number, K: number, Math: string) => void, labelColor: string}) => {
    const [kernelSize, setKernelSize] = useState<number>(5);
    const [omega, setOmega] = useState<number>(1);
    const [theta, setTheta] = useState<number>(0);
    const [K, setK] = useState<number>(3.14);
    const [math, setMath] = useState<string>("Even Symmetric");
    

    const changeOmega = (e: any) => setOmega(parseFloat(e.target.value));
    const changeKernelSize = (e: any) => setKernelSize(parseInt(e.target.value));
    const changeTheta = (t :number) => setTheta(t);
    const changeK = (e: any) => setK(parseFloat(e.target.value));
    const changeMath = (e: any) => {
        if (e.target.value== "Even Symmetric") {
            var next = "Odd Symmetric"
        } else {
            var next = "Even Symmetric"
        }
        setMath(next)
    }
    const invalidConfig = (kernelSize < 1 || kernelSize > 7)

    return (
        <div>
            <div className={`font-bold m-3 h-10 ${props.labelColor}`}>
                Kernel Size
                <input className="mx-2 w-64"
                    type="range" min="1" max="7" step={1}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <input className="number-input text-black"
                    type="number" min="1" max="7" step={1}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />

            </div>
            <div className={`font-bold m-3 ${props.labelColor}`}>
                Theta
                <AngleSelector diameter='150px' initAngle={theta} onAngleChange={changeTheta}/>
            </div>
            <Accordion className={`gabor-extras-accordion w-500px mx-auto my-2 ${props.labelColor}`}>
                <AccordionSummary className="font-bold h-1" expandIcon={<ExpandMoreIcon />}>
                    Extra Parameters
                </AccordionSummary>
                <AccordionDetails className="display-flex flex-col">
                    <div className="font-bold m-3">
                        Omega
                        <input className="mx-2 w-64"
                            type="range" min="0" max="10"
                            value={omega} onChange={(e) => changeOmega(e)} />
                        <input className="number-input text-black"
                            type="number" min="0" max="10"
                            value={omega} onChange={(e) => changeOmega(e)} />
                    </div>
                    <div className="font-bold m-3 h-10">
                        K
                        <input className="mx-2 w-64"
                            // Math.PI/4 ~= 0.79
                            type="range" min="0" max="12.56" step={0.785}
                            value={K} onChange={(e) => changeK(e)} />
                        <input className="number-input text-black"
                            type="number" min="0" max="12.56" step={0.785}
                            value={K} onChange={(e) => changeK(e)} />
                    </div>
                    <div>
                        <button 
                            className="basic-button" type="button" id="b1"
                            value={math} onClick={(e) => changeMath(e)}>
                                {math} 
                        </button>
                    </div>
                </AccordionDetails>
            </Accordion>
            <button className="basic-button" disabled={invalidConfig} onClick={e => props.onConfig(kernelSize, omega, theta, K, math)}>
                Generate Kernel
            </button>
        </div>
    );
}

export default GaborDemo;