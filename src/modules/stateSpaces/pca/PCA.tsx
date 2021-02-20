import React, { useState } from 'react';
import { PCA } from 'ml-pca';
import datasetIris from 'ml-dataset-iris';

// import trainData from '../data/train.json';
import trainDataIris from '../data/iris.json';
// import trainDataIris2 from '../data/iris2.json';
import titanicData from '../data/titanic.json';

import { BasicScatter, DataSeriesMap, ColorMap } from '../common/BasicScatter';
import './PCA.css';

type PCAProps = {labelColor: string, labelColorHex?: string};

/**
 * Interactive demo of PCA.
 * 
 * @param labelColor color of the demo's label (as a tailwind class name)
 * @param labelColorHex hex color of the demo's label
 */
export const PCADemo = ({labelColor, labelColorHex = ''}: PCAProps) => {

    return (
        <div className={`PCA-div ${labelColor}`}>
            <RawDataTable />
            <StaticAxisChart  labelColorHex={labelColorHex} />
            <SelectableAxisChart columnSet={columns} initXIdx={2} initYIdx={3} labelColor={"text-white"} labelColorHex={labelColorHex} />
            <SelectableAxisChart columnSet={pcaColumns} initXIdx={0} initYIdx={1} labelColor={"text-white"} labelColorHex={labelColorHex} />
        </div>
    );
}

export const RawDataTable = () => {

    const datasetLabel = [
        "Original Dataset",
        "Titanic Dataset",
    ];

    const [showClass, setShowClass] = useState(false);

    const [indexDataset, setIndexDataset] = useState(0);

    const datasets = [trainDataIris, titanicData];




    // some of the elements are not numbers, theyre strings but typescript doesnt catch it
    var currDataset:number[][] = []
    var currClasses:string[][]= []
    var columns:string[] = ["", ""].concat(Object.keys(datasets[indexDataset][0]).slice(0,-1))
    const target = Object.keys(datasets[indexDataset][0]).slice(-1)[0]

    
    datasets[indexDataset].forEach((row) => {
        
        const keys:string[] = Object.keys(row).slice(0,-1)
        const currRow:number[] = keys.map((rowKey) => row[rowKey]) 
        currDataset.push(currRow);

        const keys_class:string[] = Object.keys(row).slice(-1)
        const classRow:string[] = keys_class.map((rowKey) => row[rowKey]) 
        currClasses.push(classRow)
    })
    
    return (
    <div className="container mx-auto my-4">
        <div className="pca raw-data-table mx-auto">
            <table className="table-auto">
                <thead>
                    <tr>
                        {columns.map(title => title && <th key={title}>{title}</th>)}
                        <th className="cursor-pointer"
                            onClick={() => {setShowClass(!showClass)}}
                            title={showClass ? 'Hide Classes' : 'Display Classes'}>
                            {showClass ? `Class: ${target}` : '►'}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currDataset.map((row: number[], idx: number) => {
                        return (
                            <tr key={idx} className="'datarow' text-white">
                                {row.map((val: number, idx: number) => <td key={idx}>{val}</td>)}
                                <td>{showClass && currClasses[idx]}</td>
                            </tr>);
                    })}
                </tbody>
            </table>
        </div>
        <div className="axis-selector inline">
            <button onClick={e => setIndexDataset((indexDataset+1) % datasets.length)}>Current: {datasetLabel[indexDataset]}</button>
        </div>
    </div>);
}


// Plot all samples in dataset, choose what 2 features to use as the axes
export const SelectableAxisChart = (props: { columnSet: string[], initXIdx: number, initYIdx: number, labelColor: string, labelColorHex: string }) => {



    const [xIdx, setXIdx] = useState(props.initXIdx);
    const [yIdx, setYIdx] = useState(props.initYIdx);
    const points: DataSeriesMap = {};
    Object.entries(dataByClass).forEach(([dataClass, nums]) => {
        points[dataClass] = nums.map(row => ({ x: row[xIdx], y: row[yIdx] }));
    })

    return (
        <div className="pca raw-data-chart">
            <div className="select-axis-menu yIdx">
                <p className={`font-opensans font-bold italic ${props.labelColor}`}> Select Y Axis </p>
                <AxisSelector selected={yIdx} onChange={setYIdx} columnSet={props.columnSet} />
            </div>
            <div className="raw-data-scatter">
                <BasicScatter colorMap={colorMap} points={points} xLabel={props.columnSet[xIdx]} yLabel={props.columnSet[yIdx]} labelColorHex={props.labelColorHex} />
            </div>
            <div className="select-axis-menu xIdx">
                <p className={`font-opensans font-bold italic ${props.labelColor}`}> Select X Axis</p>
                <AxisSelector selected={xIdx} onChange={setXIdx} columnSet={props.columnSet} />
            </div>
        </div>);
};

const onlyUnique = (value, index, self) => self.indexOf(value) === index;


export const StaticAxisChart = (props:{  labelColorHex: string }) => {
// { xIdx: number, yIdx: number, columnSet: string[], classes: string[],
    const datasetLabel = [
        "Original Dataset",
        "Titanic Dataset",
    ];

    const columnList = [ 
        ["petalLength", "petalWidth"], 
        ["Age", "Fare"],
    ];

    const labelIndices = [
        [4, 5],
        [6, 10],
    ]

    const [indexDataset, setIndexDataset] = useState(0);
    const datasets = [trainDataIris, titanicData]

    // some of the elements are not numbers, theyre strings but typescript doesnt catch it
    let currDataset:number[][] = []
    let currClasses:string[] = []

    const xLabel = columnList[indexDataset][0];
    const yLabel = columnList[indexDataset][1];

    const xLabelIndex = labelIndices[indexDataset][0];
    const yLabelIndex = labelIndices[indexDataset][1];
    
    datasets[indexDataset].forEach((row) => {
        const keys:string[] = Object.keys(row).slice(0,-1)
        const currRow:number[] = keys.map((rowKey) => row[rowKey]) 
        currDataset.push(currRow);

        const keys_class:string[] = Object.keys(row).slice(-1)
        const classRow:string[] = keys_class.map((rowKey) => row[rowKey]) 
        currClasses.push(classRow[0])
    })

    const uniqueCurrClasses = currClasses.filter(onlyUnique);

    const prediction = new PCA(currDataset).predict(currDataset);

    const colorMap: ColorMap = {};
    const dataByClass: { [dataClass: string]: number[][] } = {};
    uniqueCurrClasses.forEach((dataClass, i) => {
        // console.log(dataClass, i);
        colorMap[dataClass] = COLORS[i];
        dataByClass[dataClass] = [];
        currDataset.forEach((row, idx) => {
            // console.log(row, idx);
            if (dataClass === currClasses[idx]) {
                dataByClass[dataClass].push([prediction.get(idx, 0), prediction.get(idx, 1)].concat(row));
            }
        });
    });

    const points: DataSeriesMap = {};
    console.log(dataByClass[currClasses[0]])
    currClasses.forEach((dataClass) => {
        // array with each data point
        points[dataClass] = dataByClass[dataClass].map(row => {
            return ({ x: row[xLabelIndex], y: row[yLabelIndex] })});
    });
    console.log(points)

    return (
        <div className="pca pca-chart">
            <div className="raw-data-scatter">
                <BasicScatter 
                    colorMap={colorMap} 
                    points={points} 
                    xLabel={xLabel} 
                    yLabel={yLabel} 
                    labelColorHex={props.labelColorHex} 
                />
                <div className="axis-selector inline">
                    <button onClick={e => setIndexDataset((indexDataset+1) % datasets.length)}>Current: {datasetLabel[indexDataset]}</button>
                </div>
            </div>
        </div>);

}

export const AxisSelector = (props: { columnSet: string[], selected: number, onChange: (arg: number) => void }) =>
    (<div className="axis-selector">
        {props.columnSet.map((col, idx) => (
            col && <button
                className={props.selected === idx ? "selected" : ""}
                key={col}
                onClick={() => props.onChange(idx)}>
                {col}
            </button>
        ))}
    </div>);

const COLORS = ['#003f5c', '#ef5675', '#FFC107', '#00B0FF', '#FF3D00', '#4DB6AC'];

// Moving these outside so they are only calculated once (this will change if we dynamically get datasets)
const dataset: number[][] = datasetIris.getNumbers(); // rows represent the samples and columns the features
const classes: string[] = datasetIris.getClasses(); // the whole column of flower types
const columns = ['', '', 'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
const pcaColumns = ['PC1', 'PC2', 'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
const prediction = new PCA(dataset).predict(dataset);

export const config = { dataset, classes, columns, pcaColumns, prediction };

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

export default PCADemo;