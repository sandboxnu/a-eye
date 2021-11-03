import React from 'react';
import { Scatter } from 'react-chartjs-2';

export type { DataSeriesMap, ColorMap };
export { BasicScatter };

type DataSeriesMap = { [dataClass: string]: Array<{ x: number; y: number }> };
type ColorMap = { [dataClass: string]: string };

type BasicScatterType = {
  points: DataSeriesMap;
  xLabel: string;
  yLabel: string;
  colorMap: ColorMap;
  labelColorHex: string;
};

const BasicScatter: React.FC<BasicScatterType> = ({
  points,
  xLabel,
  yLabel,
  colorMap,
  labelColorHex,
}) => {
  const data: { datasets: Object[] } = { datasets: [] };
  Object.entries(points).forEach(([dataClass, classPoints]) => {
    data.datasets.push({
      label: dataClass,
      fill: true,
      pointRadius: 4,
      backgroundColor: colorMap[dataClass],
      data: classPoints,
    });
  });
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
            fontColor: labelColorHex,
          },
          gridLines: { lineWidth: 3, color: '#8D9DBA' },
          ticks: { fontColor: '#394D73' },
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
            fontColor: labelColorHex,
          },
          gridLines: { lineWidth: 3, color: '#8D9DBA' },
          ticks: { fontColor: '#394D73' },
        },
      ],
    },
    legend: {
      labels: {
        fontSize: 14,
        fontFamily: 'open sans',
        fontStyle: 'bold',
        fontColor: labelColorHex,
      },
    },
  };
  return (
    <div>
      <Scatter data={data} options={options} />
    </div>
  );
};
