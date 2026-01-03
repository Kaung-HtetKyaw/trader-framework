import { type NodeProps } from '@xyflow/react';
import { JSX, memo, useMemo } from 'react';
import { VisualizationK8NodeTypeEnum } from '@/types/visualization';
import NodePlaceholder from './placeholders/NodePlaceholder';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import RFGroupHandles from './RFGroup/RFGroupHandles';
import { cn } from '@/lib/utils';
import ContainerIcon from '@/components/svgs/k8s/ContainerIcon';
import { DEFAULT_VISUALIZATION_DIMENSIONS } from '@/lib/visualization';
import { isSelectedNode, misc } from '@/signals/visualiation/misc';
import { computed } from '@preact/signals-react';

export type NormalNodeData = {
  label: string;
  description: string;
  icon?: () => JSX.Element;
  type: VisualizationK8NodeTypeEnum;
  hidden?: boolean;
  placeholder?: boolean;
};

const RFNode = ({ data, id }: NodeProps<RFVisualizationNode>) => {
  const { showPlaceholder: showPlaceholderProp, hidden } = data;

  const isSelected = isSelectedNode(id);
  const isFocused = computed(() => misc.value.focusedNode === id);

  const shouldShowPlaceholder = useMemo(() => {
    return showPlaceholderProp && !hidden;
  }, [hidden, showPlaceholderProp]);

  const shouldHideAll = useMemo(() => {
    return hidden && showPlaceholderProp;
  }, [hidden, showPlaceholderProp]);

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
    <div>
      {!showPlaceholderProp && <RFGroupHandles />}

      <div
        style={{
          width: `${DEFAULT_VISUALIZATION_DIMENSIONS.container.width}px`,
          height: `${DEFAULT_VISUALIZATION_DIMENSIONS.container.height}px`,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
        className="flex items-center"
      >
        <div className="flex flex-row items-center justify-center">
          {data.icon ? (
            <div className="translate-x-[50%]">{data.icon({})}</div>
          ) : (
            <ContainerIcon className="translate-x-[50%]" />
          )}

          <div
            className={cn(
              'rounded-[4px] h-[24px] flex items-center border-[none] bg-[#DFF0FF]  pl-[16px] pr-[8px] text-[10px] text-gray-800',
              (isSelected || isFocused) && 'border-secondary-500 border-[1px] shadow-xl'
            )}
          >
            <span
              style={{
                width: `${DEFAULT_VISUALIZATION_DIMENSIONS.container.width - 50}px`,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
              className="h-full flex items-center"
            >
              {' '}
              {data.label as string}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(RFNode);
