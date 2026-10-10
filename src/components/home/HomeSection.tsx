import type { ReactNode } from 'react'

/** Uppercase mono caption used for section labels, figure captions and small headings. */
export const captionClass = 'font-mono text-[length:var(--fs-m5)] uppercase tracking-[0.14em]'

/**
 * One numbered home-page section (spec 005 Req 10): the id is the anchor the
 * header links to, the label is "NN / Name" in the link colour, the title is
 * the Fraunces h2. scroll-mt keeps the heading clear of the sticky header.
 */
export default function HomeSection({
    id,
    label,
    title,
    children,
}: {
    id: string
    label: string
    title: string
    children: ReactNode
}) {
    const titleId = `${id}-title`
    return (
        <section id={id} aria-labelledby={titleId} className="scroll-mt-20 border-b border-border">
            <div className="container mx-auto py-16 lg:py-24">
                <p className={`${captionClass} text-link`}>{label}</p>
                <h2 id={titleId} className="mt-3 mb-10 max-w-[24ch] text-[length:var(--fs-d4)] leading-[1.1] tracking-[-0.01em] text-primary">
                    {title}
                </h2>
                {children}
            </div>
        </section>
    )
}
