import React, { Component, useState, useEffect } from 'react';
// import './App.css';
// import Chart from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import randomColour from 'randomcolor';
import './kmeans.css';
import trainData from './train.json';
import trainDataIris from './iris.json';
import trainDataIris2 from './iris2.json'; 
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
        if (i == 0) {
            console.log(curRow)
            
        }
        if (curRow.hasOwnProperty('Distance_Feature')) {
            newRow.push(curRow.Distance_Feature);
            newRow.push(curRow.Speeding_Feature);
            // console.log('1')
        }
        else if (curRow.hasOwnProperty('sepalLength')) {
            newRow.push(curRow.sepalLength);
            newRow.push(curRow.sepalWidth);
            // console.log('2')
        }
        else {

            newRow.push(curRow.petalLength * 10);
            newRow.push(curRow.petalWidth * 10);
            // console.log('3');
        }
        organisedData.push(newRow);
    }
    console.log(organisedData)
    return organisedData;
}

// let dataa = organiseData(trainData)
let centers = [[0, 0], [50, 50]];
let k = 2
// trainData = trainDataIris
let ans0 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 1 }, );
let ans100 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 100 }, );
let ans1 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 2 }, );
let centers2 = [[50, 70], [50, 80]];
let ans2 = kmeans(organiseData(trainData), k, { initialization: centers2, withIterations: true }, );

// trainDataIris
let centersIris = [[2, 2], [7, 5]];
// let k = 2
console.log(trainDataIris)
let ans0iris = kmeans(organiseData(trainDataIris), k, { initialization: centersIris, maxIterations: 1 }, );
// let ans100iris = kmeans(organiseData(trainData), k, { initialization: centersIris, maxIterations: 100 }, );
let ans1iris = kmeans(organiseData(trainDataIris), k, { initialization: centersIris, maxIterations: 2 }, );
let ans2iris = kmeans(organiseData(trainDataIris), k, { initialization: centersIris, withIterations: true }, );
// let centers2Iris = [[50, 70], [50, 80]];
// let ans2iris = kmeans(organiseData(trainData), k, { initialization: centersIris, withIterations: true }, );

let centersIris2 = [[20, 20], [40, 40]]
let ans0iris2 = kmeans(organiseData(trainDataIris2), k, { initialization: centersIris2, maxIterations: 1 }, );

let ans1iris2 = kmeans(organiseData(trainDataIris2), k, { initialization: centersIris2, maxIterations: 2 }, );
let ans2iris2 = kmeans(organiseData(trainDataIris2), k, { initialization: centersIris2, withIterations: true }, );

let gen_out = [];
for (const element of ans2) {
    gen_out.push(element);
}

let gen_outIris = [];
for (const element of ans2iris) {
    gen_outIris.push(element);
}

let gen_outIris2 = [];
for (const element of ans2iris2) {
    gen_outIris2.push(element);
}

console.log(gen_out, gen_outIris, gen_outIris2)

export const MyDemo = (props) => {
    const [original, setO] = useState(0);
    

    let gen = original == 0 ? gen_out : (original == 1 ? gen_outIris : gen_outIris2)
    const [r, setR] = useState(0);
    const changeO = () => {
        setO((original+1) % 3)
        setR(0)
        return;
    }

    if (gen.length === 0) return <div></div>;

    let bubData = []
    let data3 = original == 0 ? organiseData(trainData) : (original == 1 ? organiseData(trainDataIris) : organiseData(trainDataIris2))
    //console.log('GEN OUT: ' + gen_out);
    //console.log(gen_out[r].centroids)
    //console.log(data3)
    let cntrdss = gen[r].centroids
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
                    min: original == 0 ? 0 : (original == 1 ? 1 : 0),
                    max: original == 0 ? 120 : (original == 1 ? 7 : 40),
                }
            }],
            xAxes: [{
                scaleLabel: { display: true, labelString: props.xLabel || "", fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#394D73" },
                gridLines: {lineWidth: 3, color: '#8D9DBA'},
                ticks: {
                    fontColor: '#394D73',
                    beginAtZero: true,
                    min: original == 0 ? 0 : (original == 1 ? 1 : 0),
                    max: original == 0 ? 250 : (original == 1 ? 10 : 100), 
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
    // TODO how do I add space between the buttons
    return (
        <div>
            <Scatter data={data} options={options}/>
            <div className="text-moduleOffwhite m-3 -mt-2 space-x-2 inline">
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
                <div className="mx-auto rounded w-1/4 bg-moduleNavy">
                    <button onClick={e => changeO()}
                            className="py-1 hover:text-moduleTeal">
                        {original == 0 ? "Current: Original Dataset" : (original == 1 ? "Current: Iris Sepal Dataset" : "Current: Iris Petal Dataset")}
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
// center borders
let cb_colors = ['#004E00', '#00007D' ]
//#dd0303 red
// #e76a04 orange

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
                    pointRadius: 15,
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

        // 0 == original data
        // 1 == iris data
        // 2 == diff iris data
        // change to an int if more datasets
        const [original, setO] = useState(0);

        // ans0['centroids']
        // ans0iris['centroids']
        const changeO = (props) => {
            let c = null;
            // not sure why this is backwards
            if (original == 0) {
                setX1Idx(ans0iris['centroids'][0].centroid[0]);
                setY1Idx(ans0iris['centroids'][0].centroid[1]);
                setX2Idx(ans0iris['centroids'][1].centroid[0]);
                setY2Idx(ans0iris['centroids'][1].centroid[1]);
            } 
            else if(original == 1) {
                // console.log(centers)
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
            
            setO(props)
        }

        // console.log(ans0['centroids'])
        // console.log(ans0iris['centroids'])
        let centersx = (original == 0 ? ans0['centroids'] : (original == 1 ? ans0iris['centroids'] : ans0iris2['centroids']))
        // console.log(centers, original)

        // in order to make the chart updateable after moving a center
        const [x1Idx, setX1Idx] = useState(centersx[0].centroid[0]);
        const [y1Idx, setY1Idx] = useState(centersx[0].centroid[1]);
        const [x2Idx, setX2Idx] = useState(centersx[1].centroid[0]);
        const [y2Idx, setY2Idx] = useState(centersx[1].centroid[1]);
        const [addedPoints, setAP]  = useState([]);
        const [addedPoints2, setAP2]  = useState([]);
        const [addedPoints3, setAP3] = useState([]);
        const fakepoints = [{ Driver_ID: 0, Distance_Feature: 0, Speeding_Feature: 0 },
            { Driver_ID: 0, Distance_Feature: 1, Speeding_Feature: 1 }];
        const [removethese, setRT] = useState([]);
        const [removethese2, setRT2] = useState([]);
        const [removethese3, setRT3] = useState([]);
        const [percentRemove, setPR] = useState(16);
        const [editable, setEdit] = useState(true);
        const [base, setBase] = useState(true);
        

        // format needed for kmeans()
        let c2 = [[x1Idx, y1Idx], [x2Idx, y2Idx]];
        console.log(c2, original)
        // console.log(trainData, addedPoints)

        // console.log(addedPoints)
            
        let trainData2 = original == 0 ? trainData.slice() : (original == 1 ? trainDataIris.slice() : trainDataIris2.slice())
        if (original == 0) {
            for (let i = trainData2.length; i > 0; i--) {
                if (i % 20 == 0) {
                    trainData2.splice(i, percentRemove)
                }
            }
        }
        else {
            for (let i = trainData2.length; i > 0; i--) {
                if (i % 4 == 0) {
                    trainData2.splice(i, percentRemove - 16)
                }
            }
        }

        // trainData2 = base ? trainData2.concat(addedPoints) : addedPoints

        if (base) {
            if (original == 0) {
                trainData2 = trainData2.concat(addedPoints)
            }
            else if (original == 1) {
                trainData2 = trainData2.concat(addedPoints2)
            }
            else {
                trainData2 = trainData2.concat(addedPoints3)
            }
        }
        else {
            if (original == 0) {
                trainData2 = addedPoints
            }
            else if (original == 1) {
                trainData2 = addedPoints2
            }
            else {
                trainData2 = addedPoints3
            }
        }

        // where our data is going to be, 'bubble data'
        let bubData = []

        if (trainData2.length >= 2) {
            console.log(organiseData(trainData2))
            let ans_x = kmeans(organiseData(trainData2), k, { initialization: c2, maxIterations: 1 }, );
            let data3 = organiseData(trainData2)
            processdata(bubData, ans_x.clusters, c2, props.hidden, data3)
        }
        else {
            // console.log(organiseData(trainData2.concat(fakepoints)))
            // console.log(c2)
            // console.log(organiseData(trainData2.concat(fakepoints)))
            let s = trainData2.concat(fakepoints)
            console.log(s)
            console.log(organiseData(s))
            let ans_x = kmeans(organiseData(s), k, { initialization: c2, maxIterations: 1 }, );
            let data3 = organiseData(trainData2)
            let clustersss = trainData2.length == 1 ? [ans_x.clusters[0]] : []
            processdata(bubData, clustersss, c2, props.hidden, data3)
        }

        // data that will be put into the chart
        const data = { datasets : [] };

        Object.entries(bubData).forEach((cluster) => {
            // console.log(cluster)
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
                        min: original == 0 ? 0 : (original == 1 ? 1 : 0),
                        max: original == 0 ? 120 : (original == 1 ? 7 : 40),
                    }
                }],
                xAxes: [{
                    scaleLabel: { display: true, labelString: props.xLabel || "", fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: "#CBD9F2" },
                    gridLines: {lineWidth: 3, color: '#8D9DBA'},
                    ticks: {
                        fontColor: '#CBD9F2',
                        beginAtZero: true,
                        min: original == 0 ? 0 : (original == 1 ? 1 : 0),
                        max: original == 0 ? 250 : (original == 1 ? 10 : 100),   
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
                        let a = original == 0 ? removethese : (original == 1 ? removethese2 : removethese3)
                        a.push({ds_index, ind})
                        original == 0 ? setRT(a) : (original == 1 ? setRT2(a) : setRT3(a))

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
                        if (newX > 0 && newY > 0) {

                        
                            let a = original == 0 ? addedPoints : (original == 1 ? addedPoints2 : addedPoints3)
                            a.push({Driver_ID: 0, Distance_Feature: newX, Speeding_Feature: newY})
                            original == 0 ? setAP(a) : (original == 1 ? setAP2(a) : setAP3(a))

                            // turn a blind eye here
                            setX1Idx(this.chart.data.datasets[0].data[0].x  + 0.1)
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
                        <button className={ percentRemove===19 && "selected"} onClick={e => setPR(19)}>A Fourth of the Points</button>
                        <button className={ percentRemove===18 && "selected"} onClick={e => setPR(18)}>Half of the Points</button>
                        <button className={ percentRemove===16 && "selected"}  onClick={e => setPR(16)}>All of the Points</button>
                    </div>
                    <div className="axis-selector inline">
                        <button style={{color:'white'}} onClick={e => setBase(!base)}> {base ? "Show Only Custom" : "Show Full Dataset"}</button>
                        <button style={{color:'white'}} onClick={e => setEdit(!editable)} > {editable ? "Disable Editing" : "Enable Editing"} </button>
                        <button onClick={e => changeO((original+1) % 3)}>{original == 0 ? "Current: Original Dataset" : (original == 1 ? "Current: Iris Sepal Dataset" : "Current: Iris Petal Dataset")}</button>
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
    // console.log(colour)
    bubbleData.push({
        label: [`cluster #${ci}`],
        backgroundColor: colour,
        borderColor: colour,
        data: newCluster,
        pointRadius: 5,
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
        let cb = cb_colors[c];
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

export const config = {ans0, ans1, ans2, ans0iris, ans1iris};

export default App;
