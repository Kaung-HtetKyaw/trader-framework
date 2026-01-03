import { RFVisualizationNodeBounds } from '@/types/visualization/react-flow';
import { GetSmoothStepPathParams, XYPosition } from '@xyflow/react';
import { getBridgeGapPoint, TRBLPosition } from './gapPoints';
import { getNearestManhattanCoordinate, getNearestManhattanDistance } from './distance';
import { DEFAULT_VISUALIZATION_DIMENSIONS } from '..';

export type GetSmartSmoothOrthogonalPathParams = GetSmoothStepPathParams & {
  source: XYPosition;
  target: XYPosition;
  sourcePosition: TRBLPosition;
  targetPosition: TRBLPosition;
  gapPoints: XYPosition[];
};

export const getSmartSmoothOrthogonalPath = ({
  source,
  target,
  sourcePosition,
  targetPosition,
  gapPoints,
  bounds,
  visited,
  borderRadius = 5,
}: {
  source: XYPosition;
  target: XYPosition;
  sourcePosition: TRBLPosition;
  targetPosition: TRBLPosition;
  gapPoints: XYPosition[];
  bounds: RFVisualizationNodeBounds[];
  visited: Set<string>;
  borderRadius?: number;
}) => {
  const sourceBridgeGapPoint = getBridgeGapPoint(source, sourcePosition, gapPoints);

  const targetBridgeGapPoint = getBridgeGapPoint(target, targetPosition, gapPoints);

  const gapPointsWithBridges = getOrthogonalGapPoints({
    start: sourceBridgeGapPoint,
    end: targetBridgeGapPoint,
    points: [...gapPoints, sourceBridgeGapPoint, targetBridgeGapPoint],
    bounds,
    visited,
  });

  const points = getOrthogonalPaths([
    source,
    sourceBridgeGapPoint,
    ...gapPointsWithBridges,
    targetBridgeGapPoint,
    target,
  ]).filter(el => !!el);

  const detouredPoints = removeAllDetourPoints(points);
  const removedRoundAbouts = removeRoundAbouts(detouredPoints);
  const removedUturns = removeUturns(removedRoundAbouts, bounds);
  // this is a hack to add a small offset to the last point to avoid the edge from being too close to the node
  const optimizedPoints = addOffsetToLastPoint(removedUturns);

  const path = optimizedPoints.reduce<string>((res, p, i) => {
    let segment = '';

    if (i > 0 && i < optimizedPoints.length - 1) {
      segment = getBend(optimizedPoints[i - 1], p, optimizedPoints[i + 1], borderRadius);
    } else {
      segment = `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`;
    }

    res += segment;

    return res;
  }, '');

  // TODO: add label and offset
  return [path];
};

const addOffsetToLastPoint = (points: XYPosition[]) => {
  const lastPoint = points[points.length - 1];
  if (!lastPoint) {
    return points;
  }

  return [...points, { x: lastPoint.x, y: lastPoint.y + 10 }];
};

const removeUturns = (points: XYPosition[], bounds: RFVisualizationNodeBounds[]) => {
  // need 4 points to form an U turn, so we need to check for 4 consecutive points
  if (points.length <= 4) {
    return [];
  }

  const candidates = points.reduce((acc, cur, index) => {
    const point1 = points[index];
    const point2 = points[index + 1];
    const point3 = points[index + 2];
    const point4 = points[index + 3];

    if (!point1 || !point2 || !point3 || !point4) {
      return acc;
    }

    return [...acc, [point1, point2, point3, point4]];
  }, [] as XYPosition[][]);

  const uTurnResults = candidates.reduce(
    (acc, cur) => {
      const [point1, point2, point3, point4] = cur;

      const primaryAxisOne = point1.x === point2.x ? 'y' : 'x';
      const primaryAxisTwo = point3.x === point4.x ? 'y' : 'x';
      const secondaryAxis = point2.x === point3.x ? 'y' : 'x';

      const primaryAxisOneDir = getDirection(point1, point2);
      const primaryAxisTwoDir = getDirection(point3, point4);

      const samePrimaryAxis = primaryAxisOne === primaryAxisTwo;
      const samePrimaryDir = primaryAxisOneDir[primaryAxisOne] !== primaryAxisTwoDir[primaryAxisOne];
      const differentSecondaryAxis = secondaryAxis !== primaryAxisOne && secondaryAxis !== primaryAxisTwo;
      const belowThreshold =
        Math.abs(point2[secondaryAxis] - point3[secondaryAxis]) < DEFAULT_VISUALIZATION_DIMENSIONS.entityPadding;
      const validBelowThreshold = samePrimaryAxis && samePrimaryDir && differentSecondaryAxis && belowThreshold;
      const validAboveThreshold = samePrimaryAxis && samePrimaryDir && differentSecondaryAxis && !belowThreshold;

      /**
       * U-turn detection logic:
       *
       * A U-turn is formed by 4 consecutive points (point1 -> point2 -> point3 -> point4) where:
       *
       * 1. Primary Axis Alignment: Both segments (point1->point2 and point3->point4) move along the same primary axis (x or y)
       * 2. Direction Reversal: The segments move in opposite directions along the primary axis (samePrimaryDir = true when directions differ)
       * 3. Secondary Axis Connection: The middle segment (point2->point3) connects the two primary segments along a different axis
       * 4. Threshold Check: The distance between point2 and point3 along the secondary axis determines if it's a "tight" or "loose" U-turn
       *
       * Visual representation:
       * point1 ---- point2
       *              |
       *              | (secondary axis connection)
       *              |
       * point4 ---- point3
       *
       * The algorithm then replaces the U-turn with either:
       * - Direct connection (point1 -> point4) if they can be connected orthogonally
       * - Mid-point connection (point1 -> midPoint -> point4) if direct connection isn't possible
       */

      if (validBelowThreshold) {
        const uTurnPoints = [point1, point2, point3, point4];

        const canConnectDirectly = isOrthogonal(point1, point4);
        const isStartBetween = isBetween(point4[primaryAxisOne], point1[primaryAxisOne], point2[primaryAxisOne]);
        const isEndBetween = isBetween(point1[primaryAxisOne], point4[primaryAxisOne], point2[primaryAxisOne]);
        const isPointBetween = isEndBetween || isStartBetween;

        const directConnectionPoints = canConnectDirectly ? [point1, point4] : [];
        const midConnectionPoints = (
          isPointBetween
            ? [point1, { [primaryAxisOne]: point4[primaryAxisOne], [secondaryAxis]: point1[secondaryAxis] }, point4]
            : []
        ) as XYPosition[];
        const newPoints = directConnectionPoints.length ? directConnectionPoints : midConnectionPoints;

        const id = `${point1.x}-${point1.y}-${point2.x}-${point2.y}-${point3.x}-${point3.y}-${point4.x}-${point4.y}`;

        return [...acc, { old: uTurnPoints, new: newPoints, id }];
      } else if (validAboveThreshold) {
        /**
         * U turn gap threshold is above the threshold, so we need to check if the new points are intersecting with the bounds
         */
        const uTurnPoints = [point1, point2, point3, point4];

        const canConnectDirectly = isOrthogonal(point1, point4);
        const isStartBetween = isBetween(point4[primaryAxisOne], point1[primaryAxisOne], point2[primaryAxisOne]);
        const isEndBetween = isBetween(point1[primaryAxisOne], point4[primaryAxisOne], point2[primaryAxisOne]);
        const isPointBetween = isEndBetween || isStartBetween;

        const directConnectionPoints = canConnectDirectly ? [point1, point4] : [];
        const midConnectionPoints = (
          isPointBetween
            ? [point1, { [primaryAxisOne]: point4[primaryAxisOne], [secondaryAxis]: point1[secondaryAxis] }, point4]
            : []
        ) as XYPosition[];
        const newPoints = directConnectionPoints.length ? directConnectionPoints : midConnectionPoints;
        const isIntersected = isSegmentIntersectsRects(newPoints[0], newPoints[newPoints.length - 1], bounds);

        if (isIntersected) {
          return acc;
        }

        const id = `${point1.x}-${point1.y}-${point2.x}-${point2.y}-${point3.x}-${point3.y}-${point4.x}-${point4.y}`;

        return [...acc, { old: uTurnPoints, new: newPoints, id }];
      }

      return acc;
    },
    [] as { old: XYPosition[]; new: XYPosition[]; id: string }[]
  );

  // mutate the original points with the u-turn context, so that we can later use this context to replace with actual points
  const pointsWithUturnContext = points.reduce(
    (acc, cur) => {
      const uTurnResult = uTurnResults.find(el => el.old.find(point => point.x === cur.x && point.y === cur.y));

      if (uTurnResult) {
        return [...acc, { ...cur, id: uTurnResult.id }];
      }

      return [...acc, { ...cur, id: undefined }];
    },
    [] as (XYPosition & { id?: string })[]
  );

  let result = [...pointsWithUturnContext];

  // replace the u-turn points with the new points
  uTurnResults.forEach(el => {
    const findIndex = result.findIndex(point => el.id === point.id);

    if (!el.new.length) {
      return;
    }

    const beforeIndexItems = result.slice(0, findIndex);
    const afterIndexItems = result.slice(findIndex + 4);

    result = [...beforeIndexItems, ...el.new, ...afterIndexItems];
  });

  return result.map(el => ({ x: el.x, y: el.y }));
};

/**
 * Roundabout detection and removal logic:
 *
 * A roundabout is detected when the path takes an unnecessary detour that can be simplified
 * by connecting directly to the endpoint. The algorithm identifies roundabouts by checking:
 *
 * 1. Threshold Check: The current point is close to the endpoint along the secondary axis
 *    (within entityPadding distance)
 * 2. Endpoint Between Check: The endpoint lies between the current point and the next point
 *    along the primary axis of movement
 *
 * Visual representation of a roundabout:
 *
 * Current path: A -> B -> C -> D -> E
 * Where: A is current point, B is next point, E is endpoint
 *
 * If E is close to A (below threshold) and E lies between A and B along the primary axis,
 * then the path A -> B -> ... -> E can be simplified to A -> gapPoint -> E
 *
 * The gapPoint is created by combining:
 * - The endpoint's position along the primary axis
 * - The current point's position along the secondary axis
 *
 * This creates a direct orthogonal path that bypasses the unnecessary detour.
 *
 * @param points Array of path points to check for roundabouts
 * @returns Simplified path with roundabouts removed
 */
const removeRoundAbouts = (points: XYPosition[]) => {
  const endPoint = points[points.length - 1];

  return points.reduce(
    (acc, cur, index) => {
      const point1 = points[index];
      const point2 = points[index + 1];

      if (!point1 || !point2 || acc.found) {
        return acc;
      }

      const primaryAxis = point1.x === point2.x ? 'y' : 'x';
      const secondaryAxis = point1.x === point2.x ? 'x' : 'y';
      const belowThreshold =
        Math.abs(point1[secondaryAxis] - endPoint[secondaryAxis]) < DEFAULT_VISUALIZATION_DIMENSIONS.entityPadding;

      const isEndBetween = isBetween(point1[primaryAxis], endPoint[primaryAxis], point2[primaryAxis]);

      if (belowThreshold && isEndBetween) {
        const gapPoint = { [primaryAxis]: endPoint[primaryAxis], [secondaryAxis]: point1[secondaryAxis] } as XYPosition;

        return {
          found: true,
          points: [...acc.points, point1, gapPoint, endPoint],
        };
      }

      return { found: false, points: [...acc.points, point1] };
    },
    { found: false, points: [] } as { found: boolean; points: XYPosition[] }
  ).points;
};

// distance calculation for the svg paths (this is not used for cost of the connection of points)
const distance = (a: XYPosition, b: XYPosition) => Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));

const getBend = (a: XYPosition, b: XYPosition, c: XYPosition, size: number): string => {
  const bendSize = Math.min(distance(a, b) / 2, distance(b, c) / 2, size);
  const { x, y } = b;

  // no bend
  if ((a.x === x && x === c.x) || (a.y === y && y === c.y)) {
    return `L${x} ${y}`;
  }

  // first segment is horizontal
  if (a.y === y) {
    const xDir = a.x < c.x ? -1 : 1;
    const yDir = a.y < c.y ? 1 : -1;
    return `L ${x + bendSize * xDir},${y}Q ${x},${y} ${x},${y + bendSize * yDir}`;
  }

  const xDir = a.x < c.x ? 1 : -1;
  const yDir = a.y < c.y ? -1 : 1;
  return `L ${x},${y + bendSize * yDir}Q ${x},${y} ${x + bendSize * xDir},${y}`;
};

export const getOrthogonalGapPoints = ({
  start,
  end,
  points,
  bounds,
  visited,
  cameFromNode,
  recursionDepth = 0,
}: {
  start: XYPosition;
  end: XYPosition;
  points: XYPosition[];
  bounds: RFVisualizationNodeBounds[];
  visited: Set<string>;
  cameFromNode?: XYPosition;
  recursionDepth?: number;
}) => {
  const MAX_RECURSION_DEPTH = 1000;

  if (!start || !end) {
    return [];
  }

  if (!start || !end) {
    return [];
  }

  if (recursionDepth > MAX_RECURSION_DEPTH) {
    console.warn(`Maximum recursion depth (${MAX_RECURSION_DEPTH}) reached, returning empty path`);
    return [];
  }
  const paths: XYPosition[] = [];
  const direction = getDirection(start, end);
  const neighbours = getAvailableAdjacentNeighbours(start, points, cameFromNode);

  if (visited.has(start.x + '-' + start.y)) {
    // we already visited this node but we need to go back to that node because the current path is not valid
    if (cameFromNode) {
      paths.push(
        ...getOrthogonalGapPoints({
          start,
          end,
          points,
          bounds,
          visited,
          cameFromNode,
          recursionDepth: recursionDepth + 1,
        })
      );
      return paths;
    }

    return paths;
  }

  visited.add(start.x + '-' + start.y);

  if (start.x === end.x && start.y === end.y) {
    return paths;
  }

  const firstNeighbour = (direction.x === 1 ? neighbours.right : neighbours.left) as XYPosition;
  const secondNeighbour = (direction.y === 1 ? neighbours.bottom : neighbours.top) as XYPosition;

  if (
    firstNeighbour !== undefined &&
    isSegmentIntersectsRects(firstNeighbour, end, bounds) &&
    firstNeighbour.x === end.x &&
    firstNeighbour.y === end.y
  ) {
    return paths;
  }
  if (
    secondNeighbour !== undefined &&
    isSegmentIntersectsRects(secondNeighbour, end, bounds) &&
    secondNeighbour.x === end.x &&
    secondNeighbour.y === end.y
  ) {
    return paths;
  }

  if (firstNeighbour === undefined && secondNeighbour === undefined) {
    const nearestBridgePoint = getNearestBridgePoints({ source: start, target: end, gaps: points, direction, bounds });
    const allNeighbours = getAllAdjacentNeighbours(start, points);

    // if the nearest bridge point is not intersecting with the bounds, add it to the path
    if (!isSegmentIntersectsRects(start, nearestBridgePoint.bridgePoint, bounds)) {
      paths.push(nearestBridgePoint.bridgePoint);
      paths.push(nearestBridgePoint.gapPoint);
      // add nearest bridge point to the path but add recursion to the nearest gap point
      paths.push(
        ...getOrthogonalGapPoints({
          start: nearestBridgePoint.gapPoint,
          end,
          points,
          bounds,
          visited,
          cameFromNode: nearestBridgePoint.gapPoint,
          recursionDepth: recursionDepth + 1,
        })
      );
      return paths;
    }

    // if there are no neighbours and the bridge gap point is intersecting with the bounds, add the next neighbour to the path
    /***
     * eg. For x=1, y=1, firstNeighbour is undefined
     *                secondNeighbour
     *  nextNeighbour     start      firstNeighbour
     *      eg. For x=-1, y=1, firstNeighbour is undefined
     *                secondNeighbour
     *  firstNeighbour     start      nextNeighbour
     */
    const nextNeighbour = direction.x === 1 ? allNeighbours.left : allNeighbours.right;
    paths.push(nextNeighbour);
    paths.push(
      ...getOrthogonalGapPoints({
        start: nextNeighbour,
        end,
        points,
        bounds,
        visited,
        cameFromNode: start,
        recursionDepth: recursionDepth + 1,
      })
    );
    return paths;
  } else if (firstNeighbour === undefined && secondNeighbour !== undefined) {
    if (!isSegmentIntersectsRects(start, secondNeighbour, bounds)) {
      paths.push(secondNeighbour);
      paths.push(
        ...getOrthogonalGapPoints({
          start: secondNeighbour,
          end,
          points,
          bounds,
          visited,
          cameFromNode: start,
          recursionDepth: recursionDepth + 1,
        })
      );

      return paths;
    }

    // if the nearest bridge point is intersecting with the bounds, add the next neighbour to the path
    /***
     * eg. For x=1, y=1, firstNeighbour is undefined
     *                secondNeighbour
     *  nextNeighbour     start      firstNeighbour
     *      eg. For x=-1, y=1, firstNeighbour is undefined
     *                secondNeighbour
     *  firstNeighbour     start      nextNeighbour
     */
    const allNeighbours = getAllAdjacentNeighbours(start, points);
    const nextNeighbour = direction.x === 1 ? allNeighbours.left : allNeighbours.right;
    paths.push(nextNeighbour);
    paths.push(
      ...getOrthogonalGapPoints({
        start: nextNeighbour,
        end,
        points,
        bounds,
        visited,
        cameFromNode: start,
        recursionDepth: recursionDepth + 1,
      })
    );
    return paths;
  } else if (firstNeighbour !== undefined && secondNeighbour === undefined) {
    if (!isSegmentIntersectsRects(start, firstNeighbour, bounds)) {
      paths.push(firstNeighbour);
      paths.push(
        ...getOrthogonalGapPoints({
          start: firstNeighbour,
          end,
          points,
          bounds,
          visited,
          cameFromNode: start,
          recursionDepth: recursionDepth + 1,
        })
      );

      return paths;
    }

    // if the nearest bridge point is intersecting with the bounds, add the next neighbour to the path
    /***
     * eg. For x=1, y=1, secondNeighbour is undefined
     *   nextNeighbour
     *       start      firstNeighbour
     *   secondNeighbour
     *      eg. For x=1, y=-1, secondNeighbour is undefined
     *   secondNeighbour
     *       start      firstNeighbour
     *   nextNeighbour
     */
    const allNeighbours = getAllAdjacentNeighbours(start, points);
    const nextNeighbour = direction.y === 1 ? allNeighbours.top : allNeighbours.bottom;
    paths.push(nextNeighbour);
    paths.push(
      ...getOrthogonalGapPoints({
        start: nextNeighbour,
        end,
        points,
        bounds,
        visited,
        cameFromNode: start,
        recursionDepth: recursionDepth + 1,
      })
    );
    return paths;
  }

  const isFirstNeighbourIntersects = isSegmentIntersectsRects(start, firstNeighbour, bounds);
  const isSecondNeighbourIntersects = isSegmentIntersectsRects(start, secondNeighbour, bounds);

  const isFirstNeighbourIntersectsEnd = isSegmentIntersectsRects(firstNeighbour, end, bounds);
  const isSecondNeighbourIntersectsEnd = isSegmentIntersectsRects(secondNeighbour, end, bounds);

  const firstNeighbourCost = isFirstNeighbourIntersectsEnd
    ? Infinity
    : getNearestManhattanDistance(firstNeighbour, end);
  const secondNeighbourCost = isSecondNeighbourIntersectsEnd
    ? Infinity
    : getNearestManhattanDistance(secondNeighbour, end);

  if (isFirstNeighbourIntersects && isSecondNeighbourIntersects) {
    return paths;
  }

  if (!isFirstNeighbourIntersects && !isSecondNeighbourIntersects) {
    if (firstNeighbourCost < secondNeighbourCost) {
      paths.push(firstNeighbour);
      paths.push(
        ...getOrthogonalGapPoints({
          start: firstNeighbour,
          end,
          points,
          bounds,
          visited,
          cameFromNode: start,
          recursionDepth: recursionDepth + 1,
        })
      );
    } else {
      paths.push(secondNeighbour);
      paths.push(
        ...getOrthogonalGapPoints({
          start: secondNeighbour,
          end,
          points,
          bounds,
          visited,
          cameFromNode: start,
          recursionDepth: recursionDepth + 1,
        })
      );
    }
  }

  if (isFirstNeighbourIntersects && !isSecondNeighbourIntersects) {
    paths.push(secondNeighbour);
    paths.push(
      ...getOrthogonalGapPoints({
        start: secondNeighbour,
        end,
        points,
        bounds,
        visited,
        cameFromNode: start,
        recursionDepth: recursionDepth + 1,
      })
    );
  }

  if (!isFirstNeighbourIntersects && isSecondNeighbourIntersects) {
    paths.push(firstNeighbour);
    paths.push(
      ...getOrthogonalGapPoints({
        start: firstNeighbour,
        end,
        points,
        bounds,
        visited,
        cameFromNode: start,
        recursionDepth: recursionDepth + 1,
      })
    );
  }

  if (isFirstNeighbourIntersects && isSecondNeighbourIntersects) {
    paths.push(firstNeighbour);
    paths.push(
      ...getOrthogonalGapPoints({
        start: firstNeighbour,
        end,
        points,
        bounds,
        visited,
        cameFromNode: start,
        recursionDepth: recursionDepth + 1,
      })
    );
  }

  return paths;
};

const getDirection = (start: XYPosition, end: XYPosition) => {
  return {
    x: start.x < end.x ? 1 : -1,
    y: start.y < end.y ? 1 : -1,
  };
};

const getAvailableAdjacentNeighbours = (gap: XYPosition, gaps: XYPosition[], cameFromNode?: XYPosition) => {
  const sameXCoords = gaps.filter(el => el.x === gap.x).sort((a, b) => a.y - b.y);
  const sameYCoords = gaps.filter(el => el.y === gap.y).sort((a, b) => a.x - b.x);

  const sameXGapIndex = sameXCoords.findIndex(el => el.y === gap.y);
  const sameYGapIndex = sameYCoords.findIndex(el => el.x === gap.x);

  const top = sameXCoords[sameXGapIndex - 1];
  const bottom = sameXCoords[sameXGapIndex + 1];
  const left = sameYCoords[sameYGapIndex - 1];
  const right = sameYCoords[sameYGapIndex + 1];

  return {
    top: top?.x === cameFromNode?.x && top?.y === cameFromNode?.y ? undefined : top,
    bottom: bottom?.x === cameFromNode?.x && bottom?.y === cameFromNode?.y ? undefined : bottom,
    left: left?.x === cameFromNode?.x && left?.y === cameFromNode?.y ? undefined : left,
    right: right?.x === cameFromNode?.x && right?.y === cameFromNode?.y ? undefined : right,
  };
};

const getAllAdjacentNeighbours = (gap: XYPosition, gaps: XYPosition[]) => {
  const sameXCoords = gaps.filter(el => el.x === gap.x).sort((a, b) => a.y - b.y);
  const sameYCoords = gaps.filter(el => el.y === gap.y).sort((a, b) => a.x - b.x);

  const sameXGapIndex = sameXCoords.findIndex(el => el.y === gap.y);
  const sameYGapIndex = sameYCoords.findIndex(el => el.x === gap.x);

  const top = sameXCoords[sameXGapIndex - 1];
  const bottom = sameXCoords[sameXGapIndex + 1];
  const left = sameYCoords[sameYGapIndex - 1];
  const right = sameYCoords[sameYGapIndex + 1];

  return { top, bottom, left, right };
};

const getNearestBridgePoints = ({
  source,
  target,
  gaps,
  direction,
  bounds,
}: {
  source: XYPosition;
  target: XYPosition;
  gaps: XYPosition[];
  direction: XYPosition;
  bounds: RFVisualizationNodeBounds[];
}) => {
  // get nodes in the direction we want to go and dont go beyond the end node
  const nodesInSameDirection = gaps.filter(point => {
    const dir = getDirection(source, point);
    const isSameDirection = dir.x === direction.x && dir.y === direction.y;
    const isNotBeyondTarget = point.x <= target.x && point.y <= target.y;

    return isSameDirection && isNotBeyondTarget;
  });

  // filter out that are intersecting with the bounds
  const nodesInSameDirectionAndNotIntersecting = nodesInSameDirection.filter(point => {
    return !isSegmentIntersectsRects(source, point, bounds);
  });

  const nearestNode = getNearestManhattanCoordinate(source, nodesInSameDirectionAndNotIntersecting, target);

  const yAlignedNode = { x: nearestNode.x, y: source.y };
  const xAlignedNode = { x: source.x, y: nearestNode.y };

  return {
    gapPoint: nearestNode,
    bridgePoint: getNearestManhattanCoordinate(target, [yAlignedNode, xAlignedNode], nearestNode),
  };
};

const isSegmentIntersectsRects = (input1: XYPosition, input2: XYPosition, bounds: RFVisualizationNodeBounds[]) => {
  return bounds.some(bound => {
    const { minX, minY, maxX, maxY } = bound;

    // Parametric form P(t) = input1 + t·(input2 − input1), 0 ≤ t ≤ 1
    const dx = input2.x - input1.x;
    const dy = input2.y - input1.y;

    // Liang-Barsky arrays
    const p = [-dx, dx, -dy, dy];
    const q = [input1.x - minX, maxX - input1.x, input1.y - minY, maxY - input1.y];

    let t0 = 0; // entering parameter
    let t1 = 1; // leaving parameter

    for (let i = 0; i < 4; i++) {
      if (p[i] === 0) {
        // Segment is parallel to this rectangle edge
        if (q[i] < 0) return false; // Parallel and outside ⇒ no intersection
        // Parallel and inside ⇒ no impact on t0, t1
      } else {
        const r = q[i] / p[i];
        if (p[i] < 0) {
          // Potentially entering the rectangle
          if (r > t1) return false; // Exits before it enters ⇒ outside
          if (r > t0) t0 = r;
        } else {
          // Potentially leaving the rectangle
          if (r < t0) return false; // Leaves before it enters ⇒ outside
          if (r < t1) t1 = r;
        }
      }
    }
    // If we survived the loop t0 ≤ t1 and the segment intersects the rectangle
    return true;
  });
};

// check if the path is orthogonal, return empty array if not
const getOrthogonalPaths = (path: XYPosition[]) => {
  if (!Array.isArray(path) || path.length < 2) return [];

  for (let i = 1; i < path.length; i++) {
    const prev = path[i - 1];
    const curr = path[i];
    if (!curr) {
      return [];
    }
    // Check if segment is either vertical or horizontal
    const isVertical = prev.x === curr.x;
    const isHorizontal = prev.y === curr.y;
    if (!(isVertical || isHorizontal)) {
      return []; // Non-orthogonal segment found
    }
  }
  return path;
};

const removeDetourPoints = (points: XYPosition[], axis: 'x' | 'y') => {
  const result = [];

  for (const p of points) {
    //  skip consecutive duplicates
    if (result.length && nearEqual(result[result.length - 1].x, p.x) && nearEqual(result[result.length - 1].y, p.y)) {
      continue;
    }

    result.push({ x: p.x, y: p.y });

    // if the last three points reveal a horizontal detour, remove the middle one
    let changed = true;
    while (changed && result.length >= 3) {
      changed = false;
      const n = result.length;
      const a = result[n - 3];
      const b = result[n - 2];
      const c = result[n - 1];

      // all three share the same Y ⇒ horizontal line
      if (shouldRemoveInBetweenPoint(a, b, c, axis)) {
        result.splice(n - 2, 1); // remove b
        changed = true; // re-check with new triplet
      }
    }
  }
  return result;
};

const shouldRemoveInBetweenPoint = (a: XYPosition, b: XYPosition, c: XYPosition, primaryAxis: 'x' | 'y') => {
  const secondaryAxis = primaryAxis === 'x' ? 'y' : 'x';

  // all three share the same Y ⇒ horizontal line
  if (nearEqual(a[secondaryAxis], b[secondaryAxis]) && nearEqual(b[secondaryAxis], c[secondaryAxis])) {
    const d1 = b[primaryAxis] - a[primaryAxis];
    const d2 = c[primaryAxis] - b[primaryAxis];

    // b lies between a and c (midpoint)
    // U-turn
    return isBetween(a[primaryAxis], b[primaryAxis], c[primaryAxis]) || d1 * d2 < 0;
  }

  return false;
};

export const removeAllDetourPoints = (points: XYPosition[]) => {
  const horizontalOptimized = removeDetourPoints(points, 'x');

  return removeDetourPoints(horizontalOptimized, 'y');
};

export const removeDuplicatedPoints = (points: XYPosition[]) => {
  const visited = new Set<string>();
  const result = [];

  for (const point of points) {
    if (visited.has(point.x + '-' + point.y)) {
      continue;
    }

    visited.add(point.x + '-' + point.y);
    result.push(point);
  }

  return result;
};

const nearEqual = (a: number, b: number) => {
  // TODO: this is a hack to check if two numbers are equal or near equal, we should use a proper epsilon value
  const EPS = 1e-9;
  return Math.abs(a - b) < EPS;
};

const isBetween = (a: number, b: number, c: number) => {
  return (a <= b && b <= c) || (c <= b && b <= a);
};

const isOrthogonal = (point1: XYPosition, point2: XYPosition) => {
  return point1.x === point2.x || point1.y === point2.y;
};
