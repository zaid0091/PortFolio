export default function Contact() {
  const cards = [
    {
      icon: 'fab fa-github',
      label: 'GitHub',
        href: 'https://github.com/zaid0091',
    },
    {
      icon: 'fab fa-linkedin',
      label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/zaid-liaqat-075b8b25b/',
    },
    {
      icon: 'fas fa-phone',
      label: '+92 324 028 1184',
      href: 'tel:+923240281184',
    },
  ];

  return (
    <section
      id="contact"
      className="py-20"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="section-title">Contact</h2>

        <div className="max-w-[700px]">
          <p className="text-[1.05rem] leading-[1.7] mb-8" style={{ color: 'var(--text-muted)' }}>
            I&apos;m open to internships, freelance projects, and full-time opportunities.
            Feel free to reach out — I&apos;d love to connect!
          </p>

          {/* Cards */}
          <div className="flex gap-4 flex-wrap mb-8">
            {cards.map(c => (
              <a
                key={c.label}
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card flex items-center gap-[10px] px-5 py-[14px] border-[3px] rounded-[8px] font-semibold text-[0.9rem] transition-[box-shadow,transform,background] duration-150 hover:translate-x-[3px] hover:translate-y-[3px]"
                style={{
                  borderColor: 'var(--border)',
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow)',
                  color: 'var(--text)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#ffd93d';
                  e.currentTarget.style.boxShadow = 'var(--shadow-hover)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--bg-card)';
                  e.currentTarget.style.boxShadow = 'var(--shadow)';
                }}
              >
                <i className={`${c.icon} text-[1.2rem]`} />
                {c.label}
              </a>
            ))}
          </div>

          {/* Email */}
          <div className="flex items-center gap-[10px] text-base" style={{ color: 'var(--text-muted)' }}>
            <i className="fas fa-envelope text-[1.2rem]" />
            <a
              href="mailto:zaidliaqat999@gmail.com"
              className="font-semibold underline underline-offset-[3px] transition-[color] duration-150"
              style={{ color: 'var(--text)' }}
            >
              zaidliaqat999@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
