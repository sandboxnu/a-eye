import React, { useCallback, useMemo, useRef } from "react";
import { RblattInput } from "./constants";

import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { voronoi } from '@visx/voronoi';
import { withTooltip, Tooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { GridRows, GridColumns } from '@visx/grid';
import { scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';

const COL_HOVER = "white";
const COL_0 = "#f15e2c";
const COL_1 = "#394d73";
const background = '#FFC0CB';

export type GraphProps = {
  width?: number;
  height?: number;
  domain?: number,
  range?: number,
  inputs: any;
  line: any;
  handleClick: any;
  showControls?: boolean;
  highlighted: RblattInput | undefined;
  editingType: 0 | 1;
};

const x = (d: RblattInput) => d[0];
const y = (d: RblattInput) => d[1];
const color = (d: RblattInput) => d[2] ? COL_1 : COL_0;

const SELECTED_DOT_SIZE = 5;
const DOT_SIZE = 3;

let tooltipTimeout: number;

const defaultMargin = { top: 0, right: 0, bottom: 0, left: 0 };

const RblattGraph = withTooltip<GraphProps, RblattInput>(({
  inputs: points,
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
  domain = 10,
  range = 10,
}: GraphProps & WithTooltipProvidedProps<RblattInput>) => {
  // memoized so that it retains the same id while displayed
  const graphId = useMemo(() => `graph-${Math.random()}`, []);
  const svgRef = useRef<SVGSVGElement>(null);
  
  // convert from a value of our point system to one on the graph system
  const xScale = useCallback((a) => (a + domain) * (width / (2 * domain)), [width, domain]);
  const yScale = useCallback((a) => height - ((a + range) * (height / (2 * range))), [height, range]);

  // convert from a value on the graph system to one of our point system
  const revXScale = useCallback((a) => (a * ((2 * domain) / width)) - domain, [width, domain]);
  const revYScale = useCallback((a) => -((a * ((2 * range) / height)) - range), [height, range]);

  const voronoiLayout = useMemo(
    () =>
      voronoi<RblattInput>({
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
      const neighborRadius = 50;
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
    // TODO: There should be a way to do this with the ref as well
    const elem = document.getElementById(graphId)?.getBoundingClientRect();
    if (!elem) return;
    const xClicked = revXScale(e.clientX - elem.left);
    const yClicked = revYScale(e.clientY - elem.top);
    handleClick(xClicked, yClicked, editingType);
  }, [handleClick, revXScale, revYScale, graphId, editingType]);


  // bounds
  const x_Scale = scaleLinear<number>({
    domain: [-domain, domain],
    nice: true,
  });

  const y_Scale = scaleLinear<number>({
    domain: [-range, range],
    nice: true,
  });

  const xMax = width - defaultMargin.left - defaultMargin.right;
  const yMax = height - defaultMargin.top - defaultMargin.bottom;

  x_Scale.range([0, xMax]);
  y_Scale.range([yMax, 0]);

  return (
    <div>
      <svg width={width} height={height} ref={svgRef}>
        <rect
          id={graphId}
          width={width}
          height={height}
          fill={background}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseLeave}
          onClick={editGraph}
        />
        <Group pointerEvents="none">
          <GridRows scale={x_Scale} width={xMax} height={yMax} stroke="#e0e0e0" />
          <GridColumns scale={x_Scale} width={xMax} height={yMax} stroke="#e0e0e0" />
          <AxisBottom top={xMax / 2} scale={x_Scale} hideZero={true} numTicks={domain} />
          <AxisLeft left={xMax / 2} scale={y_Scale} hideZero={true} numTicks={range} />
          {points.length > 0 && points.map((point: RblattInput, i: number) => (
            <Circle
              key={`point-${x(point)}-${i}`}
              className="dot"
              cx={xScale(x(point))}
              cy={yScale(y(point))}
              r={highlighted &&
                 x(highlighted) === x(point) && 
                 y(highlighted) === y(point) ? 
                 SELECTED_DOT_SIZE : DOT_SIZE}
              fill={tooltipData === point ? COL_HOVER : color(point)}
            />
          ))}
        </Group>
      </svg>
      {tooltipOpen && tooltipData && tooltipLeft != null && tooltipTop != null && (
        <Tooltip left={tooltipLeft + 10} top={tooltipTop + 10}>
          <div>
            <strong>x:</strong> {x(tooltipData).toFixed(2)}
          </div>
          <div>
            <strong>y:</strong> {y(tooltipData).toFixed(2)}
          </div>
          {points.length === 1 &&
            <div>
              <strong>Last Point! Can't remove it!</strong>
            </div>
          }
        </Tooltip>
      )}
    </div>
  );
});

export default RblattGraph;