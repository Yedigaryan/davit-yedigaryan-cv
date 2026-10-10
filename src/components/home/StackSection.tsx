import { Fragment } from 'react'
import { skills, type SkillLevel } from '@/lib/data'
import HomeSection, { captionClass } from './HomeSection'

/** Expert uses the AA link colour; raw amber text fails AA on paper (plan ruling 4). */
const levelClass: Record<SkillLevel, string> = {
    Expert: 'text-link',
    Proficient: 'text-secondary',
    Familiar: 'text-muted-foreground',
}

/** #stack (spec 005 Req 15). Tables scroll inside their box on narrow screens (Req 23). */
export default function StackSection() {
    return (
        <HomeSection id="stack" label="03 / Stack" title="From the register to the component.">
            <p className="max-w-[68ch] text-[length:var(--fs-m2)] leading-relaxed text-secondary">
                <span className="block">Expert means I have led architecture and mentored on it.</span>
                <span className="block">Proficient means I have shipped it alone.</span>
                <span className="block">Familiar means I can read, debug and contribute.</span>
            </p>

            <div className="mt-12 grid gap-12 xl:grid-cols-2">
                {skills.map((cat, i) => {
                    const name = `Table ${String.fromCharCode(65 + i)} · ${cat.category}`
                    return (
                        <div key={cat.category} className="min-w-0">
                            <h3 className={`${captionClass} text-muted-foreground`}>{name}</h3>
                            <div role="region" aria-label={name} tabIndex={0} className="mt-3 overflow-x-auto">
                                <table className="w-full min-w-[32rem] border-collapse text-left">
                                    <thead>
                                        <tr className={`${captionClass} border-b border-border text-muted-foreground`}>
                                            <th scope="col" className="py-2 pr-4 font-normal">Name</th>
                                            <th scope="col" className="py-2 pr-4 font-normal">Level</th>
                                            <th scope="col" className="py-2 font-normal">Years</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cat.skills.map((s) => (
                                            <Fragment key={s.name}>
                                                <tr className={s.note ? undefined : 'border-b border-border'}>
                                                    <th scope="row" className="py-3 pr-4 text-[length:var(--fs-m2)] font-normal text-primary">{s.name}</th>
                                                    <td className="py-3 pr-4">
                                                        <span className={`inline-block rounded-[var(--r-2)] border border-current px-2 py-0.5 font-mono text-[length:var(--fs-m5)] uppercase tracking-[0.08em] ${levelClass[s.level]}`}>{s.level}</span>
                                                    </td>
                                                    <td className="py-3 font-mono text-[length:var(--fs-m4)] text-secondary">{s.years}</td>
                                                </tr>
                                                {s.note && (
                                                    <tr className="border-b border-border">
                                                        <td colSpan={3} className="pb-3 pr-4 text-[length:var(--fs-m4)] leading-relaxed text-muted-foreground">{s.note}</td>
                                                    </tr>
                                                )}
                                            </Fragment>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}
            </div>
        </HomeSection>
    )
}
