import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

const COMMANDS = [
  { id: 'hero',       label: 'Home',        icon: '🏠', section: 'hero',       desc: 'Jump to top',            keywords: 'home top start landing' },
  { id: 'about',      label: 'About',       icon: '👤', section: 'about',      desc: 'About me & stats',       keywords: 'bio info who profile' },
  { id: 'experience', label: 'Experience',   icon: '💼', section: 'experience', desc: 'Work & internships',     keywords: 'work job intern career' },
  { id: 'skills',     label: 'Skills',      icon: '⚡', section: 'skills',     desc: 'Tech stack',             keywords: 'tech stack tools languages' },
  { id: 'projects',   label: 'Projects',    icon: '🚀', section: 'projects',   desc: 'Portfolio projects',     keywords: 'portfolio apps work built' },
  { id: 'education',  label: 'Education',   icon: '🎓', section: 'education',  desc: 'Academic background',    keywords: 'school university degree' },
  { id: 'blog',       label: 'Blog',        icon: '📝', section: 'blog',       desc: 'Articles & insights',    keywords: 'articles posts writing' },
  { id: 'contact',    label: 'Contact',     icon: '📬', section: 'contact',    desc: 'Get in touch',           keywords: 'email message reach hire' },
  { id: 'theme',      label: 'Toggle Theme', icon: '🎨', action: 'theme',      desc: 'Switch dark / light',    keywords: 'dark light mode color' },
  { id: 'resume',     label: 'Resume',      icon: '📄', action: 'resume',      desc: 'View resume',            keywords: 'cv pdf download' },
  { id: 'github',     label: 'GitHub',      icon: '🐙', action: 'github',      desc: 'View source code',       keywords: 'git repo code source' },
];

const RECENT_KEY = 'cmd-palette-recent';
const MAX_RECENT = 5;

/* ── Fuzzy match ── */
function fuzzyMatch(text, pattern) {
  const lower = text.toLowerCase();
  const pat = pattern.toLowerCase();
  let score = 0;
  let pi = 0;
  let lastMatchIdx = -1;

  for (let i = 0; i < lower.length && pi < pat.length; i++) {
    if (lower[i] === pat[pi]) {
      score += 10;
      // Consecutive bonus
      if (lastMatchIdx === i - 1) score += 15;
      // Word-start bonus
      if (i === 0 || lower[i - 1] === ' ' || lower[i - 1] === '-') score += 10;
      lastMatchIdx = i;
      pi++;
    }
  }

  return pi === pat.length ? score : 0;
}

function getRecents() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
  } catch { return []; }
}

function saveRecent(id) {
  const list = getRecents().filter(r => r !== id);
  list.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
}

/* ── Highlight matched chars ── */
function HighlightMatch({ text, query }) {
  if (!query) return <>{text}</>;
  const pat = query.toLowerCase();
  const chars = text.split('');
  const matched = new Set();
  let pi = 0;
  for (let i = 0; i < chars.length && pi < pat.length; i++) {
    if (chars[i].toLowerCase() === pat[pi]) {
      matched.add(i);
      pi++;
    }
  }
  return (
      <>
        {chars.map((ch, i) =>
          matched.has(i)
            ? <span key={i} style={{ color: '#ffd93d', fontWeight: 800, opacity: 1 }}>{ch}</span>
            : <span key={i} style={{ color: 'inherit', opacity: 1 }}>{ch}</span>
        )}
      </>
    );
}

export default function CommandPalette({ open, onClose, onToggleTheme }) {
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [recents, setRecents] = useState([]);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Load recents when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setRecents(getRecents());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Fuzzy-filtered & scored results
  const filtered = useMemo(() => {
    if (!query.trim()) return null; // null = show recents + all
    return COMMANDS
      .map(cmd => {
        const searchText = `${cmd.label} ${cmd.desc} ${cmd.keywords || ''}`;
        const score = fuzzyMatch(searchText, query.trim());
        return { ...cmd, score };
      })
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  // Build display list: recents (if no query) + commands
  const displayList = useMemo(() => {
    if (filtered !== null) return filtered;

    const recentCmds = recents
      .map(id => COMMANDS.find(c => c.id === id))
      .filter(Boolean);

    if (recentCmds.length === 0) return COMMANDS;

    // Show recents first, then all commands (excluding dupes)
    const recentIds = new Set(recents);
    const rest = COMMANDS.filter(c => !recentIds.has(c.id));
    return [
      ...recentCmds.map(c => ({ ...c, isRecent: true })),
      ...rest,
    ];
  }, [filtered, recents]);

  // Determine where recents end for section divider
  const recentCount = (filtered === null)
    ? recents.filter(id => COMMANDS.find(c => c.id === id)).length
    : 0;

  // Keep active item scrolled into view
  useEffect(() => {
    const el = listRef.current?.children[activeIdx];
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  const execute = useCallback((cmd) => {
    saveRecent(cmd.id);
    onClose();

    if (cmd.action === 'theme') {
      onToggleTheme?.();
    } else if (cmd.action === 'resume') {
      // Trigger resume modal or scroll
      document.querySelector('[data-resume-trigger]')?.click();
    } else if (cmd.action === 'github') {
      window.open('https://github.com/zaid0091', '_blank');
    } else if (cmd.section === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (cmd.section) {
      const el = document.getElementById(cmd.section);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [onClose, onToggleTheme]);

  const handleKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, displayList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (displayList[activeIdx]) execute(displayList[activeIdx]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Reset active index when list changes
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
            placeholder="Search sections, actions..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            spellCheck={false}
            autoComplete="off"
          />
          <kbd className="cmd-esc-badge" onClick={onClose}>ESC</kbd>
        </div>

        {/* Divider */}
        <div className="cmd-divider" />

        {/* Results */}
        <ul ref={listRef} className="cmd-list" role="listbox">
          {displayList.length === 0 && (
            <li className="cmd-empty">No results for &ldquo;{query}&rdquo;</li>
          )}
          {displayList.map((cmd, i) => (
            <li key={`${cmd.id}-${i}`}>
              {/* Section divider between recents and all */}
              {recentCount > 0 && i === 0 && (
                <div className="cmd-section-label">Recent</div>
              )}
              {recentCount > 0 && i === recentCount && (
                <div className="cmd-section-label">All Sections</div>
              )}
              <div
                role="option"
                aria-selected={i === activeIdx}
                className={`cmd-item ${i === activeIdx ? 'cmd-item--active' : ''}`}
                onMouseEnter={() => setActiveIdx(i)}
                onClick={() => execute(cmd)}
              >
                <span className="cmd-item-icon">{cmd.icon}</span>
                <span className="cmd-item-body">
                  <span className="cmd-item-label">
                    <HighlightMatch text={cmd.label} query={query} />
                  </span>
                  <span className="cmd-item-desc">
                    <HighlightMatch text={cmd.desc} query={query} />
                  </span>
                </span>
                {cmd.isRecent && !query && (
                  <span className="cmd-recent-badge">recent</span>
                )}
                <span className="cmd-item-enter">↵</span>
              </div>
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
