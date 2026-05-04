export const personalInfo = {
    name: 'Davit Yedigaryan',
    title: 'Backend & Systems Engineer',
    tagline: 'C++ · C# · Angular',
    shortBio:
        'Systems-aware engineer with 7+ years across C/C++ core logic, C# backends, and full-stack architecture — currently shipping low-level systems work at QDSC and teaching OOP/Computer Science at university level.',
    bio: 'I’m a Full-Stack Developer with a knack for turning complex ideas into sleek, scalable web apps. With over six years of experience, I’ve led projects like the Prestige Motors marketplace (2024), a high-traffic trading platform built with Angular and Node.js, serving thousands of users with real-time data. My passion lies in crafting intuitive UIs and robust backend systems, especially in fintech and eCommerce, where I’ve boosted performance and user engagement through clean code and innovative solutions.\n' +
        '\n' +
        'From my early days at Codeep building Blackcatcard’s fintech features to optimizing Blast.tv’s portal at Teracloud, I’ve honed my craft in Angular, React, TypeScript, and Node.js, while diving into PostgreSQL, CI/CD, and microservices. I thrive in Agile teams, collaborating remotely with global squads via Deel, mentoring juniors, and driving architectural decisions. My Master’s in Aerospace Computer Science fuels my problem-solving, ensuring I tackle challenges with precision and creativity.\n' +
        '\n' +
        'I’m all about growth—both personal and for the teams I join. Whether it’s mentoring colleagues, experimenting with AI-driven tools, or delivering apps that scale to millions, I’m here to make an impact. Fluent in English, Armenian, and Russian, I’m ready to connect and build something epic. Let’s create the next big thing together—check out my projects on GitHub or ping me for a chat!',
    email: 'davit@yedigaryan.pro',
    gmail: 'Mr.D.Yedigaryan@gmail.com',
    phone: '+374 95 898285',
    linkedin: 'https://www.linkedin.com/in/davit-y-angular-react-typescript/',
    github: 'https://github.com/yedigaryan',
    location: 'Yerevan, Armenia',
    locationNote: 'Open to remote',
}

/**
 * Skill tier — replaces the previous arbitrary 0–100 percentages, which most
 * technical interviewers (rightly) ignore.
 *  - Expert: years of production experience, can lead architecture and mentor others.
 *  - Proficient: shipped real projects independently.
 *  - Familiar: working knowledge — comfortable reading, debugging, contributing.
 */
export type SkillLevel = 'Expert' | 'Proficient' | 'Familiar'

export interface Skill {
    name: string
    level: SkillLevel
    years: string
    note?: string
}

export interface SkillCategory {
    category: string
    skills: Skill[]
}

export const skills: SkillCategory[] = [
    {
        category: 'Systems & Backend',
        skills: [
            { name: 'C / C++', level: 'Proficient', years: '1+ year prod · taught at university', note: 'C++17/20 — RAII, templates, smart pointers, STL, concurrency. Core business logic at QDSC; OOP-in-C++ instructor.' },
            { name: 'C#', level: 'Expert', years: '3+ years', note: 'Backend services, RESTful APIs, low-latency trading systems, socket programming.' },
            { name: '.NET / .NET Core', level: 'Proficient', years: '3+ years', note: 'Concurrent services, EF Core, async patterns.' },
            { name: 'Python', level: 'Proficient', years: '1+ year', note: 'Django backends and APIs at Prestige Motors.' },
            { name: 'Node.js', level: 'Proficient', years: '3+ years' },
            { name: 'RESTful APIs', level: 'Expert', years: '7+ years' },
        ],
    },
    {
        category: 'OOP, Patterns & Foundations',
        skills: [
            { name: 'Object-Oriented Design', level: 'Expert', years: '7+ years', note: 'SOLID, Factory / Singleton / Observer, memory ownership.' },
            { name: 'Concurrency & Async', level: 'Proficient', years: '5+ years', note: 'Threading, async/await, RxJS reactive composition.' },
            { name: 'Cryptography (client-side)', level: 'Proficient', years: '<1 year', note: 'Encryption/decryption protocols and secure key handling at Hapalas Technology.' },
        ],
    },
    {
        category: 'Frontend',
        skills: [
            { name: 'Angular (Signals / Zoneless)', level: 'Expert', years: '6+ years' },
            { name: 'TypeScript', level: 'Expert', years: '6+ years' },
            { name: 'RxJS', level: 'Expert', years: '6+ years' },
            { name: 'React', level: 'Proficient', years: '3+ years' },
            { name: 'Next.js', level: 'Proficient', years: '2+ years' },
            { name: 'Ionic', level: 'Proficient', years: '2+ years', note: 'BlackCatCard / GEKKARD fintech apps (Android/iOS/web).' },
        ],
    },
    {
        category: 'Infrastructure & Ops',
        skills: [
            { name: 'Windows Administration', level: 'Proficient', years: '1+ year', note: 'Network infrastructure, deployments, security/backup protocols.' },
            { name: 'Networking (OSI/TCP-IP)', level: 'Proficient', years: 'Taught at university', note: 'Routing protocols (RIP, OSPF), socket programming, network security.' },
            { name: 'Docker', level: 'Proficient', years: '3+ years' },
            { name: 'CI/CD', level: 'Proficient', years: '3+ years' },
            { name: 'Git', level: 'Expert', years: '7+ years' },
        ],
    },
    {
        category: 'Databases',
        skills: [
            { name: 'SQL Server', level: 'Proficient', years: '2+ years' },
            { name: 'PostgreSQL', level: 'Proficient', years: '1+ year' },
            { name: 'MongoDB', level: 'Familiar', years: '1+ year' },
            { name: 'IndexedDB', level: 'Proficient', years: '1+ year' },
        ],
    },
]

export interface Experience {
    id: number
    period: string
    role: string
    company: string
    location?: string
    logo: string
    description: string
    achievements: string[]
    technologies: string[]
}

/** Ordered most-recent-first; matches the CV. */
export const experiences: Experience[] = [
    {
        id: 0,
        period: 'Dec 2025 – Apr 2026',
        role: 'Software Engineer — Angular, Tauri, Go, C/C++ Systems',
        company: 'Confidential Client',
        location: 'Remote',
        logo: '/images/companies/ndaglobal.png',
        description: 'Led frontend architecture for a high-security cryptographic platform. Working directly with C/C++ core business logic and bridging it to higher-level product layers.',
        achievements: [
            'Read, understand, and contribute to low-level C/C++ system components — applying systems-level reasoning to trace logic, debug behaviour, and implement features.',
            'Navigate and extend an existing C/C++ codebase under production constraints.',
            'Act as the technical liaison between the systems team and product teams, translating low-level behaviour into product-facing features.',
        ],
        technologies: ['C', 'C++', 'Angular', 'Tauri', 'Go', 'Systems Programming', 'Git', 'Signals', 'RxJS', 'TypeScript', 'Web Crypto', 'Security'],
    },
    {
        id: 1,
        period: 'Mar 2025 – Present',
        role: 'University Lecturer — OOP, Networking & Software Engineering',
        company: 'Eurasia International University',
        location: 'Yerevan, Armenia',
        logo: '/images/universities/eurasiaiu.png',
        description: 'Teaching Object-Oriented Programming in C++/C# and Computer Networks.',
        achievements: [
            'Teach OOP in C++ and C#: encapsulation, inheritance, polymorphism, templates, design patterns (Factory, Singleton, Observer).',
            'Deliver the Computer Networks course: OSI/TCP-IP, routing protocols (RIP, OSPF), socket programming in C#, network security fundamentals.',
            'Improved student outcomes by ~30% through structured code reviews and integration of professional tools (Git, Visual Studio, Postman).',
            'Mentor on performance optimisation, async programming, memory management, and secure API communication.',
        ],
        technologies: ['C++', 'C#', 'OOP', 'SOLID', 'Design Patterns', 'Computer Networks', 'Sockets', 'Mentorship'],
    },
    {
        id: 2,
        period: 'Feb 2025 – Nov 2025',
        role: 'Software Engineer — Trading Platform (NDA)',
        company: 'Confidential Client',
        location: 'Yerevan, Armenia',
        logo: '/images/companies/ndaglobal.png',
        description: 'Built a low-latency trading platform from scratch — Angular frontend, C# backend.',
        achievements: [
            'Designed and shipped a scalable Angular frontend with live charts, order execution interfaces, and risk management tools.',
            'Developed C# backend services and APIs for trading logic, data processing, and low-latency exchange integrations.',
            'Optimised real-time data flow with RxJS reactive programming for fast, responsive UI during peak market volatility.',
        ],
        technologies: ['C#', '.NET', 'Angular', 'TypeScript', 'RxJS', 'Blazor', 'Microservices', 'SQL Server', 'MongoDB', 'Docker', 'Git'],
    },
    {
        id: 3,
        period: 'Dec 2025 – Apr 2026',
        role: 'Senior Frontend Developer — Cryptographic Systems',
        company: 'Hapalas Technology',
        location: 'Yerevan, Armenia',
        logo: '/images/companies/ndaglobal.png',
        description: 'Led frontend architecture for a high-security cryptographic platform.',
        achievements: [
            'Built the Angular (Signals / RxJS) frontend for a crypto-sensitive platform with strict security and throughput requirements.',
            'Implemented client-side cryptographic protocols — data encryption/decryption and secure key handling within the browser.',
            'Hardened the application against XSS and CSRF while optimising for high-speed data throughput.',
        ],
        technologies: ['Angular', 'Signals', 'RxJS', 'TypeScript', 'Web Crypto', 'Security'],
    },
    {
        id: 4,
        period: 'Jan 2026 – Present',
        role: 'IBDP Computer Science Teacher',
        company: 'OHANYAN Educational Complex',
        location: 'Yerevan, Armenia',
        logo: '/images/universities/eurasiaiu.png',
        description: 'Delivering the IB Diploma Programme Computer Science syllabus to international-track students.',
        achievements: [
            'Teach System Fundamentals, Computer Organization, Networks, and Computational Thinking.',
            'Lead the advanced OOP and Databases modules; guide students through full-cycle software engineering projects (requirements → design → implementation → testing).',
            'Prepare students for international external examinations at the technical rigour expected by top-tier global universities.',
        ],
        technologies: ['Computer Science', 'OOP', 'Databases', 'Networks', 'IB Diploma', 'Curriculum Design'],
    },
    {
        id: 5,
        period: 'Feb 2024 – Jan 2025',
        role: 'Full Stack Engineer',
        company: 'Prestige Motors (pgm.am)',
        location: 'Yerevan, Armenia',
        logo: '/images/companies/master_mind.png',
        description: 'Frontend in Angular/Next.js and Python/Django backend APIs for an automotive retail marketplace.',
        achievements: [
            'Developed the marketplace frontend in Angular and Next.js with TecDoc integration for vehicle data.',
            'Built backend APIs in Python/Django to support catalog, ordering, and admin workflows.',
            'Refactored legacy code across the full stack, adopting modern patterns to improve maintainability and performance.',
        ],
        technologies: ['Angular', 'Next.js', 'TypeScript', 'Python', 'Django', 'PostgreSQL', 'IndexedDB', 'Git'],
    },
    {
        id: 6,
        period: 'Nov 2021 – Feb 2024',
        role: 'Senior Frontend Developer',
        company: 'Teracloud',
        location: 'Yerevan, Armenia',
        logo: '/images/companies/teracloud.png',
        description: 'Built and led delivery on three production frontends (Energy Machines, BLAST.TV, QMF).',
        achievements: [
            'Energy Machines — designed a real-time monitoring and management interface for thermal devices, including alarms and user/group/organization administration. React 15 → 18, Next.js, TypeScript.',
            'BLAST.TV — led portal and admin development in parallel Angular and React stacks, translating UX designs into production code.',
            'QMF — transformed a Windows-only DB2 management desktop application into a cross-platform desktop and web tool using Electron — direct Windows development experience.',
        ],
        technologies: ['Angular', 'React', 'TypeScript', 'RxJS', 'NgRx', 'Redux', 'Next.js', 'Electron', 'Node.js', 'Express', 'Docker', 'PostgreSQL', 'CI/CD', 'AWS'],
    },
    {
        id: 7,
        period: 'Feb 2021 – Nov 2021',
        role: 'Web / Mobile Developer',
        company: 'Codeep LLC',
        location: 'Yerevan, Armenia',
        logo: '/images/companies/codeep.png',
        description: 'Mobile and web fintech delivery using Ionic and Angular.',
        achievements: [
            'BlackCatCard — delivered the Android/iOS/web banking app in two iterations (Ionic 3 + Angular 5, then Ionic 6 + Angular 10).',
            'GEKKARD — engineered a streamlined Ionic 6 build retaining core utilities while improving performance.',
            'TERASEYA — pioneered an admin panel with Google Maps crop visualisation (Angular 11, NgRx).',
        ],
        technologies: ['Angular', 'Ionic', 'TypeScript', 'NgRx', 'RxJS', 'Firebase', 'Cordova', 'SCSS'],
    },
    {
        id: 8,
        period: 'Nov 2019 – Feb 2021',
        role: 'Frontend Web Developer',
        company: 'Haytech Solutions',
        location: 'Yerevan, Armenia',
        logo: '/images/companies/haytech.png',
        description: 'Frontend delivery for European real-estate platforms (France, Switzerland).',
        achievements: [
            'Built responsive site portals and email templates that improved engagement and digital UX.',
            'Enhanced the Media Manipulation Platform dashboard with photo upload and editing features.',
        ],
        technologies: ['React', 'jQuery', 'JavaScript', 'PHP', 'HTML5', 'CSS4', 'Bootstrap'],
    },
    {
        id: 9,
        period: 'Mar 2019 – Sep 2019',
        role: 'Junior Web Developer',
        company: 'Master Mind LLC',
        location: 'Yerevan, Armenia',
        logo: '/images/companies/master_mind.png',
        description: 'First production work on the Prestige Motors eStore.',
        achievements: [
            'Started development of the Prestige Motors eStore in Angular 11 and TypeScript, supporting the wholesale-to-retail expansion.',
        ],
        technologies: ['Angular', 'TypeScript', 'RxJS', 'JavaScript', 'HTML', 'SCSS'],
    },
    {
        id: 10,
        period: 'Mar 2018 – Mar 2019',
        role: 'Network Administrator',
        company: 'Development and Investments Corporation of Armenia UCO CJSC',
        location: 'Yerevan, Armenia',
        logo: '/images/companies/dica.png',
        description: 'Windows-based IT infrastructure, networking, and security administration.',
        achievements: [
            'Administered Windows-based systems, networking, and permissions, ensuring availability of mission-critical accounting databases.',
            'Managed hardware/software installations, real-time performance monitoring, and security/backup protocols.',
            'Maintained WordPress sites with Elementor for the organisation’s digital presence.',
        ],
        technologies: ['Windows Server', 'Active Directory', 'Networking', 'PowerShell', 'Bash', 'WordPress'],
    },
]


export const studies = [
    {
        id: 0,
        university: 'Université Paul Sabatier Toulouse III · 2017',
        studyFieldAndDegree: `Master's in Computer Science (Aerospace)`,
        logo: '/images/universities/paul_sabatier.png',
        description:
            'Computer-science fundamentals applied to aerospace: algorithms, data structures, OOP, networked systems.',
        highlight: false,
    },
    {
        id: 1,
        university: 'Armenian National Academy of Sciences · 2017',
        studyFieldAndDegree: `Master's in Computer Science / Information Technology`,
        logo: '/images/universities/nasra.png',
        description: 'Software engineering and data analysis.',
        width: 70,
        highlight: false,
    },
    {
        id: 2,
        university: 'National Polytechnic University of Armenia · 2013',
        studyFieldAndDegree: `Bachelor's in Electronic Means (C/C++, Embedded Systems)`,
        logo: '/images/universities/polytechnic.png',
        description:
            'Low-level computing foundation: C/C++, embedded systems, computer architecture — the systems-level grounding behind my current C/C++ work at QDSC.',
        width: 110,
        bgBlack: ' bg-black',
        highlight: true,
    },
    {
        id: 3,
        university: 'Synopsys Armenia Educational Department · 2013',
        studyFieldAndDegree: `Bachelor's in Microelectronics & VLSI Design`,
        logo: '/images/universities/synopsys.png',
        description: 'VLSI design, hardware engineering, and embedded systems.',
        width: 90,
        highlight: true,
    },
    {
        id: 4,
        university: 'Vineti Armenia · 2018',
        studyFieldAndDegree: 'Certified Frontend Development',
        logo: '/images/universities/vinetti.png',
        description: 'Web development and quality assurance.',
        highlight: false,
    },
]

export interface Project {
    title: string
    description: string
    image: string | null
    technologies: string[]
    githubUrl: string | null
    liveUrl: string | null
    highlights: string[]
}

export const projects: Project[] = [
    {
        title: 'Real-Time Trading (Scalping) Platform',
        description:
            'Low-latency trading platform built from scratch — Angular frontend with live charts and order execution, C#/.NET backend services for trading logic and exchange integrations.',
        image: '/images/project1.jpeg',
        technologies: ['Angular', 'C#', '.NET', 'RxJS', 'SignalR', 'SQL Server', 'Docker'],
        githubUrl: null,
        liveUrl: null,
        highlights: [
            'Real-time data flow optimised with RxJS for responsive UI under peak volatility',
            'Risk management and order execution interfaces',
            'Concurrent backend services for low-latency exchange integrations',
        ],
    },
    {
        title: 'Cryptographic Web Platform',
        description:
            'High-security platform for client-side encryption/decryption and secure key handling — built on Angular Signals/RxJS, hardened against XSS and CSRF.',
        image: null,
        technologies: ['Angular', 'Signals', 'RxJS', 'TypeScript', 'Web Crypto', 'Security'],
        githubUrl: null,
        liveUrl: null,
        highlights: [
            'Browser-side cryptographic protocols (encryption / decryption / key handling)',
            'XSS and CSRF hardening in a crypto-sensitive environment',
            'Optimised for high-speed data throughput',
        ],
    },
    {
        title: 'Energy Machines Monitoring',
        description:
            'Real-time monitoring and management interface for thermal devices: telemetry dashboards, advanced alarms, and multi-tenant user/group/organization administration.',
        image: '/images/project3.png',
        technologies: ['React 15 → 18', 'Next.js', 'TypeScript', 'SCSS'],
        githubUrl: null,
        liveUrl: null,
        highlights: [
            'Real-time telemetry across remote thermal devices',
            'Advanced alarms with configurable thresholds',
            'Multi-tenant user / group / organization management',
        ],
    },
    {
        title: 'Automotive Retail Marketplace (Prestige Motors)',
        description:
            'Full-stack marketplace for wholesale-to-retail expansion: Angular/Next.js frontend and Python/Django backend APIs with TecDoc integration.',
        image: '/images/project2.png',
        technologies: ['Angular', 'Next.js', 'Python', 'Django', 'PostgreSQL', 'TecDoc API'],
        githubUrl: null,
        liveUrl: 'https://pgm.am',
        highlights: [
            'Server-side rendering for SEO',
            'TecDoc integration for vehicle catalog data',
            'Admin panel for inventory and order management',
        ],
    },
    {
        title: 'Cross-Platform Note App',
        description: 'Standalone note-taking application — Angular + Electron, offline-first with IndexedDB.',
        image: '/images/project4.png',
        technologies: ['Angular', 'Electron', 'TypeScript', 'IndexedDB'],
        githubUrl: 'https://github.com/yedigaryan',
        liveUrl: null,
        highlights: [
            'Cross-platform desktop application',
            'Offline-first architecture with IndexedDB',
            'Rich text editing',
        ],
    },
    {
        title: 'Mobile Banking — BlackCatCard / GEKKARD',
        description:
            'Cross-platform fintech apps for Android, iOS, and web — delivered in two iterations (Ionic 3 + Angular 5, then Ionic 6 + Angular 10).',
        image: '/images/project6.png',
        technologies: ['Angular', 'Ionic', 'TypeScript', 'NgRx', 'Firebase'],
        githubUrl: null,
        liveUrl: null,
        highlights: [
            'Cross-platform fintech (Android / iOS / web)',
            'Secure auth and transaction flows',
            'Real-time notifications',
        ],
    },
    {
        title: 'TERASEYA Admin Panel',
        description:
            'Admin panel with Google Maps crop-visualisation enabling clients to inspect crops by coordinate.',
        image: '/images/project7.png',
        technologies: ['Angular 11', 'TypeScript', 'NgRx', 'Google Maps API'],
        githubUrl: null,
        liveUrl: null,
        highlights: [
            'Geospatial crop visualisation via Google Maps',
            'Operational UI for farm management',
            'Responsive layouts',
        ],
    },
]

export const certifications = [
    { name: 'EF SET English Certificate', issuer: 'EF Education First', year: '2024', description: 'C2 Proficient · 73/100' },
    { name: 'Bachelor in VLSI Design — Certificate of Achievement', issuer: 'Synopsys Armenia', year: '2013', description: 'Microelectronics and VLSI design.' },
    { name: 'Angular (Basic)', issuer: 'HackerRank', year: '2023', description: 'Angular fundamentals certification.' },
    { name: 'Problem Solving (Basic)', issuer: 'HackerRank', year: '2023', description: 'Algorithmic problem-solving.' },
    { name: 'Certified Frontend Development', issuer: 'Vineti Armenia', year: '2018', description: 'Frontend engineering and QA.' },
]
