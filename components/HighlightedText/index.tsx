import React from 'react';
import { getHighlightedParts } from '@/lib/utils';

export type HighlightedTextProps = {
  text: string;
  search: string;
  maxLength?: number;
  highlightClassName?: string;
};

/**
 * HighlightedText component
 *
 * Displays text with search term highlighting and optional truncation.
 *
 * @example
 * ```tsx
 * <HighlightedText
 *   text="kube-system-namespace"
 *   search="kube"
 *   maxLength={20}
 * />
 * // Renders: "kube-system-namespac..." with "kube" highlighted in blue
 * ```
 */
const HighlightedText: React.FC<HighlightedTextProps> = ({
  text,
  search,
  maxLength,
  highlightClassName = 'text-secondary-500',
}) => {
  const shouldTruncate = maxLength && text.length > maxLength;
  const displayText = shouldTruncate ? text.slice(0, maxLength) : text;

  const parts = getHighlightedParts(displayText, search);
  const highlightedContent = parts.map((part, index) =>
    part.isMatch ? (
      <span key={index} className={highlightClassName}>
        {part.text}
      </span>
    ) : (
      part.text
    )
  );

  return (
    <>
      {highlightedContent}
      {shouldTruncate && '...'}
    </>
  );
};

export default HighlightedText;
