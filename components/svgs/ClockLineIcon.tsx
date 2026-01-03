import { cn } from '@/lib/utils';
import { IconProps } from '@/types/misc';

const ClockLineIcon = (props?: IconProps) => {
  const { className, style } = props || {};

  return (
    <svg
      className={cn(className, 'text-[#B2B3C7]')}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M6 3.08333V5.27896C6 5.72086 6.24967 6.12483 6.64492 6.32246L8.33333 7.16667M11.25 6C11.25 8.89949 8.89949 11.25 6 11.25C3.1005 11.25 0.75 8.89949 0.75 6C0.75 3.1005 3.1005 0.75 6 0.75C8.89949 0.75 11.25 3.1005 11.25 6Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ClockLineIcon;
