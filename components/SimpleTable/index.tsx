'use client';

import {
  CellContext,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  HeaderContext,
  RowData,
  SortingState,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { CustomTableHeader, CustomTableRow, CustomTableBody, CustomTable } from '../ui/base-table';
import SimpleTableHead from './SimpleTableHeadCell';
import SimpleTableCell from './SimpleTableCell';
import { cn } from '@/lib/utils';
import InfiniteScrollContainer from '../InfiniteScrollContainer';
import { useMemo, useLayoutEffect, useRef, useState } from 'react';
import TableSkeleton from './TableSkeleton';

export const INDEX_COL_SIZE = 100;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SimpleTableProps<TData, TValue = any> = {
  rowKey: keyof TData;
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  sortSettings: SortingState;
  tableClassName?: string;
  rowClassName?: string;
  enabledInfiniteScroll?: boolean;
  enabledFetchNextPage?: boolean;
  fetchNextPage?: () => void;
  onSortChange?: (sortSettings: SortingState) => void;
  height?: number;
  rowHeight?: number;
  onRowClick?: (row: TData) => void;
  compact?: boolean;
  alignLastColumn?: boolean;
  isLoading?: boolean;
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (rowSelection: Record<string, boolean>) => void;
  selectedRowClassName?: string;
};

export const LAST_COLUMN_CELL_IDENTIFIER = 'last-column-cell';
export const LAST_COLUMN_HEADER_IDENTIFIER = 'last-column-header';

/**
 * This component is used to create a simple table without pagination.
 * @param {SimpleTableProps} props
 * @returns
 */
const SimpleTable = <TData extends RowData>(props: SimpleTableProps<TData>) => {
  const {
    data,
    columns,
    enabledInfiniteScroll,
    enabledFetchNextPage,
    fetchNextPage,
    sortSettings,
    onSortChange,
    rowKey,
    height,
    onRowClick,
    compact,
    alignLastColumn,
    isLoading,
    rowSelection,
    onRowSelectionChange,
    selectedRowClassName,
    tableClassName,
    rowClassName,
    rowHeight,
  } = props;

  const columnsWithAlignment = useMemo(() => {
    const length = columns.length;

    if (!alignLastColumn) {
      return columns;
    }

    return columns.map((column, index) => {
      if (index === length - 1) {
        return {
          ...column,
          cell:
            typeof column.cell === 'function'
              ? (data: CellContext<TData, unknown>) => {
                  if (typeof column.cell === 'function') {
                    return (
                      <div id={LAST_COLUMN_CELL_IDENTIFIER} className="flex justify-end">
                        {column.cell(data)}
                      </div>
                    );
                  }
                  return column.cell;
                }
              : column.cell,
          header:
            typeof column.header === 'function' ? (
              (props: HeaderContext<TData, unknown>) => {
                if (typeof column.header === 'function') {
                  return (
                    <div id={LAST_COLUMN_HEADER_IDENTIFIER} className="w-full flex justify-end">
                      {column.header(props)}
                    </div>
                  );
                }
                return column.header;
              }
            ) : (
              <div id={LAST_COLUMN_HEADER_IDENTIFIER} className="w-fit flex justify-end">
                <span>{column.header}</span>
              </div>
            ),
        };
      }

      return column;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as ColumnDef<TData, any>[];
  }, [columns, alignLastColumn]);

  // Handle sort changes and propagate to parent
  const handleSortingChange: TableOptions<TData>['onSortingChange'] = updater => {
    if (!onSortChange) return;

    // Handle both function updater and direct value
    const newSort = typeof updater === 'function' ? updater(sortSettings) : updater;

    onSortChange(newSort);
  };

  // Handle row selection changes and propagate to parent
  const handleRowSelectionChange: TableOptions<TData>['onRowSelectionChange'] = updater => {
    if (!onRowSelectionChange) return;

    // Handle both function updater and direct value
    const newSelection = typeof updater === 'function' ? updater(rowSelection || {}) : updater;

    onRowSelectionChange(newSelection);
  };

  const table = useReactTable({
    data,
    columns: columnsWithAlignment,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: handleSortingChange,
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      sorting: sortSettings,
      rowSelection: rowSelection || {},
    },
    enableRowSelection: true,
    getRowId: row => String(row[rowKey]),
  });

  const headerRef = useRef<HTMLTableRowElement>(null);
  const [columnWidths, setColumnWidths] = useState<number[]>([]);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const headers = headerRef.current.querySelectorAll('th');
      const widths = Array.from(headers).map(th => th.offsetWidth);
      setColumnWidths(widths);
    }
  }, [columns.length]);

  return (
    <div className="w-full">
      <div className="border border-text-200 max-w-full overflow-x-auto horizontal-scroll-container rounded-2xl">
        <CustomTable className={cn('relative w-full min-w-fit overflow-x-auto bg-white', tableClassName)}>
          <CustomTableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <CustomTableRow
                ref={headerRef}
                id="simple-table-header"
                key={headerGroup.id}
                className={cn('border-b border-text-200', rowClassName)}
              >
                {headerGroup.headers.map(header => {
                  return (
                    <SimpleTableHead
                      style={{
                        minWidth: header.column.columnDef.minSize ? header.column.columnDef.minSize : 'unset',
                        maxWidth: header.column.columnDef.maxSize ? header.column.columnDef.maxSize : 'unset',
                        width: header.column.columnDef.size ? header.column.columnDef.size : 'auto',
                        flex: header.column.columnDef.size ? '1 1 0%' : 'unset',
                        justifyContent: alignLastColumn && header.column.getIsLastColumn() ? 'end' : 'start',
                      }}
                      key={header.id}
                      onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      isSortable={header.column.getCanSort()}
                      sortDirection={header.column.getIsSorted()}
                      align={alignLastColumn && header.column.getIsLastColumn() ? 'right' : 'left'}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </SimpleTableHead>
                  );
                })}
              </CustomTableRow>
            ))}
          </CustomTableHeader>

          <InfiniteScrollContainer
            onFetchNextPage={() => {
              if (enabledInfiniteScroll && fetchNextPage) {
                fetchNextPage();
              }
            }}
            height={height}
            threshold={500}
            enabledFetchNextPage={!!enabledFetchNextPage}
            enabledInfiniteScroll={!!enabledInfiniteScroll}
            className="relative overflow-y-auto overflow-x-hidden border-t border-text-200 "
          >
            <CustomTableBody>
              {isLoading && (
                <div className="flex flex-row w-full">
                  <div className="p-0 w-full">
                    <TableSkeleton
                      rows={5}
                      columns={columns.length}
                      columnWidths={columnWidths}
                      rowHeight={rowHeight}
                    />
                  </div>
                </div>
              )}
              {!isLoading &&
                !!table.getSortedRowModel().rows.length &&
                table.getSortedRowModel().rows.map((row, index) => (
                  <CustomTableRow
                    key={String(row.original[rowKey])}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      'pr-[17px] h-12',
                      row.getIsSelected() && selectedRowClassName
                        ? selectedRowClassName
                        : index % 2 === 0
                          ? 'bg-white'
                          : 'bg-text-50',
                      onRowClick ? 'hover:bg-text-100 transition-colors cursor-pointer ' : 'cursor-default',
                      rowClassName
                    )}
                    onClick={() => onRowClick?.(row.original)}
                  >
                    {row.getVisibleCells().map(cell => (
                      <SimpleTableCell
                        className={cn(
                          compact ? 'py-0 px-4' : 'px-4 py-[10px]',
                          cell.column.getIsLastColumn() && alignLastColumn ? 'justify-end' : 'justify-start'
                        )}
                        key={cell.id}
                        style={{
                          minWidth: cell.column.columnDef.minSize ? cell.column.columnDef.minSize : 'unset',
                          maxWidth:
                            cell.column.columnDef.maxSize && !cell.column.getIsLastColumn()
                              ? cell.column.columnDef.maxSize
                              : 'none',
                          width: cell.column.columnDef.size ? cell.column.columnDef.size : 'auto',
                          flex: cell.column.columnDef.size ? '1 1 0%' : 'unset',
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </SimpleTableCell>
                    ))}
                  </CustomTableRow>
                ))}
              {!isLoading && !table.getSortedRowModel().rows.length && (
                <CustomTableRow>
                  <SimpleTableCell className="px-4 py-[10px] h-24 text-center w-full flex justify-center items-center">
                    <span>No results.</span>
                  </SimpleTableCell>
                </CustomTableRow>
              )}
            </CustomTableBody>
          </InfiniteScrollContainer>
        </CustomTable>
      </div>
    </div>
  );
};

export default SimpleTable;
