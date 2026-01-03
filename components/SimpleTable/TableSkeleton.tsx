'use client';

import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  rowHeight?: number;
  columnWidths?: number[];
  className?: string;
}

const TableSkeleton = ({ rows = 5, columns = 5, rowHeight = 48, columnWidths = [], className }: TableSkeletonProps) => {
  return (
    <div className="w-full">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          style={{ height: `${rowHeight}px` }}
          className={cn('flex items-center w-full px-4', rowIndex % 2 === 0 ? 'bg-white' : 'bg-text-50', className)}
        >
          {Array.from({ length: columns }).map((_, colIndex) => {
            const width = columnWidths[colIndex];
            const isLastColumn = colIndex === columns - 1;
            return (
              <div
                key={colIndex}
                className={
                  width
                    ? isLastColumn
                      ? 'px-2 pr-6'
                      : 'px-2'
                    : isLastColumn
                      ? 'flex-1 px-2 pr-6 min-w-0'
                      : 'flex-1 px-2 min-w-0'
                }
                style={width ? { minWidth: width, maxWidth: width, width } : undefined}
              >
                <div className="h-4 bg-text-200 rounded animate-pulse" />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default TableSkeleton;
