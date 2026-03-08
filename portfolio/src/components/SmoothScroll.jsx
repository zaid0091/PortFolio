import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll — integrates Lenis for buttery smooth scrolling with momentum.
 *
 * Lenis provides:
 * - Physics-based smooth scrolling with momentum
 * - 60FPS smooth animations
 * - Native scroll events and IntersectionObserver support
 * - Accessibility respect (prefers-reduced-motion)
 * - Optimized for performance across all devices
 */
export default function SmoothScroll() {
  useEffect(() => {
    // Respect prefers-reduced-motion
    const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noMotion) return;

    // Initialize Lenis with buttery smooth scrolling
    const lenis = new Lenis({
      duration: 1.8,           // Longer duration = ultra-smooth luxury feel
      easing: (t) => {
        // Smooth easing curve - feels natural and responsive
        return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
      },
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothWheel: true,       // Smooth wheel scrolling
      smoothTouch: false,      // Native touch momentum (best for mobile)
      wheelMultiplier: 1,      // Fine-tune wheel sensitivity for smooth feel
      touchMultiplier: 1.2,    // Touch momentum
    });

    // High-performance RAF loop
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    const animationFrameId = requestAnimationFrame(raf);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  return null;
}
