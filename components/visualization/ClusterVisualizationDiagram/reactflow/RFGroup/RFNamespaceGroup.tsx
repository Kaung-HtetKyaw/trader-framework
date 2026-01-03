import { cn } from '@/lib/utils';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { type NodeProps } from '@xyflow/react';
import RFGroupHandles from './RFGroupHandles';
import { memo, useMemo } from 'react';
import { getVisualizationClusterGroupId } from '@/lib/visualization/getVisualizationEdges';
import { useSignals } from '@preact/signals-react/runtime';
import { isFocusedNode, isSelectedNode, misc } from '@/signals/visualiation/misc';
import { getHealthStatusColor, getNamespaceHealthStatusLabelBackground } from '@/lib/visualization/health';

const RFNamespaceGroupNode = ({ data, height, id: nodeId }: NodeProps<RFVisualizationNode>) => {
  useSignals();
  const { label, icon, showPlaceholder, hidden, healthStatus } = data;

  const isSelected = isSelectedNode(nodeId);
  const isFocused = isFocusedNode(nodeId);

  const id = useMemo(() => getVisualizationClusterGroupId(data), [data]);

  const showDetails = useMemo(() => !hidden && !showPlaceholder, [showPlaceholder, hidden]);

  const healthStatusColors = useMemo(() => {
    return getHealthStatusColor({ status: healthStatus, isSelected: isSelected || isFocused });
  }, [healthStatus, isSelected, isFocused]);

  const namespaceLabelBackgroundColor = useMemo(() => {
    return getNamespaceHealthStatusLabelBackground(healthStatus);
  }, [healthStatus]);

  return (
    <div
      style={{
        height,
        ...(isSelected || isFocused
          ? {
              borderColor: healthStatusColors.border,
              borderWidth: '1px',
              borderStyle: 'solid',
              backgroundColor: healthStatusColors.background,
            }
          : {}),
      }}
      id={id}
      className={cn(
        'w-full rounded-sm bg-text-50 border-[1px] border-text-200',
        (isSelected || isFocused) && 'shadow-xl',
        misc.value.isLoading && 'opacity-75 cursor-not-allowed'
      )}
    >
      {!showPlaceholder && <RFGroupHandles />}

      {showDetails && (
        <div
          className={cn(`flex h-[24px] w-fit items-center justify-center rounded-br-[8px] rounded-tl-[8px] p-[8px]`)}
        >
          <div
            className="flex flex-row items-center gap-2 text-left text-[10px] rounded px-3 py-1"
            style={{ backgroundColor: namespaceLabelBackgroundColor }}
          >
            {icon && icon({})}
            <span className="max-w-[200px] overflow-hidden whitespace-nowrap text-ellipsis text-text-600">
              {' '}
              {label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RFNamespaceGroupNode);
