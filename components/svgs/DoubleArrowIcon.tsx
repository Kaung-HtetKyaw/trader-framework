const DoubleArrowIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M8.25 11L12 7L8.25 3M2 11L5.75 7L2 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DoubleArrowIcon;
