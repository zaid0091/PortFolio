import { useEffect } from 'react';

export default function ResumeModal({ onClose }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="resume-modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="resume-modal-dialog">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b-[3px]"
          style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
        >
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 text-[0.8rem] font-bold font-mono border-2 rounded"
              style={{ background: '#ffd93d', borderColor: 'var(--border)', color: '#000' }}
            >
              PDF
            </span>
            <span className="font-bold text-[0.95rem]" style={{ color: 'var(--text)' }}>
              Zaid_Liaqat_Resume.pdf
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/Zaid_Liaqat_Resume.pdf"
              download="Zaid_Liaqat_Resume.pdf"
              className="inline-flex items-center gap-2 px-4 py-2 text-[0.85rem] font-bold border-2 rounded transition-[box-shadow,transform] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
              style={{
                background: '#a8e6cf',
                borderColor: 'var(--border)',
                boxShadow: '3px 3px 0 var(--border)',
                color: '#000',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '1px 1px 0 var(--border)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '3px 3px 0 var(--border)'; }}
            >
              <i className="fas fa-download" /> Download
            </a>
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center border-2 rounded font-bold text-[1.1rem] transition-[background,box-shadow] duration-150"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text)',
                boxShadow: '3px 3px 0 var(--border)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ff6b9d'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* PDF Embed */}
        <div className="resume-modal-body">
          <iframe
            src="/Zaid_Liaqat_Resume.pdf#toolbar=0&navpanes=0"
            title="Zaid Liaqat Resume"
            className="w-full h-full"
            style={{ border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </div>
  );
}
