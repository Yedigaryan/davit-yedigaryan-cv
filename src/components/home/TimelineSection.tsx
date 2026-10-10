import { experiences } from '@/lib/data'
import HomeSection from './HomeSection'

const mono = 'font-mono text-[length:var(--fs-m4)]'

/** #timeline (spec 005 Req 16). `experiences` is ordered most-recent-first in data.ts. No logos. */
export default function TimelineSection() {
    return (
        <HomeSection id="timeline" label="04 / Timeline" title="Most recent first.">
            <ol className="border-t border-border">
                {experiences.map((e) => (
                    <li key={e.id} className="grid gap-3 border-b border-border py-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8">
                        <p className={`${mono} uppercase tracking-[0.08em] text-muted-foreground`}>{e.period}</p>
                        <div className="min-w-0">
                            <h3 className="text-[length:var(--fs-d5)] leading-snug text-primary">{e.role}</h3>
                            <p className={`${mono} mt-1 flex flex-wrap items-center gap-2 text-secondary`}>
                                <span>{e.company}</span>
                                {e.company === 'Confidential Client' && (
                                    <span className="rounded-[var(--r-2)] border border-current px-1.5 text-[length:var(--fs-m5)] uppercase tracking-[0.08em] text-link">NDA</span>
                                )}
                            </p>
                            <p className="mt-4 max-w-[68ch] text-[length:var(--fs-m2)] leading-relaxed text-secondary">{e.description}</p>
                            <ul className="mt-4 max-w-[68ch] border-t border-border">
                                {e.achievements.map((a) => (
                                    <li key={a} className="border-b border-border py-2 text-[length:var(--fs-m3)] leading-relaxed text-secondary">{a}</li>
                                ))}
                            </ul>
                            <p className={`${mono} mt-4 break-words leading-relaxed text-muted-foreground`}>{e.technologies.join(' · ')}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </HomeSection>
    )
}
