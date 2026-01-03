import { cn, truncateString } from '@/lib/utils';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { type NodeProps } from '@xyflow/react';
import RFGroupHandles from './RFGroupHandles';
import { memo, useMemo } from 'react';
import { getVisualizationClusterGroupId } from '@/lib/visualization/getVisualizationEdges';
import { useSignals } from '@preact/signals-react/runtime';
import { isFocusedNode, isNamespaceLoading, isSelectedNode, misc } from '@/signals/visualiation/misc';
import { getHealthStatusColor } from '@/lib/visualization/health';
import { RefreshingIcon } from '@/components/svgs/RefreshingIcon';
import PlaceholderObjectGroupIcon from '@/components/svgs/k8s/PlaceholderObjectGroupIcon';

const RFPlaceHolderNamespaceGroupNode = ({ data, id: nodeId }: NodeProps<RFVisualizationNode>) => {
  useSignals();
  const { label, showPlaceholder, healthStatus } = data;

  const isSelected = isSelectedNode(nodeId);
  const isFocused = isFocusedNode(nodeId);
  const isLoading = isNamespaceLoading(data.label);

  const id = useMemo(() => getVisualizationClusterGroupId(data), [data]);

  const healthStatusColors = useMemo(() => {
    return getHealthStatusColor({ status: healthStatus, isSelected: isSelected || isFocused });
  }, [healthStatus, isSelected, isFocused]);

  return (
    <div
      style={{
        height: '230px',
        width: 'unset',
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
        'w-full rounded-sm bg-[#F9FAFB80] border-[1px] border-text-200',
        (isSelected || isFocused) && 'shadow-xl',
        misc.value.isLoading && 'opacity-75 cursor-not-allowed'
      )}
    >
      {!showPlaceholder && <RFGroupHandles />}

      <div className="w-full h-full flex items-center justify-center relative">
        {isLoading ? (
          <>
            <div className="translate-y-[30px]">
              <RefreshingIcon className="w-10 h-10 text-black animate-spin " />
            </div>
            <div className="rounded-[8px] absolute pl-4 pt-4 inset-0 flex items-start justify-start pointer-events-none">
              <span className="block text-text-950 rounded-[8px] text-4xl font-normal text-start px-4 py-2  bg-text-100">
                {truncateString(label, 31)}
              </span>
            </div>
          </>
        ) : (
          <>
            <PlaceholderObjectGroupIcon className="w-full h-full translate-y-[30px]" />
            <div className="rounded-[8px] absolute pl-4 pt-4 inset-0 flex items-start justify-start pointer-events-none">
              <span className="block text-text-950 rounded-[8px] text-4xl font-normal text-start px-4 py-2  bg-text-100">
                {truncateString(label, 31)}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default memo(RFPlaceHolderNamespaceGroupNode);
