// Server-side proxy for Wikipedia API calls — bypasses CORS
// Fetches both the summary (image + description) and 7-day pageviews in parallel

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const article = searchParams.get("article");

  if (!article) {
    return Response.json({ image: null, description: null, total: 0, trend: "flat" });
  }

  const encoded = encodeURIComponent(article);
  const headers = {
    "User-Agent": "HerwoodSignalNoise/1.0 (https://herwoodcreative.com)",
    "Accept": "application/json",
  };

  // Build pageviews date range
  const end = new Date();
  const start = new Date(end - 7 * 86400000);
  const fmt = d => d.toISOString().slice(0, 10).replace(/-/g, "");

  try {
    const [summaryRes, viewsRes] = await Promise.all([
      fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`, { headers }),
      fetch(
        `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encoded}/daily/${fmt(start)}/${fmt(end)}`,
        { headers }
      ),
    ]);

    let image = null;
    let description = null;

    if (summaryRes.ok) {
      const s = await summaryRes.json();
      // Prefer originalimage (full res) over thumbnail
      image = s?.originalimage?.source || s?.thumbnail?.source || null;
      description = s?.description || null;
    }

    let total = 0;
    let trend = "flat";

    if (viewsRes.ok) {
      const v = await viewsRes.json();
      if (v.items) {
        const views = v.items.map(i => i.views);
        total = views.reduce((a, b) => a + b, 0);
        const first = views.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
        const last  = views.slice(-3).reduce((a, b) => a + b, 0) / 3;
        trend = last > first * 1.15 ? "up" : last < first * 0.85 ? "down" : "flat";
      }
    }

    return Response.json({ image, description, total, trend });
  } catch (e) {
    console.error("Wiki proxy error:", e);
    return Response.json({ image: null, description: null, total: 0, trend: "flat" });
  }
}
