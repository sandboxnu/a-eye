import React, {useState} from 'react';
import InteractiveFilter from '../common/InteractiveFilter';
import { haarFilter } from './haarTransform';
import Lenna from './Lenna.png';

/*
how does haar relate to normal kernel convolutions?
What other configs/things to add to demo? currently not very intuitive
*/
const HaarWaveletDemo = (props: {labelColor: string}) => {
    const [recursions, setRecursions] = useState(3);

    const invalidConfig = recursions < 1 || recursions > 10;

    return (
        <div>
            <div className={`font-bold m-3 ${props.labelColor}`}>
                Number of Recursions
                <input className="mx-2 w-64"
                    type="range" min="1" max="10" step="1"
                    value={recursions} onChange={(e) => setRecursions(parseInt(e.target.value))} />
                <input className="number-input text-black"
                    type="number" min="1" max="10"
                    value={recursions} onChange={(e) => setRecursions(parseInt(e.target.value))} />
                <div className="font-light italic text-sm">
                    { invalidConfig ? 'Enter an integer, between 1 and 10' : ''}
                </div>
            </div>
            <InteractiveFilter
                disabled={invalidConfig}
                imgUrl={Lenna}
                filter={(inCanvas, outCanvas) => {
                    haarFilter(inCanvas, outCanvas, recursions);
                }}
            />
        </div>
    );

};

export default HaarWaveletDemo;