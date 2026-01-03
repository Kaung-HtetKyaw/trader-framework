import LoadingSpinner from './LoadingSpinner';
import { cn } from '@/lib/utils';
export interface LoadingContainerProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

const LoadingContainer = ({ isLoading, children, className }: LoadingContainerProps) => {
  return (
    <>
      {isLoading ? (
        <div className={cn('flex-1 w-full flex items-center justify-center h-full', className)}>
          <LoadingSpinner />
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingContainer;
