const DatabaseIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      style={style}
    >
      <path
        d="M42 14C42 18.4183 33.9411 22 24 22C14.0589 22 6 18.4183 6 14M42 14C42 9.58172 33.9411 6 24 6C14.0589 6 6 9.58172 6 14M42 14V24M6 14V24M24 32C14.0589 32 6 28.4183 6 24M6 24V34C6 38.4183 14.0589 42 24 42M36 30V36M36 36V42M36 36H42M36 36H30"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DatabaseIcon;
