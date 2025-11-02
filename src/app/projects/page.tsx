import { Metadata } from 'next'
import ProjectCard from '@/components/ProjectCard'
import { personalInfo, projects } from '@/lib/data'

export const metadata: Metadata = {
  title: `Projects | ${personalInfo.name}`,
  description: 'Portfolio of web development projects showcasing Angular, React, and .NET expertise',
}

export default function Projects() {

  return (
      <div className="container mx-auto px-4 py-20">
        <h1 className="text-5xl font-bold mb-4">Featured Projects</h1>
        <p className="text-xl text-gray-600 mb-12">
          A selection of my recent work demonstrating full-stack capabilities
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
  )
}
