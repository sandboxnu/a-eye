import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { findDOMNode } from "react-dom";
import {
  RblattInput,
  RblattConfig,
  INIT_CONFIG,
  INIT_INPUTS,
} from "./constants";

import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { voronoi } from '@visx/voronoi';
import { PointsRange, } from '@visx/mock-data/lib/generators/genRandomNormalPoints';
import { withTooltip, Tooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';

const COL_0 = "#f15e2c";
const COL_1 = "#394d73";

export type DotsProps = {
  width?: number;
  height?: number;
  inputs: any;
  line: any;
  handleClick: any;
  showControls?: boolean;
  highlighted;
  editingType;
};

const x = (d: PointsRange) => d[0];
const y = (d: PointsRange) => d[1];

let tooltipTimeout: number;

const RblattGraph = withTooltip<DotsProps, PointsRange>(({
  inputs,
  line,
  highlighted,
  editingType,
  handleClick,
  hideTooltip,
  showTooltip,
  tooltipOpen,
  tooltipData,
  tooltipLeft,
  tooltipTop,
  width = 1000,
  height = 1000,
}: DotsProps & WithTooltipProvidedProps<PointsRange>) => {
  const graphId = useMemo(() => `graph-${Math.random()}`, []);
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
      const closest = voronoiLayout.find(point.x, point.y, neighborRadius);
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

  const editGraph = useCallback((e) => {
    // I'm sure there's a way to do this with a ref as well, but I'm not sure how
    const elem = document.getElementById(graphId)?.getBoundingClientRect();
    if(!elem) return;
    console.log(e.clientX, e.clientY);
    console.log(elem.left, elem.top);
    const xClicked = revXScale(e.clientX - elem.left);
    const yClicked = revYScale(e.clientY - elem.top);
    handleClick(xClicked, yClicked, editingType);
  }, [handleClick, revXScale, revYScale, graphId, editingType]);

  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        {/** capture all mouse events with a rect */}
        <rect
          id={graphId}
          width={width}
          height={height}
          // fill="url(#dots-pink)"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseLeave}
          onClick={editGraph}
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
                if (tooltipData === point) {
                  return "white"; // hovering over point
                } else if (point[2] === 1) {
                  return COL_1;
                } else if (point[2] === 0) {
                  return COL_0;
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

export default RblattGraph;