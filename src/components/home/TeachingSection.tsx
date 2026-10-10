import { certifications, studies } from '@/lib/data'
import HomeSection, { captionClass } from './HomeSection'

const row = 'grid gap-1 border-b border-border py-3 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_4rem] md:gap-6'
const name = 'text-[length:var(--fs-m2)] text-primary'
const meta = 'font-mono text-[length:var(--fs-m4)] text-secondary'
const year = 'font-mono text-[length:var(--fs-m4)] text-muted-foreground'

/** Degrees are studies 0-3; Vineti (id 4) is already listed under Certificates. */
const degrees = studies
    .filter((s) => s.id <= 3)
    .map((s) => {
        const [institution, graduated] = s.university.split(' · ')
        return { id: s.id, degree: s.studyFieldAndDegree, institution, graduated }
    })

/** #teaching (spec 005 Req 17). Copy from the canvas, IB Computer Science removed. */
export default function TeachingSection() {
    return (
        <HomeSection id="teaching" label="05 / Teaching" title="Explaining it is how I check I understand it.">
            <p className="max-w-[68ch] text-[length:var(--fs-m1)] leading-relaxed text-secondary">
                Lecturing OOP in C++ and C# and computer networks keeps the fundamentals sharp and forces decisions to be explained, not just made.
            </p>

            <article className="mt-10 max-w-[68ch] border border-border p-6">
                <p className={`${captionClass} text-muted-foreground`}>Mar 2025 · present</p>
                <h3 className="mt-2 text-[length:var(--fs-d5)] text-primary">Eurasia International University</h3>
                <p className="mt-3 text-[length:var(--fs-m2)] leading-relaxed text-secondary">
                    University lecturer: OOP in C++/C#, design patterns, OSI/TCP-IP, routing, sockets. Student outcomes up about 30% after introducing structured code review and professional tooling.
                </p>
            </article>

            <h3 className={`${captionClass} mt-16 mb-4 text-muted-foreground`}>Degrees</h3>
            <ul className="border-t border-border">
                {degrees.map((d) => (
                    <li key={d.id} className={row}>
                        <span className={name}>{d.degree}</span>
                        <span className={meta}>{d.institution}</span>
                        <span className={year}>{d.graduated}</span>
                    </li>
                ))}
            </ul>

            <h3 className={`${captionClass} mt-12 mb-4 text-muted-foreground`}>Certificates</h3>
            <ul className="border-t border-border">
                {certifications.map((c) => (
                    <li key={c.name} className={row}>
                        <span className={name}>{c.name}</span>
                        <span className={meta}>{c.issuer}</span>
                        <span className={year}>{c.year}</span>
                    </li>
                ))}
            </ul>
        </HomeSection>
    )
}
