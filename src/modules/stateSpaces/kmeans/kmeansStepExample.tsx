import React, { useState } from 'react';

import trainData from './datasets/train.json';
import trainDataIris from './datasets/iris.json';
import trainDataIris2 from './datasets/iris2.json';
import bookData from './datasets/books.json';

import {InputData, organiseData, KMeansResult, BubbleDataEntry, getClasses, processdata} from './utils';

import { Scatter } from 'react-chartjs-2';
import kmeans from 'ml-kmeans';

type KMeansStepExampleType = {
    hidden: boolean,
    xLabel?: string,
    yLabel?: string,
    k?: number,
    trainingData?: InputData[],
    trainingDataIris?: InputData[],
    trainingDataIris2?: InputData[],
    centers?: number[][],
    centersIris?: number[][],
    centersIris2?: number[][],
};

const KMeansStepExample:React.FC<KMeansStepExampleType> = ({
    hidden= false,
    xLabel = '',
    yLabel = '',
    k = 2,
    trainingData = trainData,
    trainingDataIris = trainDataIris,
    trainingDataIris2 = trainDataIris2,
    centers = [[50, 70], [50, 80]],
    centersIris = [[2, 2], [7, 5]],
    centersIris2 = [[20, 20], [40, 40]],
}) => {
    const kmeansData:number[][] = organiseData(trainingData);
    const kmeansIrisData:number[][] = organiseData(trainingDataIris);

    const ans2: KMeansResult[] = kmeans(kmeansData, k, { initialization: centers, withIterations: true }, );
    const ans2iris = kmeans(kmeansIrisData, k, { initialization: centersIris, withIterations: true }, );

    const kmeansIrisData2 = organiseData(trainingDataIris2);
    const ans2iris2 = kmeans(kmeansIrisData2, k, { initialization: centersIris2, withIterations: true }, );

    let gen_out: KMeansResult[] = [];
    for (const element of ans2) {
        gen_out.push(element);
    }

    let gen_outIris:KMeansResult[] = [];
    for (const element of ans2iris) {
        gen_outIris.push(element);
    }

    let gen_outIris2:KMeansResult[] = [];
    for (const element of ans2iris2) {
        gen_outIris2.push(element);
    }

    const [original, setO]: [number, Function] = useState(0);

    const gen = original === 0 ? gen_out : (original === 1 ? gen_outIris : gen_outIris2);
    const [r, setR] = useState(0);
    const changeO = () => {
        setO((original+1) % 3);
        setR(0);
        return;
    }

    if (gen.length === 0) return <div></div>;

    let bubData:BubbleDataEntry[] = [];
    let data3 = original === 0 ? organiseData(trainData) : (original === 1 ? organiseData(trainDataIris) : organiseData(trainDataIris2));
    let cntrdss = gen[r].centroids;
    let c2 = [cntrdss[0].centroid, cntrdss[1].centroid];

    let labels: number[] = getClasses(data3, c2);

    processdata(bubData, labels, c2, hidden, data3, k);

    // data that will be put into the chart
    const data:{datasets: BubbleDataEntry[]} = {datasets: []};

    Object.entries(bubData).forEach((cluster) => {
        data.datasets.push(cluster[1]);
    });

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
                    min: original === 0 ? 0 : (original === 1 ? 1 : 0),
                    max: original === 0 ? 120 : (original === 1 ? 7 : 40),
                }
            }],
            xAxes: [{
                scaleLabel: { display: true, labelString: xLabel, fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#394D73" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#394D73',
                    beginAtZero: true,
                    min: original === 0 ? 0 : (original === 1 ? 1 : 0),
                    max: original === 0 ? 250 : (original === 1 ? 10 : 100),
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
                        {original === 0 ? "Current: Original Dataset" : (original === 1 ? "Current: Iris Sepal Dataset" : "Current: Iris Petal Dataset")}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default KMeansStepExample;
