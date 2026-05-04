import { Metadata } from 'next'
import { experiences, personalInfo } from '@/lib/data'
import { FaMapMarkerAlt } from 'react-icons/fa'

export const metadata: Metadata = {
  title: `Experience | ${personalInfo.name}`,
  description: '7+ years of production experience across C/C++, C#/.NET, and full-stack engineering — month-level career timeline.',
}

export default function Experience() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground">Professional Experience</h1>
      <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl">
        7+ years across systems-level C/C++, C# backend services, cryptographic platforms, and frontend architecture — most recent first.
      </p>

      <ol className="relative space-y-12 border-l-2 border-border pl-6 sm:pl-8">
        {experiences.map((exp) => (
          <li key={exp.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[calc(1.5rem+5px)] sm:-left-[calc(2rem+5px)] top-2 h-3 w-3 rounded-full bg-primary ring-4 ring-background"
            />
            <article>
              <header className="mb-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {exp.period}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mt-1">{exp.role}</h2>
                <p className="text-base sm:text-lg text-muted-foreground">
                  {exp.company}
                  {exp.location && (
                    <span className="inline-flex items-center gap-1 ml-2 text-sm text-muted-foreground/80">
                      <FaMapMarkerAlt aria-hidden="true" /> {exp.location}
                    </span>
                  )}
                </p>
              </header>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={exp.logo}
                alt={`${exp.company} logo`}
                width={64}
                height={64}
                className="rounded-lg shadow-sm mb-4 bg-white p-1.5"
                loading="lazy"
                decoding="async"
              />

              <p className="text-foreground mb-4 leading-relaxed">{exp.description}</p>

              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-foreground text-sm uppercase tracking-wide">
                  Highlights
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="relative pl-4 leading-relaxed">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-primary/70"
                      />
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 text-xs font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>
    </div>
  )
}
