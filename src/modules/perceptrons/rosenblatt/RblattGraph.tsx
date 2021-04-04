import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  RblattInput,
  RblattConfig,
  INIT_CONFIG,
  INIT_INPUTS,
} from "./constants";
import JXG from "jsxgraph";

import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { GradientPinkRed } from '@visx/gradient';
import { scaleLinear } from '@visx/scale';
import { voronoi } from '@visx/voronoi';
import genRandomNormalPoints, {
  PointsRange,
} from '@visx/mock-data/lib/generators/genRandomNormalPoints';
import { withTooltip, Tooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';

export type DotsProps = {
  width?: number;
  height?: number;
  inputs: any;
  line: any;
  clickPoint?: any;
  showControls?: boolean;
};

// -10, 10 -> 0, 1000
// 0, 20
// 0, 20 * 50 = 1000
const x = (d: PointsRange) => d[0];
const y = (d: PointsRange) => d[1];

let tooltipTimeout: number;

const AirbnbGraph = withTooltip<DotsProps, PointsRange>(({
  inputs,
  line,
  hideTooltip,
  showTooltip,
  tooltipOpen,
  tooltipData,
  tooltipLeft,
  tooltipTop,
  width = 1000,
  height = 1000,
}: DotsProps & WithTooltipProvidedProps<PointsRange>) => {
  const points = inputs.map(({ x, y, z }) => [x, y, z]); // TODO remove in favor of better point UX

  const svgRef = useRef<SVGSVGElement>(null);
  const xScale = useCallback((a) => (a + 10) * (width / 20), [width]);
  const yScale = useCallback((a) => (a + 10) * (height / 20), [height]);

  const revXScale = useCallback((a) => (a * (2 / width)) - 10, [width]);
  const revYScale = useCallback((a) => (a * (2 / height)) - 10, [height]);

  const voronoiLayout = useMemo(
    () =>
      voronoi<PointsRange>({
        x: d => xScale(x(d)) ?? 0,
        y: d => yScale(y(d)) ?? 0,
        width,
        height,
      })(points),
    [width, height, xScale, yScale, points],
  );

  // event handlers
  const handleMouseMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (tooltipTimeout) clearTimeout(tooltipTimeout);
      if (!svgRef.current) return;

      // find the nearest polygon to the current mouse position
      const point = localPoint(svgRef.current, event);
      if (!point) return;
      const neighborRadius = 100;
      const closest = voronoiLayout.find( point.x, point.y, neighborRadius);
      if (closest) {
        showTooltip({
          tooltipLeft: xScale(x(closest.data)),
          tooltipTop: yScale(y(closest.data)),
          tooltipData: closest.data,
        });
      }
    },
    [xScale, yScale, showTooltip, voronoiLayout],
  );

  const handleMouseLeave = useCallback(() => {
    tooltipTimeout = window.setTimeout(() => {
      hideTooltip();
    }, 300);
  }, [hideTooltip]);


  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        <GradientPinkRed id="dots-pink" />
        {/** capture all mouse events with a rect */}
        <rect
          width={width}
          height={height}
          fill="url(#dots-pink)"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseLeave}
        />
        <Group pointerEvents="none">
          {points.map((point, i) => (
            <Circle
              key={`point-${x(point)}-${i}`}
              className="dot"
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              r={i % 3 === 0 ? 2 : 3}
              fill={(() => {
                if(tooltipData === point) {
                  return "white"; // hovering over point
                } else if(point[2] === 1) {
                  return "red"; // blue point?
                } else if(point[2] === 0) {
                  return 'green'; // red point?
                }
              })()}
            />
            ))}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && tooltipLeft != null && tooltipTop != null && (
        <Tooltip left={tooltipLeft + 10} top={tooltipTop + 10}>
          <div>
            <strong>x:</strong> {x(tooltipData)}
          </div>
          <div>
            <strong>y:</strong> {y(tooltipData)}
          </div>
        </Tooltip>
      )}
    </div>
  );
});

/* old stuff */

type RblattGraphProps = {
  inputs: RblattInput[];
  line?: RblattConfig;
  highlighted?: RblattInput;
  editingType: { val: 0 | 1 | null };
  onInputsChange: (inpts: React.SetStateAction<RblattInput[]>) => void;
  reset: { isReset: boolean; setReset: Function };
  clear: { isCleared: boolean; setCleared: Function };
  changedWeight?: { isChanged: boolean; setChanged: Function };
  calculatePointColor?: (RblattInput, any) => 0 | 1;
  neuronState?: any;
};

const isInitialInputPoint = (xCoord: number, yCoord: number) => {
  let result = false;
  INIT_INPUTS.forEach(({ x: xInit, y: yInit }) => {
    if (xInit === xCoord && yInit === yCoord) {
      result = true;
    }
  });
  return result;
};

// returns all the points which are all not initial inputs, aka all the points that have been added
const getListInputs = (inputs: RblattInput[]) => {
  let toRemove: RblattInput[] = [];
  let toAdd: RblattInput[] = [];
  inputs.forEach((input: RblattInput) => {
    const { x, y } = input;
    if (!isInitialInputPoint(x, y)) {
      toRemove.push(input);
    } else {
      toAdd.push(input);
    }
  });
  return [toRemove, toAdd];
};

const RblattGraph = (props: {
  inputs;
  line;
  highlighted;
  editingType;
  onInputsChange;
  reset;
  clear;
  changedWeight;
  calculatePointColor;
  neuronState;
}) => {
  return (<>
  <AirbnbGraph inputs={props.inputs} line={props.line} />
  </>);

};

export default RblattGraph;

var getMouseCoords = function (board: any, e: MouseEvent, i?: number) {
  var cPos = board.getCoordsTopLeftCorner(e),
    absPos = JXG.getPosition(e, i),
    dx = absPos[0] - cPos[0],
    dy = absPos[1] - cPos[1];

  return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], board);
};

// todo test if this is correct when switching between normal/ vertical line
function getLinePoints(line: RblattConfig) {
  if (line.weightY === 0) {
    const x = line.bias / line.weightX;
    return { aCoords: [x, 1], bCoords: [x, 2] };
  } else {
    const func = (x: number) => (line.weightX * x + line.bias) / -line.weightY;
    return { aCoords: [1, func(1)], bCoords: [2, func(2)] };
  }
}

const COL_0 = "#f15e2c";
const COL_1 = "#394d73";
