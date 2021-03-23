import React, { useEffect, useState } from 'react';
import { RblattInput, RblattConfig, INIT_CONFIG, INIT_INPUTS } from './constants';
import JXG from 'jsxgraph';

type RblattGraphProps = {
    inputs: RblattInput[],
    line?: RblattConfig,
    highlighted?: RblattInput,
    editingType: {val:  0 | 1 | null},
    onInputsChange: (inpts: React.SetStateAction<RblattInput[]>) => void,
    reset: {isReset:boolean, setReset:Function},
    clear: {isCleared:boolean, setCleared:Function},
    calculatePointColor?: (RblattInput) => 0 | 1,
    // allowSelectingPointColor: boolean
 }

const isInitialInputPoint = (xCoord: number, yCoord: number) => {
    let result = false
    INIT_INPUTS.forEach(({x: xInit, y: yInit}) => {
        if(xInit === xCoord && yInit === yCoord) {
            result = true;
        }
    });
    return result;
};

// returns all the points which are all not initial inputs, aka all the points that have been added
const getListInputs = (inputs: RblattInput[]) => {
    let toRemove:RblattInput[] = []
    let toAdd:RblattInput[] = []
    inputs.forEach((input: RblattInput) => {
        const {x,y} = input;
        if (!isInitialInputPoint(x, y)) {
            toRemove.push(input);
        } else {
            toAdd.push(input);
        }
    })
    return [toRemove, toAdd];
}

const RblattGraph = (props: RblattGraphProps) => {
    const [brdId, setBrdId] = useState('board_' + Math.random().toString(36).substr(2, 9));
    const [board, setBoard] = useState<any>(null);
    const [pointA, setPointA] = useState<any>(null); // 2 points to define the line
    const [pointB, setPointB] = useState<any>(null);

    // creates the board when the component loads
    useEffect(() => {
        const newBoard = JXG.JSXGraph.initBoard(brdId, { boundingbox: [-10, 10, 10, -10], axis: true });
        setBoard(newBoard);
        props.inputs.forEach((inpt, idx) => {
            const color = inpt.z === 1 ? COL_1 : COL_0
            const p = newBoard.create('point', [inpt.x, inpt.y], { name: '', size: 1, color, fixed: true });
        });
        if (props.line) {
            const {aCoords, bCoords} = getLinePoints(props.line);
            const pA = newBoard.create('point', aCoords, { name: '', fixed: true, color: 'transparent'});
            const pB = newBoard.create('point', bCoords, { name: '', fixed: true, color: 'transparent'});
            const li = newBoard.create('line', [pA, pB], { strokeColor: 'black', strokeWidth: 2, fixed: true });
            newBoard.create('inequality', [li], {fillColor: COL_0});
            newBoard.create('inequality', [li], { inverse: true, fillColor: COL_1 });
            setPointA(pA);
            setPointB(pB);
        }
    }, []);

    // register listeners after the state var has been set
    useEffect(() => { board && board.on('down', editPoint)}, [board]);

    useEffect(() => {
        if (props.line) {
            const {aCoords, bCoords} = getLinePoints(props.line);
            pointA?.moveTo(aCoords, 700);
            pointB?.moveTo(bCoords, 700);
            board?.removeObject('prevLine');
            board?.create('line', [[pointA?.X(), pointA?.Y()], [pointB?.X(), pointB?.Y()]],
                            {name: 'prevLine', color: 'rgba(0, 0, 0, 0.2)'});
        }
    }, [props.line]);

    useEffect(() => {
        if(props.highlighted !== undefined) {
            board?.select({
                elementClass: JXG.OBJECT_CLASS_POINT
            }).setAttribute({size: 1});
            board?.select({
                Y: (v: number) => v === props.highlighted!.y,
                X: (v: number) => v === props.highlighted!.x
            }).setAttribute({size: 4});
        }
    }, [props.highlighted]);

    useEffect(() => {
        if(board && props.reset.isReset) {
            const [pointsToRemove, pointsToAdd] = getListInputs(props.inputs)
            for (let el in board.objects) {
                if (JXG.isPoint(board.objects[el])) {
                    const [z, x, y] = board.objects[el].coords.usrCoords
                    pointsToRemove.forEach((point) => {
                        const {x: x1, y: y1} = point;
                        if (x1 == x && y1 == y)  {
                            removePoint(el, x, y);
                        }
                    })
                }
            }
            INIT_INPUTS.forEach(({x, y, z}) => 
                board.create('point', [x, y], { name: '', size: 1, color: z ? COL_1 : COL_0 }));
            props.reset.setReset(false);
        }
        else if(board && props.clear.isCleared) {
            const pointsToRemove = props.inputs;
            for (let el in board.objects) {
                if (JXG.isPoint(board.objects[el])) {
                    const [z, x, y] = board.objects[el].coords.usrCoords
                    pointsToRemove.forEach((point) => {
                        const {x: x1, y: y1} = point;
                        if (x1 == x && y1 == y)  {
                            removePoint(el, x, y);
                        }
                    })
                }
            }
            props.clear.setCleared(false);
        }
    }, [props]);

    const editPoint = (e: any) => {
        if (props.editingType.val === null) return;

        let canCreate = true;
        let i;
        let pointToDelete;
        if (e[JXG.touchProperty]) {
            i = 0;
        }
        const coords = getMouseCoords(board, e, i);
        for (let el in board.objects) {
            if (JXG.isPoint(board.objects[el]) && board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])) {
                canCreate = false;
                pointToDelete = el;
                break;
            }
        }
        if (canCreate) {
            const x = coords.usrCoords[1];
            const y = coords.usrCoords[2];
            const z = props.calculatePointColor ? props.calculatePointColor({x, y}) 
                : props.editingType.val || 0;
            addPoint(x, y, z, board);
        } else {
            removePoint(pointToDelete, coords.scrCoords[1], coords.scrCoords[2], board);
        }
    }

    const addPoint = (x: number, y: number, z: 0 | 1,  currBoard?: any) => {
        console.log(x, y, z, currBoard);
        props.onInputsChange(oldInpts => {
            return oldInpts.concat([{x, y, z}]);
        });

        // can't directly use state var for board bc of closures
        if (!currBoard) currBoard = board;
        // creating points here is *technically* going against controlled components
        // shhh do not look
        board.create('point', [x, y],
            { name: '', size: 1, color: z ? COL_1 : COL_0 });
    }

    const removePoint = (pointId: string, x: number, y: number, currBoard?: any) => {
        if (props.editingType.val === null) return;
        props.onInputsChange(oldInpts => oldInpts.filter(inpt => inpt.x != x && inpt.y != y));

        // can't directly use state var for board bc of closures
        if (!currBoard) currBoard = board;
        currBoard.removeObject(pointId);
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