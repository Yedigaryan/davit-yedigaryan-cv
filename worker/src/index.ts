// Cloudflare Worker: relays visitor messages from the CV site's chat
// widget to a private Telegram group when the primary LLM gateway is
// offline. Holds the bot token server-side so it never ships in the
// browser bundle.
//
// Required secrets (set via `wrangler secret put`):
//   - TELEGRAM_BOT_TOKEN
//   - TELEGRAM_CHAT_ID
//
// Required vars (set in wrangler.toml [vars]):
//   - ALLOWED_ORIGINS (comma-separated)

export interface Env {
    TELEGRAM_BOT_TOKEN: string
    TELEGRAM_CHAT_ID: string
    ALLOWED_ORIGINS: string
}

interface Payload {
    message?: unknown
    contact?: unknown
    pageUrl?: unknown
    userAgent?: unknown
}

const MAX_MESSAGE = 4000
const MAX_CONTACT = 200

const json = (data: unknown, status: number, cors: Record<string, string>) =>
    new Response(JSON.stringify(data), {
        status,
        headers: { 'content-type': 'application/json', ...cors },
    })

const corsHeaders = (origin: string | null, allowed: string[]): Record<string, string> => {
    if (origin && allowed.includes(origin)) {
        return {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'content-type',
            'Access-Control-Max-Age': '86400',
            Vary: 'Origin',
        }
    }
    return {}
}

const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

export default {
    async fetch(req: Request, env: Env): Promise<Response> {
        const origin = req.headers.get('Origin')
        const allowed = env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
        const cors = corsHeaders(origin, allowed)

        if (req.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors })
        }
        if (req.method !== 'POST') {
            return json({ error: 'method not allowed' }, 405, cors)
        }
        if (!origin || !allowed.includes(origin)) {
            return json({ error: 'origin not allowed' }, 403, {})
        }

        let body: Payload
        try {
            body = (await req.json()) as Payload
        } catch {
            return json({ error: 'invalid json' }, 400, cors)
        }

        const message = typeof body.message === 'string' ? body.message.trim() : ''
        const contact = typeof body.contact === 'string' ? body.contact.trim() : ''
        const pageUrl = typeof body.pageUrl === 'string' ? body.pageUrl.slice(0, 500) : ''
        const userAgent = typeof body.userAgent === 'string' ? body.userAgent.slice(0, 300) : ''

        if (!message) return json({ error: 'message required' }, 400, cors)
        if (message.length > MAX_MESSAGE) return json({ error: 'message too long' }, 400, cors)
        if (contact.length > MAX_CONTACT) return json({ error: 'contact too long' }, 400, cors)

        const text =
            `<b>CV site — chat fallback</b>\n` +
            `<b>Message:</b>\n${escape(message)}\n\n` +
            (contact ? `<b>Contact:</b> ${escape(contact)}\n` : '') +
            (pageUrl ? `<b>Page:</b> ${escape(pageUrl)}\n` : '') +
            (userAgent ? `<b>UA:</b> ${escape(userAgent)}` : '')

        const tgRes = await fetch(
            `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    chat_id: env.TELEGRAM_CHAT_ID,
                    text,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true,
                }),
            },
        )

        if (!tgRes.ok) {
            const errText = await tgRes.text().catch(() => '')
            console.error('telegram api error', tgRes.status, errText)
            return json({ error: 'relay failed' }, 502, cors)
        }

        return json({ ok: true }, 200, cors)
    },
}
