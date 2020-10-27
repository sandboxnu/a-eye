import React, { Component, useState } from 'react';
// import './App.css';
// import Chart from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import randomColour from 'randomcolor';
import './kmeans.css';
import trainData from './train.json'; // Training data is already preprocessed
import dragData from 'chartjs-plugin-dragdata';

import kmeans from 'ml-kmeans';


// Data processing
const organiseData = (data) => {
    console.log(data)
  const organisedData = [];
  for (let i = 0; i < data.length; i++) {
    const newRow = [];
    const curRow = data[i];
    newRow.push(curRow.Distance_Feature);
    newRow.push(curRow.Speeding_Feature);
    organisedData.push(newRow);
  }
  console.log(organisedData)
  return organisedData;
}


// console.log(clusters)
let dataa = organiseData(trainData)
// let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
let centers = [[0, 0], [50, 50]];
let k = 2
let ans0 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 1 }, );
let ans100 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 100 }, );
let ans1 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 2 }, );
console.log(ans100['clusters']);

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
class ScatterChart extends Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.data = props['props']
    this.chartReference = React.createRef();

  }
  setState() {
    console.log("hi")
  }

  render() {
    return (<MyScatter2 datasetsx={this.data} />)
  }
}

const MyScatter2 =
(props) => {
  
  let state = 3
  function changeState(x) {
    state = x
  }
  
  // in order to make the chart updateable after moving a center
  const [x1Idx, setX1Idx] = useState(props.cntrds[0].centroid[0]);
  const [y1Idx, setY1Idx] = useState(props.cntrds[0].centroid[1]);
  const [x2Idx, setX2Idx] = useState(props.cntrds[1].centroid[0]);
  const [y2Idx, setY2Idx] = useState(props.cntrds[1].centroid[1]);
  const [addedPoints, setAP]  = useState([]);


  // format needed for kmeans()
  let c2 = [[x1Idx, y1Idx], [x2Idx, y2Idx]];
  console.log(trainData, addedPoints)
  let trainData2 = trainData.concat(addedPoints)
  console.log(trainData2)

  // where our data is going to be, 'bubble data'
  let bubData = []

  let ans_x = kmeans(organiseData(trainData2), k, { initialization: c2, maxIterations: 1 }, );
  // process data mutates the first argument
  let data3 = organiseData(trainData2)
  processdata(bubData, ans_x.clusters, c2, props.hidden, data3)

  
  // data that will be put into the chart
  const data = { datasets : [] };

  Object.entries(bubData).forEach((cluster) => {
    data.datasets.push(
      cluster[1]      
    )
  })

  

  const options = {
      showLines: false,
      dragData: true,
      dragX: true,
      dragDataRound: 0, 
      // hover: {
      //   onHover: function(e) {
      //     // indicate that a datapoint is draggable by showing the 'grab' cursor when hovered
      //     const point = this.getElementAtEvent(e)
      //     if (point.length) e.target.style.cursor = 'grab'
      //     else e.target.style.cursor = 'default'

      //   }
      // },
      onClick : function (evt, item) {
        // console.log(evt);
        // // const myChartRef = chartRef.current.getContext("2d");
        // console.log(this);
        // console.log(evt.x - 737, 140 - evt.y)
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
        console.log(a)
        a.push({Driver_ID: 0, Distance_Feature: newX, Speeding_Feature: newY})
        console.log(a)
        setAP(a)
      },
      onDragEnd: function (e, datasetIndex, index, value) {
        console.log(value)
        console.log(datasetIndex, index)
        if (datasetIndex == 0) {
          setX1Idx(value.x)
          setY1Idx(value.y)
        }
        if (datasetIndex == 1) {
          setX2Idx(value.x)
          setY2Idx(value.y)
        }
        e.target.style.cursor = 'default'
        // where e = event
        
      },
      tooltips: { enabled: false },
      scales: {
          yAxes: [{
              scaleLabel: { display: true }
          }],
          xAxes: [{
              scaleLabel: { display: true }
          }],
      },
      animation: {
        duration: 0
    }
  };
  return (<Scatter data={data} options={options}  />);
};



const bubbleData = [];

// processing for first chart
// (convert from json to more agreeable format)
for(let ci = 0; ci < 1; ci++) {
  const newCluster = [];
  for (let ri = 0; ri < trainData.length; ri++) {
    // console.log(trainData[ri].Driver_ID)
    
    newCluster.push({
      x: trainData[ri].Distance_Feature,
      y: trainData[ri].Speeding_Feature,
      r: 3
    })

  }
  let colour = cl_colors[ci];
  console.log(colour)
  bubbleData.push({
    label: [`Cluster #${ci}`],
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
      label: [`Center #${c  }`],
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
      label: [`Cluster #${ci}`],
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
        <MyScatter2 clstrs ={ans100['clusters']} cntrds = {ans100['centroids']} hidden = {true} />
      </div> 

    </div>
  );
}

export default App;
