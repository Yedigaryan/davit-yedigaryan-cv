# davit-yedigaryan-cv

Personal CV site at [davit.yedigaryan.pro](https://davit.yedigaryan.pro) — and
the public LLM-API gateway behind the on-page chat widget.

> Last gateway redeploy trigger: **2026-05-02**.
> Bump this date and `git push` to force Render to rebuild the gateway,
> which mints a fresh Tailscale identity in the container.

## What ships from this repo

| Layer            | Lives in                  | Hosted on             | Build / deploy                      |
| ---------------- | ------------------------- | --------------------- | ----------------------------------- |
| Static CV site   | `src/`, `public/`         | name.am (Apache)      | `pnpm run build` → rsync `out/`     |
| LLM gateway      | `gateway/` + `render.yaml`| Render Free (Docker)  | git push → Render auto-deploy       |
| Inference        | local M1 Pro              | the laptop itself     | Ollama (Metal GPU) + tailnet bind   |

The static site is a `next export` build (Apache-friendly, no Node runtime
needed at the edge). The chat widget is provider-agnostic — it POSTs an
OpenAI-shaped body to whatever URL `NEXT_PUBLIC_CHAT_API_URL` points at,
which is the Render gateway in production.

## Architecture

```
chat widget on davit.yedigaryan.pro      (static, name.am Apache)
        │  POST /v1/chat/completions
        │  Authorization: Bearer $LLM_API_TOKEN
        ▼
https://cv-llm-gateway.onrender.com      (Render Free, Docker)
        │  Caddy
        │  ├── /health         → 200       (Render orchestration probe)
        │  ├── @authorized     → reverse_proxy
        │  └── otherwise       → 401
        ▼
Tailscale (userspace, SOCKS5 :1055 inside the container)
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

## Deployment guides

- **[`DEPLOY-NAME-AM.md`](./DEPLOY-NAME-AM.md)** — static-site deploy to
  name.am free hosting, including the `.htaccess` rewrite rules that make
  deep links survive a refresh on Apache.
- **[`DEPLOY-RENDER-GATEWAY.md`](./DEPLOY-RENDER-GATEWAY.md)** — Render
  Blueprint apply, Tailscale auth-key minting, Ollama setup on the M1 Pro
  (Metal GPU + launchd plist), four-layer end-to-end verification, and
  free-tier honesty around cold starts.

## Forcing a fresh Render deploy

Render auto-deploys when **any** commit lands on the watched branch. The
intentional trigger pattern: bump the date stamp at the top of this README
and push.

```bash
# Edit the "Last gateway redeploy trigger" line above to today's date.
git add README.md
git commit -m "redeploy: refresh Tailscale identity"
git push
```

Why this works: every Render container restart spawns a new `tailscaled`
process, which calls `tailscale up --auth-key=$TAILSCALE_AUTHKEY`. A
*reusable* auth key permits this; the new container joins the tailnet with
a fresh `100.x.y.z` IP. Useful when:

- Tailscale shows a stale / unreachable `cv-llm-gateway-*` entry in
  <https://login.tailscale.com/admin/machines>.
- The gateway is 502'ing despite the laptop being healthy on the tailnet.
- You rotated `LLM_API_TOKEN` and want the secret picked up immediately.

Watch the redeploy in real time: Render dashboard → `cv-llm-gateway` →
**Logs**. Look for `Tailnet IP: 100.x.y.z` (must not be `NONE`) before
testing.

## Repository layout

```
davit-yedigaryan-cv/
├── src/                          # Next.js App Router
│   ├── app/                      # routes (about, contact, experience, projects, skills)
│   ├── components/               # LlmChat, ContactForm, Header, Footer, ...
│   └── lib/data.ts               # personalInfo, experiences, projects, skills
├── public/
│   ├── images/                   # logos, headshot, project screenshots
│   └── .htaccess                 # Apache rewrite rules — copied into out/ on build
├── gateway/                      # Render Docker service (Caddy + Tailscale)
│   ├── Dockerfile
│   ├── Caddyfile
│   ├── run.sh
│   └── README.md
├── ollama/
│   └── dev.local.ollama.plist    # launchd template for the M1 Pro
├── render.yaml                   # Render Blueprint (defines the gateway service)
├── DEPLOY-NAME-AM.md
├── DEPLOY-RENDER-GATEWAY.md
└── .env.example
```

## Tech stack

- **Next.js 15** (App Router, static export via `output: 'export'`)
- **Tailwind CSS 4**, **next-themes** for light/dark
- **framer-motion** for the chat panel and hero animations
- **Caddy 2** + **Tailscale** (userspace networking) on Alpine, deployed
  to Render
- **Ollama** with Apple **Metal Performance Shaders** acceleration on the
  M1 Pro
