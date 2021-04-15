import React, { useState } from "react";
import RblattGraph from "./RblattGraph";
import { RblattInput, RblattConfig } from "./constants";
import { NeuronConfig } from "../mpNeuron/utils";

type EditingRblattGraphProps = {
  inputs: RblattInput[];
  line?: RblattConfig;
  lines?: { x: number; y: number }[];
  highlighted?: RblattInput;
  allowSelectingPointColor?: boolean;
  calculatePointColor?: (x: RblattInput, y: NeuronConfig) => 0 | 1;
  handleClick?: any;
  squareColors?: (0 | 1)[];
};

const EditingRblattGraph: React.FC<EditingRblattGraphProps> = ({
  inputs,
  line = undefined,
  lines = undefined,
  highlighted = undefined,
  allowSelectingPointColor = true,
  handleClick,
  squareColors,
}) => {
  const [editingType, setEditingType] = useState<1 | 0>(0);

  return (
    <div className="flex flex-col items-center justify-center">
      <RblattGraph
        inputs={inputs}
        line={line}
        lines={lines}
        highlighted={highlighted}
        editingType={editingType}
        handleClick={handleClick}
        squareColors={squareColors}
      />
      <div className="flex items-center justify-center">
        {allowSelectingPointColor && (
          <>
            <p className="text-modulePaleBlue">Select Point Color:</p>
            <button
              className={`basic-button alt py-1 px-2 bg-orange-500 border-4 ${
                editingType === 0 ? "border-orange-800" : "border-transparent"
              } `}
              onClick={() => setEditingType((et) => (et === 1 ? 0 : 1))}
            >
              Orange
            </button>
            <button
              className={`basic-button py-1 px-2 bg-lightNavy border-4 ${
                editingType === 1 ? "border-blue-900" : "border-transparent"
              }`}
              onClick={() => setEditingType((et) => (et === 1 ? 0 : 1))}
            >
              Blue
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditingRblattGraph;
