import { cn } from '@/lib/utils';
import { IconProps } from '@/types/misc';

const ClockDownloadTime = (props: IconProps) => {
  const { className, style } = props;
  return (
    <svg
      style={style}
      className={cn('text-text-500', className)}
      width="25"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.0181 21C16.9886 21 21.0181 16.9706 21.0181 12C21.0181 7.02944 16.9886 3 12.0181 3C7.0475 3 3.01807 7.02944 3.01807 12M12.0181 7V10.7639C12.0181 11.5215 12.4461 12.214 13.1236 12.5528L16.0181 14M6.01807 21L3.01807 18M6.01807 21L9.01807 18M6.01807 21V15"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClockDownloadTime;
