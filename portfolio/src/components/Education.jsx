export default function Education() {
  const coursework = [
    'Data Structures', 'Algorithms', 'OOP', 'Database Systems',
    'Web Engineering', 'Operating Systems', 'Software Engineering',
  ];

  const certs = [
    { name: 'Java Programming Masterclass', provider: 'Udemy' },
    { name: 'Python for Data Science', provider: 'Coursera' },
  ];

  return (
    <section
      id="education"
      className="py-20"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="section-title">Education</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Degree card */}
            <div className="neo-card p-6">
              <div className="text-[1.05rem] font-bold mb-[6px]" style={{ color: 'var(--text)' }}>
                BS Software Engineering
              </div>
              <div className="text-[0.95rem] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Islamia University of Bahawalpur (IUB)
              </div>
              <span
                className="edu-year inline-block font-mono text-[0.78rem] border-2 px-[10px] py-[2px] rounded mb-2"
                style={{ background: '#a8e6cf', borderColor: 'var(--border)', color: '#000' }}
              >
                2024 – 2028
              </span>
              <div className="text-[0.82rem] mb-1" style={{ color: 'var(--text-muted)' }}>
                📍 Bahawalpur, Pakistan
              </div>
              <div className="text-[0.9rem] mt-2" style={{ color: 'var(--text-muted)' }}>
                CGPA: <strong style={{ color: 'var(--text)' }}>3.24 / 4.0</strong>
              </div>

              {/* Coursework */}
              <div className="flex flex-wrap gap-2 mt-4">
                {coursework.map(c => (
                  <span
                    key={c}
                    className="text-[0.75rem] px-[10px] py-[3px] border-2 rounded font-semibold"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="neo-card p-6">
              <div className="text-[1rem] font-bold mb-4" style={{ color: 'var(--text)' }}>
                🏆 Certifications &amp; Awards
              </div>
              {certs.map((c, i) => (
                <div key={i} className="flex items-start gap-3 mb-3 last:mb-0">
                  <span
                    className="mt-[2px] w-5 h-5 rounded flex items-center justify-center text-[0.7rem] font-bold shrink-0"
                    style={{ background: '#ffd93d', border: '2px solid var(--border)', color: '#000' }}
                  >
                    ✓
                  </span>
                  <div>
                    <div className="text-[0.9rem] font-semibold" style={{ color: 'var(--text)' }}>{c.name}</div>
                    <div className="text-[0.8rem]" style={{ color: 'var(--text-muted)' }}>{c.provider}</div>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3 mt-3">
                <span
                  className="mt-[2px] w-5 h-5 rounded flex items-center justify-center text-[0.7rem] font-bold shrink-0"
                  style={{ background: '#ff6b9d', border: '2px solid var(--border)', color: '#000' }}
                >
                  🥇
                </span>
                <div>
                  <div className="text-[0.9rem] font-semibold" style={{ color: 'var(--text)' }}>Innovative Project Award</div>
                  <div className="text-[0.8rem]" style={{ color: 'var(--text-muted)' }}>University Tech Expo 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
