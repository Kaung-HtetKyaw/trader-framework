import { cn } from '@/lib/utils';

const SearchLineIcon = ({
  className,
  width,
  height,
  style,
  strokeWidth,
}: {
  className?: string;
  stroke?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  strokeWidth?: number;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cn('text-primary-950', className)}
      style={{
        width,
        height,
        ...style,
      }}
    >
      <path
        d="M20 20L15.9497 15.9497M15.9497 15.9497C17.2165 14.683 18 12.933 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.933 18 14.683 17.2165 15.9497 15.9497Z"
        stroke={'currentColor'}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default SearchLineIcon;
