import React, { useState } from 'react';

import trainData from '../datasets/train.json';
import trainDataIris from '../datasets/iris.json';
import trainDataIris2 from '../datasets/iris2.json';
import titanicData from '../datasets/titanic.json';
import bookData from '../datasets/books.json';

import dragData from 'chartjs-plugin-dragdata'; 
import { Scatter } from 'react-chartjs-2';
import kmeans from 'ml-kmeans';
import './chartjs-plugin-dragdata.d.ts';

import {organiseData, InputData, AddedPointList, PointToRemove, PointToRemoveList, BubbleDataEntry, processdata, AddedPoint, KMeansResult} from './utils';

type InteractiveClusteringExampleType = {
    hidden: boolean,
    yLabel?: string,
    xLabel?: string
    k?: number,
    centersList?: number[][][],
    trainingDatasets?: InputData[][],
};

const InteractiveClusteringExample: React.FC<InteractiveClusteringExampleType> = ({
    hidden = false,
    xLabel = '',
    yLabel = '',
    k = 2,
    // 0 == original data
    // 1 == iris data
    // 2 == diff iris data
    // 3 == titanic data
    // change to an int if more datasets
    trainingDatasets = [trainData, trainDataIris, trainDataIris2, bookData],
    centersList = [
        [[0, 0], [50, 50]],
        [[2, 2], [7, 5]],
        [[20, 20], [40, 40]],
        [[3000, 3], [12000, 20]]
    ],
}) => {
    // index corresponds to the datasets as numbered above
    const yAxisMin: number[] = [0, 1, 0, 0];
    const yAxisMax: number[] = [120, 7, 40, 40];
    const xAxisMin: number[] = [0, 1, 0, 0];
    const xAxisMax: number[] = [250, 10, 100, 50000];

    let organizedDatasets = [];
    for(const dataset of trainingDatasets) {
        organizedDatasets.push(organiseData(dataset));
    };

    let kmeansAnswers: KMeansResult[]  = [];
    for (let i = 0; i < trainingDatasets.length; ++i) {
        kmeansAnswers.push(kmeans(organizedDatasets[i], k, { initialization: centersList[i], maxIterations: 1 }, ));
    }

    const [originalDataset, setO] = useState(0);

    const changeO = (nextDataset: number) => {
        setX1Idx(kmeansAnswers[nextDataset]['centroids'][0].centroid[0]);
        setY1Idx(kmeansAnswers[nextDataset]['centroids'][0].centroid[1]);
        setX2Idx(kmeansAnswers[nextDataset]['centroids'][1].centroid[0]);
        setY2Idx(kmeansAnswers[nextDataset]['centroids'][1].centroid[1]);

        setO(nextDataset);
    }

    const centersx = kmeansAnswers[originalDataset]['centroids'];

    // in order to make the chart updateable after moving a center
    const [x1Idx, setX1Idx] = useState(centersx[0].centroid[0]);
    const [y1Idx, setY1Idx] = useState(centersx[0].centroid[1]);
    const [x2Idx, setX2Idx] = useState(centersx[1].centroid[0]);
    const [y2Idx, setY2Idx] = useState(centersx[1].centroid[1]);

    const [addedPoints, setAP]:AddedPointList = useState([[], [], [], []]);
    const addPoint = (index: number, newPoint: AddedPoint) => {
        let newAddedPoints: AddedPoint[][] = [...addedPoints];
        newAddedPoints[index] = newAddedPoints[index].concat(newPoint);
        setAP(newAddedPoints);
    }

    const [pointsToRemove, setRT]: PointToRemoveList = useState([[], [], [], []]);
    const addPointToRemove = (index: number, newPoint: PointToRemove) => {
        let newPoints: PointToRemove[][] = [...pointsToRemove];
        newPoints[index] = newPoints[index].concat(newPoint);
        setRT(newPoints);
    }

    const [percentRemove, setPR] = useState(16);
    const [editable, setEdit] = useState(true);
    const [base, setBase] = useState(true);

    let trainData2:InputData[] = trainingDatasets[originalDataset].slice();

    // Remove a percentage of the data
    if (originalDataset === 0) {
        for (let i = trainData2.length; i > 0; i--) {
            if (i % 20 === 0) {
                trainData2.splice(i, percentRemove)
            }
        }
    }
    else {
        for (let i = trainData2.length; i > 0; i--) {
            if (i % 4 === 0) {
                trainData2.splice(i, percentRemove - 16)
            }
        }
    }

    trainData2 = base ? trainData2.concat(addedPoints[originalDataset]) : addedPoints[originalDataset];

    // where our data is going to be, 'bubble data'
    let bubData: BubbleDataEntry[] = [];

    // possible edge case: if one dataset has fewer than 2 points, need fake data for kmeans
    // as users can remove datapoints this is necessary
    const fakepoints = [{ Distance_Feature: 2, Speeding_Feature: 2 },
        { Distance_Feature: 1, Speeding_Feature: 1 }];

    // format needed for kmeans()
    const c2 = [[x1Idx, y1Idx], [x2Idx, y2Idx]];

    if (trainData2.length >= 2) {
        const ans_x = kmeans(organiseData(trainData2), k, { initialization: c2, maxIterations: 1 }, );
        const data3 = organiseData(trainData2);
        processdata(bubData, ans_x.clusters, c2, hidden, data3, k);
    }
    else {
        const s = trainData2.concat(fakepoints);
        const ans_x = kmeans(organiseData(s), k, { initialization: c2, maxIterations: 1 }, );
        const data3 = organiseData(trainData2)
        const clustersss = trainData2.length === 1 ? [ans_x.clusters[0]] : [];
        processdata(bubData, clustersss, c2, hidden, data3, k);
    }

    // data that will be put into the chart
    const data:{datasets: BubbleDataEntry[]} = { datasets : [] };

    Object.entries(bubData).forEach((cluster) => {
        data.datasets.push(cluster[1]);
    });

    // remove removethese from data
    for (const removethese of pointsToRemove) {
        for (let i = 0; i < removethese.length; i++) {
            data.datasets[removethese[i].ds_index].data.splice(removethese[i].ind, 1);
        }
    }

    const onDragEnd = (e: React.ChangeEvent, datasetIndex: number, index: number, value: {x: number, y: number}) => {
        if (!e) return;
        if (datasetIndex === 0) {
            setX1Idx(value.x);
            setY1Idx(value.y);
        }
        if (datasetIndex === 1) {
            setX2Idx(value.x);
            setY2Idx(value.y);
        }
    }

    const options = {
        showLines: false,
        tooltips: { enabled: false },
        scales: {
            yAxes: [{
                scaleLabel: { display: true, labelString: yLabel, fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#CBD9F2" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#CBD9F2',
                    beginAtZero: true,
                    min: yAxisMin[originalDataset],
                    max: yAxisMax[originalDataset],
                }
            }],
            xAxes: [{
                scaleLabel: { display: true, labelString: xLabel, fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#CBD9F2" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#CBD9F2',
                    beginAtZero: true,
                    min: xAxisMin[originalDataset],
                    max: xAxisMax[originalDataset],
                }
            }],
        },
        legend: {
            labels: {
                fontSize: 14,
                fontFamily: 'arial',
                fontStyle: 'bold',
                fontColor: "#CBD9F2"
            }
        },
        dragData: true,
        dragX: true,
        dragDataRound: 0,
        onClick : function (evt: MouseEvent) {
            if (editable) {
                // all the // @ts-ignore 's from here on are due to the fact that we can't access of 'this' until onClick is called
                // inside the react component
                // @ts-ignore
                const asdgwg = this.chart.getElementAtEvent(evt)[0];

                 // @ts-ignore
                 let yTop = this.chartArea.top;
                 // @ts-ignore
                 let yBottom = this.chartArea.bottom;
                 // @ts-ignore
                 let yMin = this.scales['y-axis-1'].min;
                 // @ts-ignore
                 let yMax = this.scales['y-axis-1'].max;
                 let newY = 0;

                 if (evt.offsetY <= yBottom && evt.offsetY >= yTop) {
                     newY = Math.abs((evt.offsetY - yTop) / (yBottom - yTop));
                     newY = (newY - 1) * -1;
                     newY = newY * (Math.abs(yMax - yMin)) + yMin;
                 };
                 // @ts-ignore
                 let xTop = this.chartArea.left;
                 // @ts-ignore
                 let xBottom = this.chartArea.right;
                 // @ts-ignore
                 let xMin = this.scales['x-axis-1'].min;
                 // @ts-ignore
                 let xMax = this.scales['x-axis-1'].max;
                 let newX = 0;

                 if (evt.offsetX <= xBottom && evt.offsetX >= xTop) {
                     newX = Math.abs((evt.offsetX - xTop) / (xBottom - xTop));
                     newX = newX * (Math.abs(xMax - xMin)) + xMin;
                 };
                 
                 // checking to make sure where you click isnt on the centroids
                 // dont want to remove those
                 const rad = 7
                 const inXBounds = ((newX < x1Idx + rad) && (newX > x1Idx - rad)) || ((newX < x2Idx + rad) && (newX > x2Idx - rad))
                 const inYBounds = ((newY < y1Idx + rad) && (newY > y1Idx - rad)) || ((newY < y2Idx + rad) && (newY > y2Idx - rad))

                const onCentroid =  inXBounds && inYBounds

                if (asdgwg && !onCentroid) {
                    let ds_index = asdgwg._datasetIndex
                    let ind = asdgwg._index

                    
                    addPointToRemove(originalDataset, {ds_index, ind});

                    // @ts-ignore
                    setX1Idx(this.chart.data.datasets[0].data[0].x  + 0.1);
                    // @ts-ignore
                    setX1Idx(this.chart.data.datasets[0].data[0].x  - 0.1);
                    return;
                }
                else {
                
                    if (newX > 0 && newY > 0) {

                        const point = {Distance_Feature: newX, Speeding_Feature: newY};
                        addPoint(originalDataset, point);

                        // forces the chart to update because it won't rerender otherwise
                        // @ts-ignore
                        setX1Idx(this.chart.data.datasets[0].data[0].x  + 0.1)
                        // @ts-ignore
                        setX1Idx(this.chart.data.datasets[0].data[0].x  - 0.1)
                    }

                }
            }
        },
        
        onDragEnd,
        onDragStart:onDragEnd,
        onDrag:onDragEnd,
        animation: {
            duration: 0
        },
    };

    const datasetLabel = [
        "Original Dataset",
        "Iris Sepal Dataset",
        "Iris Petal Dataset",
        "Books Dataset",
    ];

    return (
        <div>
            <div>
                <Scatter data={data} options={options} plugins={[dragData]}  />
            </div>
            <div className="flex-row space-x-10 mb-5">
                <div className="axis-selector inline">
                    <button className={ percentRemove===19 ? "selected" : ""} onClick={e => setPR(19)}>A Fourth of the Points</button>
                    <button className={ percentRemove===18 ? "selected" : ""} onClick={e => setPR(18)}>Half of the Points</button>
                    <button className={ percentRemove===16 ? "selected" : ""}  onClick={e => setPR(16)}>All of the Points</button>
                </div>
                <div className="axis-selector inline">
                    <button style={{color:'white'}} onClick={e => setBase(!base)}> {base ? "Show Only Custom" : "Show Full Dataset"}</button>
                    <button style={{color:'white'}} onClick={e => setEdit(!editable)} > {editable ? "Disable Editing" : "Enable Editing"} </button>
                    <button onClick={e => changeO((originalDataset+1) % 4)}>Current: {datasetLabel[originalDataset]}</button>
                </div>
            </div>
        </div>);
};

export default InteractiveClusteringExample;
