// Live loop for the home hero meter (spec 007 Req 1-5, 10-13, 18; plan Rulings 6, 10-13).
// Starts only after the IntersectionObserver reports the hero visible, pauses when it or the page is hidden,
// and the returned cleanup removes every frame, observer and listener.

import { clearBoxes, drawGrid, drawTrace, fitCanvas, measureClearBoxes, readMeterColours, type Box } from './draw'
import { CAPACITY, LONG_TASK_WINDOW_MS, createFrameSampler, createLongTaskWindow, formatFrame, formatLongTasks, formatRate } from './model'

/** Ruling 2: grid and trace alphas checked by Verification 23. */
const GRID_ALPHA = 0.6
const TRACE_ALPHA = 0.25
/** Ruling 9: the trace band runs from 38% to 94% of the hero height. */
const BAND_TOP = 0.38
const BAND_BOTTOM = 0.94
/** Ruling 10: the numbers are written from the frame loop, 250 ms normally, 1000 ms under reduced motion. */
const CADENCE_FULL_MS = 250
const CADENCE_STATIC_MS = 1000

export interface MeterOptions {
    section: HTMLElement
    canvas: HTMLCanvasElement
    spark: HTMLCanvasElement | null
    frame: HTMLElement | null
    rate: HTMLElement | null
    long: HTMLElement | null
    mode: 'full' | 'static' | 'phone'
}

function supportsLongTask(): boolean {
    return typeof PerformanceObserver !== 'undefined' && (PerformanceObserver.supportedEntryTypes ?? []).includes('longtask')
}

function writeText(el: HTMLElement | null, text: string): void {
    if (el && el.textContent !== text) el.textContent = text
}

export function startMeter(opts: MeterOptions): () => void {
    const { section, canvas, mode, frame, rate, long } = opts
    const context = canvas.getContext('2d')
    if (!context) return () => {}
    const ctx: CanvasRenderingContext2D = context
    const spark = mode === 'full' ? opts.spark : null
    const sparkCtx = spark ? spark.getContext('2d') : null

    const drawsTrace = mode !== 'static' // Req 13
    const writesNumbers = mode !== 'phone' // Req 14
    const cadence = mode === 'full' ? CADENCE_FULL_MS : CADENCE_STATIC_MS
    const longSupported = supportsLongTask() // Req 5, 6
    const observesLongTasks = mode !== 'phone' && longSupported // Ruling 12

    const sampler = createFrameSampler(CAPACITY)
    const longTasks = createLongTaskWindow(LONG_TASK_WINDOW_MS)

    let colours = readMeterColours()
    let dpr = 1
    let width = 0
    let height = 0
    let sparkDpr = 1
    let sparkWidth = 0
    let sparkHeight = 0
    let boxes: Box[] = []

    let running = false
    let heroVisible = false
    let pageVisible = !document.hidden
    let disposed = false
    let frameId = 0
    let lastWrite = -Infinity
    let longObserver: PerformanceObserver | null = null

    /** Re-fits both canvases and re-measures the clear boxes. Fitting wipes the bitmaps, so a draw must follow. */
    function layout(): void {
        dpr = fitCanvas(canvas)
        // From the backing store, so clearRect covers every device pixel even when the CSS box is fractional.
        width = canvas.width / dpr
        height = canvas.height / dpr
        if (spark) {
            sparkDpr = fitCanvas(spark)
            sparkWidth = spark.width / sparkDpr
            sparkHeight = spark.height / sparkDpr
        }
        boxes = measureClearBoxes(section, canvas)
    }

    /** The whole picture, synchronously: grid, trace (not in static), cleared boxes, then the sparkline (full only). */
    function draw(): void {
        const samples = drawsTrace ? sampler.samples() : []
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        ctx.clearRect(0, 0, width, height)
        drawGrid(ctx, width, height, colours.grid, GRID_ALPHA)
        if (drawsTrace) {
            const band = { x: 0, y: height * BAND_TOP, w: width, h: height * (BAND_BOTTOM - BAND_TOP) }
            drawTrace(ctx, samples, band, colours.line, TRACE_ALPHA)
        }
        clearBoxes(ctx, boxes)
        if (sparkCtx) {
            sparkCtx.setTransform(sparkDpr, 0, 0, sparkDpr, 0, 0)
            sparkCtx.clearRect(0, 0, sparkWidth, sparkHeight)
            drawTrace(sparkCtx, samples, { x: 0, y: 1, w: sparkWidth, h: sparkHeight - 2 }, colours.line, 1)
        }
    }

    function writeNumbers(now: number): void {
        const smoothed = sampler.smoothed()
        writeText(frame, formatFrame(smoothed))
        writeText(rate, formatRate(smoothed))
        writeText(long, formatLongTasks(longSupported ? longTasks.count(now) : null))
    }

    function onFrame(now: number): void {
        if (disposed || !running) return
        frameId = requestAnimationFrame(onFrame)
        sampler.tick(now)
        if (drawsTrace) draw()
        if (writesNumbers && now - lastWrite >= cadence) {
            lastWrite = now
            writeNumbers(now)
        }
    }

    /** Req 3: every resume (first start, IO, visibility, bfcache restore) restarts the timestamps. */
    function resume(): void {
        running = true
        sampler.restart()
        colours = readMeterColours() // Req 18: the first frame after a resume uses the current theme
        if (observesLongTasks) {
            longObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) longTasks.add(entry.startTime)
            })
            longObserver.observe({ type: 'longtask' })
        }
        frameId = requestAnimationFrame(onFrame)
    }

    /** Req 10, 11: no frame, no observer, no window entries kept while paused. */
    function pause(): void {
        running = false
        cancelAnimationFrame(frameId)
        frameId = 0
        if (longObserver) {
            longObserver.disconnect()
            longObserver = null
        }
        longTasks.clear()
    }

    function update(): void {
        if (disposed) return
        const want = heroVisible && pageVisible
        if (want && !running) resume()
        else if (!want && running) pause()
    }

    /** Ruling 6, Req 18: static layers redraw synchronously, also while paused. */
    function relayout(): void {
        if (disposed) return
        layout()
        draw()
    }

    function onTheme(): void {
        if (disposed) return
        colours = readMeterColours()
        draw()
    }

    // Setup, synchronous (Ruling 6): the static frame is on the canvas before any observer reports.
    layout()
    draw()

    // Req 10: the strip under the sticky site header counts as off-screen. Only this callback starts the loop.
    const header = document.querySelector<HTMLElement>('body > header')
    const headerHeight = header ? header.offsetHeight : 0
    const io = new IntersectionObserver(
        (entries) => {
            if (disposed) return
            heroVisible = entries[entries.length - 1].isIntersecting
            update()
        },
        { rootMargin: `-${headerHeight}px 0px 0px 0px` },
    )
    io.observe(section)

    // Req 3, 11: page visibility and the back/forward cache.
    const onVisibility = () => {
        pageVisible = !document.hidden
        update()
    }
    const onPageHide = () => {
        pageVisible = false
        update()
    }
    const onPageShow = () => {
        pageVisible = !document.hidden
        update()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)
    window.addEventListener('pageshow', onPageShow)

    // Req 18: theme toggle (class on <html>) and OS appearance changes.
    const themeObserver = new MutationObserver(onTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
    darkQuery.addEventListener('change', onTheme)

    // Resize and late web fonts move the text, so the boxes are re-measured.
    const resizeObserver = new ResizeObserver(relayout)
    resizeObserver.observe(section)
    document.fonts.ready.then(relayout)

    // Req 12: everything above is removed; disposed stops fonts.ready and any callback already queued.
    return () => {
        disposed = true
        pause()
        io.disconnect()
        themeObserver.disconnect()
        resizeObserver.disconnect()
        darkQuery.removeEventListener('change', onTheme)
        document.removeEventListener('visibilitychange', onVisibility)
        window.removeEventListener('pagehide', onPageHide)
        window.removeEventListener('pageshow', onPageShow)
    }
}
