import React, { useState } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';


const KernelDisplay = (props: { kernelGrid?: number[][] }) => {
    const [showNums, setShowNums] = useState(true);

    if (!props.kernelGrid) return <></>;

    const getCell = (val: number, j: number) => {
        const color = getCellColor(val, props.kernelGrid);
        return (
            <td className="h-1 w-1 border border-charcoal p-2"
                key={j}
                style={{
                    background: color,
                    color: !showNums ? color : undefined
                }}
                title={`${val}`}>
                {val.toFixed(2)}
            </td>
        );
    }

    return (
        <div>
            <div className="mx-auto my-4 max-w-5xl max-h-lg overflow-auto">
                <table className="m-auto"><tbody>
                    {props.kernelGrid.map((row, i) => (
                        <tr key={i}>
                            {row.map((val, j) => getCell(val, j))}
                        </tr>
                    ))}
                </tbody></table>
            </div>
            <FormControlLabel
                control={
                    <Switch
                        checked={showNums}
                        onChange={(e) => setShowNums(e.target.checked)}
                        color="primary"
                    />
                }
                label="Show kernel numbers"
            />
        </div>
    );
}

function getCellColor(val: number, kernelGrid?: number[][]) {
    if (!kernelGrid) return;
    let max = 0;
    let min = Infinity;
    kernelGrid?.forEach(row => row.forEach(ele => {
        if (ele > max) max = ele;
        if (ele < min) min = ele;
    }))
    const red = 200 - ((val - min) / (max - min) * 200);
    return `rgb(${red}, 212, 192)`;
}

export default KernelDisplay;