'use client';

import { useEffect, useRef, useState } from 'react';

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: { opacity?: number; y?: number; x?: number; scale?: number };
  to?: { opacity?: number; y?: number; x?: number; scale?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right';
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 1,
  ease = 'ease-out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  textAlign = 'left',
  onLetterAnimationComplete,
  showCallback = false
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold, rootMargin }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [threshold, rootMargin, isVisible]);

  const splitText = () => {
    if (splitType === 'chars') {
      return text.split('').map((char, index) => (
        <span
          key={index}
          className="inline-block"
          style={{
            animation: isVisible
              ? `fadeInUp ${duration}s ${ease} ${delay + index * 0.03}s both`
              : 'none',
            opacity: isVisible ? 0 : from.opacity || 0,
            transform: isVisible
              ? `translateY(${to.y || 0}px)`
              : `translateY(${from.y || 40}px)`
          }}
          onAnimationEnd={() => {
            setAnimatedCount((prev) => {
              const newCount = prev + 1;
              if (newCount === text.length && onLetterAnimationComplete) {
                onLetterAnimationComplete();
              }
              return newCount;
            });
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    } else if (splitType === 'words') {
      return text.split(' ').map((word, index) => (
        <span
          key={index}
          className="inline-block mr-1"
          style={{
            animation: isVisible
              ? `fadeInUp ${duration}s ${ease} ${delay + index * 0.05}s both`
              : 'none',
            opacity: isVisible ? 0 : from.opacity || 0,
            transform: isVisible
              ? `translateY(${to.y || 0}px)`
              : `translateY(${from.y || 40}px)`
          }}
        >
          {word}
        </span>
      ));
    }
    return text;
  };

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: ${from.opacity || 0};
            transform: translateY(${from.y || 40}px);
          }
          to {
            opacity: ${to.opacity || 1};
            transform: translateY(${to.y || 0}px);
          }
        }
      `}</style>
      <div
        ref={containerRef}
        className={className}
        style={{ textAlign }}
      >
        {splitText()}
      </div>
    </>
  );
}

