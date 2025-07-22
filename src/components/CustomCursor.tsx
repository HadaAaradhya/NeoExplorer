import { useEffect, useRef, useState } from 'react';

// Custom cursor sizes (in px)
const INNER_SIZE = 20;
const OUTER_SIZE = 38;

// Cursor color classes
const COLORS = {
  inner: 'bg-cyan-400', // neon blue
  ring: 'border-cyan-500', // glowing cyan ring
  ringActive: 'border-indigo-500', // on click/active
};

// Linear interpolation helper for smooth movement
function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

/**
 * CustomCursor component
 * Renders a glowing, animated cursor that follows the mouse.
 * Hides on mobile/touch devices and when idle.
 */
export default function CustomCursor() {
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [isHover, setIsHover] = useState(false);
  // Current and target positions for smooth animation
  const pos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const target = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const idleTimeout = useRef<NodeJS.Timeout | null>(null);
  const animFrame = useRef<number>();

  // Hide cursor on mobile/touch devices
  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouch) {
      if (innerRef.current) innerRef.current.style.display = 'none';
      if (outerRef.current) outerRef.current.style.display = 'none';
    }
  }, []);

  // Hide default system cursor globally
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = '* { cursor: none !important; }';
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Mouse movement and idle detection
  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setIsVisible(true);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => setIsVisible(false), 2000);
    };
    const handleDown = () => setIsActive(true);
    const handleUp = () => setIsActive(false);
    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mousedown', handleDown);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mouseup', handleUp);
      if (idleTimeout.current) clearTimeout(idleTimeout.current);
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  // Animate cursor
  useEffect(() => {
    function animate() {
      pos.current.x = lerp(pos.current.x, target.current.x, 0.22);
      pos.current.y = lerp(pos.current.y, target.current.y, 0.22);
      if (innerRef.current && outerRef.current) {
        innerRef.current.style.left = `${pos.current.x}px`;
        innerRef.current.style.top = `${pos.current.y}px`;
        outerRef.current.style.left = `${pos.current.x}px`;
        outerRef.current.style.top = `${pos.current.y}px`;
      }
      animFrame.current = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current);
    };
  }, []);

  // Detect hover on interactive elements
  useEffect(() => {
    const checkHover = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (!el) return setIsHover(false);
      const tag = el.tagName.toLowerCase();
      if (["button", "a", "input", "select", "textarea", "label"].includes(tag) || el.getAttribute('role') === 'button') {
        setIsHover(true);
      } else {
        setIsHover(false);
      }
    };
    window.addEventListener('mouseover', checkHover);
    window.addEventListener('mouseout', checkHover);
    return () => {
      window.removeEventListener('mouseover', checkHover);
      window.removeEventListener('mouseout', checkHover);
    };
  }, []);

  // Aftertrail effect (optional, subtle)
  // ... (could be added as a pseudo-element or extra div if desired)

  return (
    <>
      {/* Outer Ring */}
      <div
        ref={outerRef}
        className={`fixed z-[9999] pointer-events-none rounded-full transition-all duration-200 -translate-x-1/2 -translate-y-1/2
          border-[1.5px] ${isHover ? COLORS.ringActive : COLORS.ring} shadow-[0_0_16px_2px_rgba(0,191,255,0.25)]
          ${isActive ? 'scale-110' : isHover ? 'scale-125' : 'scale-100'}
          ${isVisible ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          width: OUTER_SIZE,
          height: OUTER_SIZE,
          left: 0,
          top: 0,
          boxShadow: isHover ? '0 0 24px 4px #8A2BE2AA' : '0 0 16px 2px #00BFFFAA',
          transitionProperty: 'transform, opacity, box-shadow, border-color',
        }}
      />
      {/* Inner Dot */}
      <div
        ref={innerRef}
        className={`fixed z-[10000] pointer-events-none rounded-full transition-all duration-150 -translate-x-1/2 -translate-y-1/2
          ${COLORS.inner} shadow-[0_0_12px_2px_rgba(0,191,255,0.5)]
          ${isActive ? 'scale-75 opacity-80' : isHover ? 'scale-110 opacity-100' : 'scale-100 opacity-100'}
          ${isVisible ? '' : 'opacity-0'}
        `}
        style={{
          width: INNER_SIZE,
          height: INNER_SIZE,
          left: 0,
          top: 0,
          boxShadow: isHover ? '0 0 18px 4px #8A2BE2AA' : '0 0 12px 2px #00BFFFAA',
          transitionProperty: 'transform, opacity, box-shadow',
        }}
      />
    </>
  );
} 