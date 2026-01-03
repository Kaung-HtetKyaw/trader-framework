import { cn } from '@/lib/utils';
import { getVisualizationClusterGroupId } from '@/lib/visualization/getVisualizationEdges';
import { misc } from '@/signals/visualiation/misc';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { useSignals } from '@preact/signals-react/runtime';
import { type NodeProps } from '@xyflow/react';
import { memo, useMemo } from 'react';

const RFClusterGroupNode = ({ height, data }: NodeProps<RFVisualizationNode>) => {
  useSignals();
  const id = useMemo(() => getVisualizationClusterGroupId(data), [data]);

  return (
    <div
      id={id}
      style={{ height: height }}
      className={cn('w-full border-none shadow-none', misc.value.isLoading && 'opacity-75 cursor-not-allowed')}
    ></div>
  );
};

export default memo(RFClusterGroupNode);
