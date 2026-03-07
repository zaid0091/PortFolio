import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables.")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const projects = [
    {
        icon: 'fas fa-keyboard',
        icon_bg: '#66d9ef',
        title: 'Typing Test Platform',
        date: 'Dec 2025',
        description: 'A full-stack typing speed test app with user authentication, real-time WPM tracking, and a global leaderboard.',
        bullets: [
            'Built REST API with Django REST Framework; JWT-based auth with refresh token rotation.',
            'React frontend with live WPM/accuracy counters; deployed frontend on Vercel.',
            'Serverless backend on AWS Lambda + SQLite; CI/CD via GitHub Actions.',
        ],
        tags: ['React', 'Django', 'DRF', 'SQLite', 'AWS Lambda', 'Vercel', 'JWT'],
        github_url: 'https://github.com/zaid0091/master-typing',
        live_url: 'https://master-typing-steel.vercel.app',
        detail_overview: 'A full-stack typing speed test platform where users can measure their WPM and accuracy in real time, compete on a global leaderboard, and track personal progress over time.',
        detail_problem: 'Most typing test tools are frontend-only with no persistence — users can\'t track improvement, create accounts, or see how they rank against others. I wanted to build something with real authentication, a database-backed leaderboard, and a clean UX.',
        detail_solution: 'Built a Django REST Framework backend with JWT authentication (access + refresh token rotation) deployed serverlessly on AWS Lambda. The React frontend polls the API in real time to update WPM/accuracy counters mid-test, and persists each session result to SQLite.',
        detail_tech: [
            'Django REST Framework over Node/Express — I was already comfortable with Python and DRF\'s serializers saved a lot of boilerplate.',
            'AWS Lambda for the backend — free tier is generous for a portfolio project, and it forced me to learn serverless deployment patterns.',
            'SQLite over PostgreSQL — lightweight enough for demo scale; easy to migrate later.',
            'JWT with refresh token rotation — industry-standard auth pattern; refresh tokens stored in httpOnly cookies to prevent XSS theft.',
            'Vite + React for the frontend — fast HMR during development, small production bundle.',
        ],
        detail_features: [
            'Real-time WPM and accuracy calculation as you type',
            'JWT-based user authentication with refresh token rotation',
            'Global leaderboard sorted by WPM with pagination',
            'Personal history dashboard showing progress over sessions',
            'Multiple test durations (15s, 30s, 60s)',
            'CI/CD pipeline via GitHub Actions deploying to Vercel on push',
        ],
        detail_lessons: 'Serverless cold starts on AWS Lambda were trickier than expected — had to implement a keep-alive ping to reduce latency. Also learned that JWT refresh token rotation needs careful handling on the client to avoid race conditions when two tabs are open simultaneously.',
    },
    {
        icon: 'fas fa-map-marker-alt',
        icon_bg: '#ff6b9d',
        title: 'Real-Time Vehicle Tracking',
        date: 'Jan 2024',
        description: 'A real-time GPS vehicle tracking system with live map updates, driver dashboard, and fleet management panel.',
        bullets: [
            'WebSocket communication via Socket.IO for sub-second location broadcasting.',
            'Google Maps JavaScript API for route rendering and geofencing alerts.',
            'Firebase Realtime Database for storing location history; Node/Express backend.',
        ],
        tags: ['Node.js', 'React', 'Socket.IO', 'Google Maps API', 'Firebase', 'Express'],
        github_url: 'https://github.com/zaid0091',
        live_url: null,
        detail_overview: 'A real-time fleet management system that tracks multiple vehicles on a live map. Includes a driver-facing mobile dashboard, a fleet manager panel, geofencing alerts, and historical route playback.',
        detail_problem: 'Fleet management tools are either expensive SaaS products or poorly built open-source demos. I wanted to understand how real-time location systems actually work under the hood — the WebSocket architecture, map rendering, and database design for time-series GPS data.',
        detail_solution: 'Used Socket.IO to broadcast location updates from drivers in under 100ms. Google Maps JavaScript API handles live marker movement and geofence polygon rendering. Firebase Realtime Database stores the location stream efficiently with time-based indexing for playback.',
        detail_tech: [
            'Socket.IO over raw WebSockets — automatic reconnection, room-based broadcasting, and fallback to long-polling made it much more robust.',
            'Firebase Realtime Database for location history — its push() method with timestamp keys is perfect for append-only GPS logs, and the client SDK handles offline sync.',
            'Google Maps JS API over Leaflet/OpenStreetMap — richer feature set (geofencing, styled maps, Places API) justified the API key setup.',
            'Node/Express for the backend — lightweight enough for a real-time relay server; CPU-bound work is minimal.',
        ],
        detail_features: [
            'Sub-second live location updates via Socket.IO WebSockets',
            'Google Maps integration with animated vehicle markers',
            'Geofencing alerts when vehicles enter/leave defined zones',
            'Route history playback with timeline scrubber',
            'Multi-vehicle fleet dashboard with status indicators',
            'Driver mobile view with trip start/stop controls',
        ],
        detail_lessons: 'The hardest part was handling disconnections gracefully — a driver losing mobile signal shouldn\'t ghost their marker or corrupt the route history. Implemented a presence system in Firebase to track online/offline state separately from location data. Also learned that batching GPS updates (every 2s instead of every 100ms) dramatically reduces Firebase write costs without noticeable UX impact.',
    },
];

const blogs = [
    {
        title: 'How I Built a Full-Stack Django + React App from Scratch',
        date: 'Feb 2025',
        tags: ['Django', 'React', 'REST API'],
        color: '#ffd93d',
        summary: 'Walking through the architecture decisions, auth setup, and deployment pipeline I used when building my first full-stack project.',
        content: `## The Problem\n\nI wanted to build a real project that used both Django on the backend and React on the frontend — not just a tutorial clone, but something I designed myself.\n\n## Architecture\n\nI went with a Django REST Framework API served separately from the React frontend (decoupled architecture). This keeps both parts independently deployable and easier to reason about.\n\n\`\`\`\nFrontend (React + Vite)  →  Django REST API  →  PostgreSQL\n\`\`\`\n\n## Auth with JWT\n\nI used **djangorestframework-simplejwt** for token-based auth. The flow is:\n\n1. User logs in → Django returns \`access\` + \`refresh\` tokens\n2. React stores the access token in memory (not localStorage — avoids XSS)\n3. Refresh token in an httpOnly cookie\n4. Axios interceptor auto-refreshes the access token before expiry\n\n## What I Learned\n\n- Always version your API (\`/api/v1/\`) from the start — retrofitting is painful\n- Django signals are powerful for side effects (sending emails on user create)\n- CORS setup trips up everyone the first time — use \`django-cors-headers\`\n\n## Deployment\n\n- Django on Railway\n- React on Vercel\n- PostgreSQL on Supabase (free tier is surprisingly capable)\n\nThe full project is on my GitHub if you want to dig into the code.`,
    },
    {
        title: 'What I Learned Building My Portfolio from Zero',
        date: 'Jan 2025',
        tags: ['React', 'CSS', 'Vite'],
        color: '#66d9ef',
        summary: 'The design system, animation patterns, and performance tricks I picked up while building this exact site you\'re reading right now.',
        content: `## Why Build From Scratch?\n\nTemplate portfolios look like template portfolios. Recruiters see hundreds. I wanted mine to feel like *me* — so I built it from zero with React + Vite, no component library.\n\n## Design System First\n\nBefore writing a single component, I defined CSS custom properties for everything:\n\n\`\`\`css\n:root {\n  --bg: #ffffff;\n  --border: #000000;\n  --shadow: 5px 5px 0 #000;\n}\n\`\`\`\n\nThis neobrutalist style (hard shadows, thick borders, flat colors) forces visual consistency even when you're moving fast.\n\n## Scroll Animations Without a Library\n\nI used \`IntersectionObserver\` directly instead of pulling in framer-motion or AOS:\n\n\`\`\`js\nconst observer = new IntersectionObserver(([entry]) => {\n  if (entry.isIntersecting) el.classList.add('is-visible')\n}, { threshold: 0.15 })\n\`\`\`\n\nPair that with a CSS keyframe and you have scroll-triggered animations with zero dependencies.\n\n## Performance Tricks\n\n- **Font subsetting** — only load the character weights you actually use\n- **will-change: transform** on animated elements — promotes them to their own compositor layer\n- **passive scroll listeners** everywhere\n\n## Key Takeaway\n\nBuilding your own portfolio teaches you more than any tutorial. You hit every real problem: responsive layout, state management, performance, deployment. It's the best project to have on your resume.`,
    },
    {
        title: 'Firebase vs Supabase — Which Should You Pick?',
        date: 'Dec 2024',
        tags: ['Firebase', 'Supabase', 'Backend'],
        color: '#ff6b9d',
        summary: 'A practical comparison based on real projects. Not benchmarks — actual developer experience, pricing surprises, and when to use each.',
        content: `## The Short Answer\n\n- **Firebase** if you need real-time sync, push notifications, or you're building mobile-first\n- **Supabase** if you want SQL, a real Postgres database, and open-source escape hatches\n\n## Firebase Strengths\n\n1. **Realtime database** — Firestore's real-time listeners are genuinely excellent\n2. **Auth** — easiest social auth setup I've used (Google login in 10 minutes)\n3. **Ecosystem** — FCM push notifications, Analytics, Hosting all in one dashboard\n\n## Firebase Pain Points\n\n- NoSQL means you duplicate data everywhere to avoid expensive reads\n- Pricing can spike unexpectedly at scale (read/write counts add up fast)\n- Vendor lock-in is real — migrating off Firebase is painful\n\n## Supabase Strengths\n\n1. **Real SQL** — complex queries, joins, foreign keys — it's just Postgres\n2. **Row Level Security** — fine-grained auth at the database level\n3. **Open source** — you can self-host if you need to\n\n## Supabase Pain Points\n\n- Real-time is improving but still behind Firestore\n- Edge functions (Deno-based) have a smaller ecosystem than Firebase Functions\n\n## My Recommendation\n\nFor a side project or portfolio app: **Supabase**. The free tier is generous, SQL knowledge transfers everywhere, and you're not locked in.\n\nFor a production mobile app with real-time features: **Firebase**.`,
    },
]

async function migrate() {
    console.log('Migrating projects...')
    for (const p of projects) {
        const { error } = await supabase.from('projects').insert([p])
        if (error) console.error('Error inserting project:', error)
    }
    console.log('Migrating blogs...')
    for (const b of blogs) {
        const { error } = await supabase.from('blogs').insert([b])
        if (error) console.error('Error inserting blog:', error)
    }
    console.log('Done!')
}

migrate()
