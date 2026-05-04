import { Metadata } from 'next'
import React from 'react'
import {
  FaAngular,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaAws,
  FaPython,
  FaWindows,
  FaNetworkWired,
  FaGitAlt,
  FaShieldAlt,
} from 'react-icons/fa'
import { SiTypescript, SiSharp, SiDotnet, SiPostgresql, SiMongodb, SiCplusplus, SiIonic, SiNextdotjs } from 'react-icons/si'
import { personalInfo, skills, type SkillLevel } from '@/lib/data'

export const metadata: Metadata = {
  title: `Skills & Technologies | ${personalInfo.name}`,
  description:
    'C/C++, C#/.NET, Python, Angular, React, networking, Windows administration — grouped by tier (Expert / Proficient / Familiar) instead of arbitrary percentages.',
}

const tierStyles: Record<SkillLevel, { dot: string; label: string; ring: string }> = {
  Expert: {
    dot: 'bg-emerald-500',
    label: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    ring: 'ring-emerald-500/40',
  },
  Proficient: {
    dot: 'bg-sky-500',
    label: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
    ring: 'ring-sky-500/40',
  },
  Familiar: {
    dot: 'bg-amber-500',
    label: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    ring: 'ring-amber-500/40',
  },
}

const iconFor = (name: string): React.ReactNode => {
  const map: Record<string, React.ReactNode> = {
    'C / C++': <SiCplusplus className="text-blue-600 dark:text-blue-400" />,
    'C#': <SiSharp className="text-purple-600 dark:text-purple-400" />,
    '.NET / .NET Core': <SiDotnet className="text-purple-700 dark:text-purple-400" />,
    Python: <FaPython className="text-yellow-600 dark:text-yellow-400" />,
    'Node.js': <FaNodeJs className="text-green-600 dark:text-green-500" />,
    'Angular (Signals / Zoneless)': <FaAngular className="text-red-600 dark:text-red-500" />,
    React: <FaReact className="text-blue-500 dark:text-blue-400" />,
    TypeScript: <SiTypescript className="text-blue-600 dark:text-blue-400" />,
    'Next.js': <SiNextdotjs className="text-foreground" />,
    Ionic: <SiIonic className="text-blue-500 dark:text-blue-400" />,
    'SQL Server': <SiPostgresql className="text-blue-700 dark:text-blue-400" />,
    PostgreSQL: <SiPostgresql className="text-blue-600 dark:text-blue-400" />,
    MongoDB: <SiMongodb className="text-green-600 dark:text-green-500" />,
    Docker: <FaDocker className="text-blue-500 dark:text-blue-400" />,
    AWS: <FaAws className="text-orange-500 dark:text-orange-400" />,
    Git: <FaGitAlt className="text-orange-600 dark:text-orange-400" />,
    'Windows Administration': <FaWindows className="text-blue-500 dark:text-blue-400" />,
    'Networking (OSI/TCP-IP)': <FaNetworkWired className="text-emerald-600 dark:text-emerald-400" />,
    'Cryptography (client-side)': <FaShieldAlt className="text-emerald-600 dark:text-emerald-400" />,
  }
  return map[name] ?? null
}

export default function Skills() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground">Skills &amp; Technologies</h1>
      <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-3xl">
        Grouped by tier so you can read this in 10 seconds. <strong>Expert</strong> = years of production work and architecture ownership; <strong>Proficient</strong> = shipped real projects independently; <strong>Familiar</strong> = working knowledge — comfortable reading, debugging, and contributing.
      </p>

      <div className="mb-12 flex flex-wrap gap-3 text-sm">
        {(['Expert', 'Proficient', 'Familiar'] as SkillLevel[]).map((tier) => (
          <span
            key={tier}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 ${tierStyles[tier].label}`}
          >
            <span className={`h-2 w-2 rounded-full ${tierStyles[tier].dot}`} aria-hidden="true" />
            {tier}
          </span>
        ))}
      </div>

      <div className="space-y-12">
        {skills.map((category) => (
          <section key={category.category}>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">{category.category}</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.skills.map((skill) => {
                const tier = tierStyles[skill.level]
                return (
                  <li
                    key={skill.name}
                    className={`rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md hover:ring-2 hover:${tier.ring}`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {iconFor(skill.name) && (
                          <span className="text-2xl shrink-0" aria-hidden="true">
                            {iconFor(skill.name)}
                          </span>
                        )}
                        <h3 className="text-base sm:text-lg font-semibold text-card-foreground truncate">
                          {skill.name}
                        </h3>
                      </div>
                      <span
                        className={`shrink-0 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium ${tier.label}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${tier.dot}`} aria-hidden="true" />
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{skill.years}</p>
                    {skill.note && (
                      <p className="mt-2 text-sm text-muted-foreground/90 leading-relaxed">{skill.note}</p>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
