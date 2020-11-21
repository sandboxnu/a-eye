import React, { useEffect, useState } from 'react';
import { RblattInput, RblattConfig } from './RosenblattDemo';
const JXG = require('jsxgraph');

type RblattGraphProps = { 
    inputs: RblattInput[], 
    line: RblattConfig, 
    highlighted: RblattInput,
    editingType: {val:  0 | 1 | null}, 
    onInputsChange: (inpts: React.SetStateAction<RblattInput[]>) => void
 }

const RblattGraph = (props: RblattGraphProps) => {
    const [brdId, setBrdId] = useState('board_' + Math.random().toString(36).substr(2, 9));
    const [board, setBoard] = useState<any>(null);
    const [pointA, setPointA] = useState<any>(null); // 2 points to define the line
    const [pointB, setPointB] = useState<any>(null);

    useEffect(() => {
        const newBoard = JXG.JSXGraph.initBoard(brdId, { boundingbox: [-10, 10, 10, -10], axis: true });
        setBoard(newBoard);
        props.inputs.forEach((inpt, idx) => {
            const color = inpt.z === 1 ? COL_1 : COL_0
            const p = newBoard.create('point', [inpt.x, inpt.y], 
                                      { name: '', size: 1, color, fixed: true });
            p.on('down', () => removePoint(p, idx, newBoard));
        });
        const {aCoords, bCoords} = getLinePoints(props.line);
        const pA = newBoard.create('point', aCoords, { name: '', fixed: true, color: 'transparent'});
        const pB = newBoard.create('point', bCoords, { name: '', fixed: true, color: 'transparent'});
        const li = newBoard.create('line', [pA, pB], { strokeColor: 'black', strokeWidth: 2, fixed: true });
        newBoard.create('inequality', [li], {fillColor: COL_0});
        newBoard.create('inequality', [li], { inverse: true, fillColor: COL_1 });
        setPointA(pA);
        setPointB(pB);
    }, []);

    // register listeners after the state var has been set
    useEffect(() => { board && board.on('down', addPoint) }, [board]);

    useEffect(() => {
        const {aCoords, bCoords} = getLinePoints(props.line);
        pointA?.moveTo(aCoords, 700);
        pointB?.moveTo(bCoords, 700);
        board?.removeObject('prevLine');
        board?.create('line', [[pointA?.X(), pointA?.Y()], [pointB?.X(), pointB?.Y()]],
                        {name: 'prevLine', color: 'rgba(0, 0, 0, 0.2)'});
    }, [props.line]);

    useEffect(() => {
        board?.select({
            elementClass: JXG.OBJECT_CLASS_POINT
        }).setAttribute({size: 1});
        board?.select({
            Y: (v: number) => v === props.highlighted.y, 
            X: (v: number) => v === props.highlighted.x
        }).setAttribute({size: 4});
    }, [props.highlighted]);

    const addPoint = (e: any) => {
        if (props.editingType.val === null) return;

        var canCreate = true, i, coords: any, el;
        if (e[JXG.touchProperty]) {
            i = 0;
        }
        coords = getMouseCoords(board, e, i);
        for (el in board.objects) {
            if (JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                canCreate = false;
                break;
            }
        }
        if (canCreate) {
            const newIdx = props.inputs.length;
            props.onInputsChange(oldInpts => {
                const z = props.editingType.val || 0;
                oldInpts.push({x: coords.usrCoords[1], y: coords.usrCoords[2], z });
                return oldInpts;
            });
            // creating points here is *technically* going against controlled components
            // shhh do not look
            const p = board.create('point', [coords.usrCoords[1], coords.usrCoords[2]],
                { name: '', size: 1, color: props.editingType.val ? COL_1 : COL_0 });
            p.on('down', () => removePoint(p, newIdx));

        }
    }

    const removePoint = (point: any, idx: number, currBoard?: any) => {
        if (props.editingType.val === null) return;
        props.onInputsChange(oldInpts => oldInpts.filter(inpt => inpt.x != point.X() && inpt.y != point.Y()));

        // can't directly use state var for board bc of closures
        if (!currBoard) currBoard = board;
        currBoard.removeObject(point); 
    }

    return (
        <div className="bg-white" id={brdId} style={{ width: '500px', height: '500px' }} />
    );
}

export default RblattGraph;




var getMouseCoords = function (board: any, e: MouseEvent, i?: number) {
    var cPos = board.getCoordsTopLeftCorner(e),
        absPos = JXG.getPosition(e, i),
        dx = absPos[0] - cPos[0],
        dy = absPos[1] - cPos[1];

    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
}

// todo test if this is correct when switching between normal/ vertical line
function getLinePoints(line: RblattConfig) {
    if (line.weightY === 0) {
        const x = line.bias / line.weightX;
        return {aCoords: [x, 1], bCoords: [x, 2]} 
    } else {
        const func = (x: number) => (line.weightX * x + line.bias) / (- line.weightY);
        return {aCoords: [1, func(1)], bCoords: [2, func(2)]} 
    }
}

const COL_0 = '#f15e2c';
const COL_1 = '#394d73';

