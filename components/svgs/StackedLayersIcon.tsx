import { cn } from '@/lib/utils';

const StackedLayersIcon = ({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      style={style}
    >
      <path
        d="M2 12.4547L11.5862 16.8121C11.8491 16.9316 12.1509 16.9316 12.4138 16.8121L22 12.4547M2 16.4547L11.5862 20.8121C11.8491 20.9316 12.1509 20.9316 12.4138 20.8121L22 16.4547M3.00281 7.08981L11.5862 3.18827C11.8491 3.06875 12.1509 3.06875 12.4138 3.18827L20.9972 7.08981C21.7788 7.44508 21.7788 8.55527 20.9972 8.91054L12.4138 12.8121C12.1509 12.9316 11.8491 12.9316 11.5862 12.8121L3.00281 8.91054C2.22121 8.55527 2.22121 7.44508 3.00281 7.08981Z"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default StackedLayersIcon;
