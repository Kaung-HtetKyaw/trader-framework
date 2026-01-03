import config from '@/lib/config';
import { cn } from '@/lib/utils';
import { Handle, Position } from '@xyflow/react';
import { memo, useMemo } from 'react';

export type RFGroupHandlesProps = {
  source?: HandleContext;
  target?: HandleContext;
};

export type HandleContext = {
  position: Position;
  shouldShow: boolean;
  offset?: number;
};

const RFGroupHandles = ({ source, target }: RFGroupHandlesProps) => {
  const sourceContext = useMemo(() => {
    if (!source) {
      return {
        position: Position.Top,
        shouldShow: false,
        offset: 0,
      };
    }

    return source;
  }, [source]);

  const targetContext = useMemo(() => {
    if (!target) {
      return {
        position: Position.Bottom,
        shouldShow: false,
        offset: 0,
      };
    }

    return target;
  }, [target]);

  return (
    <>
      <Handle
        className={cn(
          targetContext.shouldShow
            ? 'w-3 h-3 !bg-secondary-500 border-2 border-white pointer-events-auto'
            : 'w-0 h-0 !bg-transparent border-0 border-none opacity-0 pointer-events-none'
        )}
        id={`target-${targetContext.position}`}
        type="target"
        position={targetContext.position}
        isConnectable={config.NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_CONNECTABLE}
      />

      <Handle
        style={{
          transform: `translate(${sourceContext.offset ? `-${sourceContext.offset}px` : '-50%'}, -50%)`,
        }}
        className={cn(
          sourceContext.shouldShow
            ? 'w-3 h-3 !bg-secondary-500 border-2 border-white pointer-events-auto'
            : 'w-0 h-0 !bg-transparent border-0 border-none opacity-0 pointer-events-none'
        )}
        id={`source-${sourceContext.position}`}
        type="source"
        position={sourceContext.position}
        isConnectable={config.NEXT_PUBLIC_CLUSTER_VISUALIZATION_NODE_CONNECTABLE}
      />
    </>
  );
};

export default memo(RFGroupHandles);
