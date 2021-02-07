import React, { useEffect, useState } from 'react';
const JXG = require('jsxgraph');
const equalArrays = (a1, a2) => (JSON.stringify(a1) === JSON.stringify(a2));

const RblattVectorsDemo = () => {
    const [brdId, setBrdId] = useState('board_' + Math.random().toString(36).substr(2, 9));
    const [phase, setPhase] = useState(0);
    const [board, setBoard] = useState<any>(null);
    const [perpPoint, setPerpPoint] = useState<any>(null);
    const [line, setLine] = useState<any>(null);
    const phaseMessages = [
        'The initial classification line is represented by its perpendicular vector Wt.',
        'After finding a misclassified point, we calculate the distance d between it and the vector\'s origin.',
        'We then calculate the new vector by subtracting d from Wt.',
        'Finally, we update the classification line to be perpendicular to the new vector (Wt - d).'];
    const [brdMsg, setBrdMsg] = useState<string>(phaseMessages[0]);
    const [demoConfig, setDemoConfig] = useState<any>(translationConfig);

    useEffect(() => {
        const newBoard = JXG.JSXGraph.initBoard(brdId, { boundingbox: [2, 6, 7, 0], axis: true });
        setBoard(newBoard);
        demoConfig.POINTS.forEach((inpt) => {
            const color = inpt.z === 1 ? COL_1 : COL_0
            const p = newBoard.create('point', [inpt.x, inpt.y],
                { name: '', size: 1, color, fixed: true });
        });
        const pA = newBoard.create('point', demoConfig.INIT_PERP_POINT, { name: '', fixed: true, color: 'transparent'});
        setPerpPoint(pA);
        const perpArrow = newBoard.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, pA],
            { strokeColor: 'black', strokeWidth: 2, fixed: true, name: 'Wt', withLabel:true, label: {position: 'top'} });
        const lineIntersect = newBoard.create('point', demoConfig.MAINLINE_INTERSECTION_I,
            { name: 'intersect', withLabel: false, fixed: true, color: 'gray'});
        const li = newBoard.create('perpendicular', [perpArrow, lineIntersect],
            { name: 'mainLine', withLabel: false, strokeColor: 'black', strokeWidth: 2, fixed: true });
        setLine(li);
        newBoard.create('inequality', [li], {name: 'ineq1', fillColor: COL_0});
        newBoard.create('inequality', [li], {name: 'ineq2', inverse: true, fillColor: COL_1 });
    }, []);

    // todo colors
    const goNext = () => {
        setBrdMsg(phaseMessages[phase+1]);
        switch (phase) {
            case 0:
                board?.select({
                    X: (v: number) => v === demoConfig.CURR_POINT[0],
                    Y: (v: number) => v === demoConfig.CURR_POINT[1]
                }).setAttribute({size: 4});
                const dist = board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, demoConfig.CURR_POINT],
                    { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: 'd', withLabel:true, label: {position: 'top'}});
                setPhase(1);
                break;
            case 1:
                if (equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F)) {
                    board?.create('arrow', [demoConfig.INIT_PERP_POINT, demoConfig.NEW_PERP_POINT],
                        { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: '-d', withLabel:true, label: {position: 'top'}});
                }
                const vectorName = equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F) ? 'Wt - d' : 'Wt + d';
                board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, demoConfig.NEW_PERP_POINT],
                    { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 3, name: vectorName, withLabel:true, label: {position: 'top'}});
                setPhase(2);
                break;
            case 2:
                board?.select({
                    X: (v: number) => v === demoConfig.CURR_POINT[0],
                    Y: (v: number) => v === demoConfig.CURR_POINT[1]
                }).setAttribute({size: 1});
                board?.removeObject('d');
                board?.removeObject('-d');
                board?.removeObject('ineq1');
                board?.removeObject('ineq2');

                if (!equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F)) {
                    board?.removeObject('Wt');
                    board?.removeObject('Wt + d');
                    board?.removeObject('mainLine');
                    board?.removeObject('intersect');
                    board?.removeObject('perpendicular');
                    board?.removeObject('arrow');
                    const pA = board?.create('point', demoConfig.NEW_PERP_POINT, { name: '', fixed: true, color: 'transparent'});
                    setPerpPoint(pA);
                    const perpArrow = board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_F, perpPoint],
                        { strokeColor: 'black', strokeWidth: 2, fixed: true, name: 'Wt', withLabel:true, label: {position: 'top'} });
                    const lineIntersect = board?.create('point', demoConfig.MAINLINE_INTERSECTION_F,
                        { name: 'intersect', withLabel:false, fixed: true, color: 'gray'});
                    const li = board?.create('perpendicular', [perpArrow, lineIntersect],
                        { name: 'mainLine',  withLabel:false, strokeColor: 'black', strokeWidth: 2, fixed: true });
                }

                perpPoint.moveTo(demoConfig.NEW_PERP_POINT, 700, {callback: () => {
                        board?.create('inequality', ['mainLine'], {name: 'ineq1', fillColor: COL_0});
                        board?.create('inequality', ['mainLine'], {name: 'ineq2', inverse: true, fillColor: COL_1 });
                    }});
                setPhase(3);
                break;
        }
    }

    const goPrev = () => {
        setBrdMsg(phaseMessages[phase-1]);
        switch (phase) {
            case 1:
                board?.select({
                    X: (v: number) => v === demoConfig.CURR_POINT[0],
                    Y: (v: number) => v === demoConfig.CURR_POINT[1]
                }).setAttribute({size: 1});
                board?.removeObject('d');
                setPhase(0);
                break;
            case 2:
                board?.removeObject('-d');
                board?.removeObject('Wt - d');
                board?.removeObject('Wt + d');
                setPhase(1);
                break;
            case 3:
                board?.removeObject('ineq1');
                board?.removeObject('ineq2');

                if (!equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F)) {
                    board?.removeObject('Wt');
                    board?.removeObject('mainLine');
                    board?.removeObject('intersect');
                    board?.removeObject('perpendicular');
                    board?.removeObject('arrow');
                    const pA = board?.create('point', demoConfig.INIT_PERP_POINT, { name: '', fixed: true, color: 'transparent'});
                    setPerpPoint(pA);
                    const perpArrow = board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, perpPoint],
                        { strokeColor: 'black', strokeWidth: 2, fixed: true, name: 'Wt', withLabel:true, label: {position: 'top'} });
                    const lineIntersect = board?.create('point', demoConfig.MAINLINE_INTERSECTION_I,
                        { name: 'intersect', withLabel:false, fixed: true, color: 'gray'});
                    const li = board?.create('perpendicular', [perpArrow, lineIntersect],
                        { name: 'mainLine',  withLabel:false, strokeColor: 'black', strokeWidth: 2, fixed: true });
                }

                perpPoint.moveTo(demoConfig.INIT_PERP_POINT, 700, {callback: () => {
                        board?.create('inequality', ['mainLine'], {name: 'ineq1', inverse: true, fillColor: COL_0});
                        board?.create('inequality', ['mainLine'], {name: 'ineq2', fillColor: COL_1 });

                        if (equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F)) {
                            board?.create('arrow', [demoConfig.INIT_PERP_POINT, demoConfig.NEW_PERP_POINT],
                                { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: '-d', withLabel:true, label: {position: 'top'}});
                        } else {
                            board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, demoConfig.NEW_PERP_POINT],
                                { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 3, name: 'Wt + d', withLabel:true, label: {position: 'top'}});
                        }
                        board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, demoConfig.CURR_POINT],
                            { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: 'd', withLabel:true, label: {position: 'top'}});
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
            <p className=''>{brdMsg}</p>
        </div>
    );
}

export default RblattVectorsDemo;

const COL_0 = '#f15e2c';
const COL_1 = '#394d73';
const rotationConfig = {
    POINTS: [
        {x: 3.481875, y: 4.48, z: 0},
        {x: 5.161875, y: 4.52, z: 0},
        {x: 4.801875, y: 3.44, z: 0},
        {x: 3.161875, y: 0.88, z: 1},
        {x: 3.721875, y: 1.84, z: 1},
        {x: 5.281875, y: .96, z: 1}],
    INIT_PERP_POINT: [6, 2.5],
    NEW_PERP_POINT: [5.22, 4.04],
    MAINLINE_INTERSECTION_I: [4.5, 2.5],
    MAINLINE_INTERSECTION_F: [4.5, 2.5],
    CURR_POINT: [5.281875, .96]
};
const translationConfig = {
    POINTS: [
        {x: 3.481875, y: 4.48, z: 0},
        {x: 5.161875, y: 4.52, z: 0},
        {x: 4.66, y: 2.9, z: 1},
        {x: 3.161875, y: 0.88, z: 1},
        {x: 3.721875, y: 1.84, z: 1},
        {x: 5.281875, y: .96, z: 1}],
    INIT_PERP_POINT: [4.82, 3.3],
    NEW_PERP_POINT: [5.14, 4.1],
    MAINLINE_INTERSECTION_I: [4.5, 2.5],
    MAINLINE_INTERSECTION_F: [4.82, 3.3],
    CURR_POINT: [4.66, 2.9]
};

