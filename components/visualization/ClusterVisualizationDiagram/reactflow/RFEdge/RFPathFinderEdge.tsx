import { cn } from '@/lib/utils';
import { getSmartSmoothOrthogonalPath } from '@/lib/visualization/edges/smartSmoothOrthogonalPath';
import { getBounds, getGapPoints } from '@/signals/visualiation/nodes';
import { RFVisualizationEdge } from '@/types/visualization/react-flow';
import { BaseEdge, type EdgeProps } from '@xyflow/react';

const RFPathFinderEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  id,
  markerEnd,
  data,
  style,
}: EdgeProps<RFVisualizationEdge>) => {
  const { hidden } = data || {};

  const bounds = getBounds(data.sourceType);

  const gapPoints = getGapPoints(data.sourceType);

  const [edgePath] = getSmartSmoothOrthogonalPath({
    source: { x: sourceX, y: sourceY },
    target: { x: targetX, y: targetY },
    sourcePosition,
    targetPosition,
    gapPoints,
    bounds,
    visited: new Set(),
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      className={cn('z-[9999] stroke-2', hidden && 'stroke-transparent')}
      markerEnd={markerEnd}
      style={style}
    />
  );
};

export default RFPathFinderEdge;
