import { useInView } from '../hooks/useInView';

export default function Skills() {
  const groups = [
    {
      icon: 'fab fa-react',
      iconBg: '#66d9ef',
      title: 'Frontend',
      tags: ['React', 'HTML5', 'CSS3', 'JavaScript (ES6+)', 'Tailwind CSS'],
    },
    {
      icon: 'fas fa-code',
      iconBg: '#ffd93d',
      title: 'Languages',
      tags: ['Python', 'JavaScript', 'C++', 'SQL'],
    },
    {
      icon: 'fas fa-server',
      iconBg: '#ff6b9d',
      title: 'Backend',
      tags: ['Node.js', 'Express.js', 'Django', 'Django REST Framework', 'Socket.IO'],
    },
    {
      icon: 'fab fa-aws',
      iconBg: '#a8e6cf',
      title: 'Cloud & Deployment',
      tags: ['AWS Lambda', 'Vercel', 'Firebase Hosting'],
    },
    {
      icon: 'fas fa-database',
      iconBg: '#c9b8ff',
      title: 'Databases',
      tags: ['SQLite', 'MySQL', 'Firebase Realtime DB', 'Firestore'],
    },
    {
      icon: 'fas fa-tools',
      iconBg: '#ffb347',
      title: 'Tools & APIs',
      tags: ['Git', 'GitHub', 'Postman', 'Google Maps API', 'REST APIs', 'JWT'],
    },
  ];

  const [titleRef, titleVisible] = useInView();
  const [gridRef, gridVisible] = useInView({ threshold: 0.05 });

  return (
    <section
      id="skills"
      className="py-20"
      style={{ background: 'var(--bg)' }}
    >
      <div className="max-w-[1100px] mx-auto px-6">
        <h2
          ref={titleRef}
          className={`section-title reveal-zoom ${titleVisible ? 'is-visible' : ''}`}
        >
          Skills
        </h2>

        <div
          ref={gridRef}
          className="grid gap-6"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}
        >
          {groups.map((g, i) => (
            <div
              key={i}
              className={`neo-card p-6 reveal ${gridVisible ? 'is-visible' : ''} delay-${i + 1}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="skill-icon w-11 h-11 border-2 flex items-center justify-center text-[1.2rem] rounded-[6px] shrink-0"
                  style={{ background: g.iconBg, borderColor: 'var(--border)' }}
                >
                  <i className={g.icon} />
                </div>
                <span className="text-base font-bold" style={{ color: 'var(--text)' }}>{g.title}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {g.tags.map(t => (
                  <span
                    key={t}
                    className="skill-tag text-[0.8rem] px-3 py-1 border-2 rounded font-semibold transition-[background] duration-150 cursor-default"
                    style={{
                      borderColor: 'var(--border)',
                      background: 'var(--bg-secondary)',
                      color: 'var(--text)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#ffd93d'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
