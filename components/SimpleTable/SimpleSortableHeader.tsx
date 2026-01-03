import { cn } from '@/lib/utils';
import { Column } from '@tanstack/react-table';
import { SortIcon } from '../svgs/SortIcon';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SimpleSortableHeaderProps<T = any> {
  column: Column<T>;
  className?: string;
  children?: React.ReactNode;
}

const SimpleSortableHeader = ({
  column,
  className,
  children,
}: SimpleSortableHeaderProps) => {
  const isSorted = !!column.getIsSorted();
  const isDesc = column.getIsSorted() === 'desc';

  return (
    <button
      className={cn('flex items-center gap-1', className)}
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {children || column.id}

      {isSorted ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.36619 11.463C6.48228 11.1827 6.75576 11 7.0591 11H11.5591C11.8625 11 12.1359 11.1827 12.252 11.463C12.3681 11.7432 12.3039 12.0658 12.0894 12.2803L9.83943 14.5303C9.69878 14.671 9.50802 14.75 9.3091 14.75C9.11019 14.75 8.91943 14.671 8.77877 14.5303L6.52877 12.2803C6.31428 12.0658 6.25011 11.7432 6.36619 11.463Z"
            fill={isDesc ? '#696D8E' : '#D6D6E1'}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.3091 4.25C9.50802 4.25 9.69878 4.32902 9.83943 4.46967L12.0894 6.71967C12.3039 6.93417 12.3681 7.25676 12.252 7.53701C12.1359 7.81727 11.8625 8 11.5591 8L7.0591 8C6.75576 8 6.48228 7.81727 6.36619 7.53701C6.25011 7.25676 6.31428 6.93417 6.52877 6.71967L8.77877 4.46967C8.91943 4.32902 9.11019 4.25 9.3091 4.25Z"
            fill={isDesc ? '#D6D6E1' : '#696D8E'}
          />
        </svg>
      ) : (
        <SortIcon className={'w-[18px] h-[18px] text-text-500'} />
      )}
    </button>
  );
};

export default SimpleSortableHeader;
