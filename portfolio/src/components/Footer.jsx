export default function Footer() {
  const navLinks = [
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#education', label: 'Education' },
    { href: '#blog', label: 'Blog' },
    { href: '#contact', label: 'Contact' },
  ];

  const socials = [
{ icon: 'fab fa-github', href: 'https://github.com/zaid0091', label: 'GitHub' },
      { icon: 'fab fa-linkedin', href: 'https://www.linkedin.com/in/zaid-liaqat-075b8b25b/', label: 'LinkedIn' },
  ];

  return (
    <footer
      className="border-t-[3px] py-10"
      style={{
        background: 'var(--text)',
        color: 'var(--bg)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex justify-between items-center flex-wrap gap-5">
          {/* Brand */}
          <div>
            <div className="text-[1.1rem] font-bold font-mono">Zaid Liaqat</div>
            <span className="block text-[0.8rem] opacity-60 font-sans font-normal mt-[2px]">
              Software Developer
            </span>
          </div>

          {/* Nav */}
          <ul className="flex gap-5 list-none flex-wrap">
            {navLinks.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="text-[0.88rem] opacity-70 transition-opacity duration-150 hover:opacity-100"
                  style={{ color: 'inherit' }}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Socials */}
          <div className="flex gap-[10px]">
            {socials.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 border-2 rounded-[6px] flex items-center justify-center text-base opacity-70 transition-[opacity,border-color] duration-150 hover:opacity-100"
                style={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: 'inherit',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              >
                <i className={s.icon} />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-6 pt-5 text-center text-[0.82rem] opacity-50"
          style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}
        >
          © {new Date().getFullYear()} Zaid Liaqat.
        </div>
      </div>
    </footer>
  );
}
