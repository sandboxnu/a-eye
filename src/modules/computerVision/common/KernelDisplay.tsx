import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const KernelDisplay = (props: { kernelGrid?: number[][], labelColor: string}) => {
  const [showNums, setShowNums] = useState(true);

  if (!props.kernelGrid) return <></>;

  let max = 0;
  let min = Infinity;
  props.kernelGrid.forEach((row) => row.forEach((ele) => {
    if (ele > max) max = ele;
    if (ele < min) min = ele;
  }));

  const getCell = (val: number, j: number) => {
    const color = getCellColor(val, max, min);
    return (
      <td
        className="h-1 w-1 border border-charcoal p-2"
        key={j}
        style={{
          background: color,
          color: !showNums ? color : undefined,
        }}
        title={`${val}`}
      >
        {val.toFixed(3)}
      </td>
    );
  };

  return (
    <div className="text-black font-normal font-xs">
      <div className="mx-auto my-4 max-w-5xl max-h-lg overflow-auto">
        <table className="m-auto">
          <tbody>
            {props.kernelGrid.map((row, i) => (
              <tr key={i}>
                {row.map((val, j) => getCell(val, j))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FormControlLabel
        control={(
          <Switch
            checked={showNums}
            onChange={(e) => setShowNums(e.target.checked)}
            color="primary"
          />
                  )}
        className={props.labelColor}
        label="Show kernel numbers"
      />
    </div>
  );
};

function getCellColor(val: number, max: number, min: number) {
  if (max === min) {
    return 'rgb(0, 212, 192)';
  }
  const red = 255 - ((val - min) / (max - min) * 255);
  return `rgb(${red}, 212, 192)`;
}

export default KernelDisplay;
