import React, { useState } from 'react';
import jellyfish from '../gaussianBlur/jellyfish.png';
import InteractiveFilter from '../gaussianBlur/InteractiveFilter';
import KernelDisplay from '../gaussianBlur/KernelDisplay';


// mimics np.meshgrid in python
function makeMeshgrid(sz: number[]) {
   
   var radius = [Math.floor(sz[0]/2.0), Math.floor(sz[1]/2.0)]

   var result_x = [];
   var result_y = [];

   for (let i = 0; i < (2 * Math.floor(sz[1] / 2)) + 1; i++) {
      let x_row = []
      for(let j = -radius[0]; j < radius[0] + 1; j++) {
         x_row.push(j)
      }
      result_x.push(x_row)
   }

   for (let i = -Math.floor(sz[1] / 2); i < Math.floor(sz[1] / 2) + 1; i++) {
      let y_row = []
      for(let j = 0; j < sz[0] + 1; j++) {
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
   
   let p = Math.pow(omega, 2) / (4* Math.PI * Math.pow(K, 2))
   let gaussian = x1.map((inner, i) => inner.map((v, j) => p * Math.exp(-Math.pow(omega, 2) / (8*Math.pow(K, 2)) * ( 4 * Math.pow(v, 2) + Math.pow(y1[i][j], 2)) )));
   let sinusoid = x1.map((inner, i) => inner.map((v, j) => (func(omega * v) * Math.exp(Math.pow(K, 2) / 2))));
   let gabor = sinusoid.map((inner, i) => inner.map((v, j) => (v * gaussian[i][j])));
   return gabor;
}

const GaborDemo = () => {
    const [kernel, setKernel] = useState<number[] | undefined>(undefined);
    const [kernelGrid, setKernelGrid] = useState<number[][] | undefined>(undefined);

    const configureKernel = (kernelSize: number, theta: number) => {
        const func = Math.cos;
        const gabor = gaborFilter(kernelSize, 1, theta, func, 3.14)
        const newKernel = gabor.flat();
        const newKernelGrid = gabor;
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

const KernelConfig = (props: { onConfig: (kernelSize: number, theta: number) => void }) => {
    const [kernelSize, setKernelSize] = useState<number>(5);
    const [theta, setTheta] = useState<number>(0);

    const changeKernelSize = (e: any) => setKernelSize(parseInt(e.target.value));
    const changeTheta = (e: any) => setTheta(parseFloat(e.target.value));

    const invalidConfig = (kernelSize < 1 || kernelSize > 7)
    return (
        <div>
            <div className="font-bold m-3 h-10">
                Kernel Size
                <input className="mx-2 w-64"
                    type="range" min="1" max="7" step={1}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />
                <input className="number-input"
                    type="number" min="1" max="7" step={1}
                    value={kernelSize} onChange={(e) => changeKernelSize(e)} />

            </div>
            <div className="font-bold m-3 h-10">
               Theta
               <input className="mx-2 w-64"
                     // Math.PI/8 ~= 0.39
                    type="range" min="0" max="6.28" step={0.39}
                    value={theta} onChange={(e) => changeTheta(e)} />
               <input className="number-input"
                    type="number" min="0" max="6.28" step={0.39}
                    value={theta} onChange={(e) => changeTheta(e)} />
            </div>
            <button className="basic-button" disabled={invalidConfig} onClick={e => props.onConfig(kernelSize, theta)}>
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

export default GaborDemo;