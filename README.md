# davit-yedigaryan-cv

Personal CV site at [davit.yedigaryan.pro](https://davit.yedigaryan.pro). A
static `next export` build (Apache-friendly, no Node runtime needed) plus a
provider-agnostic LLM chat widget that POSTs to whatever URL
`NEXT_PUBLIC_CHAT_API_URL` points at.

## What ships from this repo

| Layer            | Lives in                  | Hosted on             | Build / deploy                      |
| ---------------- | ------------------------- | --------------------- | ----------------------------------- |
| Static CV site   | `src/`, `public/`         | name.am (Apache)      | `pnpm run build` → rsync `out/`     |

The chat widget's backend (Caddy + Tailscale gateway on Render → Ollama on
the M1 Pro) lives in a **separate repository**:
[`yedigaryan-cv-gateway`](https://github.com/Yedigaryan/yedigaryan-cv-gateway).
That repo carries its own `render.yaml`, Dockerfile, deploy guide, and the
Ollama launchd plist.

## Architecture (end-to-end)

```
chat widget on davit.yedigaryan.pro      (this repo, name.am Apache, static)
        │  POST /v1/chat/completions
        │  Authorization: Bearer $LLM_API_TOKEN
        ▼
https://cv-llm-gateway.onrender.com      (yedigaryan-cv-gateway repo, Render Free)
        │  Caddy + socat + Tailscale
        ▼
<MacBook tailnet IP>:11434               (M1 Pro, Ollama bound on 0.0.0.0)
        ▼
ollama serve  →  Metal GPU
```

## Local development

```bash
pnpm install
pnpm run dev
```

Open <http://localhost:3000>.

For the chat widget to function locally you need a `.env.local` next to
`package.json` — see `.env.example` for the four `NEXT_PUBLIC_CHAT_*` vars.
Without them the widget loads but renders an "unconfigured" notice instead
of dispatching requests.

## Deployment

The static site ships to **name.am free hosting** (Apache) via FTP —
no git involvement on the hosting side. Use the bundled `deploy.sh`,
which builds the static export and syncs `out/` to `/public_html` via
`lftp`.

```bash
pnpm deploy            # build + sync
pnpm deploy:dry        # show plan (nothing uploaded / deleted)
pnpm deploy:fast       # sync existing out/ without rebuilding
```

**One-time setup** (stashes the FTP password in macOS Keychain so the
script picks it up silently on every deploy):

```bash
brew install lftp
security add-internet-password -s ftp.yedigaryan.pro -a dzdave -w -U
# Paste the password when prompted; -U updates an existing entry.
```

The script also accepts an `FTP_PASSWORD` env var or falls back to an
interactive prompt — see `deploy.sh --help` for all flags.

For the LLM gateway (Render service) and the Ollama-on-M1-Pro setup,
see the **gateway repo's `DEPLOY.md`** —
<https://github.com/Yedigaryan/yedigaryan-cv-gateway/blob/main/DEPLOY.md>.

`NEXT_PUBLIC_*` values are inlined into the JS bundle at build time —
that's the only way they reach the browser on a static deploy. After
changing any chat env var in `.env.local`, run `pnpm deploy` again so
the new values land in the bundle that ships to the CDN.

## Repository layout

```
davit-yedigaryan-cv/
├── src/                          # Next.js App Router
│   ├── app/                      # routes (about, contact, experience, projects, skills)
│   ├── components/               # LlmChat, ContactForm, Header, Footer, ...
│   └── lib/                      # personalInfo, llm-chat helper
├── public/
│   ├── images/                   # logos, headshot, project screenshots
│   └── .htaccess                 # Apache rewrite rules — copied into out/ on build
├── DEPLOY-NAME-AM.md
└── .env.example
```

## Tech stack

- **Next.js 15** (App Router, static export via `output: 'export'`)
- **Tailwind CSS 4**, **next-themes** for light/dark
- **framer-motion** for the chat panel and hero animations
- **react-icons** (Font Awesome family)
