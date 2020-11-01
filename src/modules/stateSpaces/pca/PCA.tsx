import React, { useState } from 'react';

import { BasicScatter, DataSeriesMap, ColorMap } from '../common/BasicScatter';
import './PCA.css';

type PCAInfo = {
    columns: string[],
    pcaColumns: string[],
    dataset: number[][],
    classes: string[],
    dataByClass: { [dataClass: string]: number[][] },
    colorMap: ColorMap
}

export const RawDataTable = (props: { pcaInfo: PCAInfo }) =>
    <div className="pca raw-data-table">
        <table>
            <thead>
                <tr>{props.pcaInfo.columns.map(title => title && <th key={title}>{title}</th>)}<th>Class</th></tr>
            </thead>
            <tbody>
                {props.pcaInfo.dataset.map((row: number[], idx: number) => {
                    return (
                        <tr key={idx} className="'datarow'">
                            {row.map((val: number, idx: number) => <td key={idx}>{val}</td>)}
                            <td>{props.pcaInfo.classes[idx]}</td>
                        </tr>);
                })}
            </tbody>
        </table>
    </div>


// Plot all samples in dataset, choose what 2 features to use as the axes
export const SelectableAxisChart = (props: { pcaInfo: PCAInfo, columnSet: string[], initXIdx: number, initYIdx: number }) => {
    const [xIdx, setXIdx] = useState(props.initXIdx);
    const [yIdx, setYIdx] = useState(props.initYIdx);
    const points: DataSeriesMap = {};
    Object.entries(props.pcaInfo.dataByClass).forEach(([dataClass, nums]) => {
        points[dataClass] = nums.map(row => ({ x: row[xIdx], y: row[yIdx] }));
    })

    return (
        <div className="pca raw-data-chart">
            <div className="select-axis-menu yIdx">
                <p className="font-opensans font-bold italic"> Select Y Axis </p>
                <AxisSelector selected={yIdx} onChange={setYIdx} columnSet={props.columnSet} />
            </div>
            <div className="raw-data-scatter">
                <BasicScatter colorMap={props.pcaInfo.colorMap} points={points} xLabel={props.columnSet[xIdx]} yLabel={props.columnSet[yIdx]} />
            </div>
            <div className="select-axis-menu xIdx">
                <p className="font-opensans font-bold italic"> Select X Axis</p>
                <AxisSelector selected={xIdx} onChange={setXIdx} columnSet={props.columnSet} />
            </div>
        </div>);
};

export const StaticAxisChart = (props: { pcaInfo: PCAInfo, xIdx: number, yIdx: number, columnSet: string[], displayClasses: string[] }) => {

    const points: DataSeriesMap = {};
    props.displayClasses.forEach((dataClass) => {
        points[dataClass] = props.pcaInfo.dataByClass[dataClass].map(row => ({ x: row[props.xIdx], y: row[props.yIdx] }));
    });

    return (
        <div className="pca pca-chart">
            <div className="raw-data-scatter">
                <BasicScatter 
                    colorMap={props.pcaInfo.colorMap} points={points} 
                    xLabel={props.columnSet[props.xIdx]} yLabel={props.columnSet[props.yIdx]} />
            </div>
        </div>);

}

const AxisSelector = (props: { columnSet: string[], selected: number, onChange: (arg: number) => void }) =>
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