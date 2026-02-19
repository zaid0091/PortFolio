import { useInView } from '../hooks/useInView';
import { useEffect, useRef } from 'react';
import VanillaTilt from 'vanilla-tilt';

function TiltCard({ children, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    VanillaTilt.init(ref.current, {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.12,
      scale: 1.03,
    });
    return () => ref.current?.vanillaTilt?.destroy();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}

export default function Projects() {
  const projects = [
    {
      icon: 'fas fa-keyboard',
      iconBg: '#66d9ef',
      title: 'Typing Test Platform',
      date: 'Dec 2025',
      desc: 'A full-stack typing speed test app with user authentication, real-time WPM tracking, and a global leaderboard.',
      bullets: [
        'Built REST API with Django REST Framework; JWT-based auth with refresh token rotation.',
        'React frontend with live WPM/accuracy counters; deployed frontend on Vercel.',
        'Serverless backend on AWS Lambda + SQLite; CI/CD via GitHub Actions.',
      ],
      tags: ['React', 'Django', 'DRF', 'SQLite', 'AWS Lambda', 'Vercel', 'JWT'],
      github: 'https://github.com/zaid0091/master-typing',
      live: null,
    },
    {
      icon: 'fas fa-map-marker-alt',
      iconBg: '#ff6b9d',
      title: 'Real-Time Vehicle Tracking',
      date: 'Jan 2024',
      desc: 'A real-time GPS vehicle tracking system with live map updates, driver dashboard, and fleet management panel.',
      bullets: [
        'WebSocket communication via Socket.IO for sub-second location broadcasting.',
        'Google Maps JavaScript API for route rendering and geofencing alerts.',
        'Firebase Realtime Database for storing location history; Node/Express backend.',
      ],
      tags: ['Node.js', 'React', 'Socket.IO', 'Google Maps API', 'Firebase', 'Express'],
      github: 'https://github.com/zaid0091',
      live: null,
    },
  ];

  const [titleRef, titleVisible] = useInView();
  const [gridRef, gridVisible] = useInView({ threshold: 0.05 });

  return (
    <section
      id="projects"
      className="py-20 border-t-[3px] border-b-[3px]"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <h2
          ref={titleRef}
          className={`section-title reveal-zoom ${titleVisible ? 'is-visible' : ''}`}
        >
          Projects
        </h2>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {projects.map((p, i) => (
            <TiltCard
              key={i}
              className={`neo-card p-7 ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'} ${gridVisible ? 'is-visible' : ''} delay-${i + 1}`}
            >
              {/* Top */}
              <div className="flex items-start gap-4 mb-[14px]">
                <div
                  className="project-icon w-[52px] h-[52px] border-2 flex items-center justify-center text-[1.3rem] rounded-[8px] shrink-0"
                  style={{ background: p.iconBg, borderColor: 'var(--border)' }}
                >
                  <i className={p.icon} />
                </div>
                <div>
                  <div className="text-[1.1rem] font-bold mb-1" style={{ color: 'var(--text)' }}>
                    {p.title}
                  </div>
                  <div className="text-[0.82rem] font-mono" style={{ color: 'var(--text-muted)' }}>
                    {p.date}
                  </div>
                </div>
              </div>

              <p className="text-[0.9rem] leading-[1.7] mb-3" style={{ color: 'var(--text-muted)' }}>
                {p.desc}
              </p>

              <ul className="flex flex-col gap-[6px] mb-4">
                {p.bullets.map((b, j) => (
                  <li key={j} className="text-[0.88rem] leading-[1.5] flex items-start gap-1" style={{ color: 'var(--text-muted)' }}>
                    <span className="mt-[2px] shrink-0">▸</span> {b}
                  </li>
                ))}
              </ul>

              {/* Tags */}
              <div className="flex flex-wrap gap-[6px] mb-5">
                {p.tags.map(t => (
                  <span
                    key={t}
                    className="text-[0.75rem] px-[10px] py-[3px] border-2 rounded font-semibold"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 flex-wrap">
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 text-[0.88rem] font-bold rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
                  style={{
                    background: '#000',
                    color: '#fff',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                >
                  <i className="fab fa-github" /> GitHub
                </a>
                {p.live && (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-[0.88rem] font-bold text-black rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
                    style={{
                      background: '#ffd93d',
                      borderColor: 'var(--border)',
                      boxShadow: 'var(--shadow)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                  >
                    <i className="fas fa-external-link-alt" /> Live Demo
                  </a>
                )}
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
