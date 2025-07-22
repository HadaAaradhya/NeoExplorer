
import { useEffect, useRef } from 'react';

/**
 * ShootingStars component
 * Renders animated shooting stars on a canvas for a cosmic background effect.
 */
export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Generate random stars
    const stars = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      len: Math.random() * 80 + 10,
      speed: Math.random() * 4 + 2,
      angle: Math.random() * Math.PI * 2,
      alpha: Math.random() * 0.5 + 0.5,
    }));

    // Draw and animate stars
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        ctx.save();
        ctx.globalAlpha = star.alpha;
        ctx.strokeStyle = '#38bdf8'; // Neon blue
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x + Math.cos(star.angle) * star.len,
          star.y + Math.sin(star.angle) * star.len
        );
        ctx.stroke();
        ctx.restore();
        // Move star
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        // Reset if out of bounds
        if (
          star.x > width ||
          star.x < 0 ||
          star.y > height ||
          star.y < 0
        ) {
          star.x = Math.random() * width;
          star.y = Math.random() * height;
        }
      });
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
      style={{ background: 'transparent' }}
    />
  );
} 