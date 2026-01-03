import { cn } from '@/lib/utils';

export type DividerProps = {
  type?: 'horizontal' | 'vertical';
  className?: string;
};

const Divider = (props?: DividerProps) => {
  const { type = 'horizontal', className } = props || { type: 'horizontal' };

  if (type === 'horizontal') {
    return <div className={cn('w-full h-[0.5px] bg-text-200', className)}></div>;
  }

  return <div className={cn('w-[0.5px] h-full bg-text-200', className)}></div>;
};

export default Divider;
