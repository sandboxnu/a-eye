import './kmeans.css';

import { squaredEuclidean } from 'ml-distance-euclidean';

// types for each of the four datasets
export type KMeansResult = {
  clusters: [];
  centroids: { centroid: number[]; error: number }[];
  converged: [];
  iterations: number;
};
export interface DataFormat {
  Driver_ID: number;
  Distance_Feature: number;
  Speeding_Feature: number;
}
export interface DataFormat2 {
  sepalLength: number;
  sepalWidth: number;
  petalLength: number;
  petalWidth: number;
  species: string;
}
export interface DataFormat3 {
  petalLength: number;
  petalWidth: number;
  species: string;
}
export interface TitanicData {
  PassengerId: number;
  Survived: number;
  Pclass: number;
  Name: string;
  Sex: string;
  Age: number;
  SibSp: number;
  Parch: number;
  Ticket: string | number;
  Fare: number;
  Cabin: string;
  Embarked: string;
}
// artificially added points (all datasets are converted into this format with two features)
export interface AddedPoint {
  Distance_Feature: number;
  Speeding_Feature: number;
}

export type InputData =
  | DataFormat
  | DataFormat2
  | DataFormat3
  | TitanicData
  | AddedPoint;

export type ScatterData = { datasets: ScatterDataData[] };
export type ScatterDataData = {
  data: {
    x: number;
    y: number;
    pointRadius: number;
    backgroundColor: string;
  }[];
};

// points to remove
export type PointToRemove = { dsIndex: number; ind: number };
export type PointToRemoveList = [PointToRemove[][], Function];

export type NewClusterType = { x: number; y: number; r: number };
export type BubbleDataEntry = {
  label: string[];
  backgroundColor: string;
  borderColor: string;
  data: NewClusterType[];
  pointRadius?: number;
  hidden?: boolean;
  dragData?: boolean;
};

export type AddedPointList = [AddedPoint[][], Function];

// kmeans for clusters
export const clusterColors = ['#99FF99', '#99CCFF'];
export const centerColors = ['#3cb450', '#5360fc'];
export const centerborderColors = ['#004E00', '#00007D'];

/*
 * @param data: array of points
 * @param centers: two centers
 * @return array of labels (which its closer to), 0 for first center, 1 for second center
 */
export function getClasses(data: number[][], centers: number[][]) {
  return data.map(x =>
    squaredEuclidean(x, centers[0]) > squaredEuclidean(x, centers[1]) ? 1 : 0,
  );
}

// Data processing
export const organiseData = (data: InputData[]) => {
  const organisedData: number[][] = [];
  for (let i = 0; i < data.length; i += 1) {
    const newRow: number[] = [];
    const curRow: InputData = data[i];
    if ((curRow as DataFormat).Distance_Feature) {
      const temp: DataFormat = curRow as DataFormat;
      newRow.push(temp.Distance_Feature);
      newRow.push(temp.Speeding_Feature);
    } else if ((curRow as DataFormat2).sepalLength) {
      const temp: DataFormat2 = curRow as DataFormat2;
      newRow.push(temp.sepalLength);
      newRow.push(temp.sepalWidth);
    } else if ((curRow as TitanicData).Age) {
      const temp: TitanicData = curRow as TitanicData;
      newRow.push(temp.Age);
      newRow.push(temp.Fare);
    } else {
      const temp: DataFormat3 = curRow as DataFormat3;
      newRow.push(temp.petalLength * 10);
      newRow.push(temp.petalWidth * 10);
    }
    organisedData.push(newRow);
  }
  return organisedData;
};

// processing for second and third chart
export const processdata = (
  bdata: BubbleDataEntry[],
  clsters: number[],
  cntroids: number[][],
  hidden: boolean,
  data3: number[][],
  k: number,
) => {
  // add centers
  for (let c = 0; c < cntroids.length; c += 1) {
    const newCluster: NewClusterType[] = [];
    newCluster.push({
      x: cntroids[c][0],
      y: cntroids[c][1],
      r: 3,
    });

    const colour = centerColors[c];
    const cb = centerborderColors[c];
    bdata.push({
      label: [`center ${c}`],
      backgroundColor: colour,
      borderColor: cb,
      data: newCluster,
      hidden,
      pointRadius: 7,
    });
  }

  // add clusters
  for (let ci = 0; ci < k; ci += 1) {
    const newCluster: NewClusterType[] = [];
    for (let ri = 0; ri < clsters.length; ri += 1) {
      if (clsters[ri] === ci) {
        newCluster.push({
          x: data3[ri][0],
          y: data3[ri][1],
          r: 3,
        });
      }
    }

    const colour = clusterColors[ci];
    bdata.push({
      label: [`cluster ${ci}`],
      backgroundColor: colour,
      borderColor: colour,
      data: newCluster,
      // dragData: t
    });
  }
};

export const calculateError = (results: KMeansResult): number[] => [
  Math.round(100 * results.centroids[0].error) / 100,
  Math.round(100 * results.centroids[1].error) / 100,
];
