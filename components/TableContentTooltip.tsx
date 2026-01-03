import { cn } from '@/lib/utils';
import { Row, Table } from '@tanstack/react-table';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type TableContentTooltipProps = {
  children: React.ReactNode;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: Row<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: Table<any>;
  containerClassName?: string;
  labelContentClassName?: string;
  labelContainerClassName?: string;
};

const TableContentTooltip = (props: TableContentTooltipProps) => {
  const { children, containerClassName, label, labelContentClassName, labelContainerClassName, row, table } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const toolTipRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<SVGSVGElement>(null);
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [isTruncated, setIsTruncated] = useState(false);

  const rows = useMemo(() => table.getRowModel().rows, [table]);

  const isFirstRow = useMemo(() => {
    return row.index === 0;
  }, [row.index]);

  const isLastRow = useMemo(() => {
    return row.index === rows.length - 1 || row.index === rows.length - 2;
  }, [rows.length, row.index]);

  const handleMouseMove = useCallback(() => {
    if (!isTruncated) return;
    setTooltipVisible(true);
  }, [isTruncated]);

  const handleMouseLeave = useCallback(() => {
    if (!isTruncated) return;
    setTooltipVisible(false);
  }, [isTruncated]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const handleResize = () => {
      if (!containerRef.current) {
        return;
      }
      const containerRect = containerRef.current.getBoundingClientRect();

      setTooltipPosition({
        x: containerRect.x,
        y: containerRect.y,
        width: containerRect.width,
        height: containerRect.height,
      });

      const originalLabelWidth = label.length * 6;
      const currentWidth = containerRef.current.scrollWidth;

      // NOTE: This is still not perfect, the width varies depending on the font size, the actual letter width is not constant.
      // NOTE: This is a work around to check if the label is truncated since OS is responsible for painting the truncated text and the actual truncated text content is not visible in the DOM
      setIsTruncated(originalLabelWidth > currentWidth && Math.abs(originalLabelWidth - currentWidth) > 10);
    };

    // NOTE: applying 1s delay to mitigate the stacked table (for example in GitOps Setting Page) loading
    setTimeout(() => {
      handleResize();
    }, 1000);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cn('max-w-full', containerClassName)}>
      <div ref={containerRef} onMouseEnter={handleMouseMove} onMouseLeave={handleMouseLeave}>
        {children}
      </div>

      <div
        ref={toolTipRef}
        style={{
          top: `${tooltipPosition.y + tooltipPosition.height / 2}px`,
          left: `${tooltipPosition.x + tooltipPosition.width / 2}px`,
        }}
        // NOTE: using fixed position to avoid the tooltip from being hidden by the parent container (table)
        className={cn(
          'fixed z-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-100 text-xs  font-medium rounded-[5px] text-black  pointer-events-none ',
          !tooltipVisible && 'opacity-0 pointer-events-none ',
          isFirstRow && 'top-[25px]',
          isLastRow && 'bottom-[25px]',
          !isFirstRow && !isLastRow && 'top-[25px]'
        )}
      >
        <div className="relative p-2 bg-gray-800 rounded-[5px] ">
          <div className={cn('flex flex-row  items-center  gap-1', labelContainerClassName)}>
            <p
              className={cn(
                'body-2 h-fit max-w-[200px] md:max-w-[300px] md:max-w-[400px] xl:max-w-[500px] text-wrap  text-white',
                labelContentClassName
              )}
            >
              {label}
            </p>
          </div>

          <svg
            className={cn(
              'absolute bottom-0 shadow-xl left-1/2 translate-x-[-50%] translate-y-full top-[-14px] rotate-180'
            )}
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="7"
            viewBox="0 0 11 7"
            fill="none"
            ref={tipRef}
          >
            <path d="M5.59933 6.07227L0.394531 1.02163e-06L10.8041 0L5.59933 6.07227Z" fill="#1f2937" />
          </svg>
        </div>
      </div>
    </div>
  );
};

TableContentTooltip.displayName = 'TableContentTooltip';

export default memo(TableContentTooltip);
