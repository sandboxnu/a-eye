import React, { Component, useState, useEffect } from 'react';
// import './App.css';
// import Chart from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import randomColour from 'randomcolor';
import './kmeans.css';
import trainData from './train.json';
import dragData from 'chartjs-plugin-dragdata';

import kmeans from 'ml-kmeans';
import { squaredEuclidean } from 'ml-distance-euclidean';

function getClasses(data, centers) {
    // data is a array of points
    // centers are two centers
    // return array of labels (which its closer to), 0 for first center, 1 for second center
    return data.map(x => squaredEuclidean(x, centers[0]) > squaredEuclidean(x, centers[1]) ? 1 : 0);
}

// Data processing
const organiseData = (data) => {
    const organisedData = [];
    for (let i = 0; i < data.length; i++) {
        const newRow = [];
        const curRow = data[i];
        newRow.push(curRow.Distance_Feature);
        newRow.push(curRow.Speeding_Feature);
        organisedData.push(newRow);
    }
    return organisedData;
}

let dataa = organiseData(trainData)
let centers = [[0, 0], [50, 50]];
let k = 2
let ans0 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 1 }, );
let ans100 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 100 }, );
let ans1 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 2 }, );
let centers2 = [[50, 70], [50, 80]];
let ans2 = kmeans(organiseData(trainData), k, { initialization: centers2, withIterations: true }, );
console.log(ans2)
// console.log(ans2.next())

let gen_out = [];
for (const element of ans2) {
    gen_out.push(element);
}

export const MyDemo = (props) => {
    const [r, setR] = useState(2);

    if (gen_out.length === 0) return <div></div>;

    let bubData = []
    let data3 = organiseData(trainData)
    //console.log('GEN OUT: ' + gen_out);
    //console.log(gen_out[r].centroids)
    //console.log(data3)
    let cntrdss = gen_out[r].centroids
    let c2 = [cntrdss[0].centroid, cntrdss[1].centroid];

    let labels = getClasses(data3, c2)
    //console.log(labels)

    processdata(bubData, labels, c2, props.hidden, data3)
    //console.log(bubData)

    // data that will be put into the chart
    const data = {datasets: []};

    Object.entries(bubData).forEach((cluster) => {
        //console.log(cluster[1])
        data.datasets.push(
            cluster[1]
        )
    })

    const options = {
        showLines: false,
        tooltips: {enabled: false},
        scales: {
            yAxes: [{
                scaleLabel: { display: true, labelString: props.yLabel || "", fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#394D73" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#394D73',
                    beginAtZero: true,
                    min: 0,
                    max: 120
                }
            }],
            xAxes: [{
                scaleLabel: { display: true, labelString: props.xLabel || "", fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#394D73" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#394D73',
                    beginAtZero: true,
                    min: 0,
                    max: 250
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
            <div className="text-moduleOffwhite m-3 -mt-2">
                <div className="flex justify-around rounded w-1/4 mx-auto bg-moduleNavy">
                    <button onClick={() => setR(prevR => Math.max(prevR - 1, 0))}
                            className="rounded mx-auto py-1 hover:text-moduleTeal outline-none">
                        <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <div className="md:inline py-2">Step {r}/4</div>
                    <button onClick={() => setR(prevR => Math.min(prevR + 1, 4))}
                            className="rounded mx-auto py-1 hover:text-moduleTeal outline-none">
                        <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

// cluster colors
let cl_colors = ['#99FF99', '#99CCFF']
// center
let c_colors = ['#3cb450', "#5360fc"]

const MyScatter =
    (graphdata) => {

        const data = { datasets : [{
                data: []
            }] };

        Object.entries(bubbleData).forEach((cluster) => {
            Object.entries(cluster[1].data).forEach((point) => {
                data.datasets[0].data.push({
                    x: point[1].x,
                    y: point[1].y,
                    // fill: false,
                    pointRadius: 1,
                    backgroundColor: '#ef5675',
                });

            });
        })


        console.log(data)
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
        return (<Scatter data={data} options={options} />);
    };



export const MyScatter2 = (props) => {
        // in order to make the chart updateable after moving a center
        const [x1Idx, setX1Idx] = useState(props.cntrds[0].centroid[0]);
        const [y1Idx, setY1Idx] = useState(props.cntrds[0].centroid[1]);
        const [x2Idx, setX2Idx] = useState(props.cntrds[1].centroid[0]);
        const [y2Idx, setY2Idx] = useState(props.cntrds[1].centroid[1]);
        const [addedPoints, setAP]  = useState([]);
        const fakepoints = [{ Driver_ID: 0, Distance_Feature: 0, Speeding_Feature: 0 },
            { Driver_ID: 0, Distance_Feature: 1, Speeding_Feature: 1 }];
        const [removethese, setRT] = useState([]);
        const [percentRemove, setPR] = useState(0);
        const [editable, setEdit] = useState(true);
        const [base, setBase] = useState(true);

        // format needed for kmeans()
        let c2 = [[x1Idx, y1Idx], [x2Idx, y2Idx]];
        // console.log(trainData, addedPoints)

        console.log(addedPoints)

        let trainData2 = trainData.slice()

        for (let i = trainData2.length; i > 0; i--) {
            if (i % 10 == 0) {
                trainData2.splice(i, percentRemove)
            }
        }

        trainData2 = base ? trainData2.concat(addedPoints) : addedPoints

        // where our data is going to be, 'bubble data'
        let bubData = []

        if (trainData2.length >= 2) {
            let ans_x = kmeans(organiseData(trainData2), k, { initialization: c2, maxIterations: 1 }, );
            let data3 = organiseData(trainData2)
            processdata(bubData, ans_x.clusters, c2, props.hidden, data3)
        }
        else {
            let ans_x = kmeans(organiseData(trainData2.concat(fakepoints)), k, { initialization: c2, maxIterations: 1 }, );
            let data3 = organiseData(trainData2)
            let clustersss = trainData2.length == 1 ? [ans_x.clusters[0]] : []
            processdata(bubData, clustersss, c2, props.hidden, data3)
        }

        // data that will be put into the chart
        const data = { datasets : [] };

        Object.entries(bubData).forEach((cluster) => {
            data.datasets.push(
                cluster[1]
            )
        })

        for (let i = 0; i < removethese.length; i++) {
            data.datasets[removethese[i].ds_index].data.splice(removethese[i].ind, 1)
        }

        const onDragEnd = (e, datasetIndex, index, value) => {
            if (!e) return;
            if (datasetIndex == 0) {
                setX1Idx(value.x)
                setY1Idx(value.y)
            }
            if (datasetIndex == 1) {
                setX2Idx(value.x)
                setY2Idx(value.y)
            }

        }

        const options = {
            showLines: false,
            tooltips: { enabled: false },
            scales: {
                yAxes: [{
                    scaleLabel: { display: true, labelString: props.yLabel || "", fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#CBD9F2" },
                    gridLines: {lineWidth: 3, color: '#8D9DBA'},
                    ticks: {
                        fontColor: '#CBD9F2',
                        beginAtZero: true,
                        min: 0,
                        max: 120
                    }
                }],
                xAxes: [{
                    scaleLabel: { display: true, labelString: props.xLabel || "", fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#CBD9F2" },
                    gridLines: {lineWidth: 3, color: '#8D9DBA'},
                    ticks: {
                        fontColor: '#CBD9F2',
                        beginAtZero: true,
                        min: 0,
                        max: 250
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
            onClick : function (evt, item) {
                if (editable) {

                    const asdgwg = this.chart.getElementAtEvent(evt)[0]
                    if (asdgwg) {
                        let ds_index = asdgwg._datasetIndex
                        let ind = asdgwg._index
                        let a = removethese
                        a.push({ds_index, ind})
                        setRT(a)

                        setX1Idx(this.chart.data.datasets[0].data[0].x  + 0.1)
                        setX1Idx(this.chart.data.datasets[0].data[0].x  - 0.1)
                        return;
                    }
                    else {
                        var yTop = this.chartArea.top;
                        var yBottom = this.chartArea.bottom;

                        var yMin = this.scales['y-axis-1'].min;
                        var yMax = this.scales['y-axis-1'].max;
                        var newY = 0;

                        if (evt.offsetY <= yBottom && evt.offsetY >= yTop) {
                            newY = Math.abs((evt.offsetY - yTop) / (yBottom - yTop));
                            newY = (newY - 1) * -1;
                            newY = newY * (Math.abs(yMax - yMin)) + yMin;
                        };

                        var xTop = this.chartArea.left;
                        var xBottom = this.chartArea.right;
                        var xMin = this.scales['x-axis-1'].min;
                        var xMax = this.scales['x-axis-1'].max;
                        var newX = 0;

                        if (evt.offsetX <= xBottom && evt.offsetX >= xTop) {
                            newX = Math.abs((evt.offsetX - xTop) / (xBottom - xTop));
                            newX = newX * (Math.abs(xMax - xMin)) + xMin;
                        };
                        newX = Math.round(newX)
                        newY = Math.round(newY)

                        console.log(newX, newY);
                        let a = addedPoints
                        a.push({Driver_ID: 0, Distance_Feature: newX, Speeding_Feature: newY})
                        setAP(a)

                        // turn a blind eye here
                        setX1Idx(this.chart.data.datasets[0].data[0].x  + 0.1)
                        setX1Idx(this.chart.data.datasets[0].data[0].x  - 0.1)


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
                        <button className={ percentRemove===8 && "selected"} onClick={e => setPR(8)}>A Fifth of the Points</button>
                        <button className={ percentRemove===5 && "selected"} onClick={e => setPR(5)}>Half of the Points</button>
                        <button className={ percentRemove===0 && "selected"}  onClick={e => setPR(0)}>All of the Points</button>
                    </div>
                    <div className="axis-selector inline">
                        <button style={{color:'white'}} onClick={e => setBase(!base)}> {base ? "Show Only Custom" : "Show Full Dataset"}</button>
                        <button style={{color:'white'}} onClick={e => setEdit(!editable)} > {editable ? "Disable Editing" : "Enable Editing"} </button>
                    </div>

                </div>
            </div>);
    };



const bubbleData = [];

// processing for first chart
// (convert from json to more agreeable format)
for(let ci = 0; ci < 1; ci++) {
    const newCluster = [];
    for (let ri = 0; ri < trainData.length; ri++) {

        newCluster.push({
            x: trainData[ri].Distance_Feature,
            y: trainData[ri].Speeding_Feature,
            r: 3
        })

    }
    let colour = cl_colors[ci];
    console.log(colour)
    bubbleData.push({
        label: [`cluster #${ci}`],
        backgroundColor: colour,
        borderColor: colour,
        data: newCluster,
    });
}


// processing for second and third chart
function processdata(bdata, clsters, cntroids, hidden, data3) {

    // add centers
    for (let c = 0; c < cntroids.length; c++ ){
        const newCluster = [];
        newCluster.push({
            x: cntroids[c][0],
            y: cntroids[c][1],
            r: 3
        })

        let colour = c_colors[c];
        bdata.push({
            label: [`center ${c }`],
            backgroundColor: colour,
            borderColor: colour,
            data: newCluster,
            hidden: hidden
        });
    }

    // add clusters
    for (let ci = 0; ci < k; ci++) {
        const newCluster= [];
        for (let ri = 0; ri < clsters.length; ri++){
            if (clsters[ri] == ci) {
                newCluster.push({
                    x: data3[ri][0],
                    y: data3[ri][1],
                    r: 3
                })
            }
        }

        const colour = cl_colors[ci];
        bdata.push({
            label: [`cluster ${ci}`],
            backgroundColor: colour,
            borderColor: colour,
            data: newCluster,
            dragData: false
        });
    }

}


function App() {
    return (
        <div>
            <div className="kmeansgraph">
                <MyScatter graphdata={bubbleData} />
            </div>
            <div  className="kmeansgraph">
                <MyScatter2 clstrs ={ans1['clusters']} cntrds = {ans0['centroids']} hidden = {false} />
            </div>
            <div  className="kmeansgraph">
                <MyScatter2 clstrs ={ans100['clusters']} cntrds = {ans100['centroids']} hidden = {false} />
            </div>
            <p>
                In the first plot, we can see all the points laid out on the scatterplot diagram. This represents the initial state of the kmeans
                algorithm, where we haven't split the points into separate groups yet. In the second diagram, we have the kmeans algorithm
                in its first step, where there are 2 centers (since k=2) in a random spot on the chart - these are the darker colored points.
                All the data points are colored according to which center they are closest to. Feel free to add/remove points by clicking in different
                place on the graph. For each iteration of kmeans, the centers are repositioned to the center of all the data points that belong to it.
                You can do this yourself! As you drag the centers around, notice the
                data points may be recolored, they change color based on where the centers are repositioned to. Each loop of kmeans involves repositioning
                each center once, and then repeating until they converge (stop moving). In the last plot, you can see where the centers converge to - see if
                you can do it yourself and get the same result!
            </p>
            <div  className="kmeansgraph">
                <MyDemo kmeans_gen={ans2} hidden = {false}/>
            </div>
        </div>
    );
}

export const config = {ans0, ans1, ans2};

export default App;