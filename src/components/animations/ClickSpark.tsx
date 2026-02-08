'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface ClickSparkProps {
  children: ReactNode;
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
}

export default function ClickSpark({
  children,
  sparkColor = '#fff',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createSpark = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement('div');
        spark.style.position = 'absolute';
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.style.width = `${sparkSize}px`;
        spark.style.height = `${sparkSize}px`;
        spark.style.backgroundColor = sparkColor;
        spark.style.borderRadius = '50%';
        spark.style.pointerEvents = 'none';
        spark.style.zIndex = '9999';
        spark.style.opacity = '1';
        spark.style.transition = `all ${duration}ms ease-out`;

        const angle = (Math.PI * 2 * i) / sparkCount;
        const distance = sparkRadius + Math.random() * sparkRadius;
        const finalX = x + Math.cos(angle) * distance;
        const finalY = y + Math.sin(angle) * distance;

        container.appendChild(spark);

        requestAnimationFrame(() => {
          spark.style.transform = `translate(${finalX - x}px, ${finalY - y}px)`;
          spark.style.opacity = '0';
          spark.style.transform += ` scale(0)`;
        });

        setTimeout(() => {
          spark.remove();
        }, duration);
      }
    };

    container.addEventListener('click', createSpark);
    return () => {
      container.removeEventListener('click', createSpark);
    };
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration]);

  return (
    <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
      {children}
    </div>
  );
}

