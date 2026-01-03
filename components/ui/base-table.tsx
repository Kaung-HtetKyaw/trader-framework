import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * This is a custom table component that uses divs instead of semantic table HTML elements
 * to have easier maintainability and better control
 */

const CustomTable = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div role="table" ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  )
);
CustomTable.displayName = 'CustomTable';

const CustomTableHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div role="rowgroup" ref={ref} className={cn('flex flex-row w-full z-0 relative', className)} {...props} />
  )
);
CustomTableHeader.displayName = 'CustomTableHeader';

const CustomTableBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div role="rowgroup" ref={ref} className={cn('', className)} {...props} />
);
CustomTableBody.displayName = 'CustomTableBody';

const CustomTableFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div role="rowgroup" ref={ref} className={cn('bg-muted/50 font-medium', className)} {...props} />
  )
);
CustomTableFooter.displayName = 'CustomTableFooter';

const CustomTableRow = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      role="row"
      ref={ref}
      className={cn(
        'flex flex-row w-full transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted border-b border-text-200 last:border-b-0 pr-[17px]',
        className
      )}
      {...props}
    />
  )
);
CustomTableRow.displayName = 'CustomTableRow';

const CustomTableHead = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      role="columnheader"
      ref={ref}
      className={cn(
        'h-10 px-2 flex items-center text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
);
CustomTableHead.displayName = 'CustomTableHead';

const CustomTableCell = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      role="cell"
      ref={ref}
      className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)}
      {...props}
    />
  )
);
CustomTableCell.displayName = 'CustomTableCell';

const CustomTableCaption = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div role="caption" ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
  )
);
CustomTableCaption.displayName = 'CustomTableCaption';

export {
  CustomTable,
  CustomTableHeader,
  CustomTableBody,
  CustomTableFooter,
  CustomTableHead,
  CustomTableRow,
  CustomTableCell,
  CustomTableCaption,
};
