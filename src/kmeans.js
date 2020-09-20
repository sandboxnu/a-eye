import React, { Component, useState } from 'react';
// import './App.css';
// import Chart from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import randomColour from 'randomcolor';
import { KMeans } from 'machinelearn/cluster';
import './kmeans.css';
import trainData from './train.json'; // Training data is already preprocessed
import dragData from 'chartjs-plugin-dragdata';

import kmeans from 'ml-kmeans';


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


// console.log(clusters)
let data = organiseData(trainData)
// let data = [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]];
let centers = [[0, 0], [50, 50]];
let k = 2
let ans0 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 1 }, );
let ans100 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 100 }, );
let ans1 = kmeans(organiseData(trainData), k, { initialization: centers, maxIterations: 2 }, );
console.log(ans0);




const MyScatter =
    (graphdata) => {
        
        const data = { datasets : [{ 
          data: []
        }] };
        
        console.log(data)
        Object.entries(bubbleData).forEach((cluster) => {
          Object.entries(cluster[1].data).forEach((point) => {
            // console.log(point[1])
            data.datasets[0].data.push({
              x: point[1].x,
              y: point[1].y,
              // fill: false,
              pointRadius: 1,
              backgroundColor: '#ef5675',
              // data: {x: point[1].x, y: point[1].y}
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
(datasetsx) => {
  console.log(datasetsx)
  const [x1Idx, setX1Idx] = useState(centers[0][0]);
  // console.log(x1Idx)
  let x = 1
  
  const [y1Idx, setY1Idx] = useState(centers[0][1]);
  const [x2Idx, setX2Idx] = useState(centers[1][0]);
  const [y2Idx, setY2Idx] = useState(centers[1][1]);
  // let curr_centers = [[x1Idx, y1Idx], [x2Idx, y2Idx]]
  // console.log(x2Idx)
  // console.log(y2Idx)
  // const data = datasets
  const data = { datasets : [] };
  // console.log()
  console.log(datasetsx['datasetsx'])
  Object.entries(datasetsx['datasetsx']).forEach((cluster) => {
    console.log(cluster[1])
    // console.log(x)
    data.datasets.push(
      cluster[1]
      
    )
  })

  

  // console.log(data)
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
      onDragEnd: function (e, datasetIndex, index, value) {
        console.log(value)
        console.log(datasetIndex)
        setX1Idx(value['x'])
        // x = 
        // console.log(x)
        console.log(x1Idx)
        // restore default cursor style upon drag release
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
      }
  };
  // console.log(options)
  return (<Scatter data={data} options={options}  />);
};
// let centers = [[1, 2], [10, 10]];




const bubbleData = [];

// processing for first chart
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
  const colour = randomColour();
  // console.log(colour)
  bubbleData.push({
    label: [`Cluster #${ci}`],
    backgroundColor: colour,
    borderColor: colour,
    data: newCluster,
  });
}






// console.log(bubbleData1)

const bubbleData2 = [];
const bubbleData3 = [];

function processdata(bdata, clsters, cntroids) {
  console.log(cntroids)
  for (let c = 0; c < cntroids.length; c++ ){
    const newCluster = [];
    newCluster.push({
      x: cntroids[c]['centroid'][0],
      y: cntroids[c]['centroid'][1],
      r: 3
    })
    console.log(cntroids[c]['centroid'])
    const colour = '#FF0000';
    bdata.push({
      label: [`Center #${c  }`],
      backgroundColor: colour,
      borderColor: colour,
      data: newCluster
    });
  }

  for (let ci = 0; ci < k; ci++) {
    const newCluster= [];
    for (let ri = 0; ri < clsters.length; ri++){
      if (clsters[ri] == ci) {
        newCluster.push({
          x: data[ri][0],
          y: data[ri][1],
          r: 3
        })
      }
    }

    const colour = randomColour();
    bdata.push({
      label: [`Cluster #${ci}`],
      backgroundColor: colour,
      borderColor: colour,
      data: newCluster,
      dragData: false
    });
  }

  

  // // add centers
  // Object.entries(centers).forEach((c) => {
  //   console.log(c)
  //   data.datasets.data.push({
  //     x: c[1][0],
  //     y: c[1][1],
  //     backgroundColor: '#FF0000'
  //   })
  // })
}
processdata(bubbleData3, ans100['clusters'], ans100['centroids'])
processdata(bubbleData2, ans1['clusters'], ans0['centroids'])
// for(let ci = 0; ci < clusters2.length; ci++) {
//   const cluster: any[] = clusters2[ci];
//   const newCluster = [];
//   for (let ri = 0; ri < cluster.length; ri++) {
//     const row = cluster[ri];
//     newCluster.push({
//       x: row[0],
//       y: row[1],
//       r: 3,
//     })
//   }
//   const colour = randomColour();
//   bubbleData2.push({
//     label: [`Cluster #${ci}`],
//     backgroundColor: colour,
//     borderColor: colour,
//     data: newCluster
//   });
// }
// console.log(bubbleData2)

/////////////////////////////////////
const data2 = { datasets : [{ 
  data: []
}] };
Object.entries(bubbleData).forEach((cluster) => {
  Object.entries(cluster[1].data).forEach((point) => {
    // console.log(point[1])
    data2.datasets[0].data.push({
      x: point[1].x,
      y: point[1].y,
      fill: false,
      pointRadius: 1,
      backgroundColor: '#ef5675',
      // data: {x: point[1].x, y: point[1].y}
  });
  
  });
})

function App() {
  return (
    <div>
      <div className="kmeansgraph">
        <MyScatter graphdata={bubbleData} />
      </div>
      <div  className="kmeansgraph">
        <MyScatter2 datasetsx={bubbleData2} centers={centers}/>
      </div>
      <div  className="kmeansgraph">
        <MyScatter2 datasetsx={bubbleData3} centers={centers} />
      </div> 
      <div>
        <ScatterChart props={bubbleData2} />
      </div>
    </div>
  );
}

export default App;
