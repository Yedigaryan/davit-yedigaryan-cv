// Canvas drawing for the home hero meter (spec 007 Req 1, 7, 8, 18; plan Rulings 1, 6, 9).
// Colours come only from the existing tokens on <html>; clearing is clearRect only.

import { CAPACITY, CEILING_MS, traceY } from './model'

/** CSS px, relative to the canvas's top-left corner. */
export type Box = { x: number; y: number; w: number; h: number }

const GRID_PX = 32
const LINE_WIDTH = 1.25
const CLEAR_PAD = 4

/** Req 18: grid in the border token, lines in the primary button token, re-read on every theme change. */
export function readMeterColours(): { grid: string; line: string } {
    const style = getComputedStyle(document.documentElement)
    return {
        grid: style.getPropertyValue('--border-color').trim(),
        line: style.getPropertyValue('--button-primary-bg').trim(),
    }
}

/** Sizes the backing store to the CSS box times devicePixelRatio. Setting the size wipes the bitmap. */
export function fitCanvas(canvas: HTMLCanvasElement): number {
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    const width = Math.max(1, Math.round(rect.width * dpr))
    const height = Math.max(1, Math.round(rect.height * dpr))
    if (canvas.width !== width) canvas.width = width
    if (canvas.height !== height) canvas.height = height
    return dpr
}

/** 32px squares, one path, one stroke. Lines sit on half pixels so a 1px line covers whole device rows at dpr 1 and 2. */
export function drawGrid(ctx: CanvasRenderingContext2D, w: number, h: number, colour: string, alpha: number): void {
    ctx.beginPath()
    for (let x = GRID_PX; x < w; x += GRID_PX) {
        ctx.moveTo(x + 0.5, 0)
        ctx.lineTo(x + 0.5, h)
    }
    for (let y = GRID_PX; y < h; y += GRID_PX) {
        ctx.moveTo(0, y + 0.5)
        ctx.lineTo(w, y + 0.5)
    }
    ctx.globalAlpha = alpha
    ctx.strokeStyle = colour
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.globalAlpha = 1
}

/** Req 1, 2, 7: one point per stored sample, newest at the band's right edge; the ceiling cuts only the drawing. */
export function drawTrace(ctx: CanvasRenderingContext2D, samples: number[], band: Box, colour: string, alpha: number): void {
    if (samples.length < 2) return
    const step = band.w / (CAPACITY - 1)
    const right = band.x + band.w
    const last = samples.length - 1
    ctx.beginPath()
    for (let i = 0; i <= last; i++) {
        const x = right - (last - i) * step
        const y = traceY(samples[i], band.y, band.h, CEILING_MS)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
    }
    ctx.globalAlpha = alpha
    ctx.strokeStyle = colour
    ctx.lineWidth = LINE_WIDTH
    ctx.lineJoin = 'round'
    ctx.stroke()
    ctx.globalAlpha = 1
}

/**
 * Ruling 1: the boxes the canvas is cleared behind, padded 4px.
 * Text-line boxes (Ruling 5) for the figure captions and the captionClass paragraphs (00 / Index, the location
 * line, and also the Fig. 0 caption, which carries captionClass too); element boxes for [data-meter-clear].
 */
export function measureClearBoxes(section: HTMLElement, canvas: HTMLElement): Box[] {
    const origin = canvas.getBoundingClientRect()
    const boxes: Box[] = []
    const push = (r: DOMRect) => {
        if (r.width <= 0 || r.height <= 0) return
        boxes.push({
            x: r.left - origin.left - CLEAR_PAD,
            y: r.top - origin.top - CLEAR_PAD,
            w: r.width + CLEAR_PAD * 2,
            h: r.height + CLEAR_PAD * 2,
        })
    }
    const range = document.createRange()
    section.querySelectorAll('figcaption, p.uppercase').forEach((el) => {
        range.selectNodeContents(el)
        Array.from(range.getClientRects()).forEach(push)
    })
    section.querySelectorAll('[data-meter-clear]').forEach((el) => push(el.getBoundingClientRect()))
    return boxes
}

export function clearBoxes(ctx: CanvasRenderingContext2D, boxes: Box[]): void {
    for (const b of boxes) ctx.clearRect(b.x, b.y, b.w, b.h)
}
