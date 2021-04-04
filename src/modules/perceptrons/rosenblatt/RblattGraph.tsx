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
  showControls?: boolean;
};

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
  if (width < 10) return null;
  const points = inputs.map(({ x, y, z }) => [x, y, z]); // TODO remove in favor of better point UX

  const svgRef = useRef<SVGSVGElement>(null);
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [1.3, 2.2],
        range: [0, width],
        clamp: true,
      }),
    [width],
  );
  const yScale = useMemo(
    () =>
      scaleLinear<number>({
        domain: [0.75, 1.6],
        range: [height, 0],
        clamp: true,
      }),
    [height],
  );

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
          tooltipTop: yScale(x(closest.data)),
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
          rx={14}
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
              fill={tooltipData === point ? 'white' : '#f6c431'}
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
  const [brdId, setBrdId] = useState(
    "board_" + Math.random().toString(36).substr(2, 9)
  );
  const [board, setBoard] = useState<any>(null);
  const [pointA, setPointA] = useState<any>(null); // 2 points to define the line
  const [pointB, setPointB] = useState<any>(null);

  // creates the board when the component loads
  useEffect(() => {
    const newBoard = JXG.JSXGraph.initBoard(brdId, {
      boundingbox: [-10, 10, 10, -10],
      axis: true,
    });
    setBoard(newBoard);
    props.inputs.forEach((inpt, idx) => {
      const color = inpt.z === 1 ? COL_1 : COL_0;
      const p = newBoard.create("point", [inpt.x, inpt.y], {
        name: "",
        size: 1,
        color,
        fixed: true,
      });
    });
    if (props.line) {
      const { aCoords, bCoords } = getLinePoints(props.line);
      const pA = newBoard.create("point", aCoords, {
        name: "",
        fixed: true,
        color: "transparent",
      });
      const pB = newBoard.create("point", bCoords, {
        name: "",
        fixed: true,
        color: "transparent",
      });
      const li = newBoard.create("line", [pA, pB], {
        strokeColor: "black",
        strokeWidth: 2,
        fixed: true,
      });
      newBoard.create("inequality", [li], { fillColor: COL_0 });
      newBoard.create("inequality", [li], { inverse: true, fillColor: COL_1 });
      setPointA(pA);
      setPointB(pB);
    }
  }, []);

  // register listeners after the state var has been set
  useEffect(() => {
    board && board.on("down", editPoint);
  }, [board]);

  useEffect(() => {
    if (props.line) {
      const { aCoords, bCoords } = getLinePoints(props.line);
      pointA?.moveTo(aCoords, 700);
      pointB?.moveTo(bCoords, 700);
      board?.removeObject("prevLine");
      board?.create(
        "line",
        [
          [pointA?.X(), pointA?.Y()],
          [pointB?.X(), pointB?.Y()],
        ],
        { name: "prevLine", color: "rgba(0, 0, 0, 0.2)" }
      );
    }
  }, [props.line]);

  useEffect(() => {
    if (props.highlighted !== undefined) {
      board
        ?.select({
          elementClass: JXG.OBJECT_CLASS_POINT,
        })
        .setAttribute({ size: 1 });
      board
        ?.select({
          Y: (v: number) => v === props.highlighted!.y,
          X: (v: number) => v === props.highlighted!.x,
        })
        .setAttribute({ size: 4 });
    }
  }, [props.highlighted]);

  useEffect(() => {
    if (board && props.reset.isReset) {
      const [pointsToRemove, pointsToAdd] = getListInputs(props.inputs);
      for (let el in board.objects) {
        if (JXG.isPoint(board.objects[el])) {
          const [z, x, y] = board.objects[el].coords.usrCoords;
          pointsToRemove.forEach((point) => {
            const { x: x1, y: y1 } = point;
            if (x1 == x && y1 == y) {
              removePoint(el, x, y);
            }
          });
        }
      }
      INIT_INPUTS.forEach(({ x, y, z }) => {
        const newColor = props.calculatePointColor
          ? props.calculatePointColor({ x, y }, props.neuronState)
          : z;
        board.create("point", [x, y], {
          name: "",
          size: 1,
          color: newColor ? COL_1 : COL_0,
        });
      });
      props.reset.setReset(false);
    } else if (board && props.changedWeight && props.changedWeight.isChanged) {
      // const [pointsToRemove, pointsToAdd] = getListInputs(props.inputs)
      const pointsToRemove = props.inputs;
      for (let el in board.objects) {
        if (JXG.isPoint(board.objects[el])) {
          const [z, x, y] = board.objects[el].coords.usrCoords;
          pointsToRemove.forEach((point) => {
            const { x: x1, y: y1 } = point;
            if (x1 == x && y1 == y) {
              removePoint(el, x, y, true);
            }
          });
        }
      }
      props.inputs.forEach(({ x, y, z }) => {
        const newColor = props.calculatePointColor
          ? props.calculatePointColor({ x, y }, props.neuronState)
          : z;
        board.create("point", [x, y], {
          name: "",
          size: 1,
          color: newColor ? COL_1 : COL_0,
        });
      });
      props.changedWeight.setChanged(false);
    } else if (board && props.clear.isCleared) {
      const pointsToRemove = props.inputs;
      for (let el in board.objects) {
        if (JXG.isPoint(board.objects[el])) {
          const [z, x, y] = board.objects[el].coords.usrCoords;
          pointsToRemove.forEach((point) => {
            const { x: x1, y: y1 } = point;
            if (x1 == x && y1 == y) {
              removePoint(el, x, y);
            }
          });
        }
      }
      props.clear.setCleared(false);
    }
  }, [props]);

  const editPoint = useCallback(
    (e: any) => {
      if (props.editingType.val === null) return;

      let canCreate = true;
      let i;
      let pointToDelete;
      if (e[JXG.touchProperty]) {
        i = 0;
      }
      const coords = getMouseCoords(board, e, i);
      for (let el in board.objects) {
        if (
          JXG.isPoint(board.objects[el]) &&
          board.objects[el].hasPoint(coords.scrCoords[1], coords.scrCoords[2])
        ) {
          canCreate = false;
          pointToDelete = el;
          break;
        }
      }
      if (canCreate) {
        const x = coords.usrCoords[1];
        const y = coords.usrCoords[2];
        const z = props.calculatePointColor
          ? props.calculatePointColor({ x, y }, props.neuronState)
          : props.editingType.val || 0;
        addPoint(x, y, z, board);
      } else {
        removePoint(
          pointToDelete,
          coords.scrCoords[1],
          coords.scrCoords[2],
          false,
          board
        );
      }
    },
    [props.neuronState, board]
  );

  const addPoint = (x: number, y: number, z: 0 | 1, currBoard?: any) => {
    props.onInputsChange((oldInpts) => {
      return oldInpts.concat([{ x, y, z }]);
    });

    // can't directly use state var for board bc of closures
    if (!currBoard) currBoard = board;
    // creating points here is *technically* going against controlled components
    // shhh do not look
    board.create("point", [x, y], {
      name: "",
      size: 1,
      color: z ? COL_1 : COL_0,
    });
  };

  const removePoint = (
    pointId: string,
    x: number,
    y: number,
    dontRemoveFromInputs?: boolean | undefined,
    currBoard?: any
  ) => {
    if (props.editingType.val === null) return;
    if (!dontRemoveFromInputs) {
      props.onInputsChange((oldInpts) =>
        oldInpts.filter((inpt) => inpt.x != x && inpt.y != y)
      );
    }

    // can't directly use state var for board bc of closures
    if (!currBoard) currBoard = board;
    currBoard.removeObject(pointId);
  };

  return (<>
  <AirbnbGraph inputs={props.inputs} line={props.line} />
  <div id={brdId} style={{display: "none"}}/>
  </>);

  /* return (
   *   <div
   *     className="bg-white"
   *     id={brdId}
   *     style={{ width: "500px", height: "500px" }}
   *   />
   * ); */
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
