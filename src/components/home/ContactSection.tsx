import ContactForm from '@/components/ContactForm'
import { personalInfo } from '@/lib/data'
import HomeSection, { captionClass } from './HomeSection'

const display = (url: string) => url.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, '')

/** Four channels; phone is not shown (spec 005 Req 18). */
const channels = [
    { label: 'Email', href: `mailto:${personalInfo.email}`, value: personalInfo.email },
    { label: 'Telegram', href: 'https://t.me/mr_yedigaryan', value: 't.me/mr_yedigaryan' },
    { label: 'LinkedIn', href: personalInfo.linkedin, value: display(personalInfo.linkedin) },
    { label: 'GitHub', href: personalInfo.github, value: display(personalInfo.github) },
]

/** #contact (spec 005 Req 18). ContactForm is reused unchanged. */
export default function ContactSection() {
    return (
        <HomeSection id="contact" label="06 / Contact" title="Hiring for a product team?">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <div className="min-w-0">
                    <p className="max-w-[48ch] text-[length:var(--fs-m1)] leading-relaxed text-secondary">
                        Based in Yerevan, open to remote. Fastest reply on Telegram; email works for anything with an attachment.
                    </p>
                    <ul className="mt-8 border-t border-border">
                        {channels.map((c) => {
                            const external = c.href.startsWith('https://')
                            return (
                                <li key={c.label} className="border-b border-border">
                                    <a
                                        href={c.href}
                                        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                        className="flex min-h-11 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3 underline-offset-4 hover:underline"
                                    >
                                        <span className={`${captionClass} text-muted-foreground`}>{c.label}</span>
                                        <span className="break-all font-mono text-[length:var(--fs-m3)] text-link">{c.value}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="min-w-0">
                    <ContactForm />
                    <p className="mt-4 font-mono text-[length:var(--fs-m4)] text-muted-foreground">
                        Relayed by a form service. No tracking unless you accepted analytics.
                    </p>
                </div>
            </div>
        </HomeSection>
    )
}
