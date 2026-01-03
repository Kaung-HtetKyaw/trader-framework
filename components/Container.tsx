import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export type ContainerProps = {
  className?: string;
  children: ReactNode;
  onClick?: () => void;
};

const Container = ({ children, className, onClick }: ContainerProps) => {
  return (
    <div onClick={onClick} className={cn('bg-white rounded-m p-4 ', className)}>
      {children}
    </div>
  );
};

export default Container;
