import { cn } from '@/lib/utils';
import { IconProps } from '@/types/misc';

const FitToViewIcon = ({ className, width = 24, height = 24, style }: IconProps) => {
  return (
    <svg
      style={{ width, height, ...style }}
      className={cn('w-6 h-6 text-primary-950', className)}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M15 19H19M19 19V15M19 19L15 15M9 5H5M5 5V9M5 5L9 9M15 5H19M19 5V9M19 5L15 9M9 19H5M5 19V15M5 19L9 15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FitToViewIcon;
