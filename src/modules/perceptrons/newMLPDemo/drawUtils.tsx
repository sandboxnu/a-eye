/* eslint-disable */
import p5Types, {CENTER} from "p5"; 
import { MLPConfig } from "./mlpConfig";

const nodeSize = 50

type Position = {
    x: number, 
    y: number
}

export type DrawConfig = {
    p5 : p5Types
    mlpConfig : MLPConfig,
    intermediateValues : number[][],
    canvasWidth : number,
    canvasHeight : number,

}

export const drawMLP = (config : DrawConfig) => {
    drawAllNodes(config);
    drawAllWeights(config);

}

export const drawAllNodes = (config : DrawConfig) => {
    const numLayers = config.mlpConfig.layers.length;

    for (let layerIdx = 0; layerIdx < numLayers; layerIdx++) {
        const layer = config.mlpConfig.layers[layerIdx];
        const numNodes = layer.biases.length;

        for (let nodeIdx = 0; nodeIdx < numNodes; nodeIdx++) {
            drawNode(config, layerIdx, nodeIdx);
        }

    }

}

export const drawAllWeights = (config : DrawConfig) => {

}


// get the position of the center of the given node
export const nodePosn = (config : DrawConfig, layerIdx: number, nodeIdx: number) : Position => {
    const numLayers = config.mlpConfig.layers.length;
    const numNodesInLayer = config.mlpConfig.layers[layerIdx].biases.length


    const layerWidth = config.canvasWidth / numLayers;

    const distBetweenEachNode = config.canvasHeight / (numNodesInLayer + 1);

    const x = layerWidth * layerIdx + (layerWidth/2)
    const y = distBetweenEachNode * (nodeIdx+1)

    return {
        x: x,
        y: y,
    }
}

export const drawNode = (config : DrawConfig, layerIdx: number, nodeIdx: number) => {
    return drawNodeAtPosn(config, layerIdx, nodeIdx, nodePosn(config, layerIdx, nodeIdx))
}

export const drawNodeAtPosn = (config : DrawConfig, layerIdx: number, nodeIdx: number, posn: Position) => {
    config.p5.circle(posn.x, posn.y, nodeSize)
    const val = config.intermediateValues[layerIdx][nodeIdx]



    config.p5.textSize(16)
    config.p5.text(val.toFixed(1).toString(), posn.x, posn.y)
}

