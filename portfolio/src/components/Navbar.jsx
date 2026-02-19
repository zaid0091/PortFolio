import { useState, useEffect } from 'react';

export default function Navbar({ theme, toggleTheme }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  const links = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#education', label: 'Education' },
    { href: '#contact', label: 'Contact' },
  ];

  useEffect(() => {
    const sectionIds = links.map(l => l.href.slice(1));
    const observers = [];

    sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  return (
    <>
      <nav
        style={{ background: 'var(--bg)', borderBottom: '3px solid var(--border)', height: 'var(--nav-height)' }}
        className="nav-animate fixed top-0 left-0 right-0 z-[1000] flex items-center"
      >
        <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between w-full">
          {/* Brand */}
          <a
            href="#"
            className="nav-brand-text text-[1.4rem] font-bold font-mono px-[14px] py-1 border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
            style={{
              background: '#ffd93d',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow)',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
          >
            ZL
          </a>

          {/* Desktop links */}
            <ul className="hidden md:flex items-center gap-1 list-none">
              {links.map(l => {
                const id = l.href.slice(1);
                const isActive = active === id;
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="nav-link text-[0.9rem] font-semibold px-[14px] py-[6px] border-2 rounded transition-[background,border-color,box-shadow] duration-150"
                      style={{
                        color: 'var(--text)',
                        background: isActive ? '#ffd93d' : '',
                        borderColor: isActive ? 'var(--border)' : 'transparent',
                        boxShadow: isActive ? '3px 3px 0 var(--border)' : 'none',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#ffd93d'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = isActive ? '#ffd93d' : '';
                        e.currentTarget.style.borderColor = isActive ? 'var(--border)' : 'transparent';
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-[38px] h-[38px] border-2 rounded flex items-center justify-center text-base transition-[box-shadow,transform] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
              style={{
                borderColor: 'var(--border)',
                background: 'var(--bg-card)',
                boxShadow: '3px 3px 0 var(--border)',
                color: 'var(--text)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '1px 1px 0 var(--border)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '3px 3px 0 var(--border)'; }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            {/* Hamburger / Close */}
            <button
              className="flex md:hidden items-center justify-center w-[38px] h-[38px] border-2 rounded"
              style={{ borderColor: 'var(--border)', background: 'none', color: 'var(--text)' }}
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed left-0 right-0 z-[999] flex flex-col gap-2 px-6 py-4 border-b-[3px]"
          style={{
            top: 'var(--nav-height)',
            background: 'var(--bg)',
            borderColor: 'var(--border)',
            animation: 'fade-down 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards',
          }}
        >
          {links.map(l => {
              const id = l.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  className="mobile-link font-semibold px-[14px] py-[10px] border-2 rounded text-center transition-[background,box-shadow] duration-150"
                  style={{
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    background: isActive ? '#ffd93d' : '',
                    boxShadow: isActive ? '3px 3px 0 var(--border)' : 'none',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#ffd93d'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isActive ? '#ffd93d' : ''; }}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              );
            })}
        </div>
      )}
    </>
  );
}
