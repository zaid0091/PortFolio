import { useEffect } from 'react';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="proj-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="proj-modal-dialog">

        {/* Accent bar */}
        <div style={{ height: 5, background: project.iconBg, flexShrink: 0 }} />

        {/* Header */}
        <div className="proj-modal-header" style={{ borderBottom: '3px solid var(--border)' }}>
          <div
            className="w-[48px] h-[48px] border-2 flex items-center justify-center text-[1.3rem] rounded-[8px] shrink-0"
            style={{ background: project.iconBg, borderColor: 'var(--border)', color: '#000' }}
          >
            <i className={project.icon} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[1.2rem] font-bold" style={{ color: 'var(--text)' }}>{project.title}</div>
            <div className="text-[0.8rem] font-mono" style={{ color: 'var(--text-muted)' }}>{project.date}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-[6px] text-[0.82rem] font-bold rounded-[6px] border-2 transition-[box-shadow,transform] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
                style={{ background: '#ffd93d', borderColor: 'var(--border)', color: '#000', boxShadow: 'var(--shadow)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <i className="fas fa-external-link-alt" /> Live
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-[6px] text-[0.82rem] font-bold rounded-[6px] border-2 transition-[box-shadow,transform] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
                style={{ background: '#000', borderColor: 'var(--border)', color: '#fff', boxShadow: 'var(--shadow)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <i className="fab fa-github" /> GitHub
              </a>
            )}
            <button
              onClick={onClose}
              className="proj-modal-close"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="proj-modal-body">
          <div className="proj-modal-content">

            {/* Tags */}
            <div className="flex flex-wrap gap-[6px] mb-6">
              {project.tags.map(t => (
                <span
                  key={t}
                  className="text-[0.75rem] px-[10px] py-[3px] border-2 rounded font-semibold font-mono"
                  style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Overview */}
            <Section title="Overview" color={project.iconBg}>
              <p className="proj-modal-p">{project.detail.overview}</p>
            </Section>

            {/* Problem */}
            <Section title="The Problem" color="#ff6b9d">
              <p className="proj-modal-p">{project.detail.problem}</p>
            </Section>

            {/* Solution */}
            <Section title="The Solution" color="#66d9ef">
              <p className="proj-modal-p">{project.detail.solution}</p>
            </Section>

            {/* Tech Decisions */}
            <Section title="Tech Decisions" color="#a8e6cf">
              <ul className="proj-modal-list">
                {project.detail.techDecisions.map((d, i) => (
                  <li key={i} className="proj-modal-li">{d}</li>
                ))}
              </ul>
            </Section>

            {/* Key Features */}
            <Section title="Key Features" color="#c9b8ff">
              <ul className="proj-modal-list">
                {project.detail.features.map((f, i) => (
                  <li key={i} className="proj-modal-li">{f}</li>
                ))}
              </ul>
            </Section>

            {/* Lessons Learned */}
            <Section title="Lessons Learned" color="#ffb347">
              <p className="proj-modal-p">{project.detail.lessons}</p>
            </Section>

          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, color, children }) {
  return (
    <div className="proj-modal-section">
      <h3 className="proj-modal-h3" style={{ borderLeftColor: color }}>{title}</h3>
      {children}
    </div>
  );
}
