import { useInView } from '../hooks/useInView';

const groups = [
  {
    icon: 'fab fa-react',
    iconBg: '#66d9ef',
    title: 'Frontend',
    skills: [
      { name: 'React', pct: 90 },
      { name: 'JavaScript (ES6+)', pct: 88 },
      { name: 'Tailwind CSS', pct: 85 },
      { name: 'HTML5 / CSS3', pct: 92 },
    ],
  },
  {
    icon: 'fas fa-code',
    iconBg: '#ffd93d',
    title: 'Languages',
    skills: [
      { name: 'Python', pct: 85 },
      { name: 'JavaScript', pct: 88 },
      { name: 'C++', pct: 70 },
      { name: 'SQL', pct: 75 },
    ],
  },
  {
    icon: 'fas fa-server',
    iconBg: '#ff6b9d',
    title: 'Backend',
    skills: [
      { name: 'Django / DRF', pct: 82 },
      { name: 'Node.js / Express', pct: 78 },
      { name: 'REST APIs', pct: 88 },
      { name: 'Socket.IO', pct: 65 },
    ],
  },
  {
    icon: 'fab fa-aws',
    iconBg: '#a8e6cf',
    title: 'Cloud & Deployment',
    skills: [
      { name: 'Firebase', pct: 80 },
      { name: 'Vercel', pct: 85 },
      { name: 'AWS Lambda', pct: 60 },
    ],
  },
  {
    icon: 'fas fa-database',
    iconBg: '#c9b8ff',
    title: 'Databases',
    skills: [
      { name: 'MySQL / SQLite', pct: 78 },
      { name: 'Firestore', pct: 75 },
      { name: 'Firebase Realtime DB', pct: 72 },
    ],
  },
  {
    icon: 'fas fa-tools',
    iconBg: '#ffb347',
    title: 'Tools & APIs',
    skills: [
      { name: 'Git / GitHub', pct: 90 },
      { name: 'Postman', pct: 82 },
      { name: 'JWT Auth', pct: 78 },
      { name: 'Google Maps API', pct: 70 },
    ],
  },
];

const BAR_COLORS = ['#66d9ef', '#ffd93d', '#ff6b9d', '#a8e6cf', '#c9b8ff', '#ffb347'];

function SkillBar({ name, pct, color, animate }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[0.82rem] font-semibold" style={{ color: 'var(--text)' }}>{name}</span>
        <span
          className="text-[0.75rem] font-bold font-mono px-[6px] py-[1px] border rounded"
          style={{ borderColor: 'var(--border)', background: color, color: '#000' }}
        >
          {pct}%
        </span>
      </div>
      <div
        className="w-full h-[10px] rounded border-2 overflow-hidden"
        style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}
      >
        <div
          className="h-full rounded skill-bar-fill"
          style={{
            background: color,
            width: animate ? `${pct}%` : '0%',
            transition: animate ? 'width 1s cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          }}
        />
      </div>
    </div>
  );
}

export default function Skills() {
  const [titleRef, titleVisible] = useInView();
  const [gridRef, gridVisible] = useInView({ threshold: 0.05 });

  return (
    <section id="skills" className="py-20" style={{ background: 'var(--bg)' }}>
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
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}
        >
          {groups.map((g, i) => (
            <div
              key={i}
              className={`neo-card p-6 reveal ${gridVisible ? 'is-visible' : ''} delay-${(i % 6) + 1}`}
            >
              {/* Card header */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="skill-icon w-11 h-11 border-2 flex items-center justify-center text-[1.2rem] rounded-[6px] shrink-0"
                  style={{ background: g.iconBg, borderColor: 'var(--border)' }}
                >
                  <i className={g.icon} />
                </div>
                <span className="text-base font-bold" style={{ color: 'var(--text)' }}>{g.title}</span>
              </div>

              {/* Progress bars */}
              {g.skills.map(s => (
                <SkillBar
                  key={s.name}
                  name={s.name}
                  pct={s.pct}
                  color={BAR_COLORS[i]}
                  animate={gridVisible}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
