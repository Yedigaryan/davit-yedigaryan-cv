import { Metadata } from 'next'
import Link from 'next/link'
import { captionClass } from '@/components/home/HomeSection'
import ChaptersColumn from '@/components/projects/ChaptersColumn'
import ProjectChapter from '@/components/projects/ProjectChapter'
import { figureNumber, personalInfo, projects, yearsInWords } from '@/lib/data'

export const metadata: Metadata = {
  title: `Projects | ${personalInfo.name}`,
  description:
    'Selected work: real-time trading platforms, cryptographic web platforms, IoT monitoring, and full-stack marketplaces.',
}

/** /projects (spec 006): intro, pinned chapters with the figure rail, closing call to action. */
export default function Projects() {
  return (
    <>
      <section aria-labelledby="projects-title" className="border-b border-border">
        <div className="container mx-auto flex flex-col gap-4 pt-12 pb-10 min-[561px]:gap-8 min-[561px]:pt-[60px] min-[561px]:pb-12 min-[861px]:pt-[72px] min-[861px]:pb-14 lg:flex-row lg:items-end lg:gap-16">
          <div className="min-w-0 lg:flex-[1_1_520px]">
            <p className={`${captionClass} text-link`}>{`Figures ${figureNumber(0)} to ${figureNumber(projects.length - 1)} / Projects`}</p>
            <h1
              id="projects-title"
              className="mt-2 text-[length:clamp(40px,11vw,48px)] font-light leading-[1.02] tracking-[-0.025em] text-primary min-[561px]:text-[60px] min-[561px]:leading-none min-[861px]:text-[72px]"
            >
              Things that shipped.
            </h1>
          </div>
          <p className="max-w-[480px] text-[length:var(--fs-m2)] leading-[1.65] text-secondary lg:flex-[1_1_360px]">
            {`${yearsInWords(projects.length, true)} figures, most recent first. Each one names the stack and the part I personally owned. Scroll: every project takes the full page before the next one slides over it.`}
          </p>
        </div>
      </section>

      <div className="container mx-auto flex items-start gap-8">
        <ChaptersColumn>
          {projects.map((project, i) => (
            <ProjectChapter key={project.title} project={project} figure={figureNumber(i)} />
          ))}
        </ChaptersColumn>
      </div>

      <section aria-labelledby="projects-cta" className="border-t border-foreground bg-[var(--card-bg)]">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-12 gap-y-5 py-14 min-[561px]:gap-y-6 min-[561px]:py-16 min-[861px]:py-20">
          <h2
            id="projects-cta"
            className="max-w-[620px] text-[30px] font-light leading-[1.12] tracking-[-0.02em] text-primary min-[561px]:text-[38px] min-[561px]:leading-[1.05] min-[861px]:text-[44px]"
          >
            Want the one that is under NDA explained? Ask the assistant.
          </h2>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center rounded-[var(--r-2)] bg-foreground px-[22px] font-mono text-[length:var(--fs-m3)] uppercase tracking-[0.08em] text-background underline-offset-4 hover:underline"
          >
            Back to index
          </Link>
        </div>
      </section>
    </>
  )
}
