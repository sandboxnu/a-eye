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

    // yarn vs npm?
    // material ui?
    // deployment for ts? installs? package managment in general
    // we should have text explanations for each step

    return (
        <div className="PCA-div">
            {/* <RawDataTable dataset={dataset} /> */}
            <PCAChart points={pcPoints} />
        </div>
    );
}

const RawDataTable = ({ dataset }: { dataset: number[][] }) =>
    <table className="raw-data">
        <tr><th>Sepal Length</th><th>Sepal Width</th><th>Petal Length</th><th>Petal Width</th></tr>
        {dataset.map((row: number[], idx: number) => {
            return (
                <tr key={idx} className="'datarow'">
                    {row.map((val: number, idx: number) => <td key={idx}>{val}</td>)}
                </tr>);
        })}
    </table>


// Plot all samples in dataset, choose what 2 features to use as the axes
// --> natural conclusion: want to be able to see all features, without having to use an nth dimensional plot
const RawDataChart = ({ dataset, feature1, feature2 }: { dataset: number[][], feature1: number, feature2: number }) => { };

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
const pca = new PCA(dataset);
const prediction = pca.predict(dataset); //plot columns 1, 2
const pcPoints: Array<{ x: number, y: number }> = [];
for (let i = 0; i < prediction.rows; i++) {
    pcPoints.push({ x: prediction.get(i, 0), y: prediction.get(i, 1) });
}


export default PCADemo;