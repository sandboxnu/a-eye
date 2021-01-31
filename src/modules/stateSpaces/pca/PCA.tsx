import React, { useState } from 'react';
import { PCA } from 'ml-pca';
import datasetIris from 'ml-dataset-iris';
import { BasicScatter, DataSeriesMap, ColorMap } from '../common/BasicScatter';
import './PCA.css';

type PCAProps = {labelColor: string, labelColorHex?: string};

/**
 * Interactive demo of PCA.
 *
 * @param labelColor color of the demo's label (as a tailwind class name)
 * @param labelColorHex hex color of the demo's label
 */
export const PCADemo = ({ labelColor, labelColorHex = '' }: PCAProps) => (
  <div className={`PCA-div ${labelColor}`}>
    <RawDataTable />
    <StaticAxisChart xIdx={4} yIdx={5} columnSet={columns} classes={['versicolor', 'setosa']} labelColorHex={labelColorHex} />
    <SelectableAxisChart columnSet={columns} initXIdx={2} initYIdx={3} labelColor="text-white" labelColorHex={labelColorHex} />
    <SelectableAxisChart columnSet={pcaColumns} initXIdx={0} initYIdx={1} labelColor="text-white" labelColorHex={labelColorHex} />
  </div>
);

export const RawDataTable = () => {
  const [showClass, setShowClass] = useState(false);

  return (
    <div className="container flex mx-auto my-4">
      <div className="pca raw-data-table mx-auto">
        <table className="table-auto">
          <thead>
            <tr>
              {columns.map((title) => title && <th key={title}>{title}</th>)}
              <th
                className="cursor-pointer"
                onClick={() => { setShowClass(!showClass); }}
                title={showClass ? 'Hide Classes' : 'Display Classes'}
              >
                {showClass ? 'Class' : '►'}
              </th>
            </tr>
          </thead>
          <tbody>
            {dataset.map((row: number[], idx: number) => (
              <tr key={idx} className="'datarow' text-white">
                {row.map((val: number, idx: number) => <td key={idx}>{val}</td>)}
                <td>{showClass && classes[idx]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Plot all samples in dataset, choose what 2 features to use as the axes
export const SelectableAxisChart = (props: { columnSet: string[], initXIdx: number, initYIdx: number, labelColor: string, labelColorHex: string }) => {
  const [xIdx, setXIdx] = useState(props.initXIdx);
  const [yIdx, setYIdx] = useState(props.initYIdx);
  const points: DataSeriesMap = {};
  Object.entries(dataByClass).forEach(([dataClass, nums]) => {
    points[dataClass] = nums.map((row) => ({ x: row[xIdx], y: row[yIdx] }));
  });

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
    </div>
  );
};

export const StaticAxisChart = (props: { xIdx: number, yIdx: number, columnSet: string[], classes: string[], labelColorHex: string }) => {
  const points: DataSeriesMap = {};
  props.classes.forEach((dataClass) => {
    console.log(dataClass);
    points[dataClass] = dataByClass[dataClass].map((row) => ({ x: row[props.xIdx], y: row[props.yIdx] }));
  });

  return (
    <div className="pca pca-chart">
      <div className="raw-data-scatter">
        <BasicScatter colorMap={colorMap} points={points} xLabel={props.columnSet[props.xIdx]} yLabel={props.columnSet[props.yIdx]} labelColorHex={props.labelColorHex} />
      </div>
    </div>
  );
};

export const AxisSelector = (props: { columnSet: string[], selected: number, onChange: (arg: number) => void }) => (
  <div className="axis-selector">
    {props.columnSet.map((col, idx) => (
      col && (
      <button
        className={props.selected === idx ? 'selected' : ''}
        key={col}
        onClick={() => props.onChange(idx)}
      >
        {col}
      </button>
      )
    ))}
  </div>
);

const COLORS = ['#003f5c', '#ef5675', '#FFC107', '#00B0FF', '#FF3D00', '#4DB6AC'];

// Moving these outside so they are only calculated once (this will change if we dynamically get datasets)
const dataset: number[][] = datasetIris.getNumbers(); // rows represent the samples and columns the features
const classes: string[] = datasetIris.getClasses(); // the whole column of flower types
const columns = ['', '', 'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
const pcaColumns = ['PC1', 'PC2', 'Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
const prediction = new PCA(dataset).predict(dataset);

export const config = {
  dataset, classes, columns, pcaColumns, prediction,
};

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
});

export default PCADemo;
