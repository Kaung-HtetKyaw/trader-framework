interface HexagonBackgroundProps {
  color: string;
  className?: string;
}

const HexagonBackground = ({ color, className }: HexagonBackgroundProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="33"
    viewBox="0 0 32 33"
    fill="none"
    className={className || 'w-full h-full'}
  >
    <path
      d="M14 1.96915C15.2376 1.25462 16.7624 1.25462 18 1.96915L27.8564 7.65975C29.094 8.37428 29.8564 9.69479 29.8564 11.1239V22.5051C29.8564 23.9341 29.094 25.2546 27.8564 25.9692L18 31.6598C16.7624 32.3743 15.2376 32.3743 14 31.6598L4.14359 25.9692C2.90599 25.2546 2.14359 23.9341 2.14359 22.5051V11.1239C2.14359 9.69479 2.90599 8.37428 4.14359 7.65975L14 1.96915Z"
      fill={color}
    />
  </svg>
);

export default HexagonBackground;
