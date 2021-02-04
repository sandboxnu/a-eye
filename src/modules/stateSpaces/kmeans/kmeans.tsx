import React from 'react';

import { Scatter } from 'react-chartjs-2';
import trainData from './train.json';

import {
  BubbleDataEntry,
  ScatterData,
  NewClusterType,
  cluster_colors,
} from './utils';

import InteractiveClusteringExample from './interactiveClusteringExample';
import KMeansStepExample from './kmeansStepExample';

// Currently unused, may be out of date
type BubbleDataScatterType = { graphdata: BubbleDataEntry[] };
const BubbleDataScatter: React.FC<BubbleDataScatterType> = ({ graphdata }) => {
  const scatterData: ScatterData = {
    datasets: [
      {
        data: [],
      },
    ],
  };

  // was bubbleData as defined in app
  Object.entries(graphdata).forEach(cluster => {
    Object.entries(cluster[1].data).forEach(point => {
      scatterData.datasets[0].data.push({
        x: point[1].x,
        y: point[1].y,
        pointRadius: 15,
        backgroundColor: '#ef5675',
      });
    });
  });

  const options = {
    showLines: false,
    tooltips: { enabled: false },
    scales: {
      yAxes: [
        {
          scaleLabel: { display: true },
        },
      ],
      xAxes: [
        {
          scaleLabel: { display: true },
        },
      ],
    },
  };
  return <Scatter data={scatterData} options={options} />;
};

/* Working example: for debugging */
const App = () => {
  const bubbleData: BubbleDataEntry[] = [];

  // processing for first chart
  // (convert from json to more agreeable format)
  for (let ci = 0; ci < 1; ci++) {
    const newCluster: NewClusterType[] = [];
    for (let ri = 0; ri < trainData.length; ri++) {
      newCluster.push({
        x: trainData[ri].Distance_Feature,
        y: trainData[ri].Speeding_Feature,
        r: 3,
      });
    }
    const colour = cluster_colors[ci];
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
      <div className="kmeansgraph">
        <InteractiveClusteringExample hidden={false} />
      </div>
      <div className="kmeansgraph">
        <InteractiveClusteringExample hidden={false} />
      </div>
      <p>sample text</p>
      <div className="kmeansgraph">
        <KMeansStepExample hidden={false} />
      </div>
    </div>
  );
};

export default App;
