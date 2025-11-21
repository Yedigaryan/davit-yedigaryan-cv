import { Metadata } from 'next'
import { experiences, personalInfo } from '@/lib/data'


export const metadata: Metadata = {
  title: `Experience | ${personalInfo.name}`,
  description: '6+ years of professional frontend and full-stack development experience',
}

export default function Experience() {

  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-5xl font-bold mb-4 text-foreground">Professional Experience</h1>
      <p className="text-xl text-muted-foreground mb-12">
        6+ years building enterprise-grade applications
      </p>

      <div className="space-y-12">
        {experiences.map((exp, index) => (
          <div key={index} className="border-l-4 border-blue-600 dark:border-blue-400 pl-8 pb-8 transition-colors">
            <div className="mb-4">
              <span className="text-blue-600 dark:text-blue-400 font-semibold transition-colors">{exp.period}</span>
              <h2 className="text-3xl font-bold mt-2 text-foreground">{exp.role}</h2>
              <h3 className="text-xl text-muted-foreground">{exp.company}</h3>
            </div>

            <img
              src={exp.logo}
              alt={exp.company + ' Logo'}
              width={70}
              height={70}
              className="rounded-lg shadow-lg mb-4 transition-all"
            />

            <p className="text-foreground mb-4">{exp.description}</p>

            <div className="mb-4">
              <h4 className="font-semibold mb-2 text-foreground">Key Achievements:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm transition-colors">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
