import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'galaxy' | 'normal'; // Podrías agregar más tipos si deseas
  angle?: number;            // Solo se usa en la galaxia
  radius?: number;           // Solo se usa en la galaxia
}

const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // -------- Configuraciones --------
    const NUM_GALAXY_PARTICLES = 30;
    const NUM_NORMAL_PARTICLES = 70;

    // Centro de la galaxia (ej. parte izquierda de la pantalla)
    const galaxyCenter = { x: width * 0.25, y: height * 0.5 };

    // Centro del agujero negro (ej. parte derecha de la pantalla)
    const blackHoleCenter = { x: width * 0.75, y: height * 0.5 };

    // Array principal de partículas
    const particles: Particle[] = [];

    // -------- 1. Inicializar partículas de la galaxia --------
    for (let i = 0; i < NUM_GALAXY_PARTICLES; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 40 + Math.random() * 100; // distancia al centro

      particles.push({
        x: galaxyCenter.x + radius * Math.cos(angle),
        y: galaxyCenter.y + radius * Math.sin(angle),
        vx: 0, // para galaxia no usamos vx/vy tradicionales
        vy: 0,
        type: 'galaxy',
        angle,
        radius,
      });
    }

    // -------- 2. Inicializar partículas normales --------
    for (let i = 0; i < NUM_NORMAL_PARTICLES; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        type: 'normal',
      });
    }

    // -------- Función de animación (draw) --------
    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // --- DIBUJAR PARTÍCULAS ---
      ctx.fillStyle = '#ffffff';
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- DIBUJAR LÍNEAS ENTRE PARTÍCULAS CERCANAS ---
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

      // --- ACTUALIZAR POSICIONES ---
      for (const p of particles) {
        if (p.type === 'galaxy') {
          // Movimiento circular alrededor de galaxyCenter
          if (p.angle !== undefined && p.radius !== undefined) {
            p.angle += 0.003; // Velocidad de rotación
            p.x = galaxyCenter.x + p.radius * Math.cos(p.angle);
            p.y = galaxyCenter.y + p.radius * Math.sin(p.angle);
          }
        } else if (p.type === 'normal') {
          // 1) Atracción del agujero negro
          const dx = blackHoleCenter.x - p.x;
          const dy = blackHoleCenter.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Gravedad inversa (ajusta el factor a tu gusto)
          const force = 300 / (dist * dist);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;

          // 2) Actualizar posiciones
          p.x += p.vx;
          p.y += p.vy;

          // 3) Rebote en límites de pantalla
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;

          // 4) Desaparecer si entra en el agujero negro
          const EVENT_HORIZON = 20; // radio de atracción "fatal"
          if (dist < EVENT_HORIZON) {
            // Opciones:
            // - Borrarlo completamente (splice)
            // - Ocultarlo o moverlo fuera de la pantalla
            p.x = -9999; // Simple forma de 'esconder' la partícula
            p.y = -9999;
            p.vx = 0;
            p.vy = 0;
          }
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    // Actualizar el tamaño del canvas al redimensionar ventana
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cleanup cuando el componente se desmonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        width: '100%',
        height: '100%',
        background: '#000', // Fondo negro
      }}
    />
  );
};

export default AnimatedBackground;
