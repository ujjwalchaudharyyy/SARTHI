import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Grid & Particle Nodes
    const gridSpacing = 60;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isLight = theme === 'light';
      offset += 0.4;
      if (offset >= gridSpacing) offset = 0;

      // 3D Perspective Plane at bottom / background
      const horizonY = height * 0.45;
      const vanishingX = width * 0.5;

      // Perspective Grid Lines
      const lineColor = isLight
        ? 'rgba(203, 213, 225, 0.45)' // Light theme soft slate
        : 'rgba(30, 41, 59, 0.55)'; // Dark theme deep slate

      const highlightLineColor = isLight
        ? 'rgba(59, 130, 246, 0.12)'
        : 'rgba(56, 189, 248, 0.15)';

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      // Vertical perspective ray lines
      const numRays = 18;
      for (let i = -numRays; i <= numRays; i++) {
        const bottomX = vanishingX + i * 90;
        ctx.beginPath();
        ctx.moveTo(vanishingX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal depth lines
      for (let y = horizonY; y < height; y += (y - horizonY) * 0.18 + 12) {
        const currentY = y + (offset * (y - horizonY)) / (height - horizonY);
        if (currentY > height) continue;

        ctx.strokeStyle = (Math.floor(y) % 3 === 0) ? highlightLineColor : lineColor;
        ctx.beginPath();
        ctx.moveTo(0, currentY);
        ctx.lineTo(width, currentY);
        ctx.stroke();
      }

      // Ambient Floating Light Nodes (3D Depth)
      ctx.fillStyle = isLight ? 'rgba(59, 130, 246, 0.15)' : 'rgba(56, 189, 248, 0.25)';
      for (let i = 0; i < 8; i++) {
        const x = (vanishingX + Math.sin(offset * 0.02 + i) * (width * 0.4)) % width;
        const y = horizonY + 40 + (i * 35) + Math.cos(offset * 0.03 + i) * 15;
        const radius = (y - horizonY) * 0.03 + 1.5;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic 3D Canvas */}
      <canvas ref={canvasRef} className="w-full h-full opacity-70 dark:opacity-80" />

      {/* Subtle Depth Radial Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-blue-500/5 via-sky-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[600px] h-[250px] bg-gradient-to-t from-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};
