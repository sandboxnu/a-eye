import React, { useState, useCallback } from "react";
import EditingRblattGraph from "./EditingRblattGraph";
import RblattInputsTable from "./RblattInputsTable";
import distanceToLineSegment from "distance-to-line-segment";
import InteractiveNeuron from "./InteractiveNeuron";
import { round } from "./utils";

import { changeInputsAfterClick } from "../mpNeuron/utils";

import {
  RblattInput,
  RblattConfig,
  INIT_INPUTS,
  INIT_CONFIG,
} from "./constants";

const trainRblatt = (inpt: RblattInput, config: RblattConfig) => {
  const [x, y, z] = inpt;
  const sum = x * config.weightX + y * config.weightY + config.bias;
  const predicted = sum > 0 ? 1 : 0;
  const error = z - predicted;
  if (error !== 0) {
    const newWeightX = config.weightX + config.learningRate * error * x;
    const newWeightY = config.weightY + config.learningRate * error * y;
    const newBias = config.bias + config.learningRate * error;
    return {
      ...config,
      bias: newBias,
      weightX: newWeightX,
      weightY: newWeightY,
      error,
    };
  } else {
    return { ...config, error };
  }
};

type OperationButtonType = {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  text: string;
};

const OperationButton: React.FC<OperationButtonType> = ({
  className,
  disabled,
  onClick,
  text,
}) => (
  <button
    className={`basic-button flex-shrink-0 ${className ? className : ""}`}
    disabled={true && disabled}
    onClick={onClick ? onClick : () => null}
  >
    {text}
  </button>
);

const RosenBlattDemo = ({ labelColor }: { labelColor: string }) => {
  const [inputs, setInputs] = useState<RblattInput[]>(INIT_INPUTS);
  const [config, setConfig] = useState<RblattConfig>(INIT_CONFIG);
  const [currPoint, setCurrPoint] = useState<number>(0);
  const [animInterval, setAnimInterval] = useState<NodeJS.Timeout | null>(null);
  const [binMisclass, setBinMisclass] = useState<number>(0);
  const [msError, setMSError] = useState<number>(0);

  const updateErrors = useCallback(
    (inputs: RblattInput[], config: RblattConfig) => {
      let binCount = 0;
      let msCount = 0;
      inputs.forEach(([x, y, z]) => {
        const sum = x * config.weightX + y * config.weightY + config.bias;
        const predicted = sum > 0 ? 1 : 0;
        const error = z - predicted;

        const x1 = 0,
          y1 = config.bias / -config.weightY;
        const x2 = config.bias / -config.weightX,
          y2 = 0;
        const msq = distanceToLineSegment.squared(x1, y1, x2, y2, x, y);

        if (error !== 0) {
          binCount++;
        }
        msCount += msq;
      });

      setBinMisclass(binCount);
      setMSError(round(msCount / inputs.length, 3));
    },
    []
  );

  const trainSingle = useCallback(
    (prevPoint: number) => {
      if (animInterval) return;
      const nextPoint = (prevPoint + 1) % inputs.length;
      setCurrPoint(nextPoint);
      setConfig((oldConf) => {
        const newC = trainRblatt(inputs[nextPoint], oldConf);
        return { ...newC, learningRate: oldConf.learningRate };
      });
      updateErrors(inputs, config);
    },
    [animInterval, inputs, config, updateErrors]
  );

  const trainAll = useCallback(() => {
    if (animInterval) return;
    setConfig((config) =>
      inputs.reduce((curConf, inpt) => trainRblatt(inpt, curConf), config)
    );
    updateErrors(inputs, config);
  }, [animInterval, config, inputs, updateErrors]);

  const animateAll = useCallback(() => {
    if (animInterval) {
      clearInterval(animInterval);
      setAnimInterval(null);
    } else {
      let prev = -1;
      const interval = setInterval(() => {
        trainSingle(prev);
        prev += 1;
      }, 1000);
      setAnimInterval(interval);
    }
  }, [animInterval, trainSingle]);

  const resetConfig = useCallback(() => {
    setInputs(INIT_INPUTS);
    setConfig(INIT_CONFIG);
    setCurrPoint(0);
    updateErrors(INIT_INPUTS, INIT_CONFIG);
  }, [setInputs, setConfig, setCurrPoint, updateErrors]);

  const clearConfig = useCallback(() => {
    setInputs([]);
    setConfig(INIT_CONFIG);
    setCurrPoint(0);
    updateErrors([], INIT_CONFIG);
  }, [setInputs, setConfig, setCurrPoint, updateErrors]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClick = useCallback(changeInputsAfterClick(setInputs), [
    setInputs,
  ]);

  return (
    <div className="m-4 w-max">
      <div className="m-4 flex items-center justify-center">
        {inputs.length === 0 ? (
          <div
            className={`m-4 flex items-center justify-center font-bold text-2xl ${labelColor}`}
          >
            Add a point to the graph to start!
          </div>
        ) : (
          <InteractiveNeuron
            labelColor={labelColor}
            config={config}
            inputs={inputs}
            currPoint={currPoint}
            setConfig={setConfig}
            binMisclass={binMisclass}
          />
        )}
        <EditingRblattGraph
          inputs={inputs}
          line={config}
          highlighted={inputs[currPoint]}
          handleClick={handleClick}
        />
      </div>
      <div>
        <OperationButton
          className={animInterval ? "alt" : ""}
          onClick={animateAll}
          text={animInterval ? "Stop ■" : "Animate ▶"}
          disabled={inputs.length === 0}
        />
        <OperationButton
          disabled={!!animInterval || inputs.length === 0}
          onClick={() => trainSingle(currPoint)}
          text={"Train Single Point"}
        />
        <OperationButton
          disabled={!!animInterval || inputs.length === 0}
          onClick={trainAll}
          text={"Train All Points"}
        />
        <OperationButton onClick={resetConfig} text={"Reset"} />
        <OperationButton onClick={clearConfig} text={"Clear All"} />
      </div>
      {inputs.length !== 0 && (
        <RblattInputsTable labelColor={labelColor} data={inputs} />
      )}
    </div>
  );
};

export default RosenBlattDemo;
