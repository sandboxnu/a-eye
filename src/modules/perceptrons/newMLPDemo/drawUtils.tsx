/* eslint-disable */
import p5Types, { CENTER } from "p5";
import ReactDOM from "react-dom";
import { MLPConfig } from "./mlpConfig";
import { NodeIndex } from "./utils";

// ---------- MLP DRAW CONSTANTS ----------
const nodeSize = 50; // corresponds exactly to w-12/h-12
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

const shouldDrawMulticolorLines = true; // draws outgoing lines as different colors

const black = {
    r: 0,
    g: 0,
    b: 0
}

const white = {
    r: 255,
    g: 255,
    b: 255
}

const offwhite = hexToRgb("#D2D2D2");

const nodeIdxToColor = {
    0: hexToRgb("648FFF"),
    1: hexToRgb("#DC267F"),
    2: hexToRgb("#FE6100"),
    3: hexToRgb("#FFB000"),
    4: hexToRgb("#0072B2"),
    5: hexToRgb("#D55E00"),
    6: hexToRgb("#CC79A7"),

}

// ----------------------------------------


type Color = {
    r: number,
    g: number,
    b: number,
}

function hexToRgb(hex: string): Color  {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {
        r: 0,
        g: 0,
        b: 0,
    };
  }

type Position = {
    x: number,
    y: number
}

export type DrawParams = {
    p5: p5Types,
    mlpConfig: MLPConfig,
    forwardPropValues: number[][],
    canvasWidth: number,
    canvasHeight: number,
    selectedNode: undefined | NodeIndex,
    darkmode: boolean,
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


export const drawMLP = (config: DrawParams) => {
    drawWeightLines(config);
    drawHiddenLayerNodes(config);
    /*
    */
}

export const calculateMLPDOMPlacements = (config: DrawParams): MLPDOMPlacements => {
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

const drawHiddenLayerNodes = (config: DrawParams) => {
    const numHiddenLayers = config.mlpConfig.hiddenLayers.length;

    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numHiddenLayers; hiddenLayerIdx++) {
        const layer = config.mlpConfig.hiddenLayers[hiddenLayerIdx];
        const numNodes = layer.neurons.length;

        for (let nodeIdx = 0; nodeIdx < numNodes; nodeIdx++) {
            drawHiddenLayerNode(config, hiddenLayerIdx, nodeIdx);
        }

    }

}

const calculateBiasPlacements = (config: DrawParams) => {
    const numHiddenLayers = config.mlpConfig.hiddenLayers.length;

    const placements: BiasPlacement[] = []
    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numHiddenLayers; hiddenLayerIdx++) {
        const layer = config.mlpConfig.hiddenLayers[hiddenLayerIdx];
        const numNodes = layer.neurons.length;

        for (let nodeIdx = 0; nodeIdx < numNodes; nodeIdx++) {
            placements.push(calculateBiasPlacement(config, hiddenLayerIdx, nodeIdx))
        }

    }

    return placements;
}

const calculateInputNodePlacements = (config: DrawParams): InputNodePlacement[]=> {
    const numInputs = config.mlpConfig.numInputs;

    let placements: InputNodePlacement[] = []
    for (let inputIdx = 0; inputIdx < numInputs; inputIdx++) {
        placements.push(calculateInputNodePlacement(config, inputIdx));
    }

    return placements;
}

const drawWeightLines = (config: DrawParams): WeightPlacement[] => {
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


const calculateWeightInputPlacements = (config: DrawParams): WeightPlacement[] => {
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

const calculateAddRemoveLayerPosn = (config: DrawParams): Position => {
    const lastHiddenLayerIdx = config.mlpConfig.hiddenLayers.length - 1;
    const lastLayer = config.mlpConfig.hiddenLayers[lastHiddenLayerIdx];

    const lastNodeIdx = lastLayer.neurons.length - 1;
    const layer = lastHiddenLayerIdx + 1;

    const bottomRightmostNodePosn = calcNodePosn(config, layer, lastNodeIdx);

    return {
        x: bottomRightmostNodePosn.x - 100,
        y: bottomRightmostNodePosn.y + 20,
    }
}

const calculateAddRemoveNodePlacements = (config: DrawParams) => {

    const numLayers = config.mlpConfig.hiddenLayers.length;

    let placements: AddRemoveNodePlacement[] = []
    // loop to numLayers -1 bc output layer cannot have nodes added to
    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numLayers - 1; hiddenLayerIdx++) {
        placements.push(calculateAddRemoveNodePlacement(config, hiddenLayerIdx))
    }
    return placements;
}

const calculateAddRemoveNodePlacement = (config: DrawParams, hiddenLayerIdx: number): AddRemoveNodePlacement => {
    const hiddenLayer = config.mlpConfig.hiddenLayers[hiddenLayerIdx];

    const lastNodeIdx = hiddenLayer.neurons.length - 1;
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

const calculateAddRemoveInputPosn = (config: DrawParams): Position => {
    const lastNodeIdx = config.mlpConfig.numInputs - 1;
    const layer = 0;

    const bottomRightmostNodePosn = calcNodePosn(config, layer, lastNodeIdx);

    return {
        x: bottomRightmostNodePosn.x - 36,
        y: bottomRightmostNodePosn.y + 30,
    }
}

const calculateActivationPlacements = (config: DrawParams): ActivationPlacement[] => {

    const numLayers = config.mlpConfig.hiddenLayers.length;

    let placements: ActivationPlacement[] = []
    // loop to numLayers -1 bc output layer cannot have nodes added to
    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numLayers; hiddenLayerIdx++) {
        placements.push(calculateActivationPlacement(config, hiddenLayerIdx));
    }

    return placements;
}

const calculateActivationPlacement = (config: DrawParams, hiddenLayerIdx: number): ActivationPlacement => {
    const layer = hiddenLayerIdx + 1;
    const topNodePosn = calcNodePosn(config, layer, 0);
    return {
        posn: {
            x: topNodePosn.x - 95,
            y: topNodePosn.y - 60,
        },
        hiddenLayerIdx: hiddenLayerIdx,
    };

}
const calculateInputNodePlacement = (config: DrawParams, inputIdx: number): InputNodePlacement => {
    const nodePosn = calcNodePosn(config, 0, inputIdx);

    return {
        posn: {
            x: nodePosn.x - nodeSize / 2,
            y: nodePosn.y - nodeSize / 2,
        },
        inputIdx: inputIdx,
    }

}

const drawHiddenLayerNode = (config: DrawParams, hiddenLayerIdx: number, nodeIdx: number) => {
    return drawHiddenLayerNodeAtPosn(config, hiddenLayerIdx, nodeIdx, calcNodePosn(config, hiddenLayerIdx + 1, nodeIdx))
}

const drawHiddenLayerNodeAtPosn = (config: DrawParams, hiddenLayerIdx: number, nodeIdx: number, posn: Position) => {

    if (config.selectedNode && config.selectedNode.layer == hiddenLayerIdx+1 && config.selectedNode.nodeIdx == nodeIdx) {
        setFillColor(config, selectedNodeColor)
    } else {
        setFillColor(config, unselectedNodeColor)
    }
    setStrokeColor(config, weightLineColor(nodeIdx))
    config.p5.strokeWeight(nodeBorderPx)
    config.p5.circle(posn.x, posn.y, nodeSize)


    //if (config.forwardPropValues.length < hiddenLayerIdx || config.forwardPropValues[hiddenLayerIdx].length < nodeIdx) return

    const val = config.forwardPropValues[hiddenLayerIdx+1][nodeIdx]
    config.p5.textSize(16)
    setFillColor(config, black)
    config.p5.strokeWeight(0)
    config.p5.text(val.toFixed(1).toString(), posn.x, posn.y)

    drawBiasPlus(config, hiddenLayerIdx, nodeIdx, posn);
    
}

const calculateBiasPlacement = (config: DrawParams, hiddenLayerIdx: number, nodeIdx: number) => {
    const nodePosn = calcNodePosn(config, hiddenLayerIdx + 1, nodeIdx)

    return {
        hiddenLayerIdx: hiddenLayerIdx,
        nodeIdx: nodeIdx,
        posn: {
            x: nodePosn.x - 110,
            y: nodePosn.y - 16
        }
    }
}

const drawBiasPlus = (config: DrawParams, hiddenLayerIdx: number, nodeIdx: number, posn: Position) => {
    const plusPosn = calcPlusPosnFromNodePosn(config, posn);
    drawPlus(config, plusSize, {
        x: plusPosn.x,
        y: plusPosn.y
    });
}

const drawPlus = (config: DrawParams, size: number, posn: Position, weight?: number) => {
    if (!weight) {
        weight = 1;
    }


    const hSize = size / 2;
    if (config.darkmode) {
        setStrokeColor(config, offwhite);
    } else {
        setStrokeColor(config, black);
    }
    config.p5.strokeWeight(weight);
    config.p5.line(posn.x, posn.y - hSize, posn.x, posn.y + hSize);
    config.p5.strokeWeight(weight);
    config.p5.line(posn.x - hSize, posn.y, posn.x + hSize, posn.y);

}

const drawMult = (config: DrawParams, size: number, posn: Position, weight?: number) => {
    if (!weight) {
        weight = 1;
    }


    if (config.darkmode) {
        setStrokeColor(config, offwhite);
        setFillColor(config, offwhite);    
    } else {
        setStrokeColor(config, black);
        setFillColor(config, black);    
    }
    config.p5.textSize(size)
    config.p5.text("*", posn.x, posn.y)
    /*config.p5.strokeWeight(weight);
    config.p5.line(posn.x - hSize, posn.y - hSize, posn.x + hSize, posn.y + hSize);
    config.p5.strokeWeight(weight);
    config.p5.line(posn.x - hSize, posn.y + hSize, posn.x + hSize, posn.y - hSize);*/

}


const drawWeightLine = (config: DrawParams, layer: number, inNodeIdx: number, outNodeIdx: number) => {
    const inNodePosn = calcNodePosn(config, layer, inNodeIdx);
    const outNodePlusPosn = calcPlusPosn(config, (layer + 1), outNodeIdx);

    const lineEnds = weightLineEndPositions(config, inNodePosn, outNodePlusPosn);

    const lineStart: Position = lineEnds.start;

    const lineEnd: Position = lineEnds.end;

    if (shouldDrawMulticolorLines) {
        setStrokeColor(config, weightLineColor(inNodeIdx))
    } else {
        if (config.darkmode) {
            setStrokeColor(config, offwhite);
        } else {
            setStrokeColor(config, black);
        }
    }

    config.p5.strokeWeight(2);
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

export const weightLineColor = (inNodeIdx: number) : Color => {
    return nodeIdxToColor[inNodeIdx];
}

const calculateWeightInputPlacement = (config: DrawParams, layer: number, inNodeIdx: number, outNodeIdx: number): WeightPlacement => {
    const inNodePosn = calcNodePosn(config, layer, inNodeIdx);
    const outNodePlusPosn = calcPlusPosn(config, (layer + 1), outNodeIdx);

    const lineEnds = weightLineEndPositions(config, inNodePosn, outNodePlusPosn);

    const inputPosnCenter = followDownLine(lineEnds.start, lineEnds.end, weightInputLocationOnLine);


    return {
        posn: {
            x: inputPosnCenter.x - 20 - weightOffset(config.mlpConfig.hiddenLayers.length),
            y: inputPosnCenter.y - 16
        },
        layer: layer,
        inNodeIdx: inNodeIdx,
        outNodeIdx: outNodeIdx,
    }
}

const weightLineEndPositions = (config: DrawParams, inNodePosn: Position, outNodePlusPosn: Position): { start: Position, end: Position } => {

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

const calcLayerWidth = (config: DrawParams): number => {
    const numLayers = config.mlpConfig.hiddenLayers.length + 1; // extra layer for inputs
    const layerWidth = config.canvasWidth / numLayers;
    return layerWidth
}

const calcNumNodesInLayer = (config: DrawParams, layer: number): number => {
    if (layer == 0) {
        return config.mlpConfig.numInputs;
    }
    return config.mlpConfig.hiddenLayers[layer - 1].neurons.length;
}

// get the position of the center of the given node
// note: in the layers array of the config, an index of 0 corresponds
// to layer 1 here, since layer 0 is the input layer
const calcNodePosn = (config: DrawParams, layer: number, nodeIdx: number): Position => {

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
const calcPlusPosn = (config: DrawParams, layer: number, nodeIdx: number): Position => {
    const posn = calcNodePosn(config, layer, nodeIdx)

    return calcPlusPosnFromNodePosn(config, posn)
}

// get the position of the center of the node's 'plus' symbol
const calcPlusPosnFromNodePosn = (config: DrawParams, posn: Position): Position => {
    return {
        x: posn.x - 122,
        y: posn.y
    }
}

const weightOffset = (numLayers: number): number => {
    if (numLayers == 1) {
        return 0;
    }

    if (numLayers == 2) {
        return 0;
    }

    if (numLayers == 3) {
        return 20;
    }

    if (numLayers == 4) {
        return 20;
    }

    return 0;
}

const followDownLine = (start: Position, end: Position, pcnt: number): Position => {
    const xDelta = end.x - start.x;
    const yDelta = end.y - start.y;

    return {
        x: start.x + xDelta * pcnt,
        y: start.y + yDelta * pcnt
    }
}

export const nodeAtPosn = (config: DrawParams, posn: Position): (NodeIndex | undefined) => {

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

const setFillColor = (config: DrawParams, fillColor: Color) => {
    let c = config.p5.color(fillColor.r, fillColor.g, fillColor.b);
    config.p5.fill(c);
}

const setStrokeColor = (config: DrawParams, strokeColor: Color) => {
    let c = config.p5.color(strokeColor.r, strokeColor.g, strokeColor.b);
    config.p5.stroke(c);
}