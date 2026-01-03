import { cn } from '@/lib/utils';
import { IconProps } from '@/types/misc';

const CheckList2Line = (props: IconProps) => {
  const { className, style } = props;
  return (
    <svg
      className={cn('text-[#F6F6F9]', className)}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M7.16667 2.16667H15.5M7.16667 8H15.5M7.16667 13.8333H15.5M0.5 2.16667L2.16667 3.83333L3.83333 0.5M0.5 8L2.16667 9.66667L3.83333 6.33333M3.83333 13.8333C3.83333 14.7538 3.08714 15.5 2.16667 15.5C1.24619 15.5 0.5 14.7538 0.5 13.8333C0.5 12.9129 1.24619 12.1667 2.16667 12.1667C3.08714 12.1667 3.83333 12.9129 3.83333 13.8333Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckList2Line;
