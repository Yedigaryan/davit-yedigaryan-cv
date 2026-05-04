import Hero from '@/components/Hero'
import ProjectCard from '@/components/ProjectCard'
import Link from 'next/link'
import { FaArrowRight, FaCode, FaMicrochip, FaServer } from 'react-icons/fa'
import { SiCplusplus, SiSharp, SiAngular } from 'react-icons/si'
import { experiences, personalInfo, projects } from '@/lib/data'

export default function Home() {
    const featuredProjects = projects.slice(0, 3)
    const recentRoles = experiences.slice(0, 3)

    return (
        <>
            <Hero />

            {/* Core expertise — three honest specialisms, not a buzzword cloud. */}
            <section className="py-16 sm:py-20 bg-muted/30 transition-colors duration-200">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-3 text-foreground">
                        Core expertise
                    </h2>
                    <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                        Three things I&apos;ve done in production for years — not a wishlist.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <SiCplusplus className="text-5xl text-blue-600 dark:text-blue-400 mb-4" aria-hidden="true" />
                            <h3 className="text-xl font-bold mb-2 text-card-foreground">C / C++ &amp; systems</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Core business logic at QDSC; OOP-in-C++ instructor at Eurasia International University. Backed by a Bachelor&apos;s in Electronic Means and VLSI Design.
                            </p>
                        </article>
                        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <SiSharp className="text-5xl text-purple-600 dark:text-purple-400 mb-4" aria-hidden="true" />
                            <h3 className="text-xl font-bold mb-2 text-card-foreground">C# / .NET backend</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                3+ years of backend services and APIs — concurrent low-latency systems for trading, secure integrations, and socket programming.
                            </p>
                        </article>
                        <article className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <SiAngular className="text-5xl text-red-600 dark:text-red-500 mb-4" aria-hidden="true" />
                            <h3 className="text-xl font-bold mb-2 text-card-foreground">Angular (Signals/Zoneless)</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                6+ years shipping production Angular — from cryptographic platforms (Hapalas) to live trading UIs and IoT dashboards.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* Recent roles — gives recruiters the answer to "what is he doing now?" without a click. */}
            <section className="py-16 sm:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">What I&apos;m working on</h2>
                            <p className="text-muted-foreground mt-2">Most recent roles, top to bottom.</p>
                        </div>
                        <Link
                            href="/experience"
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition"
                        >
                            Full timeline <FaArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                    <ol className="space-y-4">
                        {recentRoles.map((exp) => (
                            <li
                                key={exp.id}
                                className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                            >
                                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                    {exp.period}
                                </p>
                                <h3 className="text-lg sm:text-xl font-bold text-card-foreground mt-1">
                                    {exp.role}
                                </h3>
                                <p className="text-muted-foreground">{exp.company}</p>
                                <p className="mt-3 text-sm sm:text-base text-foreground/90 leading-relaxed">
                                    {exp.description}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            {/* Featured projects */}
            <section className="py-16 sm:py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Featured projects</h2>
                            <p className="text-muted-foreground mt-2">A small slice of what I&apos;ve shipped.</p>
                        </div>
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-primary font-semibold hover:opacity-80 transition"
                        >
                            All projects <FaArrowRight aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredProjects.map((project) => (
                            <ProjectCard key={project.title} project={project} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Why-me strip */}
            <section className="py-16 sm:py-20 bg-background">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-12">
                        Why me
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <FaMicrochip className="text-3xl text-primary mb-3" aria-hidden="true" />
                            <h3 className="font-bold text-foreground mb-1">Hardware-grade fundamentals</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                VLSI/embedded background means I understand what the bytes are actually doing — useful when systems hit pathological cases.
                            </p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <FaServer className="text-3xl text-primary mb-3" aria-hidden="true" />
                            <h3 className="font-bold text-foreground mb-1">Full-stack ownership</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                C++ → C# → TypeScript on the same project is normal for me. Fewer hand-offs, faster iteration, fewer integration bugs.
                            </p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <FaCode className="text-3xl text-primary mb-3" aria-hidden="true" />
                            <h3 className="font-bold text-foreground mb-1">Teaching = clearer thinking</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Lecturing OOP, networks, and IB-level CS keeps the fundamentals sharp and forces me to explain decisions clearly.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 sm:py-20 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                        Looking for a backend or systems engineer?
                    </h2>
                    <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Based in {personalInfo.location} · {personalInfo.locationNote}.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/contact"
                            className="inline-block bg-primary text-primary-foreground px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:opacity-90 transition shadow-md"
                        >
                            Get in touch
                        </Link>
                        <a
                            href="/resume.pdf"
                            download
                            className="inline-block border-2 border-primary text-primary px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold hover:bg-primary/5 transition"
                        >
                            Download resume
                        </a>
                    </div>
                </div>
            </section>
        </>
    )
}
