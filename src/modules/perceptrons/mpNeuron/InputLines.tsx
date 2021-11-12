/* eslint-disable */
import React from "react";

type InputLinesType = {
  numInpts: number;
  transformY?: number;
};

const InputLines: React.FC<InputLinesType> = ({ numInpts, transformY }) => {
  const height = 56 * numInpts;
  const centerY = height / 2;

  return (
    <svg
      width="125px"
      height={height}
      viewBox={`0 0 125 ${height}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array(numInpts)
        .fill(null)
        .map((_, idx) => (
          <line
            key={idx}
            x1="0"
            y1={(transformY ? transformY : 1) * idx * 56 + 28}
            x2="125"
            y2={centerY}
            strokeWidth="4px"
            stroke="#394D73"
          />
        ))}
    </svg>
  );
};

export default InputLines;
