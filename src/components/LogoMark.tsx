import { CHIP_BODY, CHIP_NOTCH, CHIP_PINS, CHIP_STROKE, GLYPHS_L } from '@/lib/logo-paths'

/**
 * The DY chip (spec 010 Req 7-9): 40px, outline, pins and glyphs in the ink
 * (--foreground), notch in --mark-accent, so it follows the theme. The glyphs
 * are outlined paths, so it never waits for Fraunces. Decorative: the brand
 * link's text carries the accessible name.
 */
export default function LogoMark() {
    return (
        <svg width="40" height="40" viewBox="0 0 100 100" aria-hidden="true" focusable="false" className="block shrink-0">
            <path d={CHIP_NOTCH} className="fill-[var(--mark-accent)]" />
            <path d={CHIP_BODY} fill="none" strokeWidth={CHIP_STROKE} className="stroke-foreground" />
            <path d={CHIP_PINS} fill="none" strokeWidth={CHIP_STROKE} strokeLinecap="square" className="stroke-foreground" />
            <path d={GLYPHS_L} className="fill-foreground" />
        </svg>
    )
}
