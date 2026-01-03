const PlusCircleIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
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
      <g clipPath="url(#clip0_18265_6066)">
        <path
          d="M4.08329 6.99935H6.99996M6.99996 6.99935H9.91663M6.99996 6.99935V4.08268M6.99996 6.99935V9.91602M12.8333 6.99935C12.8333 10.221 10.2216 12.8327 6.99996 12.8327C3.7783 12.8327 1.16663 10.221 1.16663 6.99935C1.16663 3.77769 3.7783 1.16602 6.99996 1.16602C10.2216 1.16602 12.8333 3.77769 12.8333 6.99935Z"
          stroke="#04A1F9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_18265_6066">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PlusCircleIcon;
