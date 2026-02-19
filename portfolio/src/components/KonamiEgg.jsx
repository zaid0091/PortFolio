import { useEffect, useRef } from 'react';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

const COLORS = ['#ffd93d', '#ff6b9d', '#66d9ef', '#a8e6cf', '#c9b8ff', '#ffb347', '#ffffff', '#000000'];
const SHAPES = ['rect', 'circle', 'strip'];

function makeConfettiPiece(canvas) {
  const x = Math.random() * canvas.width;
  const y = -10 - Math.random() * 40;
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 6,
    vy: 4 + Math.random() * 5,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    w: 6 + Math.random() * 8,
    h: 10 + Math.random() * 6,
    opacity: 1,
  };
}

export default function KonamiEgg() {
  const canvasRef = useRef(null);
  const stateRef = useRef({ keys: [], pieces: [], raf: null, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onKey = (e) => {
      state.keys.push(e.key);
      if (state.keys.length > SEQUENCE.length) state.keys.shift();
      if (state.keys.join(',') === SEQUENCE.join(',')) {
        triggerConfetti();
      }
    };
    window.addEventListener('keydown', onKey);

    const triggerConfetti = () => {
      if (state.active) return;
      state.active = true;

      // Spawn 180 pieces in bursts from 3 points
      const cx = canvas.width / 2;
      state.pieces = Array.from({ length: 180 }, (_, i) => {
        const p = makeConfettiPiece(canvas);
        // Burst from center-ish with spread
        p.x = cx + (Math.random() - 0.5) * canvas.width * 0.6;
        p.y = canvas.height * 0.3 + (Math.random() - 0.5) * 60;
        p.vx = (Math.random() - 0.5) * 14;
        p.vy = -8 - Math.random() * 10;
        return p;
      });

      // Show toast
      showToast();

      if (state.raf) cancelAnimationFrame(state.raf);
      animate();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      state.pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height + 20) p.opacity -= 0.05;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // strip
          ctx.fillRect(-p.w * 1.5, -p.h / 4, p.w * 3, p.h / 2);
        }
        ctx.restore();
      });

      state.pieces = state.pieces.filter((p) => p.opacity > 0);

      if (state.pieces.length > 0) {
        state.raf = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        state.active = false;
      }
    };

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', resize);
      if (state.raf) cancelAnimationFrame(state.raf);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        id="konami-canvas"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99997,
          pointerEvents: 'none',
        }}
      />
      <div id="konami-toast" style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%) translateY(20px)',
        background: '#ffd93d',
        color: '#000',
        border: '3px solid #000',
        boxShadow: '5px 5px 0 #000',
        padding: '10px 22px',
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: '0.9rem',
        borderRadius: '6px',
        zIndex: 99999,
        opacity: 0,
        transition: 'opacity 0.3s, transform 0.3s',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}>
        ↑↑↓↓←→←→BA — you found it 🎉
      </div>
    </>
  );
}

function showToast() {
  const toast = document.getElementById('konami-toast');
  if (!toast) return;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}
