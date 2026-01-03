import { useCallback, useRef, useState } from 'react';

export function useMarkdownStreamBuffer() {
  const [streamBuffer, setStreamBuffer] = useState('');
  const [renderedContent, setRenderedContent] = useState('');
  const bufferRef = useRef('');

  const handleIncomingChunk = (chunk: string) => {
    setStreamBuffer(prev => {
      const updated = prev + chunk;
      bufferRef.current = updated;

      setRenderedContent(updated);
      return updated;
    });
  };

  // call on DONE to force the last snapshot
  const finalize = useCallback(() => {
    setRenderedContent(bufferRef.current);
  }, []);

  // optional: call on ERROR to show best-effort content
  const flush = useCallback(() => {
    setRenderedContent(bufferRef.current);
  }, []);

  const resetBuffers = () => {
    bufferRef.current = '';
    setStreamBuffer('');
    setRenderedContent('');
  };

  return { streamBuffer, renderedContent, handleIncomingChunk, resetBuffers, finalize, flush };
}
