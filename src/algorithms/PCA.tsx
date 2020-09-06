
import React from 'react';
import { PCA } from 'ml-pca';
import datasetIris from 'ml-dataset-iris';

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
    // what to use for graphs? echarts?
    // dunno what to use to plot the pca stuff - which functions? what numbers am i plotting??
    // we should have text explanations for each step

    const dataset: number[][] = datasetIris.getNumbers(); // rows represent the samples and columns the features
    const pca = new PCA(dataset);
    console.log(pca.getExplainedVariance());
    /*
    [ 0.9246187232017269,
      0.05306648311706785,
      0.017102609807929704,
      0.005212183873275558 ]
    */
    const newPoints = [[4.9, 3.2, 1.2, 0.4], [5.4, 3.3, 1.4, 0.9]];
    console.log(pca.predict(newPoints));
    /*
    [[ -2.830722471866897,
        0.01139060953209596,
        0.0030369648815961603,
        -0.2817812120420965 ],
    [ -2.308002707614927,
        -0.3175048770719249,
        0.059976053412802766,
        -0.688413413360567 ]]
    */

    // todo pls refactor some of this shit
    return (
        <div className="PCA-div">
            <RawDataTable dataset={dataset}/>
        </div>
    );
}

const RawDataTable = ({dataset}: {dataset: number[][]}) =>
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
const rawDataChart = ({dataset, feature1, feature2}: {dataset: number[][], feature1: number, feature2: number}) => {}; 

// plot all features using PC1, PC2 as axes --> easy to see what the flower species are as clusters!!
// where do i get the pc1, pc2 values for points in a dataset.


export default PCADemo;