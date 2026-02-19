import { useState, useEffect, useRef, useCallback } from 'react';

const COMMANDS = [
  { id: 'hero',       label: 'Home',        icon: '🏠', section: 'hero',       desc: 'Jump to top' },
  { id: 'about',      label: 'About',       icon: '👤', section: 'about',      desc: 'About me & stats' },
  { id: 'experience', label: 'Experience',  icon: '💼', section: 'experience', desc: 'Work & internships' },
  { id: 'skills',     label: 'Skills',      icon: '⚡', section: 'skills',     desc: 'Tech stack' },
  { id: 'projects',   label: 'Projects',    icon: '🚀', section: 'projects',   desc: 'Portfolio projects' },
  { id: 'education',  label: 'Education',   icon: '🎓', section: 'education',  desc: 'Academic background' },
  { id: 'contact',    label: 'Contact',     icon: '📬', section: 'contact',    desc: 'Get in touch' },
];

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = query.trim() === ''
    ? COMMANDS
    : COMMANDS.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.desc.toLowerCase().includes(query.toLowerCase())
      );

  // Reset when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Keep active item scrolled into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const navigate = useCallback((cmd) => {
    onClose();
    if (cmd.section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(cmd.section);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [onClose]);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (filtered[activeIdx]) navigate(filtered[activeIdx]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Reset active index when filtered list changes
  useEffect(() => { setActiveIdx(0); }, [query]);

  if (!open) return null;

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div
        className="cmd-dialog"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
      >
        {/* Header */}
        <div className="cmd-header">
          <span className="cmd-header-icon">{'>'}_</span>
          <input
            ref={inputRef}
            className="cmd-input"
            placeholder="Type a section to navigate..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            spellCheck={false}
          />
          <kbd className="cmd-esc-badge" onClick={onClose}>ESC</kbd>
        </div>

        {/* Divider */}
        <div className="cmd-divider" />

        {/* Results */}
        <ul ref={listRef} className="cmd-list" role="listbox">
          {filtered.length === 0 && (
            <li className="cmd-empty">No results for &ldquo;{query}&rdquo;</li>
          )}
          {filtered.map((cmd, i) => (
            <li
              key={cmd.id}
              role="option"
              aria-selected={i === activeIdx}
              className={`cmd-item ${i === activeIdx ? 'cmd-item--active' : ''}`}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={() => navigate(cmd)}
            >
              <span className="cmd-item-icon">{cmd.icon}</span>
              <span className="cmd-item-body">
                <span className="cmd-item-label">{cmd.label}</span>
                <span className="cmd-item-desc">{cmd.desc}</span>
              </span>
              <span className="cmd-item-enter">↵</span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="cmd-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> go</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
