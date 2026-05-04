import { Metadata } from 'next'
import ProjectCard from '@/components/ProjectCard'
import { personalInfo, projects } from '@/lib/data'

export const metadata: Metadata = {
  title: `Projects | ${personalInfo.name}`,
  description:
    'Selected work: real-time trading platforms, cryptographic web platforms, IoT monitoring, and full-stack marketplaces.',
}

export default function Projects() {
  return (
    <div className="container mx-auto px-4 py-20">
      <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-foreground">Featured Projects</h1>
      <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl">
        A selection of recent work spanning systems, cryptography, real-time data, and full-stack delivery.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  )
}
