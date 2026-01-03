import { cn } from '@/lib/utils';
import { DEFAULT_VISUALIZATION_DIMENSIONS } from '@/lib/visualization';
import { memo, useCallback, useRef, useState } from 'react';

export type CustomTooltipProps = {
  children: React.ReactNode;
  label: string;
  enabled?: boolean;
  containerClassName?: string;
  labelContentClassName?: string;
  labelContainerClassName?: string;
};

const CustomTooltip = (props: CustomTooltipProps) => {
  const { children, enabled = true, containerClassName, label, labelContentClassName, labelContainerClassName } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const toolTipRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<SVGSVGElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);

  const handleMouseMove = useCallback(() => {
    if (!enabled) return;
    setTooltipVisible(true);
  }, [enabled]);

  const handleMouseLeave = useCallback(() => {
    if (!enabled) return;
    setTooltipVisible(false);
  }, [enabled]);

  return (
    <div className={cn('relative max-w-full', containerClassName)}>
      <div ref={containerRef} onMouseEnter={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      <div
        ref={toolTipRef}
        style={{
          left: `50%`,
          top: `-${DEFAULT_VISUALIZATION_DIMENSIONS.container.height / 2}px`,
        }}
        className={cn(
          'absolute top-0 -translate-x-1/2 whitespace-nowrap transition-opacity duration-100 text-xs shadow-xl font-medium rounded-[5px] text-black  pointer-events-none ',
          !tooltipVisible && 'opacity-0 pointer-events-none '
        )}
      >
        <div className="relative px-2 py-1  bg-white rounded-[5px] ">
          <div className={cn('flex flex-row  items-center min-w-15 gap-1', labelContainerClassName)}>
            <p className={cn('body-2', labelContentClassName)}>{label}</p>
          </div>

          <svg
            className="absolute bottom-0 shadow-xl left-1/2 translate-x-[-50%] translate-y-full"
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
            ref={tipRef}
          >
            <path d="M5.59933 6.07227L0.394531 1.02163e-06L10.8041 0L5.59933 6.07227Z" fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default memo(CustomTooltip);
