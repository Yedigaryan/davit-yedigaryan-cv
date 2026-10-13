#!/usr/bin/env node
// Spec 010: outline Fraunces italic into the "DY" of the B2 chip mark, then
// render the favicon, apple icon and OG image (public/og.png) from the same
// path data. Run by hand from the repo root, never from the build:
//   node scripts/logo/build-logo.mjs [path/to/Fraunces-Italic.ttf]
// Without a path the pinned font is downloaded. Either way its SHA-256 must match.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import * as fontkit from 'fontkit'
import { Resvg } from '@resvg/resvg-js'
import pngToIco from 'png-to-ico'

const FONT_URL =
    'https://raw.githubusercontent.com/google/fonts/4024282d9b0cffcdb8e3024560862746178d741f/ofl/fraunces/Fraunces-Italic%5BSOFT%2CWONK%2Copsz%2Cwght%5D.ttf'
const FONT_SHA256 = 'b24448c43702fac4ee856781d461a0dfba8d8e594b6e8e190234b75fed2c0e01'

// Raster colours (the light chip on paper). The header colours the chip with
// CSS tokens instead, so none of these reach logo-paths.ts.
const INK = '#15130F'
const ACCENT = '#9A5B06'
const PAPER = '#F4F1EA'

// Chip shapes, verbatim from the B2 reference markup in spec 010 (100-unit space).
const PINS = 'M35 20V8M65 20V8M35 80V92M65 80V92M20 35H8M20 65H8M80 35H92M80 65H92'
const BLOCK_S = 'M8 8H38A12 12 0 0 0 62 8H92V92H8Z'
const CHIP = {
    L: { notch: 'M41 20A9 9 0 0 0 59 20Z', body: 'M20 20H43A7 7 0 0 0 57 20H80V80H20Z', stroke: 5 },
    M: { notch: 'M40 20A10 10 0 0 0 60 20Z', body: 'M20 20H42A8 8 0 0 0 58 20H80V80H20Z', stroke: 7 },
}

// The reference <text> of each size, in user units. opsz defaults to the
// user-unit font-size (spec 010 Req 1, checked by the Req 4 overlay).
const SETS = {
    L: { use: 'header, apple icon, OG', wght: 600, opsz: 30, size: 30, spacing: -1.5, baseline: 61 },
    M: { use: '32px favicon, script only', wght: 700, opsz: 34, size: 34, spacing: -2, baseline: 63 },
    S: { use: '16px favicon, script only', wght: 700, opsz: 46, size: 46, spacing: -3, baseline: 70 },
}
// How Chrome lays out the reference text (Req 1 defaults; the Req 4 overlay may flip them).
const ANCHOR_X = 47
const TRAILING_SPACING_IN_WIDTH = true
const KERNING = true

const round = (n) => {
    const r = Math.round(n * 100) / 100
    return Object.is(r, -0) ? '0' : String(r)
}

async function loadFont(path) {
    let buf
    if (path) {
        buf = readFileSync(path)
    } else {
        const res = await fetch(FONT_URL)
        if (!res.ok) throw new Error(`font download failed: HTTP ${res.status}`)
        buf = Buffer.from(await res.arrayBuffer())
    }
    const sha = createHash('sha256').update(buf).digest('hex')
    if (sha !== FONT_SHA256) throw new Error(`font SHA-256 ${sha} does not match the pinned ${FONT_SHA256}`)
    return fontkit.create(buf)
}

// "DY" as SVG path data in the chip space, laid out like an SVG <text>:
// letter-spacing after every glyph, the run centred on ANCHOR_X
// (text-anchor="middle"), glyphs on the given baseline.
function outline(font, set) {
    const axes = {}
    for (const [tag, axis] of Object.entries(font.variationAxes)) axes[tag] = axis.default
    axes.wght = set.wght
    axes.opsz = set.opsz
    const inst = font.getVariation(axes)
    const run = inst.layout('DY', KERNING ? [] : { kern: false })
    const scale = set.size / inst.unitsPerEm
    const advances = run.positions.map((p) => p.xAdvance * scale + set.spacing)
    const width = advances.reduce((a, b) => a + b, 0) - (TRAILING_SPACING_IN_WIDTH ? 0 : set.spacing)
    let x = ANCHOR_X - width / 2
    const parts = []
    run.glyphs.forEach((glyph, i) => {
        const p = run.positions[i]
        const path = glyph.path.transform(scale, 0, 0, -scale, x + p.xOffset * scale, set.baseline - p.yOffset * scale)
        parts.push(path.toSVG())
        x += advances[i]
    })
    const d = parts.join('').replace(/-?\d+(\.\d+)?(e-?\d+)?/g, (n) => round(Number(n)))
    return { d, axes }
}

const chip = (size, glyphs) => {
    const c = CHIP[size]
    return (
        `<path d="${c.notch}" fill="${ACCENT}"/>` +
        `<path d="${c.body}" fill="none" stroke="${INK}" stroke-width="${c.stroke}"/>` +
        `<path d="${PINS}" fill="none" stroke="${INK}" stroke-width="${c.stroke}" stroke-linecap="square"/>` +
        `<path d="${glyphs}" fill="${INK}"/>`
    )
}

// The 16px frame: the solid notched block with "DY" knocked out to the paper.
const block = (glyphs) => `<path d="${BLOCK_S}" fill="${INK}"/><path d="${glyphs}" fill="${PAPER}"/>`

// A w x h paper rectangle with the 100-unit box drawn `box` px wide and centred.
const onPaper = (w, h, box, inner) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">` +
    `<rect width="${w}" height="${h}" fill="${PAPER}"/>` +
    `<g transform="translate(${(w - box) / 2} ${(h - box) / 2}) scale(${box / 100})">${inner}</g></svg>`

// Every raster must be fully opaque (Req 16, 19, 22).
const png = (svg) => {
    const img = new Resvg(svg, { font: { loadSystemFonts: false } }).render()
    const px = img.pixels // a getter that copies; read it once
    for (let i = 3; i < px.length; i += 4) {
        if (px[i] !== 255) throw new Error('transparent pixel in a raster that must be opaque')
    }
    return Buffer.from(img.asPng())
}

const font = await loadFont(process.argv[2])
const g = Object.fromEntries(Object.entries(SETS).map(([k, set]) => [k, outline(font, set)]))
const setNote = (k) => {
    const s = SETS[k]
    const axes = Object.entries(g[k].axes).map(([t, v]) => `${t}=${v}`).join(' ')
    return `Set ${k} (${s.use}): "DY" ${axes}, font-size ${s.size}, letter-spacing ${s.spacing}, baseline ${s.baseline}`
}

// Render everything before writing anything, so a failure leaves the old files.
const ico = await pngToIco([png(onPaper(16, 16, 16, block(g.S.d))), png(onPaper(32, 32, 30, chip('M', g.M.d)))])
const apple = png(onPaper(180, 180, 140, chip('L', g.L.d)))
const og = png(onPaper(1200, 630, 280, chip('L', g.L.d)))

writeFileSync(
    'src/lib/logo-paths.ts',
    `// Generated by scripts/logo/build-logo.mjs, do not edit (spec 010).
// Font: ${FONT_URL}
// SHA-256: ${FONT_SHA256}
// ${setNote('L')}
// ${setNote('M')}
// ${setNote('S')}
// Layout: text-anchor middle at x ${ANCHOR_X}; trailing letter-spacing in the centred width: ${TRAILING_SPACING_IN_WIDTH ? 'yes' : 'no'}; kerning: ${KERNING ? 'on' : 'off'}
// Size-L chip shapes from the B2 reference, 100-unit space. No colours: the
// header colours the chip with CSS tokens (spec 010 Req 8).

export const CHIP_NOTCH = '${CHIP.L.notch}'
export const CHIP_BODY = '${CHIP.L.body}'
export const CHIP_PINS = '${PINS}'
export const CHIP_STROKE = ${CHIP.L.stroke}
export const GLYPHS_L = '${g.L.d}'
`,
)
writeFileSync('src/app/favicon.ico', ico)
writeFileSync('src/app/apple-icon.png', apple)
writeFileSync('public/og.png', og)
console.log('wrote src/lib/logo-paths.ts, src/app/favicon.ico, src/app/apple-icon.png, public/og.png')
