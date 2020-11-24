import React, { useEffect, useState } from 'react';
const JXG = require('jsxgraph');


const RblattVectorsDemo = () => {
    const [brdId, setBrdId] = useState('board_' + Math.random().toString(36).substr(2, 9));
    const [phase, setPhase] = useState(0);
    const [board, setBoard] = useState<any>(null);
    const [perpPoint, setPerpPoint] = useState<any>(null); 

    useEffect(() => {
        const newBoard = JXG.JSXGraph.initBoard(brdId, { boundingbox: [2, 6, 7, 0], axis: true });
        setBoard(newBoard);
        POINTS.forEach((inpt) => {
            const color = inpt.z === 1 ? COL_1 : COL_0
            const p = newBoard.create('point', [inpt.x, inpt.y], 
                                      { name: '', size: 1, color, fixed: true });
        });
        const pA = newBoard.create('point', INIT_PERP_POINT, { name: '', fixed: true, color: 'transparent'});
        setPerpPoint(pA);
        const perpArrow = newBoard.create('arrow', [MAINLINE_INTERSECTION, pA], 
            { strokeColor: 'black', strokeWidth: 2, fixed: true, name: 'Wt', withLabel:true, label: {position: 'top'} });
        const li = newBoard.create('perpendicular', [perpArrow, MAINLINE_INTERSECTION], 
            { name: 'mainLine',  withLabel:false, strokeColor: 'black', strokeWidth: 2, fixed: true });
        newBoard.create('inequality', [li], {name: 'ineq1', inverse: true, fillColor: COL_0});
        newBoard.create('inequality', [li], {name: 'ineq2', fillColor: COL_1 });
    }, []);

    // todo colors
    const goNext = () => {
        switch (phase) {
            case 0:
                board?.select({
                    X: (v: number) => v === CURR_POINT[0], 
                    Y: (v: number) => v === CURR_POINT[1]
                }).setAttribute({size: 4});
                const dist = board?.create('arrow', [MAINLINE_INTERSECTION, CURR_POINT], 
                    { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: 'd', withLabel:true, label: {position: 'top'}});
                setPhase(1);
                break;
            case 1:
                board?.create('arrow', [INIT_PERP_POINT, NEW_PERP_POINT],
                     { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: '-d', withLabel:true, label: {position: 'top'}});
                board?.create('arrow', [MAINLINE_INTERSECTION, NEW_PERP_POINT], 
                    { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 3, name: 'Wt - d', withLabel:true, label: {position: 'top'}});
                setPhase(2);
                break;
            case 2:
                board?.select({
                    X: (v: number) => v === CURR_POINT[0], 
                    Y: (v: number) => v === CURR_POINT[1]
                }).setAttribute({size: 1});
                board?.removeObject('d');
                board?.removeObject('-d');
                board?.removeObject('ineq1');
                board?.removeObject('ineq2');
                perpPoint.moveTo(NEW_PERP_POINT, 700, {callback: () => {
                    board?.create('inequality', ['mainLine'], {name: 'ineq1', fillColor: COL_0});
                    board?.create('inequality', ['mainLine'], {name: 'ineq2', inverse: true, fillColor: COL_1 });
                }});
                setPhase(3);
                break;
        }
    }

    const goPrev = () => {
        switch (phase) {
            case 1:
                board?.select({
                    X: (v: number) => v === CURR_POINT[0], 
                    Y: (v: number) => v === CURR_POINT[1]
                }).setAttribute({size: 1});
                board?.removeObject('d');
                setPhase(0);
                break;
            case 2:
                board?.removeObject('-d');
                board?.removeObject('Wt - d');
                setPhase(1);
                break;
            case 3:
                board?.removeObject('ineq1');
                board?.removeObject('ineq2');
                perpPoint.moveTo(INIT_PERP_POINT, 700, {callback: () => {
                    board?.create('inequality', ['mainLine'], {name: 'ineq1', inverse: true, fillColor: COL_0});
                    board?.create('inequality', ['mainLine'], {name: 'ineq2', fillColor: COL_1 });
                    board?.create('arrow', [MAINLINE_INTERSECTION, CURR_POINT],
                    { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: 'd', withLabel:true, label: {position: 'top'}});
                    board?.create('arrow', [INIT_PERP_POINT, NEW_PERP_POINT],
                     { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: '-d', withLabel:true, label: {position: 'top'}});
                }});
                setPhase(2);
                break;
        }
    }

    return (
        <div className="m-4">
            <div className="bg-white mx-auto" id={brdId} style={{ width: '500px', height: '500px' }} />
            <button className='basic-button' onClick={goPrev} disabled={phase === 0}>
                Previous Step
            </button>
            <button className='basic-button' onClick={goNext} disabled={phase === 3}>
                Next Step
            </button>
        </div>
    );
}

export default RblattVectorsDemo;

const COL_0 = '#f15e2c';
const COL_1 = '#394d73';
const POINTS = [
    {x: 3.481875, y: 4.48, z: 0},
    {x: 5.161875, y: 4.52, z: 0},
    {x: 4.801875, y: 3.44, z: 0},
    {x: 3.161875, y: 0.88, z: 1},
    {x: 3.721875, y: 1.84, z: 1},
    {x: 5.281875, y: .96, z: 1}];
const INIT_PERP_POINT = [6, 2.5];
const NEW_PERP_POINT = [5.22, 4.04];
const MAINLINE_INTERSECTION = [4.5, 2.5];
const CURR_POINT = [ 5.281875, .96];
