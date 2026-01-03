import { cn } from '@/lib/utils';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { type NodeProps } from '@xyflow/react';
import { memo, useMemo } from 'react';
import { useSignals } from '@preact/signals-react/runtime';
import { misc } from '@/signals/visualiation/misc';

const RFHierarchyGroupNode = ({ data, height }: NodeProps<RFVisualizationNode>) => {
  useSignals();
  const { showPlaceholder, hidden } = data;

  const showDetails = useMemo(() => !hidden && !showPlaceholder, [showPlaceholder, hidden]);

  return (
    <div
      style={{ height: height }}
      className={cn('w-full rounded-sm ', misc.value.isLoading && 'opacity-75 cursor-not-allowed')}
    >
      {showDetails && (
        <div
          className={cn(`flex h-[24px] w-fit items-center justify-center rounded-br-[8px] rounded-tl-[8px] p-[8px]`)}
        ></div>
      )}
    </div>
  );
};

export default memo(RFHierarchyGroupNode);
