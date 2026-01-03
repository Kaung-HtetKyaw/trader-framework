import { RFVisualizationNodeBounds } from '@/types/visualization/react-flow';
import { XYPosition } from '@xyflow/react';
import { getNearestManhattanCoordinate } from './distance';
import { K8sObjectTypeEnum, K8sObjectTypes } from '@/types/visualization/k8sObjects';
import { BoundTypeEnum, BoundTypes } from '@/types/visualization';
import { DEFAULT_VISUALIZATION_DIMENSIONS, getHorizontalChunkedArray } from '..';
import { DEFAULT_VISUALIZATION_MATRIX_DIMENSIONS } from '../nodes/matrixLayout';

export const BOUND_OFFSET = 15;
export type TRBLPosition = 'top' | 'right' | 'bottom' | 'left';

// get nearest point from gap points depending on the source's position
// source position bottom => get nearest point from points >= sourceY, ......
export const getNearestGapPoint = (source: XYPosition, handlePosition: TRBLPosition, points: XYPosition[]) => {
  if (handlePosition === 'bottom') {
    const pointsBelow = points.filter(point => point.y >= source.y);
    return getNearestManhattanCoordinate(source, pointsBelow, source);
  }

  if (handlePosition === 'top') {
    const pointsAbove = points.filter(point => point.y <= source.y);
    return getNearestManhattanCoordinate(source, pointsAbove, source);
  }

  if (handlePosition === 'left') {
    const pointsLeft = points.filter(point => point.x <= source.x);
    return getNearestManhattanCoordinate(source, pointsLeft, source);
  }

  const pointsRight = points.filter(point => point.x >= source.x);
  return getNearestManhattanCoordinate(source, pointsRight, source);
};

// get the new gap points to bridge the source coordinate to the nearest gap point coordinate so that the path is orthogonal
export const getBridgeGapPoint = (coord: XYPosition, handlePosition: TRBLPosition, points: XYPosition[]) => {
  const nearestGapPoint = getNearestGapPoint(coord, handlePosition, points);

  if (handlePosition === 'bottom' || handlePosition === 'top') {
    return {
      x: coord.x,
      y: nearestGapPoint.y,
    };
  }

  return {
    x: nearestGapPoint.x,
    y: coord.y,
  };
};

/**
 * Returns an array of gap points positioned around bounds organized in horizontal rows.
 * Each bound generates 4 gap points:
 * - topRight: right edge + gap/2, top edge - padding
 * - topCenter: horizontal center, row center - padding
 * - bottomCenter: horizontal center, bottom edge + gap/2
 * - bottomRight: right edge + gap/2, bottom edge + gap/2
 *
 *                        X           X
 *             ────────────────────
 *            |                    |
 *            |                    |
 *            |                    |
 *             ────────────────────
 *                       X            X
 */
export const getGapPointsByHorizontalCenter = (bounds: RFVisualizationNodeBounds[]) => {
  const boundRows = getHorizontalChunkedArray(bounds, DEFAULT_VISUALIZATION_MATRIX_DIMENSIONS.entityPerRow);

  return boundRows
    .map(row => {
      const rowHeight = row.reduce((acc, curr) => {
        if (curr.maxY > acc) {
          return curr.maxY;
        }
        return acc;
      }, 0);
      const rowYCenter = rowHeight / 2;

      return row
        .map(bound => {
          const topOffset = DEFAULT_VISUALIZATION_DIMENSIONS.entityPadding;
          const offset = DEFAULT_VISUALIZATION_DIMENSIONS.entityGap / 2;

          const topRight = { x: bound.maxX + offset, y: bound.minY - topOffset };
          const topCenter = { x: (bound.minX + bound.maxX) / 2, y: rowYCenter - topOffset };
          const bottomCenter = { x: (bound.minX + bound.maxX) / 2, y: bound.maxY + offset };
          const bottomRight = { x: bound.maxX + offset, y: bound.maxY + offset };

          return [topRight, topCenter, bottomCenter, bottomRight];
        })
        .flat();
    })
    .flat();
};

/**
 *   1. For each bound in bounds array:
 *     - Calculate center points (horizontalCenter, verticalCenter)
 *     - Generate 8 gap points with BOUND_OFFSET (15px) spacing
 *
 *  2. Flatten all gap points into single array
 *
 *  3. Remove duplicate coordinates using getUniqueCoordinatesMap
 *
 *  4. Return unique gap points array
 *
 *             X ────────────────────  X
 *              |                    |
 *            X |                    | X
 *              |                    |
 *             X ────────────────────  X
 */
export const getGapPointsByBoundEdges = (bounds: RFVisualizationNodeBounds[]) => {
  return getUniqueCoordinatesMap(bounds.map(getGapPointsFromRectBounds).flat());
};

const getGapPointsFromRectBounds = ({ minX, minY, maxX, maxY }: RFVisualizationNodeBounds) => {
  const horizontalCenter = (minX + maxX) / 2;
  const verticalCenter = (minY + maxY) / 2;

  const topCenter = {
    x: horizontalCenter - BOUND_OFFSET,
    y: minY - BOUND_OFFSET,
  };

  const topLeft = {
    x: minX - BOUND_OFFSET,
    y: minY - BOUND_OFFSET,
  };

  const topRight = {
    x: maxX + BOUND_OFFSET,
    y: minY - BOUND_OFFSET,
  };

  const bottomCenter = {
    x: horizontalCenter - BOUND_OFFSET,
    y: maxY + BOUND_OFFSET,
  };

  const bottomLeft = {
    x: minX - BOUND_OFFSET,
    y: maxY + BOUND_OFFSET,
  };

  const bottomRight = {
    x: maxX + BOUND_OFFSET,
    y: maxY + BOUND_OFFSET,
  };

  const leftCenter = {
    x: minX - BOUND_OFFSET,
    y: verticalCenter - BOUND_OFFSET,
  };

  const rightCenter = {
    x: maxX + BOUND_OFFSET,
    y: verticalCenter - BOUND_OFFSET,
  };

  return getUniqueCoordinatesMap([
    topCenter,
    bottomCenter,
    leftCenter,
    rightCenter,
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  ]);
};

const getUniqueCoordinatesMap = (coordinates: XYPosition[]): XYPosition[] => {
  const uniqueMap = new Map<string, XYPosition>();

  coordinates.forEach(coord => {
    const key = `${coord.x},${coord.y}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, coord);
    }
  });

  return Array.from(uniqueMap.values());
};

export const getBoundType = (nodeType: K8sObjectTypeEnum): BoundTypeEnum => {
  if (nodeType === K8sObjectTypes.Container) {
    return BoundTypes.Container;
  }

  if (nodeType === K8sObjectTypes.Namespace) {
    return BoundTypes.Namespaced;
  }

  if (nodeType === K8sObjectTypes.Cluster) {
    return BoundTypes.Cluster;
  }

  return BoundTypes.ClusterWide;
};
