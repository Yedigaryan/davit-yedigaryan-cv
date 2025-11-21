import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

interface ProjectCardProps {
  project: {
    title: string
    description: string
    image: string
    technologies: string[]
    githubUrl: string
    liveUrl: string | null
    highlights: string[]
  }
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="border border-border rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all bg-card">
      <div className="relative h-48">
        <img
          src={project.image}
          alt={project.title}
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold mb-2 text-card-foreground">{project.title}</h3>
        <p className="text-muted-foreground mb-4">{project.description}</p>

        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2 text-card-foreground">Key Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {project.highlights.map((highlight, i) => (
              <li key={i}>• {highlight}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech, i) => (
            <span key={i} className="px-2 py-1 bg-muted text-muted-foreground rounded text-xs transition-colors">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <FaGithub /> Code
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <FaExternalLinkAlt /> Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
