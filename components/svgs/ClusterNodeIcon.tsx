import { cn } from '@/lib/utils';

const ClusterNodeIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    className={cn('text-[#F6F6F9]', className)}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    width="17"
    height="16"
    viewBox="0 0 17 16"
    fill="none"
  >
    <path
      d="M2.5 7.99984V3.99984C2.5 3.26346 3.09695 2.6665 3.83333 2.6665H13.1667C13.903 2.6665 14.5 3.26346 14.5 3.99984V7.99984M2.5 7.99984H14.5M2.5 7.99984V11.9998C2.5 12.7362 3.09695 13.3332 3.83333 13.3332H13.1667C13.903 13.3332 14.5 12.7362 14.5 11.9998V7.99984M5.16667 5.33317H5.17333M5.16667 10.6665H5.17333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ClusterNodeIcon;
