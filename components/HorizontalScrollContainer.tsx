import { cn } from '@/lib/utils';

export type HorizontalScrollContainerProps = {
  children: React.ReactNode | React.ReactNode[];
  className?: string;
};

const HorizontalScrollContainer = (props: HorizontalScrollContainerProps) => {
  const { children, className } = props;

  return <div className={cn('horizontal-scroll-container', className)}>{children}</div>;
};

export default HorizontalScrollContainer;
