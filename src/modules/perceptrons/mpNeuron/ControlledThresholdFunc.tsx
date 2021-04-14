import React from "react";

type ThresholdFuncType = {
  threshold: number;
  setThreshold: (a: number) => void;
  isGreater: boolean;
  setIsGreater: (a: boolean) => void;
};

const ControlledThresholdFunc: React.FC<ThresholdFuncType> = ({
  threshold,
  setThreshold,
  isGreater,
  setIsGreater,
}) => (
  <div
    className="font-bold w-20 h-10 rounded-md border-2 border-orange-500
                        flex items-center justify-center px-2 text-white"
  >
    <div className="cursor-pointer" onClick={() => setIsGreater(!isGreater)}>
      {isGreater ? ">" : "<"}
    </div>
    <input
      className="number-input w-10 border-0 bg-transparent"
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
);

export default ControlledThresholdFunc;
