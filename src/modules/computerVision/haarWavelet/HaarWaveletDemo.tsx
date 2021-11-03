import React, { useState } from 'react';
import InteractiveFilter from '../common/InteractiveFilter';
import { haarFilter } from './haarTransform';

/*
how does haar relate to normal kernel convolutions?
What other configs/things to add to demo? currently not very intuitive
*/

type HaarWaveletDemoType = {
  labelColor: string;
  imgUrl: string;
};

const HaarWaveletDemo: React.FC<HaarWaveletDemoType> = ({
  labelColor,
  imgUrl,
}) => {
  const [recursions, setRecursions] = useState(3);

  const invalidConfig = recursions < 1 || recursions > 10;

  return (
    <div>
      <div className={`font-bold m-3 ${labelColor}`}>
        Number of Recursions
        <input
          className="mx-2 w-64"
          type="range"
          min="1"
          max="10"
          step="1"
          value={recursions}
          onChange={e => setRecursions(parseInt(e.target.value, 10))}
        />
        <input
          className="number-input text-black"
          type="number"
          min="1"
          max="10"
          value={recursions}
          onChange={e => setRecursions(parseInt(e.target.value, 10))}
        />
        <div className="font-light italic text-sm">
          {invalidConfig ? 'Enter an integer, between 1 and 10' : ''}
        </div>
      </div>
      <InteractiveFilter
        disabled={invalidConfig}
        imgUrl={imgUrl}
        filter={(inCanvas, outCanvas) => {
          haarFilter(inCanvas, outCanvas, recursions);
        }}
      />
    </div>
  );
};

export default HaarWaveletDemo;
