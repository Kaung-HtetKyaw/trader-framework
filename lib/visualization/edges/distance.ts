import { XYPosition } from '@xyflow/react';

export const getNearestManhattanCoordinate = (
  input: XYPosition,
  coordinates: XYPosition[],
  defaultCoordinate: XYPosition
) => {
  if (!input || typeof input.x !== 'number' || typeof input.y !== 'number') {
    throw new Error('Input coordinate must have numeric x and y properties');
  }

  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    return defaultCoordinate;
  }

  let nearest = input;
  let minDist = Infinity;

  for (const coord of coordinates) {
    if (typeof coord.x !== 'number' || typeof coord.y !== 'number') continue;
    // Manhattan distance: |x1 - x2| + |y1 - y2|
    const dist = getNearestManhattanDistance(input, coord);
    if (dist < minDist) {
      minDist = dist;
      nearest = coord;
    }
  }

  return nearest;
};

export const getNearestManhattanDistance = (source: XYPosition, target: XYPosition) => {
  return Math.abs(source.x - target.x) + Math.abs(source.y - target.y);
};
