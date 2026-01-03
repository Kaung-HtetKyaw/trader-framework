import React from 'react';
import { CustomTableCell } from '../ui/base-table';
import { cn } from '@/lib/utils';

export type SimpleTableCellProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: 'left' | 'right';
};

const SimpleTableCell = React.forwardRef<HTMLDivElement, SimpleTableCellProps>(
  ({ className, align = 'left', ...props }, ref) => {
    return (
      <CustomTableCell
        className={cn(
          ' body-1 text-text-950 font-[400] px-4 py-[10px]',
          align === 'right' ? 'flex justify-end' : 'flex  items-center',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

SimpleTableCell.displayName = 'SimpleTableCell';

export default SimpleTableCell;
