import { IconProps } from '@/types/misc';
import { cn } from '@/lib/utils';

const CursorIcon = ({ className, width = 24, height = 24, style }: IconProps) => {
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
        d="M18.4498 8.10277L6.72347 4.19398C5.15995 3.67281 3.67248 5.16029 4.19365 6.72381L8.10244 18.4502C8.71024 20.2736 11.2894 20.2736 11.8972 18.4502L13.2191 14.4844C13.4182 13.8871 13.8868 13.4185 14.484 13.2194L18.4498 11.8975C20.2732 11.2897 20.2732 8.71057 18.4498 8.10277Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CursorIcon;
