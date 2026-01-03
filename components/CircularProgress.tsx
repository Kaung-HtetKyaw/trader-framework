import React from 'react';

interface CircularProgressProps {
  percentage: number; // Progress percentage (0-100)
  size?: number; // Size of the circle (default: 100px)
  strokeWidth?: number; // Width of the progress stroke (default: 10px)
  strokeColor?: string; // Color of the progress stroke (default: '#4CAF50')
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  size = 100,
  strokeWidth = 10,
  strokeColor = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
      }}
    >
      <svg width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ccc"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={`${12}px`}
          fill="#000"
        >
          {percentage}%
        </text>
      </svg>
    </div>
  );
};

export default CircularProgress;
