import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import type { Project } from '@/lib/data'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
      {project.image && (
        <div className="relative h-48 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            className="object-cover w-full h-full"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl sm:text-2xl font-bold mb-2 text-card-foreground">{project.title}</h3>
        <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

        {project.highlights.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-xs uppercase tracking-wide mb-2 text-card-foreground">
              Key features
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {project.highlights.map((highlight, i) => (
                <li key={i} className="relative pl-3 leading-relaxed">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-2 h-1 w-1 rounded-full bg-primary/70"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium"
            >
              {tech}
            </span>
          ))}
        </div>

        {(project.githubUrl || project.liveUrl) && (
          <div className="mt-auto flex flex-wrap gap-4 pt-2 border-t border-border">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <FaGithub aria-hidden="true" /> Code
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:opacity-80 transition-opacity"
              >
                <FaExternalLinkAlt aria-hidden="true" /> Live demo
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
