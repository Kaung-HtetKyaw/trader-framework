const ArrowUpRightLine = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={style}
      className={className}
    >
      <path
        d="M5.83325 11.6667L2.91659 8.75004M2.91659 8.75004L5.83325 5.83337M2.91659 8.75004H8.74992C10.0386 8.75004 11.0833 7.70537 11.0833 6.41671V2.33337"
        stroke="#00277B"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowUpRightLine;
