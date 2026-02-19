import { useInView } from '../hooks/useInView';
import { useEffect, useRef, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import VanillaTilt from 'vanilla-tilt';
import ProjectModal from './ProjectModal';

function TiltCard({ children, className, onClick }) {
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
  return <div ref={ref} className={className} onClick={onClick} style={{ cursor: 'pointer' }}>{children}</div>;
}

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
    live: 'https://master-typing-steel.vercel.app',
    detail: {
      overview:
        'A full-stack typing speed test platform where users can measure their WPM and accuracy in real time, compete on a global leaderboard, and track personal progress over time.',
      problem:
        'Most typing test tools are frontend-only with no persistence — users can\'t track improvement, create accounts, or see how they rank against others. I wanted to build something with real authentication, a database-backed leaderboard, and a clean UX.',
      solution:
        'Built a Django REST Framework backend with JWT authentication (access + refresh token rotation) deployed serverlessly on AWS Lambda. The React frontend polls the API in real time to update WPM/accuracy counters mid-test, and persists each session result to SQLite.',
      techDecisions: [
        'Django REST Framework over Node/Express — I was already comfortable with Python and DRF\'s serializers saved a lot of boilerplate.',
        'AWS Lambda for the backend — free tier is generous for a portfolio project, and it forced me to learn serverless deployment patterns.',
        'SQLite over PostgreSQL — lightweight enough for demo scale; easy to migrate later.',
        'JWT with refresh token rotation — industry-standard auth pattern; refresh tokens stored in httpOnly cookies to prevent XSS theft.',
        'Vite + React for the frontend — fast HMR during development, small production bundle.',
      ],
      features: [
        'Real-time WPM and accuracy calculation as you type',
        'JWT-based user authentication with refresh token rotation',
        'Global leaderboard sorted by WPM with pagination',
        'Personal history dashboard showing progress over sessions',
        'Multiple test durations (15s, 30s, 60s)',
        'CI/CD pipeline via GitHub Actions deploying to Vercel on push',
      ],
      lessons:
        'Serverless cold starts on AWS Lambda were trickier than expected — had to implement a keep-alive ping to reduce latency. Also learned that JWT refresh token rotation needs careful handling on the client to avoid race conditions when two tabs are open simultaneously.',
    },
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
    detail: {
      overview:
        'A real-time fleet management system that tracks multiple vehicles on a live map. Includes a driver-facing mobile dashboard, a fleet manager panel, geofencing alerts, and historical route playback.',
      problem:
        'Fleet management tools are either expensive SaaS products or poorly built open-source demos. I wanted to understand how real-time location systems actually work under the hood — the WebSocket architecture, map rendering, and database design for time-series GPS data.',
      solution:
        'Used Socket.IO to broadcast location updates from drivers in under 100ms. Google Maps JavaScript API handles live marker movement and geofence polygon rendering. Firebase Realtime Database stores the location stream efficiently with time-based indexing for playback.',
      techDecisions: [
        'Socket.IO over raw WebSockets — automatic reconnection, room-based broadcasting, and fallback to long-polling made it much more robust.',
        'Firebase Realtime Database for location history — its push() method with timestamp keys is perfect for append-only GPS logs, and the client SDK handles offline sync.',
        'Google Maps JS API over Leaflet/OpenStreetMap — richer feature set (geofencing, styled maps, Places API) justified the API key setup.',
        'Node/Express for the backend — lightweight enough for a real-time relay server; CPU-bound work is minimal.',
      ],
      features: [
        'Sub-second live location updates via Socket.IO WebSockets',
        'Google Maps integration with animated vehicle markers',
        'Geofencing alerts when vehicles enter/leave defined zones',
        'Route history playback with timeline scrubber',
        'Multi-vehicle fleet dashboard with status indicators',
        'Driver mobile view with trip start/stop controls',
      ],
      lessons:
        'The hardest part was handling disconnections gracefully — a driver losing mobile signal shouldn\'t ghost their marker or corrupt the route history. Implemented a presence system in Firebase to track online/offline state separately from location data. Also learned that batching GPS updates (every 2s instead of every 100ms) dramatically reduces Firebase write costs without noticeable UX impact.',
    },
  },
];

export default function Projects() {
  const [selected, setSelected] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [titleRef, titleVisible] = useInView();
  const [gridRef, gridVisible] = useInView({ threshold: 0.05 });

  const canViewTransition = typeof document !== 'undefined' && document.startViewTransition;

  const openProject = useCallback((p, i) => {
    if (canViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setSelected(p);
          setSelectedIdx(i);
        });
      });
    } else {
      setSelected(p);
      setSelectedIdx(i);
    }
  }, [canViewTransition]);

  const closeProject = useCallback(() => {
    if (canViewTransition) {
      document.startViewTransition(() => {
        flushSync(() => {
          setSelected(null);
          setSelectedIdx(null);
        });
      });
    } else {
      setSelected(null);
      setSelectedIdx(null);
    }
  }, [canViewTransition]);

  return (
    <>
      <section
        id="projects"
        className="py-20 border-t-[3px] border-b-[3px]"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 ref={titleRef} className={`section-title reveal-zoom ${titleVisible ? 'is-visible' : ''}`}>
            Projects
          </h2>

          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {projects.map((p, i) => {
              const isActive = selectedIdx === i;
              return (
                <TiltCard
                  key={i}
                  className={`neo-card p-7 ${i % 2 === 0 ? 'reveal-left' : 'reveal-right'} ${gridVisible ? 'is-visible' : ''} delay-${i + 1}`}
                  onClick={() => openProject(p, i)}
                >
                  {/* Top */}
                  <div className="flex items-start gap-4 mb-[14px]">
                    <div
                      className="project-icon w-[52px] h-[52px] border-2 flex items-center justify-center text-[1.3rem] rounded-[8px] shrink-0"
                      style={{
                        background: p.iconBg,
                        borderColor: 'var(--border)',
                        viewTransitionName: !isActive ? `proj-icon-${i}` : undefined,
                      }}
                    >
                      <i className={p.icon} />
                    </div>
                    <div>
                      <div
                        className="text-[1.1rem] font-bold mb-1"
                        style={{
                          color: 'var(--text)',
                          viewTransitionName: !isActive ? `proj-title-${i}` : undefined,
                        }}
                      >
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
                  <div className="flex gap-3 flex-wrap items-center">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-[0.88rem] font-bold rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
                      style={{ background: '#000', color: '#fff', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
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
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-4 py-2 text-[0.88rem] font-bold text-black rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
                        style={{ background: '#ffd93d', borderColor: 'var(--border)', boxShadow: 'var(--shadow)' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                      >
                        <i className="fas fa-external-link-alt" /> View Live
                      </a>
                    )}
                      <span
                        className="view-details-badge ml-auto text-[0.78rem] font-mono font-bold border-2 px-3 py-[4px] rounded"
                        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)' }}
                      >
                        View Details →
                      </span>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {selected && <ProjectModal project={selected} projectIdx={selectedIdx} onClose={closeProject} />}
    </>
  );
}
