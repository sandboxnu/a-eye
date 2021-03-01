import React, { useState } from 'react';

import trainData from '../data/train.json';
import trainDataIris from '../data/iris.json';
import trainDataIris2 from '../data/iris2.json';
import trainDataTitanic from '../data/titanic.json';
import {InputData, organiseData, KMeansResult, BubbleDataEntry, getClasses, processdata} from './utils';

import { Scatter } from 'react-chartjs-2';
import kmeans from 'ml-kmeans';

type KMeansStepExampleType = {
    hidden: boolean,
    xLabel?: string,
    yLabel?: string,
    k?: number,
    trainingDatasets?: InputData[][],
    centersList?: number[][][],
};

const KMeansStepExample:React.FC<KMeansStepExampleType> = ({
    hidden= false,
    xLabel = '',
    yLabel = '',
    k = 2,
    centersList = [
        [[50, 70], [50, 80]],
        [[2, 2], [7, 5]],
        [[20, 20], [40, 40]],
        [[10, 10], [20, 20]],
    ],
    trainingDatasets = [
        trainData,
        trainDataIris,
        trainDataIris2,
        trainDataTitanic
    ],
}) => {
    let organizedDatasets: number[][][] = [];
    for(const dataset of trainingDatasets) {
        organizedDatasets.push(organiseData(dataset));
    };

    let kmeansAnswers: KMeansResult[][] = [];
    for (let i = 0; i < trainingDatasets.length; ++i) {
        kmeansAnswers.push(kmeans(organizedDatasets[i], k, { initialization: centersList[i], withIterations: true }, ));
    }

    const [original, setO]: [number, Function] = useState(0);

    let gen: KMeansResult[] = [];
    for (const elem of kmeansAnswers[original]) {
        gen.push(elem);
    }

    const [r, setR] = useState(0);
    const changeO = () => {
        setO((original+1) % trainingDatasets.length);
        setR(0);
        return;
    }

    if (gen.length === 0) return <div></div>;

    let bubData:BubbleDataEntry[] = [];
    let data3 = organiseData(trainingDatasets[original]);

    let cntrdss = gen[r].centroids;
    let c2 = [cntrdss[0].centroid, cntrdss[1].centroid];

    let labels: number[] = getClasses(data3, c2);

    processdata(bubData, labels, c2, hidden, data3, k);

    // data that will be put into the chart
    const data:{datasets: BubbleDataEntry[]} = {datasets: []};

    Object.entries(bubData).forEach((cluster) => {
        data.datasets.push(cluster[1]);
    });

    // index corresponds to the datasets as numbered above
    const yAxisMin: number[] = [0, 1, 0, 0];
    const yAxisMax: number[] = [120, 7, 40, 600];
    const xAxisMin: number[] = [0, 1, 0, 0];
    const xAxisMax: number[] = [250, 10, 100, 100];

    const options = {
        showLines: false,
        tooltips: {enabled: false},
        scales: {
            yAxes: [{
                scaleLabel: { display: true, labelString: yLabel, fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#394D73" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#394D73',
                    beginAtZero: true,
                    min: yAxisMin[original],
                    max: yAxisMax[original],
                }
            }],
            xAxes: [{
                scaleLabel: { display: true, labelString: xLabel, fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#394D73" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#394D73',
                    beginAtZero: true,
                    min: xAxisMin[original],
                    max: xAxisMax[original],
                }
            }],
        },
        legend: {
            labels: {
                fontSize: 14,
                fontFamily: 'arial',
                fontStyle: 'bold',
                fontColor: "#394D73"
            }
        },
        animation: {
            duration: 0
        }
    };

    const datasetLabel = [
        "Original Dataset",
        "Iris Sepal Dataset",
        "Iris Petal Dataset",
        "Titanic Dataset",
    ];

    return (
        <div>
            <Scatter data={data} options={options}/>
            <div className="text-moduleOffwhite m-3 -mt-2 space-x-2 justify-center space-y-3">
                <div className="flex justify-around rounded w-1/4 mx-auto bg-moduleNavy">
                    <button onClick={() => setR(prevR => Math.max(prevR - 1, 0))}
                            className="rounded mx-auto py-1 hover:text-moduleTeal outline-none">
                        <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <div className="md:inline py-2">Step {r}/{gen.length - 1}</div>
                    <button onClick={() => setR(prevR => Math.min(prevR + 1, gen.length - 1))}
                            className="rounded mx-auto py-1 hover:text-moduleTeal outline-none">
                        <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                </div>
                <div className="flex justify-around rounded bg-transparent">
                    <button onClick={e => changeO()}
                            className="rounded w-1/3 mx-auto px-1 py-2 bg-moduleNavy hover:text-moduleTeal outline-none">
                        Current: {datasetLabel[original]}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default KMeansStepExample;
