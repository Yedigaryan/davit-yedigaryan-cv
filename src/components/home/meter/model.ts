// Pure meter model for the home hero (spec 007 Req 1-6a, 13-15).
// No imports and only erasable TypeScript, so it type-checks under the repo tsconfig
// and runs under node --experimental-strip-types for the model tests.

export const CAPACITY = 240
export const CEILING_MS = 50
export const SMOOTHING = 0.1
export const LONG_TASK_WINDOW_MS = 10_000

export interface FrameSampler {
    tick(now: number): void
    restart(): void
    /** Oldest to newest, at most `capacity` long. Real frame times, never clamped or smoothed. */
    samples(): number[]
    smoothed(): number | null
}

/**
 * Req 3: the first tick after creation or restart only stores its timestamp, the delta at the
 * second tick is discarded, and the delta at the third tick is the first stored sample.
 * restart() keeps the stored samples (plan Ruling 11) and resets only the timestamps.
 */
export function createFrameSampler(capacity: number): FrameSampler {
    let buffer: number[] = []
    let last: number | null = null
    let skip = 0
    let average: number | null = null

    return {
        tick(now) {
            if (last === null) {
                last = now
                skip = 1
                return
            }
            const delta = now - last
            last = now
            if (skip > 0) {
                skip -= 1
                return
            }
            buffer.push(delta)
            if (buffer.length > capacity) buffer = buffer.slice(buffer.length - capacity)
            average = average === null ? delta : average + (delta - average) * SMOOTHING
        },
        restart() {
            last = null
            skip = 0
        },
        samples() {
            return buffer.slice()
        },
        smoothed() {
            return average
        },
    }
}

export interface LongTaskWindow {
    add(startTime: number): void
    count(now: number): number
    clear(): void
}

/** Req 5: a long task counts while startTime > now - windowMs, so it leaves at startTime + windowMs. */
export function createLongTaskWindow(windowMs: number): LongTaskWindow {
    let starts: number[] = []

    return {
        add(startTime) {
            starts.push(startTime)
        },
        count(now) {
            starts = starts.filter((start) => start > now - windowMs)
            return starts.length
        },
        clear() {
            starts = []
        },
    }
}

/** Req 4, 6a: one decimal, a hyphen when there is no value. */
export function formatFrame(ms: number | null): string {
    return ms === null || !Number.isFinite(ms) ? '-' : `${ms.toFixed(1)} ms`
}

/** Req 4, 6a: 1000 / frame time, whole number; a hyphen unless the frame time is finite and above 0. */
export function formatRate(ms: number | null): string {
    return ms === null || !Number.isFinite(ms) || ms <= 0 ? '-' : `${Math.round(1000 / ms)} fps`
}

/** Req 6: null means the browser does not support longtask, shown as a hyphen, never 0. */
export function formatLongTasks(count: number | null): string {
    return count === null ? '-' : String(count)
}

export type MeterMode = 'full' | 'static' | 'phone' | 'off'

/** Req 13-15: wide + motion is full, wide + reduced motion is static, narrow + motion is phone, narrow + reduced motion is off. */
export function meterMode(wide: boolean, reducedMotion: boolean): MeterMode {
    if (wide) return reducedMotion ? 'static' : 'full'
    return reducedMotion ? 'off' : 'phone'
}

/** Req 1: 0 ms sits at the bottom of the band; the ceiling cuts only the drawing, never the stored sample. */
export function traceY(ms: number, top: number, height: number, ceilingMs: number): number {
    const clamped = Math.min(Math.max(ms, 0), ceilingMs)
    return top + height - (clamped / ceilingMs) * height
}
