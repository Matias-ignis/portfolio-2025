import React, { useRef, useEffect } from 'react';

const GalaxyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let width = (canvas.width = window.innerWidth * 0.5);
    let height = (canvas.height = window.innerHeight);
    const center = { x: width / 2, y: height / 2 };

    // === CONFIGURACIÓN ===
    const NUM_CORE_PARTICLES = 350;
    const NUM_ARMS = 4;
    const NUM_ARM_PARTICLES = 900;
    const a = 3;
    const b = 0.22;

    // Paleta estelar reutilizable (útil también para el agujero negro o fondo general)
    const starColors = ['#ffffff', '#ffe9c4', '#d4fbff', '#ffd1dc', '#cceeff'];

    // === NÚCLEO DE LA GALAXIA ===
    const coreParticles: { x: number; y: number; color: string }[] = [];
    for (let i = 0; i < NUM_CORE_PARTICLES; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const radius = Math.random() * 30;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      coreParticles.push({
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        color,
      });
    }

    // === BRAZOS ESPIRALES ===
    const armParticles: { x: number; y: number; color: string }[] = [];
    for (let arm = 0; arm < NUM_ARMS; arm++) {
      const armRotation = (2 * Math.PI * arm) / NUM_ARMS;

      for (let i = 0; i < NUM_ARM_PARTICLES; i++) {
        const theta = 0.8 + (i / NUM_ARM_PARTICLES) * 5 * Math.PI;
        const r = a * Math.exp(b * theta);
        const angle = theta + armRotation + (Math.random() - 0.5) * 0.25;
        const radius = r + (Math.random() - 0.5) * 6;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const color = starColors[Math.floor(Math.random() * starColors.length)];

        armParticles.push({ x, y, color });
      }
    }

    let rotation = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(rotation);

      // === GLOW del núcleo ===
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
      gradient.addColorStop(0, 'rgba(255, 255, 150, 0.25)');
      gradient.addColorStop(1, 'rgba(255, 255, 150, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.fill();

      // === Dibujar núcleo ===
      for (const star of coreParticles) {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // === Dibujar brazos ===
      for (const star of armParticles) {
        ctx.fillStyle = star.color;
        ctx.beginPath();
        ctx.arc(star.x, star.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

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
        left: 0,
        width: '50%',
        height: '100%',
        background: '#000',
      }}
    />
  );
};

export default GalaxyCanvas;