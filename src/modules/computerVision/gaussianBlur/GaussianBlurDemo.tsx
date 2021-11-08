import React, { useState } from 'react';
import FilterByKernel from '../common/FilterByKernel';
import KernelDisplay from '../common/KernelDisplay';
// have to use require for this bc it doesn't have a module declaration file or something
const generateGaussianKernel = require('gaussian-convolution-kernel');

type KernelConfigType = {
  onConfig: (kernelSize: number, sigma: number) => void;
  labelColor: string;
};

const KernelConfig: React.FC<KernelConfigType> = ({ onConfig, labelColor }) => {
  const [kernelSize, setKernelSize] = useState<number>(5);
  const [sigma, setSigma] = useState<number>(1);

  const changeSigma = (e: any) => setSigma(parseFloat(e.target.value));
  const changeKernelSize = (e: any) =>
    setKernelSize(parseInt(e.target.value, 10));

  const invalidSize = kernelSize % 2 !== 1 || kernelSize < 1 || kernelSize > 7;
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
      <div className={`font-bold m-3 h-10 ${labelColor}`}>
        Kernel Size
        <input
          className="mx-2 w-64"
          type="range"
          min="1"
          max="7"
          step={2}
          value={kernelSize}
          onChange={e => changeKernelSize(e)}
        />
        <input
          className="number-input text-black"
          type="number"
          min="1"
          max="7"
          step={2}
          value={kernelSize}
          onChange={e => changeKernelSize(e)}
        />
        <div className="font-light italic text-sm">
          {invalidSize ? 'Enter an odd kernel size, between 1 and 7' : ''}
        </div>
      </div>
      <div className="p-6">
        <button
          type="button"
          className={`basic-button ${window.innerWidth <= 470 ? 'mt-12' : ''}`}
          disabled={invalidConfig}
          onClick={() => onConfig(kernelSize, sigma)}
        >
          Generate Kernel
        </button>
      </div>
    </div>
  );
};

type GaussianBlurDemoType = {
  labelColor: string;
  imgUrl: string;
};

const GaussianBlurDemo: React.FC<GaussianBlurDemoType> = ({
  labelColor,
  imgUrl,
}) => {
  const [kernel, setKernel] = useState<number[] | undefined>(undefined);
  const [kernelGrid, setKernelGrid] = useState<number[][] | undefined>(
    undefined,
  );

  const configureKernel = (kernelSize: number, sigma: number) => {
    let newKernel: number[];
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
  };

  return (
    <div className="flex flex-col items-center font-bold m-4">
      <div
        className="flex flex-col place-content-center place-content-evenly md:flex-row"
        style={{ width: '150%' }}
      >
        <KernelConfig onConfig={configureKernel} labelColor={labelColor} />
      </div>
      <KernelDisplay kernelGrid={kernelGrid} labelColor={labelColor} />
      <FilterByKernel kernel={kernel} imgUrl={imgUrl} />
    </div>
  );
};

export default GaussianBlurDemo;
