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
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    // Dynamic Network Constellation (Highway & Satellite Nodes)
    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      pulseSpeed: number;
      pulseOffset: number;
      isHub?: boolean;
    }

    let nodes: Node[] = [];
    const initNodes = () => {
      nodes = [];
      const count = Math.min(Math.floor((width * height) / 22000), 45); // Responsive node density
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          radius: Math.random() * 2 + 1.2,
          baseAlpha: Math.random() * 0.4 + 0.2,
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
          isHub: i % 8 === 0,
        });
      }
    };

    initNodes();

    let radarAngle = 0;
    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;
      radarAngle += 0.008;

      const isLight = theme === 'light';

      // 1. Telemetry Network Node Links
      const maxDistance = 140;
      const nodeColor = isLight ? '37, 99, 235' : '56, 189, 248'; // Blue / Cyan
      const hubColor = isLight ? '234, 88, 12' : '251, 146, 60'; // Saffron / Orange
      const lineColor = isLight ? '148, 163, 184' : '51, 65, 85';

      // Draw Connection Lines between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isLight ? 0.22 : 0.28);
            ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and update each telemetry node
      nodes.forEach((node) => {
        // Move nodes smoothly
        node.x += node.vx;
        node.y += node.vy;

        // Bounce from boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;

        // Pulsing glow effect
        const pulse = Math.sin(time * node.pulseSpeed * 60 + node.pulseOffset);
        const currentAlpha = node.baseAlpha + pulse * 0.15;
        const color = node.isHub ? hubColor : nodeColor;

        // Outer glow halo for Hubs
        if (node.isHub) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color}, ${isLight ? 0.08 : 0.15})`;
          ctx.fill();

          // Subtle ring
          ctx.strokeStyle = `rgba(${color}, ${isLight ? 0.25 : 0.4})`;
          ctx.lineWidth = 0.75;
          ctx.stroke();
        }

        // Inner solid node point
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${Math.max(0.1, currentAlpha)})`;
        ctx.fill();
      });

      // 2. Subtle Satellite Radar Sweep (Top Right Anchor)
      const radarCenterX = width * 0.88;
      const radarCenterY = height * 0.18;
      const radarRadius = Math.min(width * 0.25, 220);

      // Radar Concentric Circles
      ctx.lineWidth = 0.6;
      for (let r = 50; r <= radarRadius; r += 55) {
        ctx.strokeStyle = isLight
          ? 'rgba(37, 99, 235, 0.08)'
          : 'rgba(56, 189, 248, 0.1)';
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radar Sweep Cone
      const gradient = ctx.createConicGradient(radarAngle, radarCenterX, radarCenterY);
      gradient.addColorStop(0, isLight ? 'rgba(37, 99, 235, 0.09)' : 'rgba(56, 189, 248, 0.15)');
      gradient.addColorStop(0.15, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(radarCenterX, radarCenterY, radarRadius, 0, Math.PI * 2);
      ctx.fill();

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
      {/* 1. Subtle High-Tech Geo Dot Matrix Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* 2. Premium Multi-Layered National Ambient Mesh Glow */}
      {/* Top Left Saffron Glow */}
      <div className="absolute -top-32 -left-20 w-[550px] h-[550px] bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Center Top National Azure Blue Command Glow */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Bottom Right Emerald Green / Cyan Security Aura */}
      <div className="absolute -bottom-32 -right-20 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/8 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 3. High-Security National Guilloche Watermark Motif (Center Backdrop) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] opacity-[0.015] dark:opacity-[0.025] pointer-events-none">
        <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_180s_linear_infinite]">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="4 2" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="6 3" />
          <circle cx="100" cy="100" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
          {/* Spoke Rays */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line
              key={i}
              x1="100"
              y1="100"
              x2={100 + 90 * Math.cos((i * Math.PI) / 12)}
              y2={100 + 90 * Math.sin((i * Math.PI) / 12)}
              stroke="currentColor"
              strokeWidth="0.4"
            />
          ))}
        </svg>
      </div>

      {/* 4. Dynamic Telemetry & Radar Canvas */}
      <canvas ref={canvasRef} className="w-full h-full opacity-80 dark:opacity-90" />
    </div>
  );
};
