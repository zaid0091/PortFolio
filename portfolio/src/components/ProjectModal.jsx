import { useEffect } from 'react';

export default function ProjectModal({ project, projectIdx, onClose }) {
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
          <div className="proj-modal-header">
            <div className="proj-modal-icon" style={{ background: project.iconBg, viewTransitionName: `proj-icon-${projectIdx}` }}>
              <i className={project.icon} />
            </div>
            <div className="proj-modal-info">
              <div className="proj-modal-title" style={{ viewTransitionName: `proj-title-${projectIdx}` }}>{project.title}</div>
              <div className="proj-modal-date">{project.date}</div>
            </div>
          <div className="proj-modal-links">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="proj-modal-btn proj-modal-btn--live">
                <i className="fas fa-external-link-alt" /> Live
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="proj-modal-btn proj-modal-btn--github">
                <i className="fab fa-github" /> GitHub
              </a>
            )}
            <button onClick={onClose} className="proj-modal-close" aria-label="Close">
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="proj-modal-body">
          <div className="proj-modal-content">

            {/* Tags */}
            <div className="proj-modal-tags">
              {project.tags.map(t => (
                <span key={t} className="proj-modal-tag">{t}</span>
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
