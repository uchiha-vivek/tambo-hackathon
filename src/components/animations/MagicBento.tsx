'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface MagicBentoProps {
  children: ReactNode;
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  enableTilt?: boolean;
  enableMagnetism?: boolean;
  clickEffect?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  glowColor?: string;
  disableAnimations?: boolean;
}

export default function MagicBento({
  children,
  textAutoHide = false,
  enableStars = false,
  enableSpotlight = true,
  enableBorderGlow = true,
  enableTilt = true,
  enableMagnetism = false,
  clickEffect = true,
  spotlightRadius = 400,
  particleCount = 12,
  glowColor = '132, 0, 255',
  disableAnimations = false
}: MagicBentoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };

    if (enableSpotlight || enableMagnetism) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseenter', () => setIsHovered(true));
      container.addEventListener('mouseleave', () => setIsHovered(false));
    }

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enableSpotlight, enableMagnetism]);

  const spotlightStyle = enableSpotlight && isHovered
    ? {
        background: `radial-gradient(circle ${spotlightRadius}px at ${mousePos.x}px ${mousePos.y}px, rgba(${glowColor}, 0.15), transparent 80%)`
      }
    : {};

  const borderGlowStyle = enableBorderGlow && isHovered
    ? {
        boxShadow: `0 0 30px rgba(${glowColor}, 0.5), inset 0 0 30px rgba(${glowColor}, 0.1)`
      }
    : {};

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-300"
      style={{
        ...spotlightStyle,
        ...borderGlowStyle,
        transform: enableTilt && isHovered
          ? `perspective(1000px) rotateX(${(mousePos.y - 200) / 20}deg) rotateY(${(mousePos.x - 200) / 20}deg)`
          : 'none'
      }}
    >
      {enableStars && (
        <div className="absolute inset-0">
          {Array.from({ length: particleCount }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

