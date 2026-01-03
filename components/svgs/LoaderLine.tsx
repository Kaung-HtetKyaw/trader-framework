import { cn } from '@/lib/utils';
import { IconProps } from '@/types/misc';

const LoaderLine = (props: IconProps) => {
  const { className, style } = props;
  return (
    <svg
      className={cn('text-[#878AA9]', className)}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="25"
      viewBox="0 0 26 25"
      fill="none"
    >
      <path
        d="M13 0.5V4.5M4.51472 4.01472L7.34315 6.84315M25 12.5L21 12.5M21.4853 4.01472L18.6569 6.84315M13 20.5L13 24.5M18.6569 18.1569L21.4853 20.9853M5 12.5H1M7.34315 18.1569L4.51472 20.9853"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LoaderLine;
