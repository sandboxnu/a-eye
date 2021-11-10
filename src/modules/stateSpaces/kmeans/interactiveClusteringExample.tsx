/* eslint-disable*/
/* eslint-disable react/no-this-in-sfc  */
/* eslint-disable no-underscore-dangle */
// must disable due to referencing the inside of the chart
import React, { useState } from 'react';

import dragData from 'chartjs-plugin-dragdata';
import { Scatter } from 'react-chartjs-2';
import kmeans from 'ml-kmeans';
import trainData from './train.json';
import trainDataIris from './iris.json';
import trainDataIris2 from './iris2.json';
import titanicData from './titanic.json';
import './chartjs-plugin-dragdata.d';

import {
  organiseData,
  InputData,
  AddedPointList,
  PointToRemove,
  PointToRemoveList,
  BubbleDataEntry,
  processdata,
  AddedPoint,
  KMeansResult,
} from './utils';

type InteractiveClusteringExampleType = {
  hidden: boolean;
  yLabel?: string;
  xLabel?: string;
  k?: number;
  centersList?: number[][][];
  trainingDatasets?: InputData[][];
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
  trainingDatasets = [trainData, trainDataIris, trainDataIris2, titanicData],
  centersList = [
    [
      [0, 0],
      [50, 50],
    ],
    [
      [2, 2],
      [7, 5],
    ],
    [
      [20, 20],
      [40, 40],
    ],
    [
      [10, 10],
      [40, 40],
    ],
  ],
}) => {
  const organizedDatasets = [];
  // TODO
  // eslint-disable-next-line
  for (const dataset of trainingDatasets) {
    organizedDatasets.push(organiseData(dataset));
  }

  const kmeansAnswers: KMeansResult[] = [];
  for (let i = 0; i < trainingDatasets.length; i += 1) {
    kmeansAnswers.push(
      kmeans(organizedDatasets[i], k, {
        initialization: centersList[i],
        maxIterations: 1,
      }),
    );
  }

  const [originalDataset, setO] = useState(0);

  const centersx = kmeansAnswers[originalDataset].centroids;

  // in order to make the chart updateable after moving a center
  const [x1Idx, setX1Idx] = useState(centersx[0].centroid[0]);
  const [y1Idx, setY1Idx] = useState(centersx[0].centroid[1]);
  const [x2Idx, setX2Idx] = useState(centersx[1].centroid[0]);
  const [y2Idx, setY2Idx] = useState(centersx[1].centroid[1]);

  const [addedPoints, setAP]: AddedPointList = useState([[], [], [], []]);
  const addPoint = (index: number, newPoint: AddedPoint) => {
    const newAddedPoints: AddedPoint[][] = [...addedPoints];
    newAddedPoints[index] = newAddedPoints[index].concat(newPoint);
    setAP(newAddedPoints);
  };

  const [pointsToRemove, setRT]: PointToRemoveList = useState([[], [], [], []]);
  const addPointToRemove = (index: number, newPoint: PointToRemove) => {
    const newPoints: PointToRemove[][] = [...pointsToRemove];
    newPoints[index] = newPoints[index].concat(newPoint);
    setRT(newPoints);
  };

  const [percentRemove, setPR] = useState(16);
  const [editable, setEdit] = useState(true);
  const [base, setBase] = useState(true);

  const changeO = (nextDataset: number) => {
    setX1Idx(kmeansAnswers[nextDataset].centroids[0].centroid[0]);
    setY1Idx(kmeansAnswers[nextDataset].centroids[0].centroid[1]);
    setX2Idx(kmeansAnswers[nextDataset].centroids[1].centroid[0]);
    setY2Idx(kmeansAnswers[nextDataset].centroids[1].centroid[1]);

    setO(nextDataset);
  };

  let trainData2: InputData[] = trainingDatasets[originalDataset].slice();

  // Remove a percentage of the data
  if (originalDataset === 0) {
    for (let i = trainData2.length; i > 0; i -= 1) {
      if (i % 20 === 0) {
        trainData2.splice(i, percentRemove);
      }
    }
  } else {
    for (let i = trainData2.length; i > 0; i -= 1) {
      if (i % 4 === 0) {
        trainData2.splice(i, percentRemove - 16);
      }
    }
  }

  trainData2 = base
    ? trainData2.concat(addedPoints[originalDataset])
    : addedPoints[originalDataset];

  // where our data is going to be, 'bubble data'
  const bubData: BubbleDataEntry[] = [];

  // possible edge case: if one dataset has fewer than 2 points, need fake data for kmeans
  // as users can remove datapoints this is necessary
  const fakepoints = [
    { Distance_Feature: 2, Speeding_Feature: 2 },
    { Distance_Feature: 1, Speeding_Feature: 1 },
  ];

  // format needed for kmeans()
  const c2 = [
    [x1Idx, y1Idx],
    [x2Idx, y2Idx],
  ];

  if (trainData2.length >= 2) {
    const ansX = kmeans(organiseData(trainData2), k, {
      initialization: c2,
      maxIterations: 1,
    });
    const data3 = organiseData(trainData2);
    processdata(bubData, ansX.clusters, c2, hidden, data3, k);
  } else {
    const s = trainData2.concat(fakepoints);
    const ansX = kmeans(organiseData(s), k, {
      initialization: c2,
      maxIterations: 1,
    });
    const data3 = organiseData(trainData2);
    const clustersss = trainData2.length === 1 ? [ansX.clusters[0]] : [];
    processdata(bubData, clustersss, c2, hidden, data3, k);
  }

  // data that will be put into the chart
  const data: { datasets: BubbleDataEntry[] } = { datasets: [] };

  Object.entries(bubData).forEach(cluster => {
    data.datasets.push(cluster[1]);
  });

  // remove removethese from data
  // TODO
  // eslint-disable-next-line
  for (const removethese of pointsToRemove) {
    for (let i = 0; i < removethese.length; i += 1) {
      data.datasets[removethese[i].dsIndex].data.splice(removethese[i].ind, 1);
    }
  }

  const onDragEnd = (
    e: React.ChangeEvent,
    datasetIndex: number,
    index: number,
    value: { x: number; y: number },
  ) => {
    if (!e) return;
    if (datasetIndex === 0) {
      setX1Idx(value.x);
      setY1Idx(value.y);
    }
    if (datasetIndex === 1) {
      setX2Idx(value.x);
      setY2Idx(value.y);
    }
  };

  // index corresponds to the datasets as numbered above
  const yAxisMin: number[] = [0, 1, 0, 0];
  const yAxisMax: number[] = [120, 7, 40, 100];
  const xAxisMin: number[] = [0, 1, 0, 0];
  const xAxisMax: number[] = [250, 10, 100, 100];

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
            fontColor: '#CBD9F2',
          },
          gridLines: { lineWidth: 3, color: '#8D9DBA' },
          ticks: {
            fontColor: '#CBD9F2',
            beginAtZero: true,
            min: yAxisMin[originalDataset],
            max: yAxisMax[originalDataset],
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
            fontColor: '#CBD9F2',
          },
          gridLines: { lineWidth: 3, color: '#8D9DBA' },
          ticks: {
            fontColor: '#CBD9F2',
            beginAtZero: true,
            min: xAxisMin[originalDataset],
            max: xAxisMax[originalDataset],
          },
        },
      ],
    },
    legend: {
      labels: {
        fontSize: 14,
        fontFamily: 'arial',
        fontStyle: 'bold',
        fontColor: '#CBD9F2',
      },
    },
    dragData: true,
    dragX: true,
    dragDataRound: 0,
    onClick(evt: MouseEvent) {
      if (editable) {
        // all the // @ts-ignore 's from here on are due to the fact that we can't access of 'this' until onClick is called
        // inside the react component
        // @ts-ignore
        const asdgwg = this.chart.getElementAtEvent(evt)[0];

        // @ts-ignore
        const yTop = this.chartArea.top;
        // @ts-ignore
        const yBottom = this.chartArea.bottom;
        // @ts-ignore
        const yMin = this.scales['y-axis-1'].min;
        // @ts-ignore
        const yMax = this.scales['y-axis-1'].max;
        let newY = 0;

        if (evt.offsetY <= yBottom && evt.offsetY >= yTop) {
          newY = Math.abs((evt.offsetY - yTop) / (yBottom - yTop));
          newY = (newY - 1) * -1;
          newY = newY * Math.abs(yMax - yMin) + yMin;
        }
        // @ts-ignore
        const xTop = this.chartArea.left;
        // @ts-ignore
        const xBottom = this.chartArea.right;
        // @ts-ignore
        const xMin = this.scales['x-axis-1'].min;
        // @ts-ignore
        const xMax = this.scales['x-axis-1'].max;
        let newX = 0;

        if (evt.offsetX <= xBottom && evt.offsetX >= xTop) {
          newX = Math.abs((evt.offsetX - xTop) / (xBottom - xTop));
          newX = newX * Math.abs(xMax - xMin) + xMin;
        }

        // checking to make sure where you click isnt on the centroids
        // dont want to remove those
        const rad = 7;
        const inXBounds =
          (newX < x1Idx + rad && newX > x1Idx - rad) ||
          (newX < x2Idx + rad && newX > x2Idx - rad);
        const inYBounds =
          (newY < y1Idx + rad && newY > y1Idx - rad) ||
          (newY < y2Idx + rad && newY > y2Idx - rad);

        const onCentroid = inXBounds && inYBounds;

        if (asdgwg && !onCentroid) {
          const dsIndex = asdgwg._datasetIndex;
          const ind = asdgwg._index;

          addPointToRemove(originalDataset, { dsIndex, ind });

          // @ts-ignore
          setX1Idx(this.chart.data.datasets[0].data[0].x + 0.1);
          // @ts-ignore
          setX1Idx(this.chart.data.datasets[0].data[0].x - 0.1);
        } else if (newX > 0 && newY > 0) {
          const point = { Distance_Feature: newX, Speeding_Feature: newY };
          addPoint(originalDataset, point);

          // forces the chart to update because it won't rerender otherwise
          // @ts-ignore
          setX1Idx(this.chart.data.datasets[0].data[0].x + 0.1);
          // @ts-ignore
          setX1Idx(this.chart.data.datasets[0].data[0].x - 0.1);
        }
      }
    },

    onDragEnd,
    onDragStart: onDragEnd,
    onDrag: onDragEnd,
    animation: {
      duration: 0,
    },
  };

  const datasetLabel = [
    'Original Dataset',
    'Iris Sepal Dataset',
    'Iris Petal Dataset',
    'Titanic Dataset',
  ];

  return (
    <div>
      <div>
        <Scatter data={data} options={options} plugins={[dragData]} />
      </div>
      <div className="flex-row space-x-10 mb-5">
        <div className="axis-selector inline">
          <button
            type="button"
            className={percentRemove === 19 ? 'selected' : ''}
            onClick={() => setPR(19)}
          >
            A Fourth of the Points
          </button>
          <button
            type="button"
            className={percentRemove === 18 ? 'selected' : ''}
            onClick={() => setPR(18)}
          >
            Half of the Points
          </button>
          <button
            type="button"
            className={percentRemove === 16 ? 'selected' : ''}
            onClick={() => setPR(16)}
          >
            All of the Points
          </button>
        </div>
        <div className="axis-selector inline">
          <button
            type="button"
            style={{ color: 'white' }}
            onClick={() => setBase(!base)}
          >
            {' '}
            {base ? 'Show Only Custom' : 'Show Full Dataset'}
          </button>
          <button
            type="button"
            style={{ color: 'white' }}
            onClick={() => setEdit(!editable)}
          >
            {editable ? 'Disable Editing' : 'Enable Editing'}
          </button>
          <button
            type="button"
            onClick={() => changeO((originalDataset + 1) % 4)}
          >
            Current:
            {datasetLabel[originalDataset]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InteractiveClusteringExample;
