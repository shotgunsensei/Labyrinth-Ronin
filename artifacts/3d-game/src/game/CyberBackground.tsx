import { useRef, useEffect } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  life: number;
  maxLife: number;
}

interface GridPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

export function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const gridSize = 40;
    const particles: Particle[] = [];
    const pulses: GridPulse[] = [];
    const mazeWalls: { x1: number; y1: number; x2: number; y2: number; alpha: number; pulse: number }[] = [];

    function resize() {
      w = canvas!.width = canvas!.offsetWidth;
      h = canvas!.height = canvas!.offsetHeight;
      generateMazeWalls();
    }

    function generateMazeWalls() {
      mazeWalls.length = 0;
      const cols = Math.ceil(w / gridSize);
      const rows = Math.ceil(h / gridSize);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < 0.3) {
            mazeWalls.push({
              x1: c * gridSize,
              y1: r * gridSize,
              x2: (c + 1) * gridSize,
              y2: r * gridSize,
              alpha: 0.1 + Math.random() * 0.15,
              pulse: Math.random() * Math.PI * 2,
            });
          }
          if (Math.random() < 0.3) {
            mazeWalls.push({
              x1: c * gridSize,
              y1: r * gridSize,
              x2: c * gridSize,
              y2: (r + 1) * gridSize,
              alpha: 0.1 + Math.random() * 0.15,
              pulse: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    }

    function spawnParticle() {
      const onGrid = Math.random() < 0.7;
      let x: number, y: number, vx: number, vy: number;

      if (onGrid) {
        const horizontal = Math.random() < 0.5;
        if (horizontal) {
          x = Math.random() * w;
          y = Math.round(Math.random() * (h / gridSize)) * gridSize;
          vx = (Math.random() - 0.5) * 2;
          vy = 0;
        } else {
          x = Math.round(Math.random() * (w / gridSize)) * gridSize;
          y = Math.random() * h;
          vx = 0;
          vy = (Math.random() - 0.5) * 2;
        }
      } else {
        x = Math.random() * w;
        y = Math.random() * h;
        vx = (Math.random() - 0.5) * 0.8;
        vy = (Math.random() - 0.5) * 0.8;
      }

      const colors = ['#ff0000', '#cc0000', '#ff3333', '#990000', '#ff4444'];
      particles.push({
        x, y, vx, vy,
        size: 1 + Math.random() * 2.5,
        alpha: 0.3 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 0,
        maxLife: 200 + Math.random() * 400,
      });
    }

    function spawnPulse() {
      const col = Math.floor(Math.random() * (w / gridSize));
      const row = Math.floor(Math.random() * (h / gridSize));
      pulses.push({
        x: col * gridSize,
        y: row * gridSize,
        radius: 0,
        maxRadius: 60 + Math.random() * 80,
        alpha: 0.3,
      });
    }

    let time = 0;

    function draw() {
      time += 0.016;
      ctx!.clearRect(0, 0, w, h);

      ctx!.strokeStyle = 'rgba(255, 0, 0, 0.04)';
      ctx!.lineWidth = 0.5;
      for (let x = 0; x <= w; x += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }
      for (let y = 0; y <= h; y += gridSize) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }

      for (const wall of mazeWalls) {
        const pulseAlpha = wall.alpha + Math.sin(time * 1.5 + wall.pulse) * 0.08;
        ctx!.strokeStyle = `rgba(255, 30, 30, ${Math.max(0, pulseAlpha)})`;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(wall.x1, wall.y1);
        ctx!.lineTo(wall.x2, wall.y2);
        ctx!.stroke();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.radius += 0.8;
        p.alpha = 0.3 * (1 - p.radius / p.maxRadius);
        if (p.radius >= p.maxRadius) {
          pulses.splice(i, 1);
          continue;
        }
        ctx!.strokeStyle = `rgba(255, 0, 0, ${p.alpha})`;
        ctx!.lineWidth = 1;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.stroke();
      }

      if (particles.length < 120) spawnParticle();
      if (Math.random() < 0.02) spawnPulse();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const lifeFrac = p.life / p.maxLife;
        const fadeAlpha = lifeFrac < 0.1
          ? p.alpha * (lifeFrac / 0.1)
          : lifeFrac > 0.8
            ? p.alpha * (1 - (lifeFrac - 0.8) / 0.2)
            : p.alpha;

        if (p.life >= p.maxLife || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) {
          particles.splice(i, 1);
          continue;
        }

        ctx!.shadowBlur = 6;
        ctx!.shadowColor = p.color;
        ctx!.fillStyle = p.color.replace(')', `, ${fadeAlpha})`).replace('rgb', 'rgba');
        ctx!.beginPath();
        ctx!.rect(
          Math.round(p.x / 2) * 2,
          Math.round(p.y / 2) * 2,
          p.size,
          p.size,
        );
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      const cols = Math.ceil(w / gridSize);
      const rows = Math.ceil(h / gridSize);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const ix = c * gridSize;
          const iy = r * gridSize;
          const flicker = Math.sin(time * 3 + c * 0.7 + r * 1.1) * 0.5 + 0.5;
          if (flicker > 0.92) {
            const a = (flicker - 0.92) * 8;
            ctx!.fillStyle = `rgba(255, 0, 0, ${a * 0.15})`;
            ctx!.fillRect(ix + 1, iy + 1, gridSize - 2, gridSize - 2);
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
