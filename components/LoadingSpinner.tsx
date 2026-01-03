import { cn } from '@/lib/utils';
import { KubegradeIconLight } from './svgs/KubegradeIconLight';

export type LoadingSpinnerProps = {
  message?: string;
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

const LoadingSpinner = ({ message, children, className, containerClassName }: LoadingSpinnerProps) => {
  return (
    <div className={cn('flex items-center justify-center gap-2 py-6', containerClassName)}>
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="50"
          height="50"
          viewBox="0 0 50 50"
          fill="none"
          role="img"
          aria-label="Loading"
          className={cn('text-secondary-400')}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="90 140"
            strokeDashoffset="0"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              dur="1s"
              from="0 25 25"
              to="360 25 25"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <KubegradeIconLight className="!w-6 !h-6" />
        </div>
      </div>

      {children || (message && <p className={cn('ml-2 text-text-500', className)}>{message}</p>)}
    </div>
  );
};

export default LoadingSpinner;
