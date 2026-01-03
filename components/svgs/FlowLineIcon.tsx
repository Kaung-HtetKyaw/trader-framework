const FlowLineIcon = ({
  className,
  stroke,
  width,
  height,
  style,
}: {
  className?: string;
  stroke?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={{
        width,
        height,
        ...style,
      }}
    >
      <path
        d="M8 12H12M12 12H16M12 12L12 7C12 5.89543 12.8954 5 14 5H16M12 12V17C12 18.1046 12.8954 19 14 19H16M4 14L4 10H8V14H4ZM16 14V10H20V14H16ZM16 21V17H20V21H16ZM16 7V3L20 3V7H16Z"
        stroke={stroke || '#00277B'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FlowLineIcon;
