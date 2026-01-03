import { cn } from '@/lib/utils';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { type NodeProps } from '@xyflow/react';
import RFGroupHandles from './RFGroupHandles';
import { memo, useMemo } from 'react';
import PodPlaceholder from '../placeholders/PodPlaceholder';
import { useSignals } from '@preact/signals-react/runtime';
import { isSelectedNode, misc } from '@/signals/visualiation/misc';
import { computed } from '@preact/signals-react';

const RFPodGroupNode = ({ data, height, id: nodeId }: NodeProps<RFVisualizationNode>) => {
  useSignals();
  const { label, icon, showPlaceholder, hidden } = data;

  const isSelected = isSelectedNode(nodeId);
  const isFocused = computed(() => misc.value.focusedNode === nodeId);

  const showDetails = useMemo(() => !hidden && !showPlaceholder, [showPlaceholder, hidden]);

  return (
    <div
      style={{ height: height }}
      className={cn(
        'w-full rounded-sm border-text-300 border-[1px] border-dashed',
        (isSelected || isFocused.value) && 'border-secondary-500 border-[1px] border-solid shadow-xl',
        misc.value.isLoading && 'opacity-75 cursor-not-allowed'
      )}
    >
      {!showPlaceholder && <RFGroupHandles />}

      {showPlaceholder && <PodPlaceholder />}

      {showDetails && (
        <div
          className={cn(`flex h-[24px] w-fit items-center justify-center rounded-br-[8px] rounded-tl-[8px] p-[8px]`)}
        >
          <div className="flex flex-row items-center gap-2 text-left text-[10px]">
            {icon && icon({})}
            <span className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis"> {label}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RFPodGroupNode);
