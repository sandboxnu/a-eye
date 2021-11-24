/* eslint-disable */
import p5Types, { CENTER } from "p5";
import ReactDOM from "react-dom";
import { MLPConfig } from "./mlpConfig";

const nodeSize = 48; // corresponds exactly to w-12/h-12
const plusSize = 16

type Position = {
    x: number,
    y: number
}

export type DrawConfig = {
    p5: p5Types,
    canvas: p5Types.Element,
    parentDivID: string,
    mlpConfig: MLPConfig,
    intermediateValues: number[][],
    canvasWidth: number,
    canvasHeight: number,
    inputs: {
        biasInput: (hiddenLayerIdx: number, nodeIdx: number) => JSX.Element,
        inputNode: (inputIdx: number) => JSX.Element,
    },
}

export const drawMLP = (config: DrawConfig) => {
    drawInputNodes(config);
    drawHiddenLayerNodes(config);
    drawWeightLines(config);

}

const drawHiddenLayerNodes = (config: DrawConfig) => {
    const numHiddenLayers = config.mlpConfig.hiddenLayers.length;

    for (let hiddenLayerIdx = 0; hiddenLayerIdx < numHiddenLayers; hiddenLayerIdx++) {
        const layer = config.mlpConfig.hiddenLayers[hiddenLayerIdx];
        const numNodes = layer.biases.length;

        for (let nodeIdx = 0; nodeIdx < numNodes; nodeIdx++) {
            drawHiddenLayerNode(config, hiddenLayerIdx, nodeIdx);
            drawBiasInputForNode(config, hiddenLayerIdx, nodeIdx)
        }

    }

}

const drawInputNodes = (config: DrawConfig) => {
    const numInputs = config.mlpConfig.inputs.length;

    for (let inputIdx = 0; inputIdx < numInputs; inputIdx++) {
        drawInputNode(config, inputIdx);
    }

}

const drawWeightLines = (config: DrawConfig) => {
    const numLayers = config.mlpConfig.hiddenLayers.length+1;

    for (let layer = 0; layer < numLayers-1; layer++) {
        const nodesInInputLayer = calcNumNodesInLayer(config, layer);
        const nodesInOutputLayer = calcNumNodesInLayer(config, layer+1);

        for (let inNode = 0; inNode < nodesInInputLayer; inNode++) {
            for (let outNode = 0; outNode < nodesInOutputLayer; outNode++) {
                drawWeightLine(config, layer, inNode, outNode)
            }
        }

    }
}


const drawInputNode = (config: DrawConfig, inputIdx: number) => {
    const inputJSX = config.inputs.inputNode(inputIdx);
    const nodePosn = calcNodePosn(config, 0, inputIdx);

    placeJSXElm(config, inputJSX, {
        x: nodePosn.x-25,
        y: nodePosn.y-25
    })
    
}

const drawHiddenLayerNode = (config: DrawConfig, hiddenLayerIdx: number, nodeIdx: number) => {
    return drawHiddenLayerNodeAtPosn(config, hiddenLayerIdx, nodeIdx, calcNodePosn(config, hiddenLayerIdx+1, nodeIdx))
}

const drawHiddenLayerNodeAtPosn = (config: DrawConfig, hiddenLayerIdx: number, nodeIdx: number, posn: Position) => {
    config.p5.circle(posn.x, posn.y, nodeSize)

    if (config.intermediateValues.length < hiddenLayerIdx || config.intermediateValues[hiddenLayerIdx].length < nodeIdx) return

    const val = config.intermediateValues[hiddenLayerIdx][nodeIdx]
    config.p5.textSize(16)
    config.p5.text(val.toFixed(1).toString(), posn.x, posn.y)
}

const drawBiasInputForNode = (config: DrawConfig, hiddenLayerIdx: number, nodeIdx: number) => {
    const nodePosn = calcNodePosn(config, hiddenLayerIdx+1, nodeIdx)

    return drawBiasInputAtPosn(config, hiddenLayerIdx, nodeIdx, {
        x: nodePosn.x,
        y: nodePosn.y
    })
}

const drawBiasInputAtPosn = (config: DrawConfig, hiddenLayerIdx: number, nodeIdx: number, posn: Position) => {
    const inp = config.inputs.biasInput(hiddenLayerIdx, nodeIdx);

    placeJSXElm(config, inp, {
        x: posn.x - 75,
        y: posn.y - 16
    });

    const plusPosn = calcPlusPosnFromNodePosn(posn);
    drawPlus(config, plusSize, {
        x: plusPosn.x,
        y: plusPosn.y
    })
}

const drawPlus = (config: DrawConfig, size: number, posn: Position, weight?: number) => {
    if (!weight) {
        weight = 1;
    }


    const hSize = size/2;
    config.p5.strokeWeight(weight);
    config.p5.line(posn.x,posn.y-hSize,posn.x,posn.y+hSize)
    config.p5.strokeWeight(weight);
    config.p5.line(posn.x-hSize,posn.y,posn.x+hSize,posn.y)

}


const drawWeightLine = (config: DrawConfig, layer: number, inNodeIdx: number, outNodeIdx: number) => {
    const inNodePosn = calcNodePosn(config, layer, inNodeIdx);
    const outNodePlusPosn = calcPlusPosn(config, (layer+1), outNodeIdx);

    config.p5.line(
        inNodePosn.x+nodeSize/2,
        inNodePosn.y,
        outNodePlusPosn.x-plusSize/2 - 5,
        outNodePlusPosn.y
    )

}

// ok so, you can't actually render DOM elements in a canvas. So, incorporate things like
// HTML inputs for the weights and biases, we do this in a kind of hacky way. There is a
// div of 0 height and width directly above the canvas, which has an id, accessible at
// "config.parentDivID". Using relative positioning, we can place DOM elements above the
// canvas at any position; so, here, we create a container div with the desired position,
// then 'render' the JSX within that div 
const placeJSXElm = (config: DrawConfig, elt: JSX.Element , posn: Position) => {
    const div = config.p5.createDiv()
    
    div.parent(config.parentDivID)
    div.class('w-0').class('h-0')
    div.style('position', 'relative')
    div.style('left',posn.x.toString()+"px")
    div.style('top', posn.y.toString()+"px")

    ReactDOM.render(elt, div.elt)

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
    return config.mlpConfig.hiddenLayers[layer-1].biases.length;
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
        x: posn.x - 90,
        y: posn.y
    }
}