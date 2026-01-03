import { cn } from '@/lib/utils';

const NamespaceNodeIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={cn('text-[#F3FFEE]', className)}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
  >
    <path
      d="M2 3.99984C2 3.26346 2.59695 2.6665 3.33333 2.6665H5.95309C6.39889 2.6665 6.8152 2.88931 7.06249 3.26024L7.60418 4.07277C7.85147 4.4437 8.26777 4.6665 8.71358 4.6665H12.6667C13.403 4.6665 14 5.26346 14 5.99984V11.9998C14 12.7362 13.403 13.3332 12.6667 13.3332H3.33333C2.59695 13.3332 2 12.7362 2 11.9998V3.99984Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default NamespaceNodeIcon;
