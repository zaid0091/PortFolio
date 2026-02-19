import { useEffect, useRef } from 'react';

/**
 * SmoothScroll — replaces native scroll with physics-based lerp scroll.
 *
 * Strategy:
 * - The real page stays scrollable (overflow: auto on html/body) so all
 *   anchor links, IntersectionObservers, and scroll events work normally.
 * - We read window.scrollY each frame and lerp a CSS translate on the
 *   #smooth-root wrapper, creating the momentum illusion.
 * - A fixed-height spacer keeps the document tall enough to scroll.
 */
export default function SmoothScroll() {
  const rafRef = useRef(null);

  useEffect(() => {
    // Bail on touch/mobile — native momentum scroll is better there
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || noMotion) return;

    const root = document.getElementById('smooth-root');
    if (!root) return;

    // Fix the root in the viewport; we'll move it with translate
    root.style.position = 'fixed';
    root.style.top = '0';
    root.style.left = '0';
    root.style.width = '100%';
    root.style.willChange = 'transform';

    // Spacer keeps the page scrollable
    const spacer = document.createElement('div');
    spacer.id = 'smooth-spacer';
    document.body.appendChild(spacer);

    let currentY = 0;
    let targetY = 0;
    const LERP = 0.09; // lower = more lag / smoother feel

    const syncHeight = () => {
      spacer.style.height = root.scrollHeight + 'px';
    };

    // Sync whenever content changes height
    const ro = new ResizeObserver(syncHeight);
    ro.observe(root);
    syncHeight();

    const tick = () => {
      targetY = window.scrollY;
      currentY += (targetY - currentY) * LERP;

      // Sub-pixel rounding to avoid blurry text on non-retina
      const rounded = Math.round(currentY * 100) / 100;
      root.style.transform = `translate3d(0, -${rounded}px, 0)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      // Restore
      root.style.position = '';
      root.style.top = '';
      root.style.left = '';
      root.style.width = '';
      root.style.willChange = '';
      root.style.transform = '';
      spacer.remove();
    };
  }, []);

  return null;
}
