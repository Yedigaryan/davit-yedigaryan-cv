import Link from 'next/link'
import { figureNumber, projects } from '@/lib/data'

/**
 * Figure rail (spec 006 Req 10): one link per chapter, number first in the
 * accessible name. Next <Link> like the header's section links, so Back and
 * Forward keep Next's history state. The active highlight is spec 007.
 */
export default function FigureRail() {
    return (
        <nav aria-label="Figures" className="sticky top-[200px] hidden w-11 flex-none flex-col border-l border-border py-3 lg:flex">
            {projects.map((p, i) => {
                const n = figureNumber(i)
                const num = String(n).padStart(2, '0')
                return (
                    <Link
                        key={p.title}
                        href={`/projects#fig${n}`}
                        aria-label={`${num}, Figure ${n}: ${p.title}`}
                        className="flex min-h-11 items-center gap-2 pl-2 font-mono text-[10.5px] tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
                    >
                        <span aria-hidden="true" className="h-px w-3 flex-none bg-current" />
                        {num}
                    </Link>
                )
            })}
        </nav>
    )
}
