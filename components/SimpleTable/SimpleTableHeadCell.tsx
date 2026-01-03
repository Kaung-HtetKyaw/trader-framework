import React from 'react';
import { CustomTableHead } from '../ui/base-table';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

export type SimpleTableHeadProps = React.HTMLAttributes<HTMLDivElement> & {
  isSortable?: boolean;
  sortDirection?: false | 'asc' | 'desc';
  align?: 'left' | 'right';
};

const SimpleTableHead = React.forwardRef<HTMLDivElement, SimpleTableHeadProps>(
  ({ className, children, isSortable, sortDirection, align = 'left', style, ...props }, ref) => {
    return (
      <CustomTableHead
        ref={ref}
        className={cn(
          'body-2 sticky top-0 z-10 text-text-500 font-[600] h-[3.75rem] px-4 py-[10px] bg-white',
          className
        )}
        style={{
          ...style,
          opacity: 1,
        }}
        {...props}
      >
        <div className={cn('flex items-center justify-between', align === 'right' && 'justify-end')}>
          {children}
          {isSortable && (
            <div className="flex ml-1">
              {sortDirection === 'asc' ? (
                <ArrowUp className="h-4 w-4" />
              ) : sortDirection === 'desc' ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <div className="h-4 w-4 opacity-0 group-hover:opacity-50" />
              )}
            </div>
          )}
        </div>
      </CustomTableHead>
    );
  }
);

SimpleTableHead.displayName = 'SimpleTableHead';

export default SimpleTableHead;
