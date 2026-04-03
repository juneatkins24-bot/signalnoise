# Signal / Noise
### A brand culture game by Herwood Creative

Swipe right for SIGNAL. Swipe left for NOISE.

Each card shows the brand's real Wikipedia photo — Rare Beauty shows Selena Gomez, WNBA shows a game photo, Liquid Death shows the can. Real brand imagery from Wikipedia, no API key needed.

---

## What powers each card

- **Wikipedia Summary API** — pulls the main article photo + brand description. No key required.
- **Wikipedia Pageviews API** — real 7-day traffic data for the heat score
- **Product Hunt API** — today's top launches inject at the front of the deck with live vote counts
- **Claude** — assigns each brand to one of The Company's 7 archetypes and writes the verdict

---

## Deploy to Vercel

**Step 1 — Get your keys**

*Anthropic (required):*
- console.anthropic.com → API Keys

*Product Hunt (optional — for live launches):*
- producthunt.com/v2/oauth/applications → Add Application
- Redirect URI: https://localhost:3000
- Copy API Key + API Secret

**Step 2 — Push to GitHub**
```bash
git init && git add . && git commit -m "signal noise"
git remote add origin YOUR_GITHUB_REPO
git push -u origin main
```

**Step 3 — Import to Vercel**
- vercel.com → New Project → Import
- Add environment variables:
  - `ANTHROPIC_API_KEY` (required)
  - `PH_CLIENT_ID` (optional)
  - `PH_CLIENT_SECRET` (optional)

---

## Run locally
```bash
cp .env.example .env.local
# fill in your keys
npm install && npm run dev
```
