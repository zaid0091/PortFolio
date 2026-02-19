import { useEffect, useRef } from 'react';
import { RESUME } from '../data/resumeData';

export default function ResumeModal({ onClose }) {
  const printRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

    const handlePrint = () => {
      const el = printRef.current;
      if (!el) return;
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`
      <html><head><title>${RESUME.name} — Resume</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Segoe UI',system-ui,sans-serif;color:#111;padding:40px 48px;max-width:800px;margin:0 auto;font-size:11pt;line-height:1.5}
        h1{font-size:20pt;font-weight:800;margin-bottom:2px}
        .title{font-size:11pt;font-weight:600;color:#444;margin-bottom:4px}
        .contact{font-size:9pt;color:#555;margin-bottom:14px}
        .contact a{color:#555;text-decoration:none}
        .section{margin-bottom:14px}
        .section-title{font-size:10.5pt;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;border-bottom:2px solid #111;padding-bottom:3px;margin-bottom:8px}
        .entry{margin-bottom:10px}
        .entry-header{display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap}
        .entry-primary{font-weight:700;font-size:10.5pt}
        .entry-secondary{font-size:10pt;color:#333}
        .entry-date{font-size:9pt;color:#555;white-space:nowrap}
        .entry-sub{font-size:9pt;color:#555;font-style:italic}
        ul{margin:3px 0 0 18px}
        li{font-size:10pt;margin-bottom:2px}
        .skills-grid{display:grid;grid-template-columns:140px 1fr;gap:3px 12px;font-size:10pt}
        .skill-cat{font-weight:700;font-size:9.5pt}
        .skill-list{font-size:9.5pt;color:#333}
        .summary{font-size:10pt;color:#333;margin-bottom:14px}
        @media print{body{padding:32px 40px}}
      </style></head><body>
      ${el.innerHTML}
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  const r = RESUME;

  return (
    <div
      className="resume-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="resume-modal-dialog">
          {/* Header bar */}
          <div className="resume-modal-header">
            <div className="resume-modal-header-left">
              <span className="resume-modal-live-badge">LIVE</span>
              <span className="resume-modal-header-title">Resume Preview</span>
            </div>
            <div className="resume-modal-header-actions">
              <a
                href="/Zaid_Liaqat_Resume.pdf"
                download="Zaid_Liaqat_Resume.pdf"
                className="resume-modal-btn resume-modal-btn--pdf"
              >
                <i className="fas fa-download" /> PDF
              </a>
              <button onClick={handlePrint} className="resume-modal-btn resume-modal-btn--print">
                <i className="fas fa-print" /> Print
              </button>
              <button onClick={onClose} className="resume-modal-close" aria-label="Close">
                ×
              </button>
            </div>
          </div>

        {/* Live rendered resume */}
        <div className="resume-modal-body" style={{ overflow: 'auto' }}>
          <div ref={printRef} className="rlp">
            {/* Name + Title */}
            <h1 className="rlp-name">{r.name}</h1>
            <p className="rlp-title">{r.title}</p>
            <p className="rlp-contact">
              <a href={`mailto:${r.email}`}>{r.email}</a>
              <span className="rlp-dot">·</span>
              {r.phone}
              <span className="rlp-dot">·</span>
              {r.location}
              <span className="rlp-dot">·</span>
              <a href={`https://${r.github}`} target="_blank" rel="noreferrer">{r.github}</a>
              <span className="rlp-dot">·</span>
              <a href={`https://${r.linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>
            </p>

            {/* Summary */}
            <p className="rlp-summary">{r.summary}</p>

            {/* Experience */}
            <div className="rlp-section">
              <h2 className="rlp-section-title">Experience</h2>
              {r.experience.map((exp, i) => (
                <div key={i} className="rlp-entry">
                  <div className="rlp-entry-header">
                    <span className="rlp-entry-primary">{exp.title}</span>
                    <span className="rlp-entry-date">{exp.date}</span>
                  </div>
                  <div className="rlp-entry-sub">{exp.company} — {exp.location}</div>
                  <ul>
                    {exp.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            {/* Education */}
            <div className="rlp-section">
              <h2 className="rlp-section-title">Education</h2>
              {r.education.map((ed, i) => (
                <div key={i} className="rlp-entry">
                  <div className="rlp-entry-header">
                    <span className="rlp-entry-primary">{ed.degree}</span>
                    <span className="rlp-entry-date">{ed.date}</span>
                  </div>
                  <div className="rlp-entry-sub">{ed.school} {ed.gpa && `— GPA: ${ed.gpa}`}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div className="rlp-section">
              <h2 className="rlp-section-title">Skills</h2>
              <div className="rlp-skills-grid">
                {Object.entries(r.skills).map(([cat, items]) => (
                  <div key={cat} className="rlp-skill-row">
                    <span className="rlp-skill-cat">{cat}</span>
                    <span className="rlp-skill-list">{items.join(', ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activities */}
            <div className="rlp-section">
              <h2 className="rlp-section-title">Activities & Leadership</h2>
              {r.activities.map((a, i) => (
                <div key={i} className="rlp-entry">
                  <div className="rlp-entry-header">
                    <span className="rlp-entry-primary">{a.title}</span>
                    <span className="rlp-entry-date">{a.date}</span>
                  </div>
                  <div className="rlp-entry-sub">{a.org}</div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className="rlp-section">
              <h2 className="rlp-section-title">Certifications</h2>
              {r.certifications.map((c, i) => (
                <div key={i} className="rlp-entry">
                  <div className="rlp-entry-header">
                    <span className="rlp-entry-primary">{c.name}</span>
                    <span className="rlp-entry-date">{c.provider}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
