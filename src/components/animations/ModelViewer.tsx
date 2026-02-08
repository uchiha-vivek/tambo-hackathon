'use client';

import { useEffect, useRef } from 'react';

interface ModelViewerProps {
  url?: string;
  width?: number;
  height?: number;
  modelXOffset?: number;
  modelYOffset?: number;
  enableMouseParallax?: boolean;
  enableHoverRotation?: boolean;
  environmentPreset?: string;
  fadeIn?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  showScreenshotButton?: boolean;
}

export default function ModelViewer({
  url,
  width = 400,
  height = 400,
  modelXOffset = 0.5,
  modelYOffset = 0,
  enableMouseParallax = false,
  enableHoverRotation = false,
  environmentPreset = 'forest',
  fadeIn = false,
  autoRotate = false,
  autoRotateSpeed = 0.35,
  showScreenshotButton = false
}: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Simplified placeholder - in production, you'd use @react-three/fiber and drei
  return (
    <div
      ref={containerRef}
      className="relative rounded-lg overflow-hidden bg-gradient-to-br from-[#3FDFD5]/20 to-[#61210F]/20"
      style={{ width, height }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#3FDFD5] to-[#61210F] flex items-center justify-center">
          <span className="text-white text-4xl font-bold">3D</span>
        </div>
      </div>
      {url && (
        <div className="absolute inset-0 opacity-50">
          <p className="text-white/50 text-xs p-4">Model: {url.split('/').pop()}</p>
        </div>
      )}
    </div>
  );
}

