import { cn } from '@/lib/utils';

const FileClockLineIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <svg
      className={cn('text-[#878AA9]', className)}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="65"
      viewBox="0 0 64 65"
      fill="none"
    >
      <path
        d="M45.3334 43.1667V48.5H50.6667M53.3334 24.5V24.0425C53.3334 22.628 52.7715 21.2714 51.7713 20.2712L41.5621 10.0621C40.5619 9.0619 39.2054 8.5 37.7909 8.5H37.3334M53.3334 24.5H42.6667C39.7212 24.5 37.3334 22.1122 37.3334 19.1667V8.5M53.3334 24.5V27.1667M37.3334 8.5H16C13.0545 8.5 10.6667 10.8878 10.6667 13.8333V51.1667C10.6667 54.1122 13.0545 56.5 16 56.5H26.6667M58.6667 47.1667C58.6667 53.7941 53.2941 59.1667 46.6667 59.1667C40.0393 59.1667 34.6667 53.7941 34.6667 47.1667C34.6667 40.5393 40.0393 35.1667 46.6667 35.1667C53.2941 35.1667 58.6667 40.5393 58.6667 47.1667Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FileClockLineIcon;
