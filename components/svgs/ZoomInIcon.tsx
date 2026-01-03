import { IconProps } from '@/types/misc';
import { cn } from '@/lib/utils';

const ZoomInIcon = ({ className, width = 24, height = 24, style }: IconProps) => {
  return (
    <svg
      style={{ width, height, ...style }}
      className={cn('w-6 h-6 text-primary-950', className)}
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M20 20L15.9497 15.9497M15.9497 15.9497C17.2165 14.683 18 12.933 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.933 18 14.683 17.2165 15.9497 15.9497ZM8 11H11M11 11H14M11 11V8M11 11V14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ZoomInIcon;
