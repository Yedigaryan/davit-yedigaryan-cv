'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { FaBars, FaTimes } from 'react-icons/fa'
import { personalInfo } from '@/lib/data'
import ThemeToggle from './ThemeToggle'

/** Home-page sections in page order. The ids are anchors spec 005 fixes. */
const sections = [
    { id: 'profile', label: '01 Profile' },
    { id: 'proof', label: '02 Proof' },
    { id: 'stack', label: '03 Stack' },
    { id: 'timeline', label: '04 Timeline' },
    { id: 'teaching', label: '05 Teaching' },
    { id: 'contact', label: '06 Contact' },
]

const linkBase = 'font-mono text-[length:var(--fs-m4)] uppercase tracking-[0.08em] transition-colors'
const idle = 'text-muted-foreground hover:text-primary'
const current = 'text-link underline underline-offset-4'

export default function Header() {
    const pathname = usePathname()
    const [hash, setHash] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Active link follows location.hash (spec 005 Req 11; scroll-spy is spec 007).
    // Re-read on every pathname change: Next <Link> navigation uses pushState,
    // which does not fire hashchange.
    useEffect(() => {
        const read = () => setHash(window.location.hash)
        read()
        window.addEventListener('hashchange', read)
        return () => window.removeEventListener('hashchange', read)
    }, [pathname])

    const isActive = (id: string) => pathname === '/' && hash === `#${id}`
    const onProjects = pathname === '/projects'
    const closeMenu = () => setIsMenuOpen(false)

    // Plain <a>: a same-page hash jump must fire hashchange, which Next <Link> does not.
    const sectionLinks = (extra: string, onClick?: () => void) =>
        sections.map((s) => (
            <a
                key={s.id}
                href={`/#${s.id}`}
                onClick={onClick}
                aria-current={isActive(s.id) ? 'location' : undefined}
                className={`${linkBase} ${extra} ${isActive(s.id) ? current : idle}`}
            >
                {s.label}
            </a>
        ))

    const projectsLink = (extra: string, onClick?: () => void) => (
        <Link
            href="/projects"
            onClick={onClick}
            aria-current={onProjects ? 'page' : undefined}
            className={`${linkBase} ${extra} ${onProjects ? current : idle}`}
        >
            Projects
        </Link>
    )

    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background">
            <div className="container mx-auto">
                <div className="flex items-center justify-between gap-4 py-3">
                    <Link href="/" className="flex items-baseline gap-3 text-primary hover:text-primary">
                        <span className="font-serif text-[length:var(--fs-d5)] leading-none">DY</span>
                        <span className="whitespace-nowrap font-mono text-[length:var(--fs-m4)] uppercase tracking-[0.12em] text-secondary">{personalInfo.name}</span>
                    </Link>

                    <nav aria-label="Sections" className="hidden items-center gap-5 lg:flex">
                        {sectionLinks('')}
                        {projectsLink('')}
                    </nav>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex h-11 w-11 items-center justify-center text-muted-foreground transition-colors hover:text-primary lg:hidden"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-nav"
                        >
                            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <nav id="mobile-nav" aria-label="Sections" className="border-t border-border py-2 lg:hidden">
                        <div className="flex flex-col">
                            {sectionLinks('py-3', closeMenu)}
                            {projectsLink('py-3', closeMenu)}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    )
}
