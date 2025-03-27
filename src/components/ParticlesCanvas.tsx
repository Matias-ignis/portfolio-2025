import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'galaxy' | 'normal';
  angle?: number;
  radius?: number;
}

const ParticlesCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const NUM_GALAXY_PARTICLES = 30;
    const NUM_NORMAL_PARTICLES = 70;
    const galaxyCenter = { x: width * 0.25, y: height * 0.5 };
    const blackHoleCenter = { x: width * 0.75, y: height * 0.5 };

    const particles: Particle[] = [];

    for (let i = 0; i < NUM_GALAXY_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 100;
      particles.push({
        x: galaxyCenter.x + radius * Math.cos(angle),
        y: galaxyCenter.y + radius * Math.sin(angle),
        vx: 0,
        vy: 0,
        type: 'galaxy',
        angle,
        radius,
      });
    }

    for (let i = 0; i < NUM_NORMAL_PARTICLES; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        type: 'normal',
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#ffffff';
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        if (p.type === 'galaxy' && p.angle !== undefined && p.radius !== undefined) {
          p.angle += 0.003;
          p.x = galaxyCenter.x + p.radius * Math.cos(p.angle);
          p.y = galaxyCenter.y + p.radius * Math.sin(p.angle);
        } else if (p.type === 'normal') {
          const dx = blackHoleCenter.x - p.x;
          const dy = blackHoleCenter.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const force = 300 / (dist * dist);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;

          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          if (dist < 20) {
            p.x = -9999;
            p.y = -9999;
            p.vx = 0;
            p.vy = 0;
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
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
        width: '100%',
        height: '100%',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    />
  );
};

export default ParticlesCanvas;
