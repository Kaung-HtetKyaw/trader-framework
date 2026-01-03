import { cn } from '@/lib/utils';
import { Slot } from '@radix-ui/react-slot';

export type ScrollContainerProps = {
  children: React.ReactNode;
  height: number;
  className?: string;
  asChild?: boolean;
};

const ScrollContainer = ({ children, height, className, asChild }: ScrollContainerProps) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp style={{ maxHeight: `${height}px` }} className={cn('overflow-y-auto relative ', className || '')}>
      {children}
    </Comp>
  );
};

export default ScrollContainer;
