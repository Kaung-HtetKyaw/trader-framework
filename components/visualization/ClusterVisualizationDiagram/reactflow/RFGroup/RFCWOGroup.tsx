import { cn } from '@/lib/utils';
import { RFVisualizationNode } from '@/types/visualization/react-flow';
import { type NodeProps } from '@xyflow/react';
import RFGroupHandles from './RFGroupHandles';
import { memo, useMemo } from 'react';
import { getVisualizationClusterGroupId } from '@/lib/visualization/getVisualizationEdges';
import { useSignals } from '@preact/signals-react/runtime';
import { misc } from '@/signals/visualiation/misc';

const RFCWOGroupNode = ({ data, height }: NodeProps<RFVisualizationNode>) => {
  useSignals();
  const { label, icon, showPlaceholder, hidden, apiVersions } = data;

  const id = useMemo(() => getVisualizationClusterGroupId(data), [data]);
  const showDetails = useMemo(() => !hidden && !showPlaceholder, [showPlaceholder, hidden]);

  const labelWithVerions = useMemo(() => {
    if (!apiVersions.length) {
      return label;
    }

    return `${label} (${apiVersions.join(', ')})`;
  }, [apiVersions, label]);

  return (
    <div
      style={{
        height,
      }}
      id={id}
      className={cn(
        'w-full rounded-sm bg-text-50 border-[1px] border-text-200',
        misc.value.isLoading && 'opacity-75 cursor-not-allowed'
      )}
    >
      {!showPlaceholder && <RFGroupHandles />}

      {showDetails && (
        <div
          className={cn(`flex h-[24px] w-fit items-center justify-center rounded-br-[8px] rounded-tl-[8px] p-[8px]`)}
        >
          <div className="flex flex-row items-center gap-2 text-left text-[10px] rounded px-3 py-1 bg-text-100">
            {icon && icon({})}
            <span className=" overflow-hidden whitespace-nowrap text-ellipsis text-text-600">{labelWithVerions}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(RFCWOGroupNode);
