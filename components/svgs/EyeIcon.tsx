import { IconProps } from '@/types/misc';

const EyeIcon = (props: IconProps) => {
  const { className, style } = props;
  return (
    <svg
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
    >
      <path
        d="M8.99989 3.75C4.26938 3.75 1.97454 8.01243 1.56671 8.85596C1.52204 8.94836 1.52204 9.05164 1.56671 9.14404C1.97454 9.98757 4.26938 14.25 8.99989 14.25C13.7304 14.25 16.0252 9.98757 16.4331 9.14404C16.4777 9.05164 16.4777 8.94836 16.4331 8.85596C16.0252 8.01243 13.7304 3.75 8.99989 3.75Z"
        stroke="#00277B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2499 9C11.2499 10.2426 10.2425 11.25 8.99989 11.25C7.75725 11.25 6.74989 10.2426 6.74989 9C6.74989 7.75736 7.75725 6.75 8.99989 6.75C10.2425 6.75 11.2499 7.75736 11.2499 9Z"
        stroke="#00277B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EyeIcon;
