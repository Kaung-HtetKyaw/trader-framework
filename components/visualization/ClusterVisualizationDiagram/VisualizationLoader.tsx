import LoadingSpinner from '@/components/LoadingSpinner';
import ViewportContainer from '@/components/ViewportContainer';
import { cn } from '@/lib/utils';
import { memo } from 'react';

export type VisualizationLoaderProps = {
  loadingIcon?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  isLoading?: boolean;
  id?: string;
};

const VisualizationLoader = (props: VisualizationLoaderProps) => {
  const { loadingIcon, className, children, isLoading, id } = props;

  return (
    <ViewportContainer id={id} className="w-full h-full relative bg-white rounded-[12px]" offset={12} auto>
      {isLoading && (
        <div
          className={cn(
            'absolute top-0 left-0 w-full h-full rounded-[12px] z-50 pointer-events-none flex items-center justify-center bg-text-50 ',
            className
          )}
        >
          {loadingIcon || <LoadingSpinner className="text-text-700" />}
        </div>
      )}

      {children && children}
    </ViewportContainer>
  );
};

export default memo(VisualizationLoader);
