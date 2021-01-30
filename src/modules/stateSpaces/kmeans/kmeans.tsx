import React, { useState } from 'react';

import { Scatter } from 'react-chartjs-2';
import './kmeans.css';
import trainData from './train.json';
import trainDataIris from './iris.json';
import trainDataIris2 from './iris2.json';

import './ml-kmeans.d.ts';
import kmeans from 'ml-kmeans';
import { squaredEuclidean } from 'ml-distance-euclidean';

type KMeansResult = {clusters: [], centroids: {centroid: number[]}[], converged: [], iterations: number};
interface DataFormat { Driver_ID: number, Distance_Feature: number, Speeding_Feature:number};
interface DataFormat2 { sepalLength: number, sepalWidth: number, petalLength:number, petalWidth:number, species:string};
interface DataFormat3 { petalLength:number, petalWidth:number, species:string };
type InputData = DataFormat | DataFormat2 | DataFormat3;

type ScatterData = {datasets: ScatterDataData[]};
type ScatterDataData = {data:{x:number, y:number, pointRadius:number, backgroundColor:string}[]};

type RemoveThese = {ds_index:number, ind: number}[];
type RemoveTheseList = [RemoveThese, Function];

type NewClusterType = {x:number, y:number, r:number};
type BubbleDataEntry = {label:string[], backgroundColor:string, borderColor:string, data:NewClusterType[], pointRadius?:number, hidden?: boolean, dragData?: boolean };

type AddedPoint = {Driver_ID:number, Distance_Feature:number, Speeding_Feature:number}[];
type AddedPointList = [AddedPoint, Function];

// kmeans for clusters
const cluster_colors = ['#99FF99', '#99CCFF'];
const center_colors = ['#3cb450', "#5360fc"];
const centerborder_colors = ['#004E00', '#00007D' ];

/*
 * @param data: array of points
 * @param centers: two centers
 * @return array of labels (which its closer to), 0 for first center, 1 for second center
 */
function getClasses(data:number[][], centers: number[][]) {
    return data.map(x => squaredEuclidean(x, centers[0]) > squaredEuclidean(x, centers[1]) ? 1 : 0);
}

// Data processing
const organiseData = (data: InputData[]) => {
    const organisedData: number[][] = [];
    for (let i = 0; i < data.length; i++) {
        const newRow:number[] = [];
        const curRow:InputData = data[i];
        if ((curRow as DataFormat).Distance_Feature) {
            const temp:DataFormat = curRow as DataFormat;
            newRow.push(temp.Distance_Feature);
            newRow.push(temp.Speeding_Feature);
        }
        else if ((curRow as DataFormat2).sepalLength) {
            const temp:DataFormat2 = curRow as DataFormat2;
            newRow.push(temp.sepalLength);
            newRow.push(temp.sepalWidth);
        }
        else {
            const temp:DataFormat3 = curRow as DataFormat3;
            newRow.push(temp.petalLength * 10);
            newRow.push(temp.petalWidth * 10);
        }
        organisedData.push(newRow);
    }
    return organisedData;
}

// processing for second and third chart
const processdata = (bdata: BubbleDataEntry[], clsters: number[], cntroids: number[][], hidden: boolean, data3: number[][], k: number) => {
    // add centers
    for (let c = 0; c < cntroids.length; c++ ){
        const newCluster:NewClusterType[] = [];
        newCluster.push({
            x: cntroids[c][0],
            y: cntroids[c][1],
            r: 3
        });

        const colour = center_colors[c];
        const cb = centerborder_colors[c];
        bdata.push({
            label: [`center ${c }`],
            backgroundColor: colour,
            borderColor: cb,
            data: newCluster,
            hidden: hidden,
            pointRadius: 7,
        });
    }

    // add clusters
    for (let ci = 0; ci < k; ci++) {
        const newCluster:NewClusterType[] = [];
        for (let ri = 0; ri < clsters.length; ri++){
            if (clsters[ri] === ci) {
                newCluster.push({
                    x: data3[ri][0],
                    y: data3[ri][1],
                    r: 3
                });
            }
        }

        const colour = cluster_colors[ci];
        bdata.push({
            label: [`cluster ${ci}`],
            backgroundColor: colour,
            borderColor: colour,
            data: newCluster,
            dragData: false
        });
    };
}

type KMeansStepExampleType = {
    hidden: boolean,
    xLabel?: string,
    yLabel?: string,
    k?: number,
    trainingData?: InputData[],
    centers?: number[][],
    centersIris?: number[][],
    centersIris2?: number[][],
};

export const KMeansStepExample:React.FC<KMeansStepExampleType> = ({
    hidden= false,
    xLabel = '',
    yLabel = '',
    k = 2,
    trainingData = trainData,
    centers = [[50, 70], [50, 80]],
    centersIris = [[2, 2], [7, 5]],
    centersIris2 = [[20, 20], [40, 40]],
}) => {
    const kmeansData = organiseData(trainingData);
    const kmeansIrisData = organiseData(trainDataIris);

    const ans2: KMeansResult[] = kmeans(kmeansData, k, { initialization: centers, withIterations: true }, );
    const ans2iris = kmeans(kmeansIrisData, k, { initialization: centersIris, withIterations: true }, );

    const kmeansIrisData2 = organiseData(trainDataIris2)
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

// Currently unused, may be out of date
type BubbleDataScatterType = {graphdata: BubbleDataEntry[]};
const BubbleDataScatter: React.FC<BubbleDataScatterType> = ({graphdata}) => {
        const scatterData:ScatterData =  { datasets : [{
            data: []
        }]};

        // was bubbleData as defined in app
        Object.entries(graphdata).forEach((cluster) => {
            Object.entries(cluster[1].data).forEach((point) => {
                scatterData.datasets[0].data.push({
                    x: point[1].x,
                    y: point[1].y,
                    pointRadius: 15,
                    backgroundColor: '#ef5675',
                });

            });
        })

        const options = {
            showLines: false,
            tooltips: { enabled: false },
            scales: {
                yAxes: [{
                    scaleLabel: { display: true }
                }],
                xAxes: [{
                    scaleLabel: { display: true }
                }],
            }
        };
        return (<Scatter data={scatterData} options={options} />);
    };

type InteractiveClusteringExampleType = {
    hidden: boolean,
    yLabel?: string,
    xLabel?: string
    k?: number,
    centers?: number[][],
    centersIris?: number[][],
    centersIris2?: number[][],
    trainingData?: InputData[],
    trainingDataIris?: InputData[],
    trainingDataIris2?: InputData[],
};

export const InteractiveClusteringExample: React.FC<InteractiveClusteringExampleType> = ({
    hidden = false,
    xLabel = '',
    yLabel = '',
    k = 2,
    centers = [[0, 0], [50, 50]],
    centersIris = [[2, 2], [7, 5]],
    centersIris2 = [[20, 20], [40, 40]],
    trainingData= trainData,
    trainingDataIris = trainDataIris,
    trainingDataIris2 = trainDataIris2,
}) => {
    const kmeansIrisData = organiseData(trainingDataIris);
    const kmeansData = organiseData(trainingData);
    const kmeansIrisData2 = organiseData(trainingDataIris2)
    const ans0 = kmeans(kmeansData, k, { initialization: centers, maxIterations: 1 }, );
    const ans0iris = kmeans(kmeansIrisData, k, { initialization: centersIris, maxIterations: 1 }, );
    const ans0iris2 = kmeans(kmeansIrisData2, k, { initialization: centersIris2, maxIterations: 1 }, );

    // 0 == original data
    // 1 == iris data
    // 2 == diff iris data
    // change to an int if more datasets
    const [originalDataset, setO] = useState(0);

    const changeO = (nextDataset: number) => {
        if (originalDataset === 0) {
            setX1Idx(ans0iris['centroids'][0].centroid[0]);
            setY1Idx(ans0iris['centroids'][0].centroid[1]);
            setX2Idx(ans0iris['centroids'][1].centroid[0]);
            setY2Idx(ans0iris['centroids'][1].centroid[1]);
        }
        else if(originalDataset === 1) {
            setX1Idx(ans0['centroids'][0].centroid[0]);
            setY1Idx(ans0['centroids'][0].centroid[1]);
            setX2Idx(ans0['centroids'][1].centroid[0]);
            setY2Idx(ans0['centroids'][1].centroid[1]);
        }
        else {
            setX1Idx(ans0iris2['centroids'][0].centroid[0]);
            setY1Idx(ans0iris2['centroids'][0].centroid[1]);
            setX2Idx(ans0iris2['centroids'][1].centroid[0]);
            setY2Idx(ans0iris2['centroids'][1].centroid[1]);
        }

        setO(nextDataset);
    }

    const centersx = (originalDataset === 0 ? ans0['centroids'] : (originalDataset === 1 ? ans0iris['centroids'] : ans0iris2['centroids']));

    // in order to make the chart updateable after moving a center
    const [x1Idx, setX1Idx] = useState(centersx[0].centroid[0]);
    const [y1Idx, setY1Idx] = useState(centersx[0].centroid[1]);
    const [x2Idx, setX2Idx] = useState(centersx[1].centroid[0]);
    const [y2Idx, setY2Idx] = useState(centersx[1].centroid[1]);
    const [addedPoints, setAP]:AddedPointList  = useState([]);
    const [addedPoints2, setAP2]:AddedPointList  = useState([]);
    const [addedPoints3, setAP3]:AddedPointList = useState([]);
    const fakepoints = [{ Driver_ID: 0, Distance_Feature: 0, Speeding_Feature: 0 },
                        { Driver_ID: 0, Distance_Feature: 1, Speeding_Feature: 1 }];
    const [removethese, setRT]:RemoveTheseList = useState([]);
    const [removethese2, setRT2]:RemoveTheseList = useState([]);
    const [removethese3, setRT3]:RemoveTheseList = useState([]);
    const [percentRemove, setPR] = useState(16);
    const [editable, setEdit] = useState(true);
    const [base, setBase] = useState(true);

    // format needed for kmeans()
    const c2 = [[x1Idx, y1Idx], [x2Idx, y2Idx]];

    let trainData2:InputData[] = originalDataset === 0 ? trainData.slice() : (originalDataset === 1 ? trainDataIris.slice() : trainDataIris2.slice())
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

    if (base) {
        if (originalDataset === 0) {
            trainData2 = trainData2.concat(addedPoints)
        }
        else if (originalDataset === 1) {
            trainData2 = trainData2.concat(addedPoints2)
        }
        else {
            trainData2 = trainData2.concat(addedPoints3)
        }
    }
    else {
        if (originalDataset === 0) {
            trainData2 = addedPoints
        }
        else if (originalDataset === 1) {
            trainData2 = addedPoints2
        }
        else {
            trainData2 = addedPoints3
        }
    }

    // where our data is going to be, 'bubble data'
    let bubData: BubbleDataEntry[] = []

    if (trainData2.length >= 2) {
        let ans_x = kmeans(organiseData(trainData2), k, { initialization: c2, maxIterations: 1 }, );
        let data3 = organiseData(trainData2)
        processdata(bubData, ans_x.clusters, c2, hidden, data3, k);
    }
    else {
        let s = trainData2.concat(fakepoints)
        let ans_x = kmeans(organiseData(s), k, { initialization: c2, maxIterations: 1 }, );
        let data3 = organiseData(trainData2)
        let clustersss = trainData2.length === 1 ? [ans_x.clusters[0]] : []
        processdata(bubData, clustersss, c2, hidden, data3, k);
    }

    // data that will be put into the chart
    const data:{datasets: BubbleDataEntry[]} = { datasets : [] };

    Object.entries(bubData).forEach((cluster) => {
        data.datasets.push(cluster[1]);
    });

    for (let i = 0; i < removethese.length; i++) {
        data.datasets[removethese[i].ds_index].data.splice(removethese[i].ind, 1)
    }

    const onDragEnd = (e: React.ChangeEvent, datasetIndex: number, index: number, value: {x: number, y: number}) => {
        if (!e) return;
        if (datasetIndex === 0) {
            setX1Idx(value.x)
            setY1Idx(value.y)
        }
        if (datasetIndex === 1) {
            setX2Idx(value.x)
            setY2Idx(value.y)
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
                    min: originalDataset === 0 ? 0 : (originalDataset === 1 ? 1 : 0),
                    max: originalDataset === 0 ? 120 : (originalDataset === 1 ? 7 : 40),
                }
            }],
            xAxes: [{
                scaleLabel: { display: true, labelString: xLabel, fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#CBD9F2" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#CBD9F2',
                    beginAtZero: true,
                    min: originalDataset === 0 ? 0 : (originalDataset === 1 ? 1 : 0),
                    max: originalDataset === 0 ? 250 : (originalDataset === 1 ? 10 : 100),
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
                const asdgwg = this.chart.getElementAtEvent(evt)[0]
                if (asdgwg) {
                    let ds_index = asdgwg._datasetIndex
                    let ind = asdgwg._index
                    let a:RemoveThese = originalDataset === 0 ? removethese : (originalDataset === 1 ? removethese2 : removethese3)
                    a.push({ds_index, ind})
                    originalDataset === 0 ? setRT(a) : (originalDataset === 1 ? setRT2(a) : setRT3(a))
                    // @ts-ignore
                    setX1Idx(this.chart.data.datasets[0].data[0].x  + 0.1)
                    // @ts-ignore
                    setX1Idx(this.chart.data.datasets[0].data[0].x  - 0.1)
                    return;
                }
                else {
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
                    newX = Math.round(newX)
                    newY = Math.round(newY)

                    if (newX > 0 && newY > 0) {
                        let a:AddedPoint = originalDataset === 0 ? addedPoints : (originalDataset === 1 ? addedPoints2 : addedPoints3)
                        a.push({Driver_ID: 0, Distance_Feature: newX, Speeding_Feature: newY})
                        originalDataset === 0 ? setAP(a) : (originalDataset === 1 ? setAP2(a) : setAP3(a))

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
        animation: {
            duration: 0
        },
    };

    return (
        <div>
            <div>
                <Scatter data={data} options={options}  />
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
                    <button onClick={e => changeO((originalDataset+1) % 3)}>{originalDataset === 0 ? "Current: Original Dataset" : (originalDataset === 1 ? "Current: Iris Sepal Dataset" : "Current: Iris Petal Dataset")}</button>
                </div>

            </div>
        </div>);
};



/* Working example: for debugging */
const App = () => {
    const bubbleData:BubbleDataEntry[] = [];

    // processing for first chart
    // (convert from json to more agreeable format)
    for(let ci = 0; ci < 1; ci++) {
        const newCluster:NewClusterType[] = [];
        for (let ri = 0; ri < trainData.length; ri++) {

            newCluster.push({
                x: trainData[ri].Distance_Feature,
                y: trainData[ri].Speeding_Feature,
                r: 3
            })

        }
        let colour = cluster_colors[ci];
        bubbleData.push({
            label: [`cluster #${ci}`],
            backgroundColor: colour,
            borderColor: colour,
            data: newCluster,
            pointRadius: 5,
        });
    }

    return (
        <div>
            <div className="kmeansgraph">
                <BubbleDataScatter graphdata={bubbleData} />
            </div>
            <div  className="kmeansgraph">
                <InteractiveClusteringExample hidden = {false} />
            </div>
            <div  className="kmeansgraph">
                <InteractiveClusteringExample hidden = {false} />
            </div>
            <p>
                sample text
            </p>
            <div  className="kmeansgraph">
                <KMeansStepExample hidden = {false}/>
            </div>
        </div>
    );
};

export default App;
