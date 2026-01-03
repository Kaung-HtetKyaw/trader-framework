import { cn } from '@/lib/utils';
import { TableRow } from '../ui/table';
import React from 'react';

export type SimpleTableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

const SimpleTableRow = React.forwardRef<
  HTMLTableRowElement,
  SimpleTableRowProps
>(({ className, children, ...props }, ref) => {
  return (
    <TableRow
      className={cn('border-b h-[60px] hover:bg-text-100 transition-colors', className)}
      ref={ref}
      {...props}
    >
      {children}
    </TableRow>
  );
});

SimpleTableRow.displayName = 'SimpleTableRow';

export default SimpleTableRow;
