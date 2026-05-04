import { Metadata } from 'next'
import Link from 'next/link'
import { FaGraduationCap, FaMicrochip, FaBookOpen, FaTerminal } from 'react-icons/fa'
import { personalInfo, studies } from '@/lib/data'

export const metadata: Metadata = {
    title: `About | ${personalInfo.name}`,
    description:
        'Background, education, and engineering philosophy of Davit Yedigaryan — a backend & systems engineer with VLSI/electronics roots.',
}

export default function About() {
    return (
        <div className="container mx-auto px-4 py-20">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-foreground">About Me</h1>

                {/* Hero block */}
                <div className="grid md:grid-cols-2 gap-12 mb-16 items-start">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">
                            Backend &amp; Systems Engineer with VLSI roots
                        </h2>
                        <p className="text-base sm:text-lg text-muted-foreground mb-5 leading-relaxed">
                            I started in microelectronics — my first degree is in <strong className="text-foreground">Electronic Means</strong> at the National Polytechnic University of Armenia, with a parallel <strong className="text-foreground">VLSI Design</strong> bachelor at Synopsys Armenia. That low-level grounding (C/C++, embedded, computer architecture) is the reason I&apos;m comfortable now with C/C++ core business logic at QDSC and teaching OOP-in-C++ at university.
                        </p>
                        <p className="text-base sm:text-lg text-muted-foreground mb-5 leading-relaxed">
                            On top of that I&apos;ve spent 7+ years shipping production code: C# / .NET trading services, Angular and React frontends for cryptographic and fintech platforms, and full-stack work with Python/Django. I treat the stack as one continuous system — there&apos;s no &quot;frontend problem&quot; that doesn&apos;t bottom out somewhere in memory layout, network behaviour, or contention on a backend resource.
                        </p>
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                            Based in {personalInfo.location} · {personalInfo.locationNote}.
                        </p>
                    </div>
                    <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/about-image.png"
                            alt={`Portrait of ${personalInfo.name}`}
                            width={400}
                            height={500}
                            className="rounded-lg shadow-lg w-full max-w-sm md:ml-auto"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                </div>

                {/* Education & Certifications */}
                <section className="mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-8 flex items-center text-foreground">
                        <FaGraduationCap className="text-blue-600 dark:text-blue-400 mr-3" />
                        Education
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {studies.map((stud) => (
                            <article
                                key={stud.id}
                                className={`relative rounded-lg border p-6 shadow-sm bg-card transition ${stud.highlight ? 'border-primary/60 ring-2 ring-primary/20' : 'border-border'}`}
                            >
                                {stud.highlight && (
                                    <span className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                                        <FaMicrochip aria-hidden="true" /> Systems foundation
                                    </span>
                                )}
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={stud.logo}
                                    alt={`${stud.university} logo`}
                                    width={stud.width ?? 50}
                                    height={70}
                                    className={`rounded-lg shadow-sm mb-4${stud.bgBlack ?? ''}`}
                                    loading="lazy"
                                    decoding="async"
                                />
                                <h3 className="text-lg font-bold mb-1 text-card-foreground">
                                    {stud.university}
                                </h3>
                                <p className="text-muted-foreground mb-2">{stud.studyFieldAndDegree}</p>
                                <p className="text-sm text-muted-foreground/90 leading-relaxed">
                                    {stud.description}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Engineering philosophy — replaces the generic "Clean Code / Quality / Continuous Learning" trio. */}
                <section className="mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">
                        How I work
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                            <FaTerminal className="text-2xl text-primary mb-3" aria-hidden="true" />
                            <h3 className="text-lg font-bold mb-2 text-foreground">Read the code, not the docs</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                When something breaks at QDSC the answer is in a C++ source file, not a wiki page. I default to reading source — including the runtime, the compiler output, the Angular framework code — before guessing.
                            </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                            <FaMicrochip className="text-2xl text-primary mb-3" aria-hidden="true" />
                            <h3 className="text-lg font-bold mb-2 text-foreground">One stack, top to bottom</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                A &quot;frontend bug&quot; is often a network bug, a memory bug, or a backend race. I treat C++/C#/TypeScript as one system, which is what made the trading platform&apos;s low-latency UX possible.
                            </p>
                        </div>
                        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
                            <FaBookOpen className="text-2xl text-primary mb-3" aria-hidden="true" />
                            <h3 className="text-lg font-bold mb-2 text-foreground">Teach what I ship</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                I teach OOP-in-C++ and Computer Networks at university and IB-level CS. Forcing yourself to explain templates, RAII, or OSPF to first-year students keeps your fundamentals honest.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pivot CTA */}
                <div className="bg-muted/30 p-6 sm:p-8 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                            Looking for the technical timeline?
                        </h2>
                        <p className="text-muted-foreground">Month-by-month roles, stacks, and outcomes.</p>
                    </div>
                    <Link
                        href="/experience"
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition focus:outline-none focus:ring-4 focus:ring-primary/40"
                    >
                        See experience →
                    </Link>
                </div>
            </div>
        </div>
    )
}
