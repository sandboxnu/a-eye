/* eslint-disable */
import p5Types, { CENTER } from "p5";
import ReactDOM from "react-dom";
import { MLPConfig } from "./mlpConfig";

// ---------- MLP DRAW CONSTANTS ----------
const nodeSize = 48; // corresponds exactly to w-12/h-12
const plusSize = 16;
const weightInputLocationOnLine = 0.8;

const shouldDrawMult = false; // draws a small asterisk by the weight
const multLocationOnLine = 0.18;

const nodeBorderPx = 2;

const unselectedNodeColor = {
    r: 255,
    g: 255,
    b: 255,
}

const selectedNodeColor = {
    r: 200,
    g: 200,
    b: 200,
}

const nodeBorderColor = {
    r: 44,
    g: 122,
    b: 123,
}

const shouldDrawMulticolorLines = false; // draws outgoing lines as different colors

const nodeIdxToColor = {
    0: {
        r: 0,
        g: 0,
        b: 0,
    },
    1: {
        r: 255,
        g: 0,
        b: 0,
    },
    2: {
        r: 128,
        g: 255,
        b: 255,
    },
    3: {
        r: 0,
        g: 0,
        b: 255,
    },
    4: {
        r: 123,
        g: 123,
        b: 123,
    },
    5: {
        r: 35,
        g: 25,
        b: 88,
    },
}

// ----------------------------------------

const black = {
    r: 0,
    g: 0,
    b: 0
}

const white = {
    r: 0,
    g: 0,
    b: 0
}

type Color = {
    r: number,
    g: number,
    b: number,
}

type Position = {
    x: number,
    y: number
}

export type NodeIndex = {
    layer: number,
    nodeIdx: number,
}

export type DrawConfig = {
    p5: p5Types,
    mlpConfig: MLPConfig,
    intermediateValues: number[][],
    canvasWidth: number,
    canvasHeight: number,
    selectedNode: undefined | NodeIndex,
};

// these classes specify where HTML should be rendered over the canvas.

export type WeightPlacement = {
    posn: Position,
    layer: number,
    inNodeIdx: number,
    outNodeIdx: number
}

export type BiasPlacement = {
    posn: Position,
    hiddenLayerIdx: number,
    nodeIdx: number,
}

export type ActivationPlacement = {
    posn: Position,
    hiddenLayerIdx: number,
}

export type InputNodePlacement = {
    posn: Position,
    inputIdx: number,
}

export type AddRemoveNodePlacement = {
    posn: Position,
    hiddenLayerIdx: number,
}

export type MLPDOMPlacements = {
    weightInputs: WeightPlacement[],
    biasInputs: BiasPlacement[],
    activationInputs: ActivationPlacement[],
    inputNodes: InputNodePlacement[],
    addRemoveNode: AddRemoveNodePlacement[],
    addRemoveLayer: Position,
    addRemoveInput: Position,
}


export const drawMLP = (config: DrawConfig) => {
    drawWeightLines(config);
    drawHiddenLayerNodes(config);
    /*
    */
}

export const calculateMLPDOMPlacements = (config: DrawConfig): MLPDOMPlacements => {
    const inputNodePlacements = calculateInputNodePlacements(config);
    const layerPosn = calculateAddRemoveLayerPosn(config);
    const addRemoveNodePlacements = calculateAddRemoveNodePlacements(config);
    const inputPosn = calculateAddRemoveInputPosn(config);
    const activationPlacements = calculateActivationPlacements(config);

    return {
        weightInputs: calculateWeightInputPlacements(config),
        biasInputs: calculateBiasPlacements(config),
        activationInputs: calculateActivationPlacements(config),
        inputNodes: calculateInputNodePlacements(config),
        addRemoveNode: calculateAddRemoveNodePlacements(config),
        addRemoveLayer: calculateAddRemoveLayerPosn(config),
        addRemoveInput: calculateAddRemoveInputPosn(config),

    }
}

const drawHiddenLayerNodes = (config: DrawConfig) => {
    const numHiddenLayers = config.mlpConfig.hiddenLayers.length;

    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numHiddenLayers; hiddenLayerIdx++) {
        const layer = config.mlpConfig.hiddenLayers[hiddenLayerIdx];
        const numNodes = layer.biases.length;

        for (let nodeIdx = 0; nodeIdx < numNodes; nodeIdx++) {
            drawHiddenLayerNode(config, hiddenLayerIdx, nodeIdx);
        }

    }

}

const calculateBiasPlacements = (config: DrawConfig) => {
    const numHiddenLayers = config.mlpConfig.hiddenLayers.length;

    const placements: BiasPlacement[] = []
    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numHiddenLayers; hiddenLayerIdx++) {
        const layer = config.mlpConfig.hiddenLayers[hiddenLayerIdx];
        const numNodes = layer.biases.length;

        for (let nodeIdx = 0; nodeIdx < numNodes; nodeIdx++) {
            placements.push(calculateBiasPlacement(config, hiddenLayerIdx, nodeIdx))
        }

    }

    return placements;
}

const calculateInputNodePlacements = (config: DrawConfig): InputNodePlacement[]=> {
    const numInputs = config.mlpConfig.inputs.length;

    let placements: InputNodePlacement[] = []
    for (let inputIdx = 0; inputIdx < numInputs; inputIdx++) {
        placements.push(calculateInputNodePlacement(config, inputIdx));
    }

    return placements;
}

const drawWeightLines = (config: DrawConfig): WeightPlacement[] => {
    const numLayers = config.mlpConfig.hiddenLayers.length + 1;

    let placements: WeightPlacement[] = []
    for (let layer = 0; layer < numLayers - 1; layer++) {
        const nodesInInputLayer = calcNumNodesInLayer(config, layer);
        const nodesInOutputLayer = calcNumNodesInLayer(config, layer + 1);

        for (let inNode = 0; inNode < nodesInInputLayer; inNode++) {
            for (let outNode = 0; outNode < nodesInOutputLayer; outNode++) {
                drawWeightLine(config, layer, inNode, outNode);
            }
        }

    }

    return placements
}


const calculateWeightInputPlacements = (config: DrawConfig): WeightPlacement[] => {
    const numLayers = config.mlpConfig.hiddenLayers.length + 1;

    let placements: WeightPlacement[] = []
    for (let layer = 0; layer < numLayers - 1; layer++) {
        const nodesInInputLayer = calcNumNodesInLayer(config, layer);
        const nodesInOutputLayer = calcNumNodesInLayer(config, layer + 1);

        for (let inNode = 0; inNode < nodesInInputLayer; inNode++) {
            for (let outNode = 0; outNode < nodesInOutputLayer; outNode++) {
                placements.push(calculateWeightInputPlacement(config, layer, inNode, outNode));
            }
        }

    }

    return placements
}

const calculateAddRemoveLayerPosn = (config: DrawConfig): Position => {
    const lastHiddenLayerIdx = config.mlpConfig.hiddenLayers.length - 1;
    const lastLayer = config.mlpConfig.hiddenLayers[lastHiddenLayerIdx];

    const lastNodeIdx = lastLayer.biases.length - 1;
    const layer = lastHiddenLayerIdx + 1;

    const bottomRightmostNodePosn = calcNodePosn(config, layer, lastNodeIdx);

    return {
        x: bottomRightmostNodePosn.x - 100,
        y: bottomRightmostNodePosn.y + 20,
    }
}

const calculateAddRemoveNodePlacements = (config: DrawConfig) => {

    const numLayers = config.mlpConfig.hiddenLayers.length;

    let placements: AddRemoveNodePlacement[] = []
    // loop to numLayers -1 bc output layer cannot have nodes added to
    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numLayers - 1; hiddenLayerIdx++) {
        placements.push(calculateAddRemoveNodePlacement(config, hiddenLayerIdx))
    }
    return placements;
}

const calculateAddRemoveNodePlacement = (config: DrawConfig, hiddenLayerIdx: number): AddRemoveNodePlacement => {
    const hiddenLayer = config.mlpConfig.hiddenLayers[hiddenLayerIdx];

    const lastNodeIdx = hiddenLayer.biases.length - 1;
    const layer = hiddenLayerIdx + 1;

    const bottommostNodePosn = calcNodePosn(config, layer, lastNodeIdx);


    return {
        posn: {
            x: bottommostNodePosn.x - 60,
            y: bottommostNodePosn.y + 30,
        },
        hiddenLayerIdx: hiddenLayerIdx
    };
}

const calculateAddRemoveInputPosn = (config: DrawConfig): Position => {
    const lastNodeIdx = config.mlpConfig.inputs.length - 1;
    const layer = 0;

    const bottomRightmostNodePosn = calcNodePosn(config, layer, lastNodeIdx);

    return {
        x: bottomRightmostNodePosn.x - 36,
        y: bottomRightmostNodePosn.y + 30,
    }
}

const calculateActivationPlacements = (config: DrawConfig): ActivationPlacement[] => {

    const numLayers = config.mlpConfig.hiddenLayers.length;

    let placements: ActivationPlacement[] = []
    // loop to numLayers -1 bc output layer cannot have nodes added to
    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numLayers; hiddenLayerIdx++) {
        placements.push(calculateActivationPlacement(config, hiddenLayerIdx));
    }

    return placements;
}

const calculateActivationPlacement = (config: DrawConfig, hiddenLayerIdx: number): ActivationPlacement => {
    const layer = hiddenLayerIdx + 1;
    const topNodePosn = calcNodePosn(config, layer, 0);
    return {
        posn: {
            x: topNodePosn.x - 83,
            y: topNodePosn.y - 60,
        },
        hiddenLayerIdx: hiddenLayerIdx,
    };

}
const calculateInputNodePlacement = (config: DrawConfig, inputIdx: number): InputNodePlacement => {
    const nodePosn = calcNodePosn(config, 0, inputIdx);

    return {
        posn: {
            x: nodePosn.x - nodeSize / 2,
            y: nodePosn.y - nodeSize / 2,
        },
        inputIdx: inputIdx,
    }

}

const drawHiddenLayerNode = (config: DrawConfig, hiddenLayerIdx: number, nodeIdx: number) => {
    return drawHiddenLayerNodeAtPosn(config, hiddenLayerIdx, nodeIdx, calcNodePosn(config, hiddenLayerIdx + 1, nodeIdx))
}

const drawHiddenLayerNodeAtPosn = (config: DrawConfig, hiddenLayerIdx: number, nodeIdx: number, posn: Position) => {

    if (config.selectedNode && config.selectedNode.layer - 1 == hiddenLayerIdx && config.selectedNode.nodeIdx == nodeIdx) {
        setFillColor(config, selectedNodeColor)
    } else {
        setFillColor(config, unselectedNodeColor)
    }
    setStrokeColor(config, nodeBorderColor)
    config.p5.strokeWeight(nodeBorderPx)
    config.p5.circle(posn.x, posn.y, nodeSize)


    if (config.intermediateValues.length < hiddenLayerIdx || config.intermediateValues[hiddenLayerIdx].length < nodeIdx) return

    const val = config.intermediateValues[hiddenLayerIdx][nodeIdx]
    config.p5.textSize(16)
    setFillColor(config, black)
    config.p5.strokeWeight(0)
    config.p5.text(val.toFixed(1).toString(), posn.x, posn.y)

    drawBiasPlus(config, hiddenLayerIdx, nodeIdx, posn);
    
}

const calculateBiasPlacement = (config: DrawConfig, hiddenLayerIdx: number, nodeIdx: number) => {
    const nodePosn = calcNodePosn(config, hiddenLayerIdx + 1, nodeIdx)

    return {
        hiddenLayerIdx: hiddenLayerIdx,
        nodeIdx: nodeIdx,
        posn: {
            x: nodePosn.x - 92,
            y: nodePosn.y - 16
        }
    }
}

const drawBiasPlus = (config: DrawConfig, hiddenLayerIdx: number, nodeIdx: number, posn: Position) => {
    const plusPosn = calcPlusPosnFromNodePosn(posn);
    drawPlus(config, plusSize, {
        x: plusPosn.x,
        y: plusPosn.y
    });
}

const drawPlus = (config: DrawConfig, size: number, posn: Position, weight?: number) => {
    if (!weight) {
        weight = 1;
    }


    const hSize = size / 2;
    setStrokeColor(config, black);
    config.p5.strokeWeight(weight);
    config.p5.line(posn.x, posn.y - hSize, posn.x, posn.y + hSize);
    config.p5.strokeWeight(weight);
    config.p5.line(posn.x - hSize, posn.y, posn.x + hSize, posn.y);

}

const drawMult = (config: DrawConfig, size: number, posn: Position, weight?: number) => {
    if (!weight) {
        weight = 1;
    }


    setStrokeColor(config, black);
    config.p5.textSize(size)
    config.p5.text("*", posn.x, posn.y)
    /*config.p5.strokeWeight(weight);
    config.p5.line(posn.x - hSize, posn.y - hSize, posn.x + hSize, posn.y + hSize);
    config.p5.strokeWeight(weight);
    config.p5.line(posn.x - hSize, posn.y + hSize, posn.x + hSize, posn.y - hSize);*/

}


const drawWeightLine = (config: DrawConfig, layer: number, inNodeIdx: number, outNodeIdx: number) => {
    const inNodePosn = calcNodePosn(config, layer, inNodeIdx);
    const outNodePlusPosn = calcPlusPosn(config, (layer + 1), outNodeIdx);

    const lineEnds = weightLineEndPositions(config, inNodePosn, outNodePlusPosn);

    const lineStart: Position = lineEnds.start;

    const lineEnd: Position = lineEnds.end;

    if (shouldDrawMulticolorLines) {
        setStrokeColor(config, nodeIdxToColor[inNodeIdx])
    } else {
        setStrokeColor(config, black);
    }
    config.p5.line(
        lineStart.x,
        lineStart.y,
        lineEnd.x,
        lineEnd.y,
    );

    if (shouldDrawMult) {
        drawMult(config, 16, followDownLine(lineStart, lineEnd, multLocationOnLine));
    }
}

const calculateWeightInputPlacement = (config: DrawConfig, layer: number, inNodeIdx: number, outNodeIdx: number): WeightPlacement => {
    const inNodePosn = calcNodePosn(config, layer, inNodeIdx);
    const outNodePlusPosn = calcPlusPosn(config, (layer + 1), outNodeIdx);


    const lineEnds = weightLineEndPositions(config, inNodePosn, outNodePlusPosn);

    const inputPosnCenter = followDownLine(lineEnds.start, lineEnds.end, weightInputLocationOnLine);


    return {
        posn: {
            x: inputPosnCenter.x - 20,
            y: inputPosnCenter.y - 16
        },
        layer: layer,
        inNodeIdx: inNodeIdx,
        outNodeIdx: outNodeIdx,
    }
}

const weightLineEndPositions = (config: DrawConfig, inNodePosn: Position, outNodePlusPosn: Position): { start: Position, end: Position } => {

    return {
        start: {
            x: inNodePosn.x + nodeSize / 2,
            y: inNodePosn.y,
        },
        end: {
            x: outNodePlusPosn.x - plusSize / 2 - 5,
            y: outNodePlusPosn.y
        }
    }
}


// ok so, you can't actually render DOM elements in a canvas. So, incorporate things like
// HTML inputs for the weights and biases, we do this in a kind of hacky way. There is a
// div of 0 height and width directly above the canvas, which has an id, accessible at
// "config.parentDivID". Using relative positioning, we can place DOM elements above the
// canvas at any position; so, here, we create a container div with the desired position,
// then 'render' the JSX within that div 
const placeJSXElm = (config: DrawConfig, elt: JSX.Element, posn: Position) => {
    const div = config.p5.createDiv();

    //div.parent(config.parentDivID)
    div.class('w-0').class('h-0');
    div.style('position', 'relative');
    div.style('left', posn.x.toString() + "px");
    div.style('top', posn.y.toString() + "px");

    ReactDOM.render(elt, div.elt);

    //config.canvasEltDivRef.current?.appendChild(div.elt);
}


const calcLayerWidth = (config: DrawConfig): number => {
    const numLayers = config.mlpConfig.hiddenLayers.length + 1; // extra layer for inputs
    const layerWidth = config.canvasWidth / numLayers;
    return layerWidth
}

const calcNumNodesInLayer = (config: DrawConfig, layer: number): number => {
    if (layer == 0) {
        return config.mlpConfig.inputs.length;
    }
    return config.mlpConfig.hiddenLayers[layer - 1].biases.length;
}

// get the position of the center of the given node
// note: in the layers array of the config, an index of 0 corresponds
// to layer 1 here, since layer 0 is the input layer
const calcNodePosn = (config: DrawConfig, layer: number, nodeIdx: number): Position => {

    const numNodesInLayer = calcNumNodesInLayer(config, layer);
    const layerWidth = calcLayerWidth(config);

    const distBetweenEachNode = config.canvasHeight / (numNodesInLayer + 1);

    const x = layerWidth * layer + (layerWidth / 2)
    const y = distBetweenEachNode * (nodeIdx + 1)

    return {
        x: x,
        y: y,
    }
}

// get the position of the center of the node's 'plus' symbol
const calcPlusPosn = (config: DrawConfig, layer: number, nodeIdx: number): Position => {
    const posn = calcNodePosn(config, layer, nodeIdx)

    return calcPlusPosnFromNodePosn(posn)
}

// get the position of the center of the node's 'plus' symbol
const calcPlusPosnFromNodePosn = (posn: Position): Position => {
    return {
        x: posn.x - 105,
        y: posn.y
    }
}

const followDownLine = (start: Position, end: Position, pcnt: number): Position => {
    const xDelta = end.x - start.x;
    const yDelta = end.y - start.y;

    return {
        x: start.x + xDelta * pcnt,
        y: start.y + yDelta * pcnt
    }
}

export const nodeAtPosn = (config: DrawConfig, posn: Position): (NodeIndex | undefined) => {

    const numHiddenLayers = config.mlpConfig.hiddenLayers.length;

    for (let layer = 0; layer < numHiddenLayers + 1; layer++) {
        const numNodes = calcNumNodesInLayer(config, layer)
        for (let nodeIdx = 0; nodeIdx < numNodes; nodeIdx++) {
            const nodePosn = calcNodePosn(config, layer, nodeIdx)
            const dist = Math.sqrt(Math.pow(posn.x - nodePosn.x, 2) + Math.pow(posn.y - nodePosn.y, 2))

            if (dist < nodeSize / 2) {

                return {
                    layer: layer,
                    nodeIdx: nodeIdx,
                }
            }
        }
    }
    return undefined;
}

const setFillColor = (config: DrawConfig, fillColor: Color) => {
    let c = config.p5.color(fillColor.r, fillColor.g, fillColor.b);
    config.p5.fill(c);
}

const setStrokeColor = (config: DrawConfig, strokeColor: Color) => {
    let c = config.p5.color(strokeColor.r, strokeColor.g, strokeColor.b);
    config.p5.stroke(c);
}