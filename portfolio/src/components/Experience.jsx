export default function Experience() {
  const work = [
    {
      title: 'Software Developer Intern',
      company: 'CodeWithCurious Tech Solutions',
      date: 'Jun 2023 – Dec 2023',
      location: 'Pune, India (Remote)',
      bullets: [
        'Built and maintained full-stack web applications using Django, Django REST Framework, and React.',
        'Designed RESTful APIs consumed by React front-ends; wrote unit tests with pytest.',
        'Deployed applications on AWS Lambda + Vercel; reduced page load time by ~30 %.',
        'Collaborated with a cross-functional team via Git, daily stand-ups, and Agile sprints.',
      ],
      tags: ['Django', 'DRF', 'React', 'Python', 'AWS Lambda', 'Vercel', 'PostgreSQL'],
    },
  ];

  const activities = [
    {
      title: 'Head of Events',
      company: 'CodeWithCurious Tech Club — IUB',
      date: '2024 – Present',
      location: 'Bahawalpur, Pakistan',
      bullets: [
        'Organised and managed 10+ hackathons, coding competitions, and tech workshops.',
        'Coordinated with speakers, sponsors, and 200+ student participants.',
      ],
      tags: ['Leadership', 'Event Management', 'Community'],
    },
    {
      title: 'Committee Member',
      company: 'Google Developer Student Club (GDSC) — IUB',
      date: '2024 – Present',
      location: 'Bahawalpur, Pakistan',
      bullets: [
        'Contributed to organising developer-focused events and learning sessions.',
        'Helped onboard new members and promoted open-source culture on campus.',
      ],
      tags: ['Google', 'Open Source', 'Community'],
    },
  ];

  const TimelineSection = ({ title, items, dateColor }) => (
    <div className="mb-12">
      <h3
        className="text-[1rem] font-bold font-mono mb-6 px-3 py-1 border-2 inline-block rounded"
        style={{
          background: dateColor,
          borderColor: 'var(--border)',
          color: '#000',
        }}
      >
        {title}
      </h3>

      <div className="relative pl-8">
        {/* Vertical line */}
        <div
          className="absolute left-2 top-2 bottom-2 w-[3px]"
          style={{ background: 'var(--border)' }}
        />

        {items.map((item, i) => (
          <div key={i} className="relative mb-8 last:mb-0">
            {/* Dot */}
            <div
              className="absolute left-[-31px] top-5 w-[18px] h-[18px] rounded-full border-[3px]"
              style={{ background: '#ffd93d', borderColor: 'var(--border)' }}
            />

            <div className="neo-card p-6">
              <div className="flex justify-between items-start gap-3 mb-[10px] flex-wrap">
                <div>
                  <div className="text-[1.05rem] font-bold leading-[1.3]" style={{ color: 'var(--text)' }}>
                    {item.title}
                  </div>
                  <div className="text-[0.95rem] font-medium mt-[2px]" style={{ color: 'var(--text-muted)' }}>
                    {item.company}
                  </div>
                </div>
                <span
                  className="timeline-date font-mono text-[0.78rem] border-2 px-[10px] py-[2px] rounded shrink-0"
                  style={{ background: dateColor, borderColor: 'var(--border)', color: '#000' }}
                >
                  {item.date}
                </span>
              </div>

              <div className="text-[0.82rem] mb-[10px]" style={{ color: 'var(--text-muted)' }}>
                📍 {item.location}
              </div>

              <ul className="flex flex-col gap-[6px] mb-3">
                {item.bullets.map((b, j) => (
                  <li key={j} className="text-[0.92rem] leading-[1.7] flex items-start gap-1" style={{ color: 'var(--text-muted)' }}>
                    <span className="mt-[2px] shrink-0">▸</span> {b}
                  </li>
                ))}
              </ul>

              <div className="flex gap-[6px] flex-wrap mt-3">
                {item.tags.map(t => (
                  <span
                    key={t}
                    className="text-[0.75rem] px-[10px] py-[3px] border-2 rounded font-semibold"
                    style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)', color: 'var(--text)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section
      id="experience"
      className="py-20"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <h2 className="section-title">Experience</h2>
        <TimelineSection title="💼 Work Experience" items={work} dateColor="#66d9ef" />
        <TimelineSection title="🎓 Activities & Leadership" items={activities} dateColor="#a8e6cf" />
      </div>
    </section>
  );
}
