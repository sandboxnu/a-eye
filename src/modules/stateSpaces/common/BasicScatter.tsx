import React from 'react';
import { Scatter } from 'react-chartjs-2';

export type { DataSeriesMap, ColorMap };
export { BasicScatter };

type DataSeriesMap = { [dataClass: string]: Array<{ x: number, y: number }> };
type ColorMap = { [dataClass: string]: string };

const BasicScatter =
    (props: { points: DataSeriesMap, xLabel: string, yLabel: string, colorMap: ColorMap }) => {
        const data: { datasets: Object[] } = { datasets: [] };
        Object.entries(props.points).forEach(([dataClass, classPoints]) => {
            data.datasets.push({
                label: dataClass,
                fill: true,
                pointRadius: 4,
                backgroundColor: props.colorMap[dataClass],
                data: classPoints
            });
        })
        const options = {
            showLines: false,
            tooltips: { enabled: false },
            scales: {
                yAxes: [{
                    scaleLabel: { display: true, labelString: props.yLabel, fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: '#394D73' },
                    gridLines: {lineWidth: 3, color: '#8D9DBA'},
                    ticks: {fontColor: '#394D73'}
                }],
                xAxes: [{
                    scaleLabel: { display: true, labelString: props.xLabel, fontSize: 16, fontFamily: 'open sans', fontStyle: 'italic bold', fontColor: '#394D73' },
                    gridLines: {lineWidth: 3, color: '#8D9DBA'},
                    ticks: {fontColor: '#394D73'}
                }],
            },
            legend: {
                labels: {
                    fontSize: 14,
                    fontFamily: 'open sans',
                    fontStyle: 'bold',
                    fontColor: '#394D73'
                }
            }
        };
        return (
            <div >
                <Scatter data={data} options={options} />
            </div>
        );
    };
