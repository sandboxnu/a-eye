import React, { useState } from 'react';
import { PCA } from 'ml-pca';
import datasetIris from 'ml-dataset-iris';
import { Scatter } from 'react-chartjs-2';
import './PCA.css';

/**
 * Interactive demo of PCA.
 * 
 * @param props 
 */
const PCADemo = () => {

    return (
        <div className="PCA-div">
            <RawDataTable />
            <RawDataChart />
            <PCAChart />
        </div>
    );
}

const RawDataTable = () =>
    <div className="pca raw-data-table">
        <table>
            <thead>
                <tr className="bg-gray-100">{columns.map(title => <th key={title}>{title}</th>)}<th>Class</th></tr>
            </thead>
            <tbody>
                {dataset.map((row: number[], idx: number) => {
                    return (
                        <tr key={idx} className="'datarow'">
                            {row.map((val: number, idx: number) => <td key={idx}>{val}</td>)}
                            <td>{classes[idx]}</td>
                        </tr>);
                })}
            </tbody>
        </table>
    </div>


// Plot all samples in dataset, choose what 2 features to use as the axes
// --> natural conclusion: want to be able to see all features, without having to use an nth dimensional plot
const RawDataChart = () => {
    const [xIdx, setXIdx] = useState(0);
    const [yIdx, setYIdx] = useState(1);
    const points: DataSeriesMap = {};
    Object.entries(dataByClass).forEach(([dataClass, nums]) => {
        points[dataClass] = nums.map(row => ({ x: row[xIdx], y: row[yIdx] }));
    })

    return (
        <div className="pca raw-data-chart">
            <div className="chart-config">
                <div className="select-axis-menu xIdx">
                    Select X Axis
                <AxisSelector selected={xIdx} onChange={setXIdx} />
                </div>
                <div className="select-axis-menu yIdx">
                    Select Y Axis
                <AxisSelector selected={yIdx} onChange={setYIdx} />
                </div>
            </div>
            <div className="raw-data-scatter">
                <BasicScatter points={points} xLabel={columns[xIdx]} yLabel={columns[yIdx]} />
            </div>
        </div>);
};

const AxisSelector = (props: { selected: number, onChange: (arg: number) => void }) =>
    (<div className="axis-selector">
        {columns.map((col, idx) => (
            <button
                className={props.selected === idx ? "selected" : ""}
                key={col}
                onClick={() => props.onChange(idx)}>
                {col}
            </button>
        ))}
    </div>);

const PCAChart = () => (
    <div className="pca pca-chart">
        <BasicScatter points={pcPoints} xLabel='PC1' yLabel='PC2' />
    </div>);

const BasicScatter =
    (props: { points: DataSeriesMap, xLabel: string, yLabel: string}) => {
        const data: { datasets: Object[] } = { datasets: [] };
        Object.entries(props.points).forEach(([dataClass, classPoints]) => {
            data.datasets.push({
                label: dataClass,
                fill: true,
                pointRadius: 4,
                backgroundColor: colorMap[dataClass],
                data: classPoints
            });
        })
        const options = {
            showLines: false,
            tooltips: { enabled: false },
            scales: {
                yAxes: [{
                    scaleLabel: { display: true, labelString: props.xLabel }
                }],
                xAxes: [{
                    scaleLabel: { display: true, labelString: props.yLabel }
                }],
            }
        };
        return (<Scatter data={data} options={options} />);
    };

const COLORS = ['#003f5c', '#ef5675', '#FFC107', '#00B0FF', '#FF3D00', '#4DB6AC'];

// Moving these outside so they are only calculated once (this will change if we dynamically get datasets)
const dataset: number[][] = datasetIris.getNumbers(); // rows represent the samples and columns the features
const classes: string[] = datasetIris.getClasses(); // the whole column of flower types
const columns = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
const pca = new PCA(dataset);
const prediction = pca.predict(dataset);

const colorMap: { [dataClass: string]: string } = {};
const dataByClass: { [dataClass: string]: number[][] } = {};
const pcPoints: DataSeriesMap = {};
datasetIris.getDistinctClasses().forEach((dataClass, i) => {
    pcPoints[dataClass] = [];
    colorMap[dataClass] = COLORS[i] || '#de425b';
    dataByClass[dataClass] = dataset.filter((val, idx) => dataClass === classes[idx]);
})
for (let i = 0; i < prediction.rows; i++) {
    pcPoints[classes[i]].push({ x: prediction.get(i, 0), y: prediction.get(i, 1) });
}

type DataSeriesMap = { [dataClass: string]: Array<{ x: number, y: number }> };

export default PCADemo;