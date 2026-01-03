import { IconProps } from '@/types/misc';

const EditPenIcon = (props: IconProps) => {
  const { className, style } = props;
  return (
    <svg
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
    >
      <path
        d="M6.5 3.49992L7.64645 2.35348C7.84171 2.15822 8.15829 2.15822 8.35355 2.35348L9.64645 3.64637C9.84171 3.84163 9.84171 4.15822 9.64645 4.35348L8.5 5.49992M6.5 3.49992L2.14645 7.85348C2.05268 7.94725 2 8.07442 2 8.20703V9.49992C2 9.77607 2.22386 9.99992 2.5 9.99992H3.79289C3.9255 9.99992 4.05268 9.94725 4.14645 9.85348L8.5 5.49992M6.5 3.49992L8.5 5.49992M6.5 9.99992H10"
        stroke="#444560"
        strokeWidth="0.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditPenIcon;
