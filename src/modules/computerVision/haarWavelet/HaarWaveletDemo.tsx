import React, {useState} from 'react';
import InteractiveFilter from '../common/InteractiveFilter';
import { haarFilter } from './haarTransform';

/*
how does haar relate to normal kernel convolutions?
What other configs/things to add to demo? currently not very intuitive
*/
const HaarWaveletDemo = (props : {imgUrl: string}) => {
    const [recursions, setRecursions] = useState(3);

    const invalidConfig = recursions < 1 || recursions > 10;

    return (
        <div>
            <div className="font-bold m-3">
                Number of Recursions
                <input className="mx-2 w-64"
                    type="range" min="1" max="10" step="1"
                    value={recursions} onChange={(e) => setRecursions(parseInt(e.target.value))} />
                <input className="number-input"
                    type="number" min="1" max="10"
                    value={recursions} onChange={(e) => setRecursions(parseInt(e.target.value))} />
                <div className="font-light italic text-sm">
                    { invalidConfig ? 'Enter an integer, between 1 and 10' : ''}
                </div>
            </div>
            <InteractiveFilter
                disabled={invalidConfig}
                imgUrl={props.imgUrl}
                filter={(inCanvas, outCanvas) => {
                    haarFilter(inCanvas, outCanvas, recursions);
                }}
            />
        </div>
    );

};

export default HaarWaveletDemo;