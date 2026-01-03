'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import CopyToClipboard from './CopyToClipboard';

export type ResponsiveEllipsisProps = {
  text: string;
  visibleChars?: {
    start: number;
    end: number;
  };
  showFullOnHover?: boolean;
  showFullOnClick?: boolean;
  className?: string;
  enableCopy?: boolean;
};

const ResponsiveEllipsis = ({
  text,
  visibleChars = { start: 8, end: 8 },
  showFullOnHover = false,
  showFullOnClick = false,
  className = '',
  enableCopy,
}: ResponsiveEllipsisProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsEllipsis, setNeedsEllipsis] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [resizeObserver, setResizeObserver] = useState<ResizeObserver | null>(null);

  const toggleExpand = () => {
    if (showFullOnClick) {
      setIsExpanded(!isExpanded);
    }
  };

  // Check if text needs ellipsis
  useEffect(() => {
    const checkTextFit = () => {
      if (containerRef.current && textRef.current) {
        // Create a temporary span to measure text width without affecting the DOM
        const tempSpan = document.createElement('span');
        tempSpan.style.visibility = 'hidden';
        tempSpan.style.position = 'absolute';
        tempSpan.style.whiteSpace = 'nowrap';
        tempSpan.style.fontFamily = 'monospace'; // Match the font of our component
        tempSpan.style.fontSize = window.getComputedStyle(textRef.current).fontSize;
        tempSpan.innerText = text;

        document.body.appendChild(tempSpan);
        const textWidth = tempSpan.getBoundingClientRect().width;
        document.body.removeChild(tempSpan);

        const containerWidth = containerRef.current.clientWidth;

        setNeedsEllipsis(textWidth > containerWidth);
      }
    };

    // Initial check
    checkTextFit();

    // Set up resize observer to check again if container size changes
    const newResizeObserver = new ResizeObserver(() => {
      checkTextFit();
    });

    setResizeObserver(newResizeObserver);

    if (containerRef.current) {
      newResizeObserver.observe(containerRef.current);
    }

    // Also observe the document body for any layout changes
    newResizeObserver.observe(document.body);

    return () => {
      newResizeObserver.disconnect();
    };
  }, [text]);

  useEffect(() => {
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [resizeObserver]);

  // Format the key with ellipsis only if needed
  const formatKey = () => {
    if (isExpanded || !needsEllipsis) return text;

    const start = text.substring(0, visibleChars.start);
    const end = text.substring(text.length - visibleChars.end);
    return `${start}...${end}`;
  };

  if (!text) return null;

  return (
    <div ref={containerRef} className="flex items-center w-full">
      <div
        className={`overflow-hidden ${className}`}
        onClick={toggleExpand}
        onMouseEnter={showFullOnHover ? () => setIsExpanded(true) : undefined}
        onMouseLeave={showFullOnHover ? () => setIsExpanded(false) : undefined}
      >
        <span
          ref={textRef}
          className="block truncate"
          style={{
            textOverflow: needsEllipsis && !isExpanded ? 'ellipsis' : 'clip',
            whiteSpace: 'nowrap',
          }}
        >
          {formatKey()}
        </span>
        {enableCopy && <CopyToClipboard color="#fff" text={text} />}
      </div>
    </div>
  );
};

export default ResponsiveEllipsis;
