import React, { useState } from 'react';
import { PCA } from 'ml-pca';
import datasetIris from 'ml-dataset-iris';
import { BasicScatter, DataSeriesMap, ColorMap } from '../common/BasicScatter';
import './PCA.css';

const COLORS = [
  '#003f5c',
  '#ef5675',
  '#FFC107',
  '#00B0FF',
  '#FF3D00',
  '#4DB6AC',
];

// Moving these outside so they are only calculated once (this will change if we dynamically get datasets)
const dataset: number[][] = datasetIris.getNumbers(); // rows represent the samples and columns the features
const irisClasses: string[] = datasetIris.getClasses(); // the whole column of flower types
const columns = [
  '',
  '',
  'Sepal Length',
  'Sepal Width',
  'Petal Length',
  'Petal Width',
];
const pcaColumns = [
  'PC1',
  'PC2',
  'Sepal Length',
  'Sepal Width',
  'Petal Length',
  'Petal Width',
];

const prediction = new PCA(dataset).predict(dataset);

export const config = {
  dataset,
  classes: irisClasses,
  columns,
  pcaColumns,
  prediction,
};
const colorMap: ColorMap = {};
const dataByClass: { [dataClass: string]: number[][] } = {};
datasetIris.getDistinctClasses().forEach((dataClass: string, i: number) => {
  colorMap[dataClass] = COLORS[i] || '#de425b';
  dataByClass[dataClass] = [];
  dataset.forEach((row, idx) => {
    if (dataClass === irisClasses[idx]) {
      dataByClass[dataClass].push(
        [prediction.get(idx, 0), prediction.get(idx, 1)].concat(row),
      );
    }
  });
});

export const RawDataTable = () => {
  const [showClass, setShowClass] = useState(false);

  return (
    <div className="container flex mx-auto my-4">
      <div className="pca raw-data-table mx-auto">
        <table className="table-auto">
          <thead>
            <tr>
              {columns.map(title => title && <th key={title}>{title}</th>)}
              <th
                className="cursor-pointer"
                onClick={() => {
                  setShowClass(!showClass);
                }}
                title={showClass ? 'Hide Classes' : 'Display Classes'}
              >
                {showClass ? 'Class' : '►'}
              </th>
            </tr>
          </thead>
          <tbody>
            {dataset.map((row: number[], idx: number) => (
              <>
                {/* eslint-disable-next-line */}
              <tr key={idx} className="'datarow' text-white">
                  {/* eslint-disable-next-line */}
                  {row.map((val: number, idx: number) => (
                    <>
                      {/* eslint-disable-next-line */}
                      <td key={idx}>{val}</td>
                    </>
                  ))}
                  <td>{showClass && irisClasses[idx]}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

type AxisSelectorType = {
  columnSet: string[];
  selected: number;
  onChange: (arg: number) => void;
};
export const AxisSelector: React.FC<AxisSelectorType> = ({
  columnSet,
  selected,
  onChange,
}) => (
  <div className="axis-selector">
    {columnSet.map(
      (col, idx) =>
        col && (
          <button
            type="button"
            className={selected === idx ? 'selected' : ''}
            key={col}
            onClick={() => onChange(idx)}
          >
            {col}
          </button>
        ),
    )}
  </div>
);

// Plot all samples in dataset, choose what 2 features to use as the axes
type SelectableAxisChartType = {
  columnSet: string[];
  initXIdx: number;
  initYIdx: number;
  labelColor: string;
  labelColorHex: string;
};
export const SelectableAxisChart: React.FC<SelectableAxisChartType> = ({
  columnSet,
  initXIdx,
  initYIdx,
  labelColor,
  labelColorHex,
}) => {
  const [xIdx, setXIdx] = useState(initXIdx);
  const [yIdx, setYIdx] = useState(initYIdx);
  const points: DataSeriesMap = {};
  Object.entries(dataByClass).forEach(([dataClass, nums]) => {
    points[dataClass] = nums.map(row => ({ x: row[xIdx], y: row[yIdx] }));
  });

  return (
    <div className="pca raw-data-chart">
      <div className="select-axis-menu yIdx">
        <p className={`font-opensans font-bold italic ${labelColor}`}>
          Select Y Axis
        </p>
        <AxisSelector
          selected={yIdx}
          onChange={setYIdx}
          columnSet={columnSet}
        />
      </div>
      <div className="raw-data-scatter">
        <BasicScatter
          colorMap={colorMap}
          points={points}
          xLabel={columnSet[xIdx]}
          yLabel={columnSet[yIdx]}
          labelColorHex={labelColorHex}
        />
      </div>
      <div className="select-axis-menu xIdx">
        <p className={`font-opensans font-bold italic ${labelColor}`}>
          Select X Axis
        </p>
        <AxisSelector
          selected={xIdx}
          onChange={setXIdx}
          columnSet={columnSet}
        />
      </div>
    </div>
  );
};

type StaticAxisChartType = {
  xIdx: number;
  yIdx: number;
  columnSet: string[];
  classes: string[];
  labelColorHex: string;
};
export const StaticAxisChart: React.FC<StaticAxisChartType> = ({
  xIdx,
  yIdx,
  columnSet,
  classes,
  labelColorHex,
}) => {
  const points: DataSeriesMap = {};
  classes.forEach(dataClass => {
    points[dataClass] = dataByClass[dataClass].map(row => ({
      x: row[xIdx],
      y: row[yIdx],
    }));
  });

  return (
    <div className="pca pca-chart">
      <div className="raw-data-scatter">
        <BasicScatter
          colorMap={colorMap}
          points={points}
          xLabel={columnSet[xIdx]}
          yLabel={columnSet[yIdx]}
          labelColorHex={labelColorHex}
        />
      </div>
    </div>
  );
};

type PCAProps = { labelColor: string; labelColorHex?: string };

/**
 * Interactive demo of PCA.
 *
 * @param labelColor color of the demo's label (as a tailwind class name)
 * @param labelColorHex hex color of the demo's label
 */
const PCADemo: React.FC<PCAProps> = ({ labelColor, labelColorHex = '' }) => (
  <div className={`PCA-div ${labelColor}`}>
    <RawDataTable />
    <StaticAxisChart
      xIdx={4}
      yIdx={5}
      columnSet={columns}
      classes={['versicolor', 'setosa']}
      labelColorHex={labelColorHex}
    />
    <SelectableAxisChart
      columnSet={columns}
      initXIdx={2}
      initYIdx={3}
      labelColor="text-white"
      labelColorHex={labelColorHex}
    />
    <SelectableAxisChart
      columnSet={pcaColumns}
      initXIdx={0}
      initYIdx={1}
      labelColor="text-white"
      labelColorHex={labelColorHex}
    />
  </div>
);

export default PCADemo;
