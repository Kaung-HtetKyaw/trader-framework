'use client';
import { useState, useEffect } from 'react';

interface ProgressBarProps {
  value: number;
  limit: number;
  size: {
    value: number;
    unit: string;
  };
  requirement: {
    value: number;
    unit: string;
    label: string;
  };
  color: string;
  animationDelay?: number;
}

const MetricsProgressBar = ({ value, limit, size, requirement, color, animationDelay = 0 }: ProgressBarProps) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Start animations with delay
    const animateTimer = setTimeout(() => {
      setAnimate(true);
    }, animationDelay);

    return () => {
      clearTimeout(animateTimer);
    };
  }, [animationDelay]);

  // Calculate widths as percentages
  const usagePercent = value;
  const limitPercent = (((limit / 100) * size.value) / size.value) * 100;

  // Determine bar colors
  const activeColorClass = color === 'green' ? 'bg-green-500' : color === 'red' ? 'bg-red-500' : 'bg-blue-500';
  const limitColorClass = 'bg-gray-300'; // Light gray for the limit section

  return (
    <div>
      <div className="h-6 inline-1 bg-gray-200 rounded-full overflow-hidden flex">
        <div
          className={`h-full flex items-center ${activeColorClass} rounded-l-full transition-all duration-1000 ease-out`}
          style={{ width: animate ? `${usagePercent}%` : '0%' }}
        >
          <span
            className={`text-white font-bold ml-3 whitespace-nowrap transition-opacity duration-300 ${
              animate && usagePercent > 15 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {requirement.label}: {requirement.value} {requirement.unit}
          </span>
        </div>

        {/* Limit section - not animated */}
        <div className={`h-full ${limitColorClass}`} style={{ width: `${limitPercent - usagePercent}%` }}></div>
      </div>
    </div>
  );
};

export default MetricsProgressBar;
