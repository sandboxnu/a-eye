import React, { useEffect, useState } from 'react';
const JXG = require('jsxgraph');
const equalArrays = (a1, a2) => (JSON.stringify(a1) === JSON.stringify(a2));

const RblattVectorsDemo = () => {
    const brdId = 'board_1';  
    const [phase, setPhase] = useState(0);
    const [board, setBoard] = useState<any>(null);
    const [perpPoint, setPerpPoint] = useState<any>(null);
    const [demoConfig, setDemoConfig] = useState<any>(rotationConfig);
    const [brdMsg, setBrdMsg] = useState<string>(demoConfig.phaseMessages[0]);

    useEffect(() => {
        const newBoard = JXG.JSXGraph.initBoard(brdId, { boundingbox: [2, 6, 7, 0], axis: true });
        setBoard(newBoard);
        demoConfig.POINTS.forEach((input) => {
            const color = input.z === 1 ? COL_1 : COL_0
            newBoard.create('point', [input.x, input.y],
                { name: '', size: 1, color, fixed: true });
        });
        // endpoint of Wt vector
        const perpPt = newBoard.create('point', demoConfig.INIT_PERP_POINT, { name: '', fixed: true, color: 'transparent'});
        setPerpPoint(perpPt);
        const perpArrow = newBoard.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, perpPt],
            { strokeColor: 'black', strokeWidth: 2, fixed: true, name: 'Wt', withLabel:true, label: {position: 'top'} });
        // classification line
        const lineIntersect = newBoard.create('point', demoConfig.MAINLINE_INTERSECTION_I,
            { name: 'intersect', withLabel: false, fixed: true, color: 'gray'});
        const li = newBoard.create('perpendicular', [perpArrow, lineIntersect],
            { name: 'mainLine', withLabel: false, strokeColor: 'black', strokeWidth: 2, fixed: true });
        newBoard.create('inequality', [li], {name: 'ineq1', fillColor: COL_0});
        newBoard.create('inequality', [li], {name: 'ineq2', inverse: true, fillColor: COL_1 });
    }, [demoConfig]);

    // todo colors
    const goNext = () => {
        setBrdMsg(demoConfig.phaseMessages[phase+1]);
        switch (phase) {
            case 0:
                board?.create('point', [demoConfig.CURR_POINT[0], demoConfig.CURR_POINT[1]],
                { name: 'misclassified', size: 1, color: COL_1, fixed: true, withLabel:false});
                setPhase(1);
                break;
            case 1:
                board?.select({
                    X: (v: number) => v === demoConfig.CURR_POINT[0],
                    Y: (v: number) => v === demoConfig.CURR_POINT[1]
                }).setAttribute({size: 4});
                // d vector (distance from current point to intersection point)
                board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, demoConfig.CURR_POINT],
                    { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: 'd', withLabel:true, label: {position: 'top'}});
                setPhase(2);
                break;
            case 2:
                // translation demo doesn't have a -d vector
                if (equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F)) {
                    board?.create('arrow', [demoConfig.INIT_PERP_POINT, demoConfig.NEW_PERP_POINT],
                        { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: '-d', withLabel:true, label: {position: 'top'}});
                }
                // new vector: Wt +/- d
                const vectorName = equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F) ? 'Wt - d' : 'Wt + d';
                board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, demoConfig.NEW_PERP_POINT],
                    { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 3, name: vectorName, withLabel:true, label: {position: 'top'}});
                setPhase(3);
                break;
            case 3:
                board?.select({
                    X: (v: number) => v === demoConfig.CURR_POINT[0],
                    Y: (v: number) => v === demoConfig.CURR_POINT[1]
                }).setAttribute({size: 1});

                board?.removeObject('d');
                board?.removeObject('-d');
                board?.removeObject('ineq1');
                board?.removeObject('ineq2');

                // translation demo: need to replace Wt, Wt+d, and classification line
                if (!equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F)) {
                    board?.removeObject('Wt + d');
                    replaceLine(demoConfig.NEW_PERP_POINT, demoConfig.MAINLINE_INTERSECTION_F);
                }

                shiftLine(demoConfig.NEW_PERP_POINT);
                setPhase(4);
                break;
        }
    }


    const goPrev = () => {
        setBrdMsg(demoConfig.phaseMessages[phase-1]);
        switch (phase) {
            case 1:
                board?.removeObject('misclassified');
                setPhase(0);
                break;
            case 2:
                board?.select({
                    X: (v: number) => v === demoConfig.CURR_POINT[0],
                    Y: (v: number) => v === demoConfig.CURR_POINT[1]
                }).setAttribute({size: 1});
                board?.removeObject('d');
                setPhase(1);
                break;
            case 3:
                board?.removeObject('-d');
                board?.removeObject('Wt - d');
                board?.removeObject('Wt + d');
                setPhase(2);
                break;
            case 4:
                board?.removeObject('ineq1');
                board?.removeObject('ineq2');

                // translation demo: need to replace Wt, Wt+d, and classification line
                if (!equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F)) {
                    replaceLine(demoConfig.INIT_PERP_POINT, demoConfig.MAINLINE_INTERSECTION_I);
                }

                // only rotation demo has -d vector
                if (equalArrays(demoConfig.MAINLINE_INTERSECTION_I, demoConfig.MAINLINE_INTERSECTION_F)) {
                    board?.create('arrow', [demoConfig.INIT_PERP_POINT, demoConfig.NEW_PERP_POINT],
                        { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: '-d', withLabel:true, label: {position: 'top'}});
                } else { // only translation demo has (Wt + d) vector
                    board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, demoConfig.NEW_PERP_POINT],
                        { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 3, name: 'Wt + d', withLabel:true, label: {position: 'top'}});
                }
                board?.create('arrow', [demoConfig.MAINLINE_INTERSECTION_I, demoConfig.CURR_POINT],
                            { strokeColor: 'black', strokeWidth: 2, fixed: true, dash: 2, name: 'd', withLabel:true, label: {position: 'top'}});

                shiftLine(demoConfig.INIT_PERP_POINT);
                setPhase(3);
                break;
        }
    }

    const replaceLine = (pPoint, intersection) => {
        board?.removeObject('Wt');
        board?.removeObject('intersect');
        board?.removeObject('mainLine');
        const perpPt = board?.create('point', pPoint, { name: '', fixed: true, color: 'transparent'});
        setPerpPoint(perpPt);
        const perpArrow = board?.create('arrow', [intersection, perpPoint],
            { strokeColor: 'black', strokeWidth: 2, fixed: true, name: 'Wt', withLabel:true, label: {position: 'top'} });
        const lineIntersect = board?.create('point', intersection,
            { name: 'intersect', withLabel:false, fixed: true, color: 'gray'});
        board?.create('perpendicular', [perpArrow, lineIntersect],
            { name: 'mainLine',  withLabel:false, strokeColor: 'black', strokeWidth: 2, fixed: true });
    }

    const shiftLine = (point) => {
        perpPoint.moveTo(point, 700, {callback: () => {
            board?.create('inequality', ['mainLine'], {name: 'ineq1', fillColor: COL_0});
            board?.create('inequality', ['mainLine'], {name: 'ineq2', inverse: true, fillColor: COL_1 });
        }});
    }

    const switchConfig = (type: string) => {
        if (type === 'rotation') {
            setDemoConfig(rotationConfig);
            setBrdMsg(rotationConfig.phaseMessages[0]);
        } else {
            setDemoConfig(translationConfig);
            setBrdMsg(translationConfig.phaseMessages[0]);
        }
        setPhase(0);
    } 

    return (
        <div className="m-4">
            <p>
                Type of Update:
            </p>
            <span>
                <button className='basic-button' onClick={() => {switchConfig('rotation')}} 
                    disabled={JSON.stringify(demoConfig) === JSON.stringify(rotationConfig)}>
                    Rotation
                </button>
                
                <button className='basic-button' onClick={() => {switchConfig('translation')}}
                    disabled={JSON.stringify(demoConfig) === JSON.stringify(translationConfig)}>
                    Translation
                </button>
            </span>
            <div className="bg-white mx-auto" id={brdId} style={{ width: '500px', height: '500px' }} />
            <button className='basic-button' onClick={goPrev} disabled={phase === 0}>
                Previous Step
            </button>
            <button className='basic-button' onClick={goNext} disabled={phase === 4}>
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
        {x: 3.721875, y: 1.84, z: 1}],
    INIT_PERP_POINT: [6, 2.5],
    NEW_PERP_POINT: [5.22, 4.04],
    MAINLINE_INTERSECTION_I: [4.5, 2.5],
    MAINLINE_INTERSECTION_F: [4.5, 2.5],
    CURR_POINT: [5.281875, .96],
    phaseMessages: [
        'The initial classification line is represented by its perpendicular vector Wt. With this line, all the points are classified correctly.',
        'Now, we introduce a misclassified point; so the line needs to update to accomodate for the added point.',
        'To do so, we calculate the distance d between the misclassified point and the vector\'s origin.',
        'We then calculate the new vector by subtracting d from Wt.',
        'Finally, we update the classification line to be perpendicular to the new vector (Wt - d).']
};
const translationConfig = {
    POINTS: [
        {x: 3.481875, y: 4.48, z: 0},
        {x: 5.161875, y: 4.52, z: 0},
        {x: 3.161875, y: 0.88, z: 1},
        {x: 3.721875, y: 1.84, z: 1},
        {x: 5.281875, y: .96, z: 1}],
    INIT_PERP_POINT: [4.82, 3.3],
    NEW_PERP_POINT: [5.14, 4.1],
    MAINLINE_INTERSECTION_I: [4.5, 2.5],
    MAINLINE_INTERSECTION_F: [4.82, 3.3],
    CURR_POINT: [4.66, 2.9],
    phaseMessages: [
        'The initial classification line is represented by its perpendicular vector Wt. With this line, all the points are classified correctly.',
        'Now, we introduce a misclassified point; so the line needs to update to accomodate for the added point. In contrast to the rotation demo, the misclassified point is on the along Wt.',
        'To do so, we calculate the distance d between the misclassified point and the vector\'s origin.',
        'Since d is parallel to Wt, we calculate the new vector differently by shifting the entire line by d; to do so, we instead add d to Wt.',
        'Finally, we update the classification line to be perpendicular to the new vector (Wt + d).']
};

