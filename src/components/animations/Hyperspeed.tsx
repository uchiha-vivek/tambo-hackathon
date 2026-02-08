'use client';

import { useEffect, useRef } from 'react';

interface HyperspeedProps {
  effectOptions?: any;
}

export default function Hyperspeed({ effectOptions }: HyperspeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const roadWidth = 10;
    const lanes = 3;
    const speed = 0.1;
    let offset = 0;

    function draw() {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw road lines
      ctx.strokeStyle = '#3FDFD5';
      ctx.lineWidth = 2;
      ctx.setLineDash([20, 20]);

      for (let i = 0; i < 20; i++) {
        const y = (canvas.height / 20) * i + (offset % (canvas.height / 20));
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2 - roadWidth * 20, y);
        ctx.lineTo(canvas.width / 2 + roadWidth * 20, y);
        ctx.stroke();
      }

      offset += speed * 10;

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ opacity: 0.3 }}
    />
  );
}

