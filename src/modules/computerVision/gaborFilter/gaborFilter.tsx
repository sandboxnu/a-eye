import React, { useState } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KernelDisplay from '../common/KernelDisplay';
import FilterByKernel from '../common/FilterByKernel';
import AngleSelector from './AngleSelector';

// mimics np.meshgrid in python
function makeMeshgrid(sz: number[]) {
  const radius = [Math.floor(sz[0] / 2.0), Math.floor(sz[1] / 2.0)];

  const resultX = [];
  const resultY = [];

  for (let i = 0; i < 2 * Math.floor(sz[1] / 2) + 1; i += 1) {
    const xRow = [];
    for (let j = -radius[0]; j < radius[0] + 1; j += 1) {
      xRow.push(j);
    }
    resultX.push(xRow);
  }

  for (let i = -Math.floor(sz[1] / 2); i < Math.floor(sz[1] / 2) + 1; i += 1) {
    const yRow = [];
    for (let j = 0; j < sz[0] + 1; j += 1) {
      yRow.push(i);
    }
    resultY.push(yRow);
  }

  return [resultX, resultY];
}

type KernelConfigType = {
  onConfig: (
    kernelSize: number,
    omega: number,
    theta: number,
    K: number,
  ) => void;
  labelColor: string;
};
const KernelConfig: React.FC<KernelConfigType> = ({ onConfig, labelColor }) => {
  const [kernelSize, setKernelSize] = useState<number>(5);
  const [omega, setOmega] = useState<number>(1);
  const [theta, setTheta] = useState<number>(0);
  const [K, setK] = useState<number>(3.14);

  const changeOmega = (e: any) => setOmega(parseFloat(e.target.value));
  const changeKernelSize = (e: any) =>
    setKernelSize(parseInt(e.target.value, 10));
  const changeTheta = (t: number) => setTheta(t);
  const changeK = (e: any) => setK(parseFloat(e.target.value));

  const invalidConfig = kernelSize < 1 || kernelSize > 7;
  return (
    <div>
      <div className={`font-bold m-3 h-10 ${labelColor}`}>
        Kernel Size
        <input
          className="mx-2 w-1/4"
          type="range"
          min="1"
          max="7"
          step={1}
          value={kernelSize}
          onChange={e => changeKernelSize(e)}
        />
        <input
          className="number-input text-black"
          type="number"
          min="1"
          max="7"
          step={1}
          value={kernelSize}
          onChange={e => changeKernelSize(e)}
        />
      </div>
      <div className={`font-bold m-3 ${labelColor}`}>
        Theta
        <AngleSelector
          diameter="150px"
          initAngle={theta}
          onAngleChange={changeTheta}
        />
      </div>
      <Accordion
        className={`gabor-extras-accordion w-3/4 mx-auto my-2 ${labelColor}`}
      >
        <AccordionSummary
          className="font-bold h-1"
          expandIcon={<ExpandMoreIcon />}
        >
          Extra Parameters
        </AccordionSummary>
        <AccordionDetails className="display-flex flex-col">
          <div className="font-bold m-3">
            Omega
            <input
              className="mx-2 w-64"
              type="range"
              min="0"
              max="10"
              value={omega}
              onChange={e => changeOmega(e)}
            />
            <input
              className="number-input text-black"
              type="number"
              min="0"
              max="10"
              value={omega}
              onChange={e => changeOmega(e)}
            />
          </div>
          <div className="font-bold m-3 h-10">
            K
            <input
              className="mx-2 w-64"
              // Math.PI/4 ~= 0.79
              type="range"
              min="0"
              max="12.56"
              step={0.785}
              value={K}
              onChange={e => changeK(e)}
            />
            <input
              className="number-input text-black"
              type="number"
              min="0"
              max="12.56"
              step={0.785}
              value={K}
              onChange={e => changeK(e)}
            />
          </div>
        </AccordionDetails>
      </Accordion>
      <button
        type="button"
        className="basic-button"
        disabled={invalidConfig}
        onClick={() => onConfig(kernelSize, omega, theta, K)}
      >
        Generate Kernel
      </button>
    </div>
  );
};

// http://vision.psych.umn.edu/users/kersten/kersten-lab/courses/Psy5036W2017/Lectures/17_PythonForVision/Demos/html/2b.Gabor.html
function gaborFilter(
  sz: number,
  omega: number,
  theta: number,
  func = Math.cos,
  K = Math.PI,
) {
  // EXAMPLE INPUTS

  // let sz = [4,4]
  // let omega = 0.3
  // let theta = Math.PI/4
  // let func = Math.cos
  // let K = Math.PI
  const sz1 = [sz, sz];
  const xy = makeMeshgrid(sz1);
  const x = xy[0];
  const y = xy[1];

  const x1 = x.map((inner, i) =>
    inner.map((v, j) => v * Math.cos(theta) + y[i][j] * Math.sin(theta)),
  );
  const y1 = x.map((inner, i) =>
    inner.map((v, j) => -v * Math.sin(theta) + y[i][j] * Math.cos(theta)),
  );

  const p = omega ** 2 / (4 * Math.PI * K ** 2);
  const gaussian = x1.map((inner, i) =>
    inner.map(
      (v, j) =>
        p *
        Math.exp((-(omega ** 2) / (8 * K ** 2)) * (4 * v ** 2 + y1[i][j] ** 2)),
    ),
  );
  const sinusoid = x1.map(inner =>
    inner.map(v => func(omega * v) * Math.exp(K ** 2 / 2)),
  );
  const gabor = sinusoid.map((inner, i) =>
    inner.map((v, j) => v * gaussian[i][j]),
  );
  return gabor;
}

type GaborDemoType = {
  labelColor: string;
  imgUrl: string;
};
const GaborDemo: React.FC<GaborDemoType> = ({ labelColor, imgUrl }) => {
  const [kernel, setKernel] = useState<number[] | undefined>(undefined);
  const [kernelGrid, setKernelGrid] = useState<number[][] | undefined>(
    undefined,
  );

  const configureKernel = (
    kernelSize: number,
    omega: number,
    theta: number,
    K: number,
  ) => {
    const func = Math.cos;

    const gabor = gaborFilter(kernelSize, omega, theta, func, K);
    const newKernel = gabor.flat();
    const newKernelGrid = gabor;
    setKernel(newKernel);
    setKernelGrid(newKernelGrid);
  };

  return (
    <div className="m-4">
      <div className="grid grid-cols-1 md:grid-cols-2 mx-auto items-center mb-5">
        <KernelConfig onConfig={configureKernel} labelColor={labelColor} />
        <KernelDisplay kernelGrid={kernelGrid} labelColor={labelColor} />
      </div>
      <FilterByKernel kernel={kernel} imgUrl={imgUrl} />
    </div>
  );
};

export default GaborDemo;
