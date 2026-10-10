import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'

/** 44x44 tap targets (spec 005 Req 19). */
const iconLink = 'inline-flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary'

export default function Footer() {
    const year = new Date().getFullYear()
    return (
        <footer className="border-t border-border bg-background">
            <div className="container mx-auto flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
                <div className="font-mono text-[length:var(--fs-m4)] uppercase tracking-[0.08em]">
                    <p className="text-primary">{`DY · ${personalInfo.name} · Yerevan`}</p>
                    <p className="mt-2 text-muted-foreground">{`Static export · Next.js · Self-hosted assistant · © ${year}`}</p>
                </div>
                <div className="-ml-3 flex gap-1 md:ml-0">
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn">
                        <FaLinkedin size={22} />
                    </a>
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub">
                        <FaGithub size={22} />
                    </a>
                    <a href={`mailto:${personalInfo.email}`} className={iconLink} aria-label="Email">
                        <FaEnvelope size={22} />
                    </a>
                </div>
            </div>
        </footer>
    )
}
