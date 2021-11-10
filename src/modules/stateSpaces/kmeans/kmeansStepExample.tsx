/* eslint-disable*/
import React, { useState } from 'react';

import { Scatter } from 'react-chartjs-2';
import kmeans from 'ml-kmeans';
import trainData from './train.json';
import trainDataIris from './iris.json';
import trainDataIris2 from './iris2.json';
import {
  InputData,
  organiseData,
  KMeansResult,
  BubbleDataEntry,
  getClasses,
  processdata,
  calculateError,
} from './utils';

type KMeansStepExampleType = {
  hidden: boolean;
  xLabel?: string;
  yLabel?: string;
  k?: number;
  trainingData?: InputData[];
  trainingDataIris?: InputData[];
  trainingDataIris2?: InputData[];
  centers?: number[][];
  centersIris?: number[][];
  centersIris2?: number[][];
};

const KMeansStepExample: React.FC<KMeansStepExampleType> = ({
  hidden = false,
  xLabel = '',
  yLabel = '',
  k = 2,
  trainingData = trainData,
  trainingDataIris = trainDataIris,
  trainingDataIris2 = trainDataIris2,
  centers = [
    [50, 70],
    [50, 80],
  ],
  centersIris = [
    [2, 2],
    [7, 5],
  ],
  centersIris2 = [
    [20, 20],
    [40, 40],
  ],
}) => {
  const kmeansData: number[][] = organiseData(trainingData);
  const kmeansIrisData: number[][] = organiseData(trainingDataIris);

  const ans2: KMeansResult[] = kmeans(kmeansData, k, {
    initialization: centers,
    withIterations: true,
  });
  const ans2iris = kmeans(kmeansIrisData, k, {
    initialization: centersIris,
    withIterations: true,
  });

  const kmeansIrisData2 = organiseData(trainingDataIris2);
  const ans2iris2 = kmeans(kmeansIrisData2, k, {
    initialization: centersIris2,
    withIterations: true,
  });

  const genOut: KMeansResult[] = [];
  // eslint-disable-next-line
  for (const element of ans2) {
    genOut.push(element);
  }

  const genOutIris: KMeansResult[] = [];
  // eslint-disable-next-line
  for (const element of ans2iris) {
    genOutIris.push(element);
  }

  const genOutIris2: KMeansResult[] = [];

  // eslint-disable-next-line
  for (const element of ans2iris2) {
    genOutIris2.push(element);
  }

  const [original, setO]: [number, Function] = useState(0);

  const gen =
    // eslint-disable-next-line
    original === 0 ? genOut : original === 1 ? genOutIris : genOutIris2;
  const [r, setR] = useState(0);
  const changeO = () => {
    setO((original + 1) % 3);
    setR(0);
  };

  if (gen.length === 0) return <div />;

  const bubData: BubbleDataEntry[] = [];
  const data3 =
    // eslint-disable-next-line
    original === 0
      ? organiseData(trainData)
      : original === 1
      ? organiseData(trainDataIris)
      : organiseData(trainDataIris2);
  const cntrdss = gen[r].centroids;
  const c2 = [cntrdss[0].centroid, cntrdss[1].centroid];

  const labels: number[] = getClasses(data3, c2);

  processdata(bubData, labels, c2, hidden, data3, k);

  // data that will be put into the chart
  const data: { datasets: BubbleDataEntry[] } = { datasets: [] };

  Object.entries(bubData).forEach(cluster => {
    data.datasets.push(cluster[1]);
  });

  const error: number[] = calculateError(gen[r]);

  const options = {
    showLines: false,
    tooltips: { enabled: false },
    scales: {
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: yLabel,
            fontSize: 16,
            fontFamily: 'open sans',
            fontStyle: 'italic bold',
            fontColor: '#394D73',
          },
          gridLines: { lineWidth: 3, color: '#8D9DBA' },
          ticks: {
            fontColor: '#394D73',
            beginAtZero: true,
            // eslint-disable-next-line
            min: original === 0 ? 0 : original === 1 ? 1 : 0,
            // eslint-disable-next-line
            max: original === 0 ? 120 : original === 1 ? 7 : 40,
          },
        },
      ],
      xAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: xLabel,
            fontSize: 16,
            fontFamily: 'open sans',
            fontStyle: 'italic bold',
            fontColor: '#394D73',
          },
          gridLines: { lineWidth: 3, color: '#8D9DBA' },
          ticks: {
            fontColor: '#394D73',
            beginAtZero: true,
            // eslint-disable-next-line
            min: original === 0 ? 0 : original === 1 ? 1 : 0,
            // eslint-disable-next-line
            max: original === 0 ? 250 : original === 1 ? 10 : 100,
          },
        },
      ],
    },
    legend: {
      labels: {
        fontSize: 14,
        fontFamily: 'arial',
        fontStyle: 'bold',
        fontColor: '#394D73',
      },
    },
    animation: {
      duration: 0,
    },
  };

  return (
    <div>
      <Scatter data={data} options={options} />
      <div className="flex justify-around mb-8">
        <span className="text-moduleNavy">
          {/* eslint-disable-next-line */}
          Cluster 0 Mean Squared Error: {error[0]}
        </span>
        <span className="text-moduleNavy">
          {/* eslint-disable-next-line */}
          Cluster 1 Mean Squared Error: {error[1]}
        </span>
      </div>
      <div className="text-moduleOffwhite m-3 space-x-2 justify-center space-y-3">
        <div className="flex justify-around rounded w-1/4 mx-auto bg-moduleNavy">
          <button
            type="button"
            onClick={() => setR(prevR => Math.max(prevR - 1, 0))}
            className="rounded mx-auto py-1 hover:text-moduleTeal outline-none"
          >
            <span className="m-auto text-2xl font-thin">−</span>
          </button>
          <div className="md:inline py-2">
            {/* eslint-disable-next-line */}
            Step {r} / {gen.length - 1}
          </div>
          <button
            type="button"
            onClick={() => setR(prevR => Math.min(prevR + 1, gen.length - 1))}
            className="rounded mx-auto py-1 hover:text-moduleTeal outline-none"
          >
            <span className="m-auto text-2xl font-thin">+</span>
          </button>
        </div>
        <div className="flex justify-around rounded bg-transparent">
          <button
            type="button"
            onClick={() => changeO()}
            className="rounded w-1/3 mx-auto px-1 py-2 bg-moduleNavy hover:text-moduleTeal outline-none"
          >
            {/* eslint-disable-next-line */}
            {original === 0
              ? 'Current: Original Dataset'
              : original === 1
              ? 'Current: Iris Sepal Dataset'
              : 'Current: Iris Petal Dataset'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KMeansStepExample;
