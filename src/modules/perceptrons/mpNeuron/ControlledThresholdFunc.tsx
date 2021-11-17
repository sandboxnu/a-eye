/* eslint-disable */
import React from "react";

type ThresholdFuncType = {
  threshold: number;
  setThreshold?: (a: number) => void;
  isGreater: boolean;
  setIsGreater?: (a: boolean) => void;
  labelColor: string;
};

const ControlledThresholdFunc: React.FC<ThresholdFuncType> = ({
  threshold,
  setThreshold,
  isGreater,
  setIsGreater,
  labelColor,
}) =>
  setIsGreater && setThreshold ? (
    <div
      className="font-bold w-24 h-10 rounded-md border-2 border-orange-500
                        flex items-center justify-center px-2 text-white"
    >
      <div className="flex cursor-pointer border-orange-500 border-r-2 pr-2 h-full items-center" onClick={() => setIsGreater(!isGreater)}>
        {isGreater ? ">" : "<"}
      </div>
      <input
        className="number-input w-12 border-0 bg-transparent"
        type="number"
        value={threshold !== null ? threshold : ""}
        onChange={(e) => {
          if (e.target.value !== "") {
            const val = parseFloat(e.target.value);
            if (!isNaN(val)) setThreshold(val);
          }
        }}
      />
    </div>
  ) : (
    <div
      className={`w-20 h-10 rounded-md border-2 border-orange-500 flex items-center justify-center px-2 ${labelColor}`}
    >
      {`${isGreater ? ">" : "<"} ${threshold}`}
    </div>
  );

export default ControlledThresholdFunc;
