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

import { supabase } from '../services/supabaseClient';

const ensureAbsoluteUrl = (url) => {
  if (!url) return url;
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

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

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error) {
        // Map database fields to the structure expected by the component
        const formattedProjects = data.map(p => ({
          ...p,
          iconBg: p.icon_bg,
          desc: p.description,
          github: ensureAbsoluteUrl(p.github_url),
          live: ensureAbsoluteUrl(p.live_url),
          detail: {
            overview: p.detail_overview,
            problem: p.detail_problem,
            solution: p.detail_solution,
            techDecisions: p.detail_tech,
            features: p.detail_features,
            lessons: p.detail_lessons,
          }
        }));
        setProjects(formattedProjects);
      }
      setLoading(false);
    }
    fetchProjects();
  }, []);

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

          {loading ? (
            <div className="text-center py-10 opacity-60 font-mono">Loading projects...</div>
          ) : (
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
          )}
        </div>
      </section>

      {selected && <ProjectModal project={selected} projectIdx={selectedIdx} onClose={closeProject} />}
    </>
  );
}
