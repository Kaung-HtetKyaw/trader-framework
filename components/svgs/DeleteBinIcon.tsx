import { cn } from '@/lib/utils';
import { IconProps } from '@/types/misc';

const DeleteBinIcon = (props: IconProps) => {
  const { className, style } = props;
  return (
    <svg
      style={style}
      className={cn(className, 'text-error-500')}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.74992 4.08325H5.24992M8.74992 4.08325H10.4999M8.74992 4.08325C8.74992 3.11675 7.96642 2.33325 6.99992 2.33325C6.03342 2.33325 5.24992 3.11675 5.24992 4.08325M5.24992 4.08325H3.49992M2.33325 4.08325H3.49992M3.49992 4.08325V10.4999C3.49992 11.1443 4.02225 11.6666 4.66659 11.6666H9.33325C9.97758 11.6666 10.4999 11.1443 10.4999 10.4999V4.08325M10.4999 4.08325H11.6666M5.83325 6.41659V9.33325M8.16659 9.33325V6.41659"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DeleteBinIcon;
