import { useRef, useEffect } from 'react';

/**
 * useMagnet — attract a button toward the cursor when it's within `radius` px.
 *
 * @param {object} opts
 * @param {number} opts.radius   - distance (px) at which attraction starts (default 90)
 * @param {number} opts.strength - how far the element moves toward cursor 0–1 (default 0.38)
 * @param {boolean} opts.disabled - turn off on mobile / reduced motion
 */
export function useMagnet({ radius = 90, strength = 0.38, disabled = false } = {}) {
  const ref = useRef(null);
  const pos = useRef({ x: 0, y: 0 });       // current translated position
  const target = useRef({ x: 0, y: 0 });    // desired translated position
  const raf = useRef(null);
  const active = useRef(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (disabled || noMotion) return;

    const el = ref.current;
    if (!el) return;

    // Spring loop
    const tick = () => {
      const EASE = 0.18; // spring factor
      pos.current.x += (target.current.x - pos.current.x) * EASE;
      pos.current.y += (target.current.y - pos.current.y) * EASE;

      el.style.transform = `translate(${pos.current.x.toFixed(2)}px, ${pos.current.y.toFixed(2)}px)`;

      // Keep running while attracted or returning to origin
      const doneX = Math.abs(pos.current.x) < 0.05 && Math.abs(target.current.x) < 0.05;
      const doneY = Math.abs(pos.current.y) < 0.05 && Math.abs(target.current.y) < 0.05;
      if (!doneX || !doneY) {
        raf.current = requestAnimationFrame(tick);
      } else {
        el.style.transform = '';
        raf.current = null;
      }
    };

    const startLoop = () => {
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        active.current = true;
        // Attraction proportional to proximity
        const factor = (1 - dist / radius) * strength;
        target.current.x = dx * factor;
        target.current.y = dy * factor;
      } else if (active.current) {
        active.current = false;
        target.current.x = 0;
        target.current.y = 0;
      }

      startLoop();
    };

    const onLeave = () => {
      active.current = false;
      target.current.x = 0;
      target.current.y = 0;
      startLoop();
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (raf.current) cancelAnimationFrame(raf.current);
      if (el) el.style.transform = '';
    };
  }, [radius, strength, disabled]);

  return ref;
}
