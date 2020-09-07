import React from 'react';
import { PCA } from 'ml-pca';
import datasetIris from 'ml-dataset-iris';
import { Scatter } from 'react-chartjs-2';
// you can also directly use chartjs without the wrapper for more customization

/**
 * Interactive demo of PCA.
 * 
 * @param props 
 */
const PCADemo = ({ }) => {
    // pca shows the clusters of samples that are highly correlated
    // PC1 axis is more important than Pc2 differences

    // material ui?
    // deployment for ts? installs? package managment in general
    // we should have text explanations for each step

    return (
        <div className="PCA-div">
            <RawDataTable dataset={dataset} columns={columns}/>
            <RawDataChart dataset={dataset} columns={columns} xIdx={2} yIdx={3}/>
            <PCAChart points={pcPoints} />
        </div>
    );
}

const RawDataTable = ({ dataset, columns }: { dataset: number[][], columns: string[] }) =>
    <table className="raw-data">
        <tr>{columns.map(title => <th key={title}>{title}</th>)}</tr>
        {dataset.map((row: number[], idx: number) => {
            return (
                <tr key={idx} className="'datarow'">
                    {row.map((val: number, idx: number) => <td key={idx}>{val}</td>)}
                </tr>);
        })}
    </table>


// Plot all samples in dataset, choose what 2 features to use as the axes
// --> natural conclusion: want to be able to see all features, without having to use an nth dimensional plot
const RawDataChart =
    ({ dataset, columns, xIdx, yIdx}: { dataset: number[][], columns: string[], xIdx: number, yIdx: number}) => {
        const points: Array<{ x: number, y: number }> = dataset.map(row => ({ x: row[xIdx], y: row[yIdx] }));

        const data = {
            labels: ['Scatter'],
            datasets: [{
                label: 'Flower Sample',
                fill: true,
                pointRadius: 4,
                backgroundColor: '#605196',
                data: points
            }]
        };
        const options = {
            showLines: false,
            tooltips: { enabled: false },
            scales: {
                yAxes: [{
                    scaleLabel: { display: true, labelString: columns[yIdx] }
                }],
                xAxes: [{
                    scaleLabel: { display: true, labelString: columns[xIdx] }
                }],
            }
        };
        return (<Scatter data={data} options={options} />);
    };

const PCAChart = ({ points }: { points: Array<{ x: number, y: number }> }) => {
    const data = {
        labels: ['Scatter'],
        datasets: [{
            label: 'Flower Sample',
            fill: true,
            pointRadius: 4,
            backgroundColor: '#605196',
            data: points
        }]
    };
    const options = {
        showLines: false,
        tooltips: { enabled: false },
        scales: {
            yAxes: [{
                scaleLabel: { display: true, labelString: 'PC2' }
            }],
            xAxes: [{
                scaleLabel: { display: true, labelString: 'PC1' }
            }],
        }
    };
    return (<Scatter data={data} options={options} />);
}

// Moving these outside so they are only calculated once (this will change if we dynamically get datasets)
const dataset: number[][] = datasetIris.getNumbers(); // rows represent the samples and columns the features
const columns = ['Sepal Length', 'Sepal Width', 'Petal Length', 'Petal Width'];
const pca = new PCA(dataset);
const prediction = pca.predict(dataset); //plot columns 1, 2
const pcPoints: Array<{ x: number, y: number }> = [];
for (let i = 0; i < prediction.rows; i++) {
    pcPoints.push({ x: prediction.get(i, 0), y: prediction.get(i, 1) });
}


export default PCADemo;