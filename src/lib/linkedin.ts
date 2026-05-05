/**
 * LinkedIn profile export — structured knowledge that supplements src/lib/data.ts.
 *
 * data.ts is the canonical source for what's RENDERED on the site (Hero,
 * Experience, Skills, Projects pages). linkedin.ts is the supplementary
 * knowledge fed to the chat-bot's system prompt: things present on
 * LinkedIn that don't have a UI surface (languages, certifications, the
 * fuller summary text), plus information about employers / dates that
 * helps the bot answer specific questions.
 *
 * To refresh: open the LinkedIn profile PDF export ("More" → "Save to PDF"),
 * extract the new sections, and update the constants below. Do NOT
 * duplicate fields that already exist in data.ts — the system-prompt
 * builder pulls from both and we want a single source of truth per fact.
 */

export interface LinkedInLanguage {
    name: string
    proficiency:
    | 'Native or Bilingual'
    | 'Professional Working'
    | 'Limited Working'
    | 'Elementary'
}

export interface LinkedInCertification {
    name: string
    issuer?: string
    detail?: string
}

export interface LinkedInEducation {
    institution: string
    degree: string
    field: string
    period: string
}

export interface LinkedInExtraExperience {
    company: string
    role: string
    period: string
    location?: string
    summary: string
    skills?: string[]
}

export const linkedin = {
    /**
     * Headline as it appears on the LinkedIn profile — not the same as
     * `personalInfo.title` in data.ts (which is the on-site headline).
     */
    headline:
        '7 Year In Software Development | M.Sc. in Computer Science | Angular | Next.JS | TypeScript | IBDP CS Teacher | Lecturer at Eurasia International University',

    /** Geographic area on LinkedIn (may differ from on-site `location`). */
    geographicArea: 'Greater Valencia Metropolitan Area',

    /**
     * Long-form summary from the LinkedIn "Summary" section. Richer than
     * `personalInfo.shortBio` in data.ts; goes into the chat system
     * prompt verbatim because it's already first-person and well-edited.
     */
    summary:
        "Senior Full-Stack Engineer & CS Lecturer with 7+ years of experience building high-scale web apps, having worked in Cryptography, Trading, Fintech, E-Commerce, and Cybersports domains. I specialize in Angular, React, and C#/.NET, having architected fintech platforms (Blackcatcard), real-time trading systems, and crypto-driven solutions. What sets me apart is the synergy between industry and academia. With a Master's from Toulouse III (France) and my role as a University Lecturer, I don't just write code — I mentor teams and design robust architectures based on deep CS principles. Expertise: Modern Angular (Signals/Zoneless), TypeScript, Node.js, C#, and Cryptography. I thrive in global Agile squads and am dedicated to performance, precision, and scaling products to millions.",

    /** LinkedIn "Top Skills" — the three pinned signals on the profile. */
    topSkills: ['Systems Design', 'Front-End Design', 'Web Application Development'],

    languages: [
        { name: 'English', proficiency: 'Professional Working' },
        { name: 'Armenian', proficiency: 'Native or Bilingual' },
        { name: 'Russian', proficiency: 'Professional Working' },
        { name: 'French', proficiency: 'Elementary' },
        { name: 'Spanish', proficiency: 'Elementary' },
    ] satisfies LinkedInLanguage[],

    certifications: [
        {
            name: 'EF SET English Certificate',
            detail: '73/100 — C2 Proficient',
        },
        {
            name: "Bachelor's program completion (VLSI Design specialization)",
            issuer: 'Synopsys Armenia',
        },
        {
            name: 'French language proficiency — basic',
            detail: 'Approximate level',
        },
        {
            name: 'Problem Solving — Intermediate',
            issuer: 'HackerRank',
        },
        {
            name: 'Angular — Intermediate',
            issuer: 'HackerRank',
        }, {
            name: 'Problem Solving — Basic',
            issuer: 'HackerRank',
        },
        {
            name: 'Angular — Basic',
            issuer: 'HackerRank',
        },
    ] satisfies LinkedInCertification[],

    /**
     * Education with full date ranges from the LinkedIn export. data.ts
     * carries an abbreviated `studies` list for the About page; this is
     * the LinkedIn-faithful version for the bot's reference.
     */
    education: [
        {
            institution: 'Université Paul Sabatier Toulouse III',
            degree: "Master's degree",
            field: 'Computer Science in Aerospace',
            period: 'September 2016 — March 2017',
        },
        {
            institution: 'Armenian National Academy of Sciences',
            degree: "Master's of Computer Science",
            field: 'Information Technology',
            period: 'September 2015 — May 2017',
        },
        {
            institution: 'Vineti Armenia',
            degree: 'Certificate',
            field: 'Frontend development',
            period: 'February 2018 — March 2018',
        },
        {
            institution: 'Synopsys Armenia Educational Department',
            degree: "Bachelor's degree",
            field: 'Microelectronics VLSI Design',
            period: 'September 2011 — May 2013',
        },
        {
            institution: 'National Polytechnic University of Armenia',
            degree: "Bachelor's degree",
            field: 'Electronic Means',
            period: 'September 2009 — May 2013',
        },
    ] satisfies LinkedInEducation[],

    /**
     * Experience entries on LinkedIn that are NOT yet in data.ts (or
     * that have richer detail on LinkedIn). Skip anything already
     * fully captured on the Experience page to avoid token bloat.
     */
    extraExperience: [
        {
            company: 'OHANYAN Educational Complex',
            role: 'IBDP CS Teacher',
            period: 'January 2026 — Present',
            location: 'Yerevan, Armenia',
            summary:
                "Teaching Computer Science at the highest international academic standard for the IB Diploma Programme. Facilitates the IBDP CS syllabus (System Fundamentals, Computer Organization, Networks, Computational Thinking), with specialized instruction in OOP and Databases. Mentors students through the Internal Assessment 'Solution' — a full-cycle software engineering project covering stakeholder requirements, system design, implementation, and testing. Prepares students for international external examinations and top-tier global universities. School profile: https://www.ibo.org/en/school/062205",
            skills: ['IBDP CS', 'OOP', 'Databases', 'Computational Thinking', 'Mentorship'],
        },
        {
            company: 'Hapalas Technology',
            role: 'Senior Frontend Developer',
            period: 'December 2025 — April 2026',
            location: 'Yerevan, Armenia',
            summary:
                "Full ownership of the web client architecture for a high-security cryptographic project. Primary architect and lead for the project's web ecosystem (Angular). Implemented secure client-side cryptographic protocols — encryption/decryption and secure in-browser key handling. Optimized for high-speed data processing while maintaining strict security against XSS/CSRF in a crypto-heavy environment. Used modern Angular features (Signals, RxJS) to manage complex real-time reactive states for data-intensive cryptographic operations.",
            skills: [
                'Angular',
                'Signals',
                'RxJS',
                'Cryptography (client-side)',
                'XSS/CSRF mitigation',
            ],
        },
        {
            company: 'Optimum Partners Global',
            role: 'Software and Quality Engineer | TechX Trainer',
            period: 'November 2025 — December 2025',
            location: 'Yerevan',
            summary:
                "Bridged the gap between academic learning and production-ready engineering. Led the 'TechX' initiative to identify, hire, and mentor pre-intern candidates into client-ready Software Engineers. Designed intensive training modules in Modern Angular, React, and C#/.NET. Implemented rigorous code-review processes and testing standards to deliver scalable, bug-free features. Tracked technical growth and 'readiness' of junior talent against stakeholder expectations.",
            skills: [
                'Angular',
                'React',
                'C#',
                '.NET',
                'Quality Engineering',
                'Mentorship',
                'Agile',
            ],
        },
        {
            company: 'NDA (trading systems)',
            role: 'Software Engineer',
            period: 'February 2025 — November 2025',
            location: 'Yerevan, Armenia',
            summary:
                'Built a real-time trading (scalping) platform from scratch. Developed and maintained the Angular frontend for high performance and real-time data handling. Implemented complex UI/UX features: live charts, order execution interfaces, risk management tools. Optimized frontend with RxJS for low-latency responsiveness during market volatility. Built backend services and APIs in C# for trading logic, data processing, and secure exchange integrations. Architected a scalable foundation for future expansion.',
            skills: [
                'Angular',
                'TypeScript',
                'RxJS',
                'C#',
                'Trading Systems',
                'FinTech',
                'Software Architecture',
            ],
        },
    ] satisfies LinkedInExtraExperience[],
} as const
