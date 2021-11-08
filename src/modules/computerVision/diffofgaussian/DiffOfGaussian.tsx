import React, { useState } from 'react';
import KernelDisplay from '../common/KernelDisplay';
import FilterByKernel from '../common/FilterByKernel';
import DiffofFiltered from '../common/DiffofFiltered';

// have to use require for this bc it doesn't have a module declaration file or something
const generateGaussianKernel = require('gaussian-convolution-kernel');

// function getBg(val: number, kernel?: number[]) {
//   if (!kernel) return;
//   const max = kernel[Math.floor(kernel.length / 2)];
//   const min = kernel[0];
//   const red = 200 - ((val - min) / (max - min)) * 200;
//   return { background: `rgb(${red}, 212, 192)` };
// }

type KernelConfigType = {
  labelColor: string;
  onConfig: (kernelSize: number, sigma: number, sigma2: number) => void;
};

const KernelConfig: React.FC<KernelConfigType> = ({ labelColor, onConfig }) => {
  const [kernelSize, setKernelSize] = useState<number>(5);
  const [sigma, setSigma] = useState<number>(1);
  const [sigma2, setSigma2] = useState<number>(3);

  const changeSigma = (e: any) => setSigma(parseFloat(e.target.value));
  const changeSigma2 = (e: any) => setSigma2(parseFloat(e.target.value));
  const changeKernelSize = (e: any) =>
    setKernelSize(parseInt(e.target.value, 10));

  const invalidSize = kernelSize % 2 !== 1 || kernelSize < 3 || kernelSize > 7;
  const invalidConfig = !sigma || invalidSize;
  return (
    <div>
      <div className={`font-bold m-3 ${labelColor}`}>
        Sigma
        <input
          className="mx-2 w-64"
          type="range"
          min=".1"
          max="10"
          step="any"
          value={sigma}
          onChange={e => changeSigma(e)}
        />
        <input
          className="number-input text-black"
          type="number"
          min=".1"
          max="10"
          value={sigma}
          onChange={e => changeSigma(e)}
        />
      </div>
      <div className={`font-bold m-3 ${labelColor}`}>
        Sigma 2
        <input
          className="mx-2 w-64"
          type="range"
          min=".1"
          max="10"
          step="any"
          value={sigma2}
          onChange={e => changeSigma2(e)}
        />
        <input
          className="number-input text-black"
          type="number"
          min=".1"
          max="10"
          value={sigma2}
          onChange={e => changeSigma2(e)}
        />
      </div>
      <div className={`font-bold m-3 ${labelColor}`}>
        Kernel Size
        <input
          className="mx-2 w-64"
          type="range"
          min="3"
          max="7"
          step={2}
          value={kernelSize}
          onChange={e => changeKernelSize(e)}
        />
        <input
          className="number-input text-black"
          type="number"
          min="3"
          max="7"
          step={2}
          value={kernelSize}
          onChange={e => changeKernelSize(e)}
        />
        <div className="font-light italic text-sm">
          {invalidSize ? 'Enter an odd kernel size, between 3 and 7' : ''}
        </div>
      </div>
      <div>
        <button
          type="button"
          className="basic-button"
          disabled={invalidConfig}
          onClick={() => onConfig(kernelSize, sigma, sigma2)}
        >
          Generate Kernel
        </button>
      </div>
    </div>
  );
};

type DoGType = {
  labelColor: string;
  imgUrl: string;
};
const DoG: React.FC<DoGType> = ({ labelColor, imgUrl }) => {
  const [kernel, setKernel] = useState<number[] | undefined>(undefined);
  const [kernel2, setKernel2] = useState<number[] | undefined>(undefined);
  const [kernelGrid, setKernelGrid] = useState<number[][] | undefined>(
    undefined,
  );
  const [kernelGrid2, setKernelGrid2] = useState<number[][] | undefined>(
    undefined,
  );

  const [dogGrid, setDogGrid] = useState<number[][] | undefined>(undefined);

  const configureKernel = (
    kernelSize: number,
    sigma: number,
    sigma2: number,
  ) => {
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

    const newDogGrid = newKernelGrid.map((row, i) =>
      row.map((cell, j) => cell - newKernelGrid2[i][j]),
    );

    // take difference of the two filters
    // dog = difference of gaussians
    // let dog = newKernel.map((inner, i) => (inner - newKernel2[i]));

    // let dogGrid = newKernelGrid.map((inner, i) => inner.map((v, j) => (v - newKernelGrid2[i][j])));

    setKernel(newKernel);
    setKernel2(newKernel2);
    setKernelGrid(newKernelGrid);
    setKernelGrid2(newKernelGrid2);
    setDogGrid(newDogGrid);
  };

  type NamedKernelDisplayType = {
    grid?: number[][];
    label: string;
    kernelName: string;
  };
  const NamedKernelDisplay: React.FC<NamedKernelDisplayType> = ({
    grid,
    label,
    kernelName,
  }) => (
    <div>
      {grid && kernelName}
      {/* TODO: Make kernel smaller in mobile rendering, (avoid scrolling) */}
      <KernelDisplay kernelGrid={grid} labelColor={label} />
    </div>
  );

  return (
    <div className={`flex flex-col items-center font-bold m-4 ${labelColor}`}>
      <KernelConfig onConfig={configureKernel} labelColor={labelColor} />
      {/* TODO:
       un-overlap genwerate kernel button */}
      <div
        className="flex flex-col place-content-center place-content-evenly md:flex-row "
        style={{ width: '1100px' }}
      >
        <NamedKernelDisplay
          grid={kernelGrid}
          label={labelColor}
          kernelName="Kernel 1"
        />
        <NamedKernelDisplay
          grid={kernelGrid2}
          label={labelColor}
          kernelName="Kernel 2"
        />
      </div>
      <div
        className="grid grid-cols-1 items-center mb-5"
        style={{ width: '1100px' }}
      >
        <NamedKernelDisplay
          grid={dogGrid}
          label={labelColor}
          kernelName="Difference of Kernels (1 - 2)"
        />
      </div>
      <p>Filter by the First Kernel</p>
      {/* TODO: Make Filter by kernel Images Larger (mobile rendfering? unclear?) */}
      <FilterByKernel kernel={kernel} imgUrl={imgUrl} />
      <p>Filter by the Second Kernel</p>
      <FilterByKernel kernel={kernel2} imgUrl={imgUrl} />
      <p>Take the Difference of the Filtered Images</p>
      <DiffofFiltered kernel={kernel} kernel2={kernel2} imgUrl={imgUrl} />
    </div>
  );
};

export default DoG;
