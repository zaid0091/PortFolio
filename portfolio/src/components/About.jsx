export default function About() {
  const stats = [
    { number: '3.24', label: 'CGPA / 4.0', color: '#66d9ef' },
    { number: '1', label: 'Internship', color: '#ff6b9d' },
    { number: '2+', label: 'Projects Built', color: '#a8e6cf' },
    { number: '10+', label: 'Hackathons Organised', color: '#ffd93d' },
  ];

  return (
    <section
      id="about"
      className="py-20"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="section-title">About Me</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Bio card */}
          <div className="neo-card p-7">
            <p className="leading-[1.75] mb-4" style={{ color: 'var(--text-muted)' }}>
              I&apos;m a <span className="highlight font-semibold" style={{ background: '#ffd93d', padding: '1px 5px' }}>BS Software Engineering</span> student
              at <span className="highlight font-semibold" style={{ background: '#ffd93d', padding: '1px 5px' }}>IUB</span> (2024–2028),
              building full-stack applications and REST APIs with a passion for clean,
              maintainable code.
            </p>
            <p className="leading-[1.75] mb-4" style={{ color: 'var(--text-muted)' }}>
              During my internship at{' '}
              <span className="highlight-cyan font-semibold" style={{ background: '#66d9ef', padding: '1px 5px', color: 'var(--text)' }}>
                CodeWithCurious Tech Solutions
              </span>{' '}
              I worked on production-level Django &amp; React projects and shipped
              features end-to-end — from database design to deployment on AWS &amp; Vercel.
            </p>
            <p className="leading-[1.75]" style={{ color: 'var(--text-muted)' }}>
              Outside work I lead events for{' '}
              <span className="highlight-pink font-semibold" style={{ background: '#ff6b9d', padding: '1px 5px', color: '#000' }}>
                CodeWithCurious Tech Club
              </span>{' '}
              and contribute to the{' '}
              <span className="highlight-green font-semibold" style={{ background: '#a8e6cf', padding: '1px 5px', color: 'var(--text)' }}>
                GDSC
              </span>{' '}
              committee — organising 10+ hackathons and workshops.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="neo-card p-5 text-center">
                <div
                  className="text-[2.4rem] font-bold font-mono leading-none mb-[6px]"
                  style={{ color: s.color }}
                >
                  {s.number}
                </div>
                <div className="text-[0.82rem] font-medium" style={{ color: 'var(--text-muted)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
