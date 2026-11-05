'use client'

import { useEffect, useRef, useState } from 'react'
import { captionClass } from './HomeSection'
import { startMeter } from './meter/loop'
import { meterMode, type MeterMode } from './meter/model'

/**
 * Live frame meter, DOM layers (spec 007). It is the last child of #top.
 * Ruling 1: the canvas is cleared behind the small captions and the instrument, not dimmed under them.
 * Ruling 4: paint order comes from z-index (canvas 0, hero container 1, overlay 2), not from DOM order.
 * Ruling 8: on phones only the Fig. 0 caption shows, inside the hero's bottom padding.
 */

const labelClass = 'uppercase tracking-[0.06em] text-muted-foreground'
const rowClass = 'flex justify-between text-[length:var(--fs-m5)] leading-[1.7]'

const rows = [
    { label: 'Frame', key: 'frame' },
    { label: 'Rate', key: 'rate' },
    { label: 'Long tasks 10s', key: 'long' },
] as const

export default function FrameMeter() {
    const [mode, setMode] = useState<MeterMode | null>(null)
    const traceRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const wide = window.matchMedia('(min-width: 640px)')
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
        const update = () => setMode(meterMode(wide.matches, reduced.matches))
        update()
        wide.addEventListener('change', update)
        reduced.addEventListener('change', update)
        return () => {
            wide.removeEventListener('change', update)
            reduced.removeEventListener('change', update)
        }
    }, [])

    // One loop per mode: a mode change (or StrictMode's double mount) tears it down and starts one again.
    // The spark canvas and value spans are re-read each run, since a mode change mounts or unmounts them.
    useEffect(() => {
        const canvas = traceRef.current
        const section = canvas?.parentElement
        if (!canvas || !section || mode === null || mode === 'off') return
        const pick = (key: string) => section.querySelector<HTMLElement>(`[data-meter="${key}"]`)
        return startMeter({
            section,
            canvas,
            spark: section.querySelector<HTMLCanvasElement>('canvas[data-meter="spark"]'),
            frame: pick('frame'),
            rate: pick('rate'),
            long: pick('long'),
            mode,
        })
    }, [mode])

    if (mode === null || mode === 'off') return null

    const phone = mode === 'phone'
    const caption = (
        <p data-meter-clear className={`${captionClass} ${phone ? 'absolute bottom-6 left-4' : 'mt-2'} whitespace-nowrap text-muted-foreground`}>
            <span className="text-link">Fig. 0</span> This page, measured live.
        </p>
    )

    return (
        <>
            <canvas ref={traceRef} data-meter="trace" aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full forced-colors:hidden" />
            <div className="pointer-events-none absolute inset-0 z-[2]">
                <div className="container relative mx-auto h-full">
                    {phone ? (
                        caption
                    ) : (
                        <div className="absolute right-4 top-16 flex flex-col items-end lg:top-24 xl:top-auto xl:right-[204px] xl:bottom-60">
                            <div data-meter-clear aria-hidden="true" className="w-[200px] border border-border bg-background px-3 py-2.5 font-mono">
                                {rows.map(({ label, key }) => (
                                    <div key={key} className={rowClass}>
                                        <span className={labelClass}>{label}</span>
                                        <span data-meter={key} className="tabular-nums text-foreground">
                                            -
                                        </span>
                                    </div>
                                ))}
                                {mode === 'full' && <canvas data-meter="spark" aria-hidden="true" className="mt-1.5 block h-8 w-full" />}
                            </div>
                            {caption}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
