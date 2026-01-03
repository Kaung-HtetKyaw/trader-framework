const VisualizationIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <svg
      width="15"
      height="14"
      viewBox="0 0 15 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path
        d="M3.49121 11.0832L6.40788 8.1665L8.15788 9.9165L11.6579 6.4165M11.6579 6.4165H9.90788M11.6579 6.4165V8.1665M3.49121 8.1665V4.6665M5.82454 6.4165V2.9165M8.15788 6.99984V5.24984"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default VisualizationIcon;
