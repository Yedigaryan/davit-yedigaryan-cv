import Link from 'next/link'
import { personalInfo } from '@/lib/data'
import { captionClass } from './home/HomeSection'
import ResumeDownloadLink from './ResumeDownloadLink'

const button = 'inline-flex min-h-11 items-center rounded-[var(--r-3)] px-5 font-mono text-[length:var(--fs-m3)] uppercase tracking-[0.08em] transition-colors'

/** #top (spec 005 Req 12). The trace, boot overlay and chat pane are specs 007 and 008. */
export default function Hero() {
    return (
        <section id="top" aria-labelledby="top-title" className="scroll-mt-20 border-b border-border">
            <div className="container mx-auto grid gap-10 py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:py-24">
                <div className="min-w-0">
                    <p className={`${captionClass} text-link`}>00 / Index</p>
                    <p className={`${captionClass} mt-8 text-muted-foreground`}>{`${personalInfo.location} · ${personalInfo.locationNote}`}</p>
                    <h1
                        id="top-title"
                        className="mt-4 max-w-[14ch] text-[length:var(--fs-d3)] leading-[1.02] tracking-[-0.02em] text-primary md:text-[length:var(--fs-d2)] lg:text-[length:var(--fs-d1)]"
                    >
                        Systems-minded <em className="italic">frontend</em> engineer.
                    </h1>
                    <p className="mt-6 max-w-[60ch] text-[length:var(--fs-m1)] leading-relaxed text-secondary">{personalInfo.shortBio}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link href="/projects" className={`${button} bg-primary text-primary-foreground underline-offset-4 hover:underline`}>
                            View projects
                        </Link>
                        <ResumeDownloadLink location="hero" className={`${button} border border-border text-primary hover:text-primary`}>
                            Resume (PDF)
                        </ResumeDownloadLink>
                    </div>
                </div>

                {/* Fig. 1: amber duotone in CSS only (Req 12); 120px below md, 148px from md. */}
                <figure className="w-[120px] md:w-[148px]">
                    <div className="relative isolate aspect-square overflow-hidden bg-primary">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/images/about-image.png"
                            alt={`Portrait of ${personalInfo.name}`}
                            className="h-full w-full object-cover [filter:grayscale(1)_contrast(1.15)] mix-blend-multiply"
                            decoding="async"
                        />
                    </div>
                    <figcaption className={`${captionClass} mt-3 leading-relaxed text-muted-foreground`}>
                        <span className="text-link">Fig. 1</span> Davit Yedigaryan · Yerevan · EN / HY / RU
                    </figcaption>
                </figure>
            </div>
        </section>
    )
}
