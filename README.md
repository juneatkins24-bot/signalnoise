# Signal / Noise
### A brand culture game by Herwood Creative

Swipe right for SIGNAL. Swipe left for NOISE. Real Wikipedia data, Claude analysis.

---

## Deploy to Vercel in 4 steps

**1. Install dependencies**
```
npm install
```

**2. Push to GitHub**
```
git init
git add .
git commit -m "signal noise"
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

**3. Import to Vercel**
- Go to vercel.com → New Project → Import your repo
- In Environment Variables, add:
  - `ANTHROPIC_API_KEY` → your Anthropic API key

**4. Deploy**
Hit Deploy. Live in ~60 seconds.

---

## Run locally
```
cp .env.example .env.local
# add your ANTHROPIC_API_KEY to .env.local
npm run dev
```
Open http://localhost:3000

---

## Built with
- Next.js 14 App Router
- Wikipedia Pageviews API (real data, no key needed)
- Anthropic Claude (brand analysis + archetype assignment)
- Clearbit Logo API (brand logos, no key needed)
