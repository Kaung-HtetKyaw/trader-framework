import React, { useState } from 'react';

interface CustomEllipsisProps {
  text: string;
  maxLength?: number;
  maxLines?: number;
  className?: string;
  expandable?: boolean;
  expandText?: string;
  collapseText?: string;
  buttonClassName?: string;
  ellipsis?: string;
  truncateAtWordBoundary?: boolean;
  showTooltip?: boolean;
  tooltipClassName?: string;
}

const CustomEllipsis: React.FC<CustomEllipsisProps> = ({
  text,
  maxLength = 100,
  maxLines,
  className = '',
  expandable = false,
  expandText = 'Show more',
  collapseText = 'Show less',
  buttonClassName = 'text-blue-500 hover:text-blue-700 ml-1 cursor-pointer font-medium',
  ellipsis = '...',
  truncateAtWordBoundary = false,
  showTooltip = false,
  tooltipClassName = 'absolute z-10 p-2 bg-gray-800 text-white text-sm rounded shadow-lg max-w-xs break-words whitespace-normal',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  if (!text) return null;

  // Handle line clamp mode
  if (maxLines && !isExpanded) {
    return (
      <div>
        <div
          className={className}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: maxLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
          title={showTooltip ? text : undefined}
          // onMouseEnter={showTooltip ? () => setTooltipVisible(true) : undefined}
          // onMouseLeave={showTooltip ? () => setTooltipVisible(false) : undefined}
        >
          {text}
        </div>
        {expandable && (
          <button onClick={() => setIsExpanded(true)} className={buttonClassName} type="button">
            {expandText}
          </button>
        )}
        {tooltipVisible && showTooltip && (
          <div id="testing-tooltip" className={tooltipClassName}>
            {text}
          </div>
        )}
      </div>
    );
  }

  // Handle character-based truncation
  const shouldTruncate = text.length > maxLength;

  if (!shouldTruncate || isExpanded) {
    return (
      <div className={className}>
        {text}
        {expandable && isExpanded && (
          <button onClick={() => setIsExpanded(false)} className={buttonClassName} type="button">
            {collapseText}
          </button>
        )}
      </div>
    );
  }

  let truncatedText = text.slice(0, maxLength);

  // Truncate at word boundary if requested
  if (truncateAtWordBoundary) {
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      truncatedText = truncatedText.slice(0, lastSpaceIndex);
    }
  }

  return (
    <span
      className={className}
      title={showTooltip ? text : undefined}
      onMouseEnter={showTooltip ? () => setTooltipVisible(true) : undefined}
      onMouseLeave={showTooltip ? () => setTooltipVisible(false) : undefined}
    >
      {truncatedText}
      {ellipsis}
      {expandable && (
        <button onClick={() => setIsExpanded(true)} className={buttonClassName} type="button">
          {expandText}
        </button>
      )}
      {tooltipVisible && showTooltip && (
        <div id="testing-tooltip" className={tooltipClassName} style={{ position: 'absolute' }}>
          {text}
        </div>
      )}
    </span>
  );
};

export default CustomEllipsis;
