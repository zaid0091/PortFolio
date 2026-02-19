import { useEffect, useRef } from 'react';

export default function CursorGlow() {
  const glowRef = useRef(null);

  useEffect(() => {
    const glow = glowRef.current;
    if (!glow) return;

    // Respect OS-level "reduce motion" preference — hide glow entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      glow.style.display = 'none';
      return;
    }

    let x = -200, y = -200;
    let curX = -200, curY = -200;
    let raf;

    const onMove = (e) => {
      x = e.clientX;
      y = e.clientY;
    };

    const animate = () => {
      curX += (x - curX) * 0.12;
      curY += (y - curY) * 0.12;
      glow.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 320,
        height: 320,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 99999,
        background: 'radial-gradient(circle, rgba(255,217,61,0.18) 0%, rgba(255,107,157,0.10) 40%, transparent 70%)',
        filter: 'blur(18px)',
        willChange: 'transform',
      }}
    />
  );
}
