'use client';

import { cn } from '@/lib/utils';
import { memo, useEffect, useRef } from 'react';
export type ViewportContainerProps = {
  children: React.ReactNode;
  offset?: number;
  className?: string;
  type?: 'min' | 'max' | 'default';
  auto?: boolean;
  id?: string;
  style?: React.CSSProperties;
};

const ViewportContainer = ({
  children,
  className,
  type = 'min',
  offset = 0,
  id,
  auto,
  style,
}: ViewportContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || auto) return;

    if (typeof window === 'undefined') return;

    const top = ref.current.getBoundingClientRect().top;
    const height = window.innerHeight - top - offset;

    if (type === 'min') {
      ref.current.style.minHeight = `${height}px`;
    } else if (type === 'default') {
      ref.current.style.height = `${height}px`;
    } else {
      ref.current.style.maxHeight = `${height}px`;
    }
  }, [offset, type, auto]);

  return (
    <div ref={ref} className={cn('w-full', className)} id={id} style={style}>
      {children}
    </div>
  );
};

export default memo(ViewportContainer);
