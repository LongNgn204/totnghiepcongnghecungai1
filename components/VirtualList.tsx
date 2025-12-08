/**
 * PHASE 3 - VirtualList: Lightweight fixed-height virtualization
 *
 * When to use:
 * - Lists with 200+ items
 * - Items have (approximately) fixed height
 *
 * Notes:
 * - For variable-height items, consider react-virtualized/react-window.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface VirtualListProps<T> {
  items: T[];
  height: number; // container height in px
  itemHeight: number; // fixed item height in px
  overscan?: number; // number of items to render above/below the viewport
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  className?: string;
  role?: string;
  ariaLabel?: string;
}

export function VirtualList<T>({
  items,
  height,
  itemHeight,
  overscan = 6,
  renderItem,
  getKey,
  className = '',
  role = 'list',
  ariaLabel,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);
  const visibleCount = Math.ceil(height / itemHeight);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(items.length - 1, startIndex + visibleCount + overscan * 2);

  const offsetY = startIndex * itemHeight;

  const onScroll = useCallback(() => {
    if (!containerRef.current) return;
    setScrollTop(containerRef.current.scrollTop);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto w-full ${className}`}
      style={{ height }}
      role={role}
      aria-label={ariaLabel}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: offsetY, left: 0, right: 0 }}>
          {items.slice(startIndex, endIndex + 1).map((item, i) => {
            const index = startIndex + i;
            const key = getKey ? getKey(item, index) : index;
            return (
              <div key={key} role={role === 'list' ? 'listitem' : undefined} style={{ height: itemHeight }}>
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;

