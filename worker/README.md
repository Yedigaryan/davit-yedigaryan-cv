# cv-telegram-fallback

Cloudflare Worker that relays visitor messages from the CV chat widget
to a private Telegram group when the primary LLM gateway is offline
(laptop sleeping, Tailscale down, Render cold-starting too long, etc.).

The bot token lives only as a Worker secret — it never ships to the
browser.

## One-time setup

### 1. Create the Telegram bot

1. Open Telegram, message `@BotFather`, send `/newbot`.
2. Pick a display name and a username ending in `bot`.
3. Copy the token BotFather returns. This is your `TELEGRAM_BOT_TOKEN`.

### 2. Create the destination group

1. Create a new private group in Telegram (e.g. "CV site — visitor messages").
2. Add the bot to the group as a member.
3. Send any message in the group, then open in a browser:
   `https://api.telegram.org/bot<TOKEN>/getUpdates`
4. Find `"chat":{"id":-1001234567890,...}` — the negative number is your
   `TELEGRAM_CHAT_ID`. (Alternative: add `@RawDataBot` to the group and
   it echoes the chat ID, then remove it.)

### 3. Sanity-check from a terminal

```
curl "https://api.telegram.org/bot<TOKEN>/sendMessage" \
  -d "chat_id=<CHAT_ID>&text=hello"
```

You should see "hello" appear in the group.

### 4. Deploy the Worker

```
cd worker
pnpm install                                # or npm install
npx wrangler login                          # one-time
npx wrangler secret put TELEGRAM_BOT_TOKEN  # paste token at prompt
npx wrangler secret put TELEGRAM_CHAT_ID    # paste chat id at prompt
npx wrangler deploy
```

Wrangler prints the deployed URL, e.g.
`https://cv-telegram-fallback.<your-subdomain>.workers.dev`.

### 5. Wire it into the static site

Add to `.env.local` at the repo root (not in `worker/`):

```
NEXT_PUBLIC_TELEGRAM_FALLBACK_URL="https://cv-telegram-fallback.<your-subdomain>.workers.dev"
```

Rebuild and redeploy the static site so the env var bakes into the bundle.

## Updating the origin allowlist

Edit `ALLOWED_ORIGINS` in `wrangler.toml` and `npx wrangler deploy` again.
Format: comma-separated, no trailing slashes, scheme included.

## Local dev

```
npx wrangler dev
```

Worker runs on `http://localhost:8787`. Point the site at it by setting
`NEXT_PUBLIC_TELEGRAM_FALLBACK_URL=http://localhost:8787` in `.env.local`.
`localhost:3000` is already in the default `ALLOWED_ORIGINS`.

## Notes

- Origin allowlist is the primary defense; Telegram-side rate limits
  (~30 msg/sec per bot) are the backstop. If abuse becomes real, add a
  Cloudflare Turnstile check in the frontend form.
- Max payload sizes enforced in the Worker: message 4000 chars,
  contact 200 chars. Mirror these in the frontend form.
- The Worker does not log message contents; only failures hit
  `console.error` and surface via `wrangler tail`.
