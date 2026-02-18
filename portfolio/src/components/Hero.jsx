export default function Hero() {
  const socials = [
{ icon: 'fab fa-github', href: 'https://github.com/zaid0091', label: 'GitHub' },
      { icon: 'fab fa-linkedin', href: 'https://www.linkedin.com/in/zaid-liaqat-075b8b25b/', label: 'LinkedIn' },
    { icon: 'fas fa-envelope', href: 'mailto:zaidliaqat999@gmail.com', label: 'Email' },
    { icon: 'fas fa-phone', href: 'tel:+923240281184', label: 'Phone' },
  ];

  const techs = [
    { icon: 'fab fa-react', label: 'React' },
    { icon: 'fab fa-node-js', label: 'Node' },
    { icon: 'fab fa-python', label: 'Python' },
    { icon: 'fab fa-js', label: 'JS' },
    { icon: 'fab fa-aws', label: 'AWS' },
    { icon: 'fas fa-database', label: 'Django' },
    { icon: 'fab fa-git-alt', label: 'Git' },
    { icon: 'fas fa-fire', label: 'Firebase' },
  ];

  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center relative overflow-hidden border-b-[3px]"
      style={{
        paddingTop: 'var(--nav-height)',
        background: 'var(--bg-secondary)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Dot grid bg */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(var(--border) 1.5px, transparent 1.5px)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="max-w-[1100px] mx-auto px-6 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-[60px] items-center">
          {/* Left */}
          <div>
            <p
              className="text-[1.1rem] font-mono mb-3"
              style={{ color: 'var(--text-muted)' }}
            >
              👋 Hey, I&apos;m
            </p>

            <h1
              className="font-bold leading-[1.1] tracking-[-0.03em] mb-5"
              style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                color: 'var(--text)',
              }}
            >
              Zaid Liaqat
            </h1>

            <span
              className="hero-title-badge inline-block font-semibold text-base px-4 py-1 border-[3px] mb-5"
              style={{
                background: '#66d9ef',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow)',
              }}
            >
              Software Developer &amp; Full-Stack Engineer
            </span>

            <p
              className="text-[1.05rem] leading-[1.7] max-w-[540px] mb-7"
              style={{ color: 'var(--text-muted)' }}
            >
              BS Software Engineering student at IUB with hands-on experience building
              full-stack web apps, REST APIs, and real-time systems. Passionate about
              clean code and solving real problems.
            </p>

            {/* Socials */}
            <div className="flex gap-[10px] mb-7">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="social-btn w-[42px] h-[42px] border-2 flex items-center justify-center text-[1.1rem] rounded-[6px] transition-[box-shadow,transform,background] duration-150 hover:translate-x-[2px] hover:translate-y-[2px]"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-card)',
                    boxShadow: '3px 3px 0 var(--border)',
                    color: 'var(--text)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#ffd93d';
                    e.currentTarget.style.boxShadow = '1px 1px 0 var(--border)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.boxShadow = '3px 3px 0 var(--border)';
                  }}
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap">
              <a
                href="#contact"
                className="btn-primary inline-flex items-center gap-2 px-6 py-3 font-bold text-[0.95rem] rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
                style={{
                  background: '#000',
                  color: '#fff',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--shadow)',
                }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
              >
                <i className="fas fa-paper-plane" /> Get In Touch
              </a>
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold text-[0.95rem] text-black rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
                  style={{
                    background: '#ffd93d',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                >
                  <i className="fas fa-code" /> View Projects
                </a>
                  <a
                    href="/Zaid_Liaqat_Resume.pdf"
                    download="Zaid_Liaqat_Resume.pdf"
                  className="inline-flex items-center gap-2 px-6 py-3 font-bold text-[0.95rem] rounded-[6px] border-[3px] transition-[box-shadow,transform] duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
                  style={{
                    background: '#a8e6cf',
                    color: '#000',
                    borderColor: 'var(--border)',
                    boxShadow: 'var(--shadow)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
                >
                  <i className="fas fa-download" /> Resume
                </a>
            </div>

            {/* Tech strip */}
            <div
              className="flex gap-[10px] flex-wrap mt-12 pt-8 border-t-2 border-dashed"
              style={{ borderColor: 'var(--border)' }}
            >
              {techs.map(t => (
                <span
                  key={t.label}
                  className="tech-badge inline-flex items-center gap-[6px] px-[14px] py-[6px] border-2 rounded-full text-[0.82rem] font-semibold transition-[background] duration-150 cursor-default"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-card)',
                    color: 'var(--text)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#66d9ef'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <i className={t.icon} /> {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right — avatar */}
          <div className="relative w-[300px] shrink-0 hidden md:block">
            <div
              className="hero-avatar-placeholder w-[300px] h-[300px] border-4 rounded-[8px] flex items-center justify-center text-[5rem] font-bold font-mono text-black transition-transform duration-300 hover:-rotate-2 cursor-default select-none"
              style={{
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-lg)',
                background: 'linear-gradient(135deg, #66d9ef, #a8e6cf)',
              }}
            >
              ZL
            </div>

            {/* Deco tags */}
            <span
              className="absolute bottom-[-16px] right-[-16px] px-[14px] py-[6px] text-[0.85rem] font-bold rounded border-[3px] whitespace-nowrap"
              style={{
                background: '#ff6b9d',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow)',
              }}
            >
              📍 Hasilpur, Pakistan
            </span>
            <span
              className="absolute top-[-14px] left-[-14px] px-[14px] py-[6px] text-[0.8rem] font-bold rounded border-[3px] whitespace-nowrap font-mono"
              style={{
                background: '#a8e6cf',
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow)',
              }}
            >
              &lt;developer /&gt;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
