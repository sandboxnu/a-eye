import './kmeans.css';

import { squaredEuclidean } from 'ml-distance-euclidean';

export type KMeansResult = {clusters: [], centroids: {centroid: number[]}[], converged: [], iterations: number};
export interface DataFormat { Driver_ID: number, Distance_Feature: number, Speeding_Feature:number};
export interface DataFormat2 { sepalLength: number, sepalWidth: number, petalLength:number, petalWidth:number, species:string};
export interface DataFormat3 { petalLength:number, petalWidth:number, species:string };
export type InputData = DataFormat | DataFormat2 | DataFormat3;

export type ScatterData = {datasets: ScatterDataData[]};
export type ScatterDataData = {data:{x:number, y:number, pointRadius:number, backgroundColor:string}[]};

export type RemoveThese = {ds_index:number, ind: number}[];
export type RemoveTheseList = [RemoveThese, Function];

export type NewClusterType = {x:number, y:number, r:number};
export type BubbleDataEntry = {label:string[], backgroundColor:string, borderColor:string, data:NewClusterType[], pointRadius?:number, hidden?: boolean, dragData?: boolean };

export type AddedPoint = {Driver_ID:number, Distance_Feature:number, Speeding_Feature:number}[];
export type AddedPointList = [AddedPoint, Function];

// kmeans for clusters
export const cluster_colors = ['#99FF99', '#99CCFF'];
export const center_colors = ['#3cb450', "#5360fc"];
export const centerborder_colors = ['#004E00', '#00007D' ];

/*
 * @param data: array of points
 * @param centers: two centers
 * @return array of labels (which its closer to), 0 for first center, 1 for second center
 */
export function getClasses(data:number[][], centers: number[][]) {
    return data.map(x => squaredEuclidean(x, centers[0]) > squaredEuclidean(x, centers[1]) ? 1 : 0);
}

// Data processing
export const organiseData = (data: InputData[]) => {
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
export const processdata = (bdata: BubbleDataEntry[], clsters: number[], cntroids: number[][], hidden: boolean, data3: number[][], k: number) => {
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