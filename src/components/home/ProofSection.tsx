import Link from 'next/link'
import { figureNumber, personalInfo, projects, studies } from '@/lib/data'
import HomeSection, { captionClass } from './HomeSection'

const pad = (n: number) => String(n).padStart(2, '0')

/** Static figures (spec 005 Req 14). The count-up animation is spec 007. */
const figures = [
    { value: `${pad(personalInfo.yearsOfExperience)}+`, label: 'years shipping software, since 2019' },
    { value: '06+', label: 'years of production Angular' },
    { value: '03+', label: 'years of C# / .NET services' },
    { value: pad(studies.filter((s) => s.id <= 3).length), label: 'university degrees, from VLSI to computer science' },
]

/** Trading platform, Prestige Motors, Energy Machines, in figure order (spec 006 Req 17). */
const featured = [1, 2, 3].map((i) => ({ project: projects[i], figure: figureNumber(i) }))

export default function ProofSection() {
    return (
        <HomeSection id="proof" label="02 / Proof" title="Numbers, then the work.">
            <dl className="grid grid-cols-2 border-t border-border lg:grid-cols-4">
                {figures.map((f) => (
                    <div key={f.label} className="flex flex-col-reverse gap-2 border-b border-border py-6 pr-4">
                        <dt className={`${captionClass} leading-relaxed text-muted-foreground`}>{f.label}</dt>
                        <dd className="font-serif text-[length:var(--fs-d3)] leading-none text-primary md:text-[length:var(--fs-d2)]">{f.value}</dd>
                    </div>
                ))}
            </dl>

            <h3 className={`${captionClass} mt-16 mb-6 text-muted-foreground`}>Selected figures</h3>
            <ul className="grid gap-10 md:grid-cols-3 md:gap-6">
                {featured.map(({ project: p, figure }) => (
                    <li key={p.title} className="flex min-w-0 flex-col">
                        <figure>
                            <div className="relative isolate aspect-[4/3] overflow-hidden bg-primary">
                                {p.image && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={p.image}
                                        alt=""
                                        loading="lazy"
                                        decoding="async"
                                        className="h-full w-full object-cover [filter:grayscale(1)_contrast(1.15)] mix-blend-multiply"
                                    />
                                )}
                            </div>
                            <figcaption className={`${captionClass} mt-3 text-link`}>{`Fig. ${figure}`}</figcaption>
                        </figure>
                        <h4 className="mt-3 font-serif text-[length:var(--fs-d5)] leading-snug text-primary">{p.title}</h4>
                        <p className="mt-2 text-[length:var(--fs-m3)] leading-relaxed text-secondary">{p.description}</p>
                        <Link href={`/projects#fig${figure}`} className="mt-4 font-mono text-[length:var(--fs-m4)] uppercase tracking-[0.08em] text-link underline-offset-4 hover:underline">
                            See it on Projects<span className="sr-only">{`: ${p.title}`}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <Link href="/projects" className="mt-12 inline-flex min-h-11 items-center font-mono text-[length:var(--fs-m3)] uppercase tracking-[0.08em] text-link underline-offset-4 hover:underline">
                All projects ↗
            </Link>
        </HomeSection>
    )
}
