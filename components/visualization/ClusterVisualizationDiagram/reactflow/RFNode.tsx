import { DEFAULT_VISUALIZATION_DIMENSIONS } from '@/lib/visualization';
import { Position, useEdges, type NodeProps } from '@xyflow/react';
import { memo, useMemo } from 'react';
import NodePlaceholder from './placeholders/NodePlaceholder';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import RFGroupHandles from './RFGroup/RFGroupHandles';
import { cn } from '@/lib/utils';
import ContainerIcon from '@/components/svgs/k8s/ContainerIcon';
import { useSignals } from '@preact/signals-react/runtime';
import { isSelectedNode, misc } from '@/signals/visualiation/misc';
import NodeTooltip from '@/components/CustomTooltip';
import { getHealthStatusColor } from '@/lib/visualization/health';
import { computed } from '@preact/signals-react';

const RFNode = ({ data, id }: NodeProps<RFVisualizationNode>) => {
  useSignals();
  const { showPlaceholder: showPlaceholderProp, hidden, healthStatus } = data;
  const edges = useEdges();

  const shouldShowPlaceholder = useMemo(() => {
    return showPlaceholderProp && !hidden;
  }, [hidden, showPlaceholderProp]);

  const shouldHideAll = useMemo(() => {
    return hidden && showPlaceholderProp;
  }, [hidden, showPlaceholderProp]);

  const isSelected = isSelectedNode(id);
  const isFocused = computed(() => misc.value.focusedNode === id);

  const showSourceHandle = useMemo(() => {
    return edges.some(connection => connection.source === id);
  }, [edges, id]);

  const sourcePosition = useMemo(
    () => ({
      position: Position.Right,
      shouldShow: showSourceHandle,
      offset: 10,
    }),
    [showSourceHandle]
  );

  const targetPosition = useMemo(
    () => ({
      position: Position.Left,
      shouldShow: false,
    }),
    []
  );

  const healthStatusColor = useMemo(() => {
    return getHealthStatusColor({ status: healthStatus, isSelected: isSelected });
  }, [healthStatus, isSelected]);

  const tooltipContent = useMemo(
    () => (
      <NodeTooltip label={data.label || ''}>
        <div
          style={{
            width: `${DEFAULT_VISUALIZATION_DIMENSIONS.container.width}px`,
            height: `${DEFAULT_VISUALIZATION_DIMENSIONS.container.height}px`,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          className="flex items-center "
        >
          <div className="flex flex-row items-center justify-center">
            {data.icon ? (
              <div className="translate-x-[50%]">
                {data.icon({
                  style: {
                    color: healthStatusColor.color,
                  },
                  className: cn('w-9 h-9'),
                })}
              </div>
            ) : (
              <ContainerIcon
                style={{
                  color: healthStatusColor.color,
                }}
                className={cn('translate-x-[50%] w-9 h-9')}
              />
            )}

            <div
              style={{
                width: `${DEFAULT_VISUALIZATION_DIMENSIONS.container.width - 36}px`,
                height: `${DEFAULT_VISUALIZATION_DIMENSIONS.container.height}px`,
                borderColor: healthStatusColor.border,
                backgroundColor: healthStatusColor.background,
              }}
              className={cn(
                'rounded-[4px] flex flex-col py-[2px] items-start justify-center border-[none]  pl-[16px] pr-[8px] text-[10px] text-gray-800',
                (isSelected || isFocused.value) && 'border-[1px] shadow-xl'
              )}
            >
              <span
                style={{
                  maxWidth: `${DEFAULT_VISUALIZATION_DIMENSIONS.container.width - 50}px`,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  display: 'block',
                }}
                className="flex items-center pl-2 pr-2"
              >
                {data.label as string}
              </span>
              <div className="flex flex-row  items-center min-w-15 gap-1 pl-2">
                <p className="text-text-500 text-[8px]">{data.type}</p>
              </div>
            </div>
          </div>
        </div>
      </NodeTooltip>
    ),
    [data, isSelected, healthStatus, isFocused, healthStatusColor]
  );

  if (shouldShowPlaceholder) {
    return (
      <div className="ml-[15px]">
        <NodePlaceholder />
      </div>
    );
  }

  if (shouldHideAll) {
    return null;
  }

  return (
    <div className={cn(misc.value.isLoading && 'opacity-75 cursor-not-allowed')}>
      {!showPlaceholderProp && <RFGroupHandles source={sourcePosition} target={targetPosition} />}
      {tooltipContent}
    </div>
  );
};

export default memo(RFNode);
