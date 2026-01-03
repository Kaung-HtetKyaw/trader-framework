import { cn } from '@/lib/utils';
import { RFVisualizationEdge } from '@/types/visualization/react-flow';
import { BaseEdge, getSmoothStepPath, Position, type EdgeProps } from '@xyflow/react';
import { useMemo } from 'react';

// NOTE: This comes from `@/components/visualization/ClusterVisualizationDiagram/reactflow/RFNode.tsx`
//       the icon was translated to the left by 50% which is 18px
export const TRANSLATED_OFFSET = 18;

const RFSmoothStepEdge = ({
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

  const [edgePath] = useMemo(() => {
    return getSmoothStepPath({
      sourcePosition,
      targetPosition,
      sourceX,
      sourceY,
      targetX: targetPosition === Position.Left ? targetX + TRANSLATED_OFFSET : targetX,
      targetY,
    });
    // Never re-run this function,
    // TODO: refactor to optimize
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

export default RFSmoothStepEdge;
