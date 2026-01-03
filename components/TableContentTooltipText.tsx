import { cn } from '@/lib/utils';

export type TableContentTooltipTextProps = {
  children: React.ReactNode;
  className?: string;
};

const TableContentTooltipText = (props: TableContentTooltipTextProps) => {
  const { children, className } = props;
  return <div className={cn('body-2 text-text-950 font-bold line-clamp-2 truncate', className)}>{children}</div>;
};

export default TableContentTooltipText;
