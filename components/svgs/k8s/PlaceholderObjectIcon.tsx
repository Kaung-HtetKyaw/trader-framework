import { IconProps } from '@/types/misc';

const PlaceholderObjectIcon = (props?: IconProps) => {
  const { className, style } = props || {};
  return (
    <svg
      className={className}
      style={style}
      width="32"
      height="34"
      viewBox="0 0 32 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_15532_3632)">
        <path
          d="M13.9472 0.524145C15.2175 -0.174715 16.7825 -0.174715 18.0528 0.524145L29.9472 7.06801C31.2175 7.76687 32 9.05842 32 10.4561V23.5439C32 24.9416 31.2175 26.2331 29.9472 26.932L18.0528 33.4759C16.7825 34.1747 15.2175 34.1747 13.9472 33.4759L2.0528 26.932C0.782522 26.2331 0 24.9416 0 23.5439V10.4561C0 9.05842 0.782523 7.76687 2.0528 7.06801L13.9472 0.524145Z"
          fill="url(#paint0_linear_15532_3632)"
        />
      </g>
      <defs>
        <linearGradient id="paint0_linear_15532_3632" x1="3" y1="17" x2="32" y2="17" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ECECF2" />
          <stop offset="1" stopColor="#E2E2E9" />
        </linearGradient>
        <clipPath id="clip0_15532_3632">
          <rect width="32" height="34" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PlaceholderObjectIcon;
