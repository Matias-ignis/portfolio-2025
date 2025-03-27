import React, { useRef, useEffect } from 'react';

const BlackHoleSpiralCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let width = (canvas.width = window.innerWidth * 0.5);
    let height = (canvas.height = window.innerHeight);
    const center = { x: width / 2, y: height / 2 };

    const a = 3;
    const b = 0.22;
    const totalSteps = 1200;
    const NUM_ARMS = 6;
    const PARTICLES_PER_ARM = 1000;
    const starColors = ['#ffffff', '#ffe9c4', '#d4fbff', '#ffd1dc', '#cceeff'];

    interface Particle {
      path: { x: number; y: number }[];
      position: number;
      speed: number;
      color: string;
    }

    const particles: Particle[] = [];

    for (let arm = 0; arm < NUM_ARMS; arm++) {
      const rotationOffset = (2 * Math.PI * arm) / NUM_ARMS;
      const spiralPath: { x: number; y: number }[] = [];

      for (let i = 0; i < totalSteps; i++) {
        const t = 0.8 + (i / totalSteps) * 5 * Math.PI;
        const r = a * Math.exp(b * t);

        // Simulamos la dispersión: como en la galaxia
        const angleNoise = (Math.random() - 0.5) * 0.25;
        const radiusNoise = (Math.random() - 0.5) * 6;

        const theta = t + rotationOffset + angleNoise;
        const radius = r + radiusNoise;

        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        spiralPath.push({ x, y });
      }

      for (let i = 0; i < PARTICLES_PER_ARM; i++) {
        particles.push({
          path: spiralPath,
          position: (i / PARTICLES_PER_ARM) * spiralPath.length,
          speed: 0.005,
          color: starColors[(i + arm) % starColors.length],
        });
      }
    }

    let rotation = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // ROTAR GALAXIA
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(rotation);

      for (const p of particles) {
        const index = Math.floor(p.position) % p.path.length;
        const point = p.path[index];

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
        ctx.fill();

        p.position += p.speed;
        if (p.position >= p.path.length) {
          p.position = 0;
        }
      }

      ctx.restore();

      // === HALO DIFUSO DEL AGUJERO NEGRO ===
      ctx.save();
      ctx.translate(center.x, center.y);
      const halo = ctx.createRadialGradient(0, 0, 35, 0, 0, 90);
      halo.addColorStop(0, 'rgba(100, 150, 255, 0.3)');
      halo.addColorStop(0.5, 'rgba(140, 80, 255, 0.1)');
      halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(0, 0, 90, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // === AGUJERO NEGRO CENTRAL ===
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(0, 0, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      rotation += 0.0005;
      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth * 0.5;
      height = canvas.height = window.innerHeight;
      center.x = width / 2;
      center.y = height / 2;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        width: '50%',
        height: '100%',
        background: '#000',
      }}
    />
  );
};

export default BlackHoleSpiralCanvas;
