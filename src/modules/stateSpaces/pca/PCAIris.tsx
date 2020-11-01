import React from 'react';
import { PCA } from 'ml-pca';
import datasetIris from 'ml-dataset-iris';
import { ColorMap } from '../common/BasicScatter';
import { RawDataTable, StaticAxisChart, SelectableAxisChart } from './PCA';

export const PCADemoIris = (props: { labelColor: string }) => {
    return (
        <div className={`PCA-div  ${props.labelColor}`}>
            <RawDataTable pcaInfo={PCADATA} />
            <StaticAxisChart pcaInfo={PCADATA} xIdx={4} yIdx={5}
                columnSet={PCADATA.columns} displayClasses={["versicolor", "setosa"]} />
            <SelectableAxisChart pcaInfo={PCADATA} columnSet={PCADATA.columns} initXIdx={2} initYIdx={3} />
            <SelectableAxisChart pcaInfo={PCADATA} columnSet={PCADATA.pcaColumns} initXIdx={0} initYIdx={1} />
        </div>
    );
}

export const RawDataTableIris = (props: { labelColor: string }) => {
    return (
        <div className={`PCA-div ${props.labelColor}`}>
            <RawDataTable pcaInfo={PCADATA} />
        </div>);
}

export const StaticChartIris  = (props: { labelColor: string }) => {
    return (
        <div className={`PCA-div ${props.labelColor}`}>
            <StaticAxisChart pcaInfo={PCADATA} xIdx={4} yIdx={5}
                columnSet={PCADATA.columns} displayClasses={["versicolor", "setosa"]} />
        </div>);
}

export const FirstInteractiveChartIris = (props: { labelColor: string }) => {
    return (
        <div className={`PCA-div ${props.labelColor}`}>
            <SelectableAxisChart pcaInfo={PCADATA} columnSet={PCADATA.columns} initXIdx={2} initYIdx={3} />
        </div>);
}

export const SecondInteractiveChartIris = (props: { labelColor: string }) => {
    return (
        <div className={`PCA-div ${props.labelColor}`}>
            <SelectableAxisChart pcaInfo={PCADATA} columnSet={PCADATA.pcaColumns} initXIdx={0} initYIdx={1} />
        </div>);
}

const COLORS = ['#003f5c', '#ef5675', '#FFC107', '#00B0FF', '#FF3D00', '#4DB6AC'];

// Moving these outside so they are only calculated once (this will change if we dynamically get datasets)
const dataset: number[][] = datasetIris.getNumbers(); // rows represent the samples and columns the features
const classes: string[] = datasetIris.getClasses(); // the whole column of flower types
const columns = ['', '', 'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
const pcaColumns = ['PC1', 'PC2', 'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
const prediction = new PCA(dataset).predict(dataset);

const colorMap: ColorMap = {};
const dataByClass: { [dataClass: string]: number[][] } = {};
datasetIris.getDistinctClasses().forEach((dataClass: string, i: number) => {
    colorMap[dataClass] = COLORS[i] || '#de425b';
    dataByClass[dataClass] = [];
    dataset.forEach((row, idx) => {
        if (dataClass === classes[idx]) {
            dataByClass[dataClass].push([prediction.get(idx, 0), prediction.get(idx, 1)].concat(row));
        }
    });
})

const PCADATA = {
    columns,
    pcaColumns,
    dataset,
    classes,
    dataByClass,
    colorMap
}