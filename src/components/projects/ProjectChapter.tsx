import { captionClass } from '@/components/home/HomeSection'
import type { Project } from '@/lib/data'

const button = 'inline-flex min-h-11 items-center gap-2 rounded-[var(--r-2)] px-[18px] font-mono text-[length:var(--fs-m4)] uppercase tracking-[0.08em]'

/**
 * One project chapter (spec 006 Req 6-8). The zero-height div before the
 * article carries the #figN id, so jumps land even while later chapters are
 * pinned (Req 11). `pin:` (globals.css) makes every chapter sticky under the
 * header on tall desktop viewports, or none of them.
 */
export default function ProjectChapter({ project, figure }: { project: Project; figure: number }) {
    const titleId = `fig${figure}-title`
    return (
        <>
            <div id={`fig${figure}`} className="scroll-mt-[var(--header-h,69px)] lg:scroll-mt-[var(--header-h,67px)]" />
            <article
                aria-labelledby={titleId}
                className="grid gap-8 border-t border-foreground bg-background pt-8 pb-10 min-[721px]:pt-10 min-[721px]:pb-12 lg:grid-cols-2 lg:gap-x-12 pin:sticky pin:top-[var(--header-h,67px)] pin:min-h-[calc(100vh_-_var(--header-h,67px))]"
            >
                <div className="flex min-w-0 flex-col">
                    <p className={`${captionClass} flex items-baseline justify-between gap-4 text-muted-foreground`}>
                        <span className="text-link">{`Fig. ${figure}`}</span>
                        <span>{project.period}</span>
                    </p>
                    <h2
                        id={titleId}
                        className="mt-[18px] mb-3.5 text-[length:clamp(32px,9vw,44px)] font-light leading-none tracking-[-0.025em] text-primary [overflow-wrap:break-word] max-[720px]:[hyphens:auto] min-[721px]:text-[56px]"
                    >
                        {project.title}
                    </h2>
                    <p className="mb-[22px] max-w-[520px] text-[length:var(--fs-m2)] leading-[1.65] text-secondary">{project.description}</p>
                    <ul className="mb-6 flex flex-col gap-2 text-[length:var(--fs-m3)] leading-[1.65] text-primary">
                        {project.highlights.map((h) => (
                            <li key={h} className="flex gap-3">
                                <span aria-hidden="true" className="mt-[0.8em] h-px w-3 flex-none bg-primary" />
                                <span>{h}</span>
                            </li>
                        ))}
                    </ul>
                    <ul aria-label="Technologies" className="mt-auto flex flex-wrap gap-2">
                        {project.technologies.map((t) => (
                            <li key={t} className="rounded-[var(--r-2)] border border-border px-2.5 py-1.5 font-mono text-[length:var(--fs-m5)] uppercase tracking-[0.08em] text-secondary">
                                {t}
                            </li>
                        ))}
                    </ul>
                    {(project.liveUrl || project.githubUrl || project.nda) && (
                        <div className="mt-5 flex flex-wrap gap-3">
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`${button} bg-foreground text-background underline-offset-4 hover:underline`}>
                                    Live site <span aria-hidden="true">↗</span>
                                </a>
                            )}
                            {project.githubUrl && (
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`${button} border border-border text-primary hover:text-primary`}>
                                    Code <span aria-hidden="true">↗</span>
                                </a>
                            )}
                            {project.nda && <span className={`${button} border border-dashed border-border text-muted-foreground`}>Under NDA · ask in chat</span>}
                        </div>
                    )}
                </div>

                <div className="relative isolate aspect-[4/3] min-w-0 overflow-hidden border border-border bg-primary/15 dark:bg-primary/10 lg:aspect-auto lg:min-h-[360px]">
                    {project.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={project.image}
                            alt={`${project.title} screenshot`}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 h-full w-full object-cover [filter:grayscale(1)_contrast(1.08)] mix-blend-multiply dark:mix-blend-screen"
                        />
                    ) : (
                        <>
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 bg-[linear-gradient(var(--border-color)_1px,transparent_1px),linear-gradient(90deg,var(--border-color)_1px,transparent_1px)] bg-[size:48px_48px] opacity-70"
                            />
                            <p className={`${captionClass} absolute bottom-5 left-6 text-muted-foreground`}>No public figure · client confidential</p>
                        </>
                    )}
                    <span className="absolute top-3.5 left-4 border border-border bg-background px-2 py-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-primary">{`Fig. ${figure}`}</span>
                </div>
            </article>
        </>
    )
}
