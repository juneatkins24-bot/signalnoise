"use client";
import { useState, useEffect, useCallback, useRef } from "react";

const CAST = [
  { letter: "H", name: "Hugo",   hex: "#1A3D52", word: "MYTHIC" },
  { letter: "E", name: "Ellis",  hex: "#B83A2A", word: "GROUNDED" },
  { letter: "R", name: "Rex",    hex: "#4A7A9A", word: "BURNING" },
  { letter: "W", name: "Wren",   hex: "#8C2A1C", word: "ELECTRIC" },
  { letter: "O", name: "Odette", hex: "#A8C4E0", word: "UNTOUCHABLE" },
  { letter: "O", name: "Otto",   hex: "#C84A38", word: "WARM" },
  { letter: "D", name: "Dot",    hex: "#2A5A7A", word: "BECOMING" },
];

const BRANDS = [
  { name: "Rhode",        wiki: "Rhode_(brand)",                             domain: "rhode.com",       bg: "#F5EDE6" },
  { name: "Poppi",        wiki: "Poppi_(drink)",                             domain: "drinkpoppi.com",  bg: "#F5D5B0" },
  { name: "Liquid Death", wiki: "Liquid_Death",                              domain: "liquiddeath.com", bg: "#1A1A2E" },
  { name: "Skims",        wiki: "Skims",                                     domain: "skims.com",       bg: "#C8B49A" },
  { name: "Rare Beauty",  wiki: "Rare_Beauty",                               domain: "rarebeauty.com",  bg: "#E8C0CC" },
  { name: "Jacquemus",    wiki: "Jacquemus",                                 domain: "jacquemus.com",   bg: "#E8D5B0" },
  { name: "Erewhon",      wiki: "Erewhon_(market)",                          domain: "erewhon.com",     bg: "#C8D8B0" },
  { name: "WNBA",         wiki: "Women%27s_National_Basketball_Association", domain: "wnba.com",        bg: "#F5A050" },
  { name: "Olipop",       wiki: "Olipop_(drink)",                            domain: "drinkolipop.com", bg: "#D0E8B8" },
  { name: "Duolingo",     wiki: "Duolingo",                                  domain: "duolingo.com",    bg: "#E8F5D0" },
  { name: "Gymshark",     wiki: "Gymshark",                                  domain: "gymshark.com",    bg: "#1A1A1A" },
  { name: "Stanley",      wiki: "Stanley_(brand)",                           domain: "stanley1913.com", bg: "#4A7A5A" },
];

async function fetchWiki(article) {
  const end = new Date();
  const start = new Date(end - 7 * 86400000);
  const fmt = d => d.toISOString().slice(0,10).replace(/-/g,"");
  try {
    const res = await fetch(
      `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/all-agents/${encodeURIComponent(article)}/daily/${fmt(start)}/${fmt(end)}`,
      { headers: { "User-Agent": "HerwoodSignalNoise/1.0" } }
    );
    const data = await res.json();
    if (!data.items) return { total: 0, trend: "flat" };
    const views = data.items.map(i => i.views);
    const total = views.reduce((a, b) => a + b, 0);
    const first = views.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
    const last  = views.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const trend = last > first * 1.15 ? "up" : last < first * 0.85 ? "down" : "flat";
    return { total, trend };
  } catch { return { total: 0, trend: "flat" }; }
}

function heatScore(total, trend) {
  const s = Math.min(80, Math.round((Math.log1p(total) / Math.log1p(100000)) * 80));
  return trend === "up" ? Math.min(100, s + 10) : trend === "down" ? Math.max(0, s - 10) : s;
}

function getHeatLabel(s) {
  if (s >= 85) return "SCORCHING";
  if (s >= 70) return "HOT";
  if (s >= 55) return "WARM";
  if (s >= 40) return "TEPID";
  return "COOLING";
}

async function getBrandTake(brand) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 200,
      messages: [{
        role: "user",
        content: `You are THE COMPANY by Herwood Creative. Brand: ${brand.name}. Real data: heat ${brand.score}, ${brand.total.toLocaleString()} Wikipedia views/week, trend ${brand.trend}.

7 archetypes: Hugo (Myth - scarcity), Ellis (Conviction - consistent POV), Rex (Trend Rider - hot, no foundation), Wren (Cultural Moment - electric, undefined), Odette (Visual Identity - aesthetic first), Otto (Scaled Soul - grew, kept warmth), Dot (Emerging - becoming real).

Return ONLY valid JSON:
{"archetype":"Hugo|Ellis|Rex|Wren|Odette|Otto|Dot","hotTake":"one punchy 8-word verdict","reason":"7 words lowercase why this archetype fits"}`
      }]
    }),
  });
  const d = await res.json();
  const text = d.content.filter(b => b.type === "text").map(b => b.text).join("");
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

function getArch(name) { return CAST.find(c => c.name === name) || CAST[2]; }

const BTN_BASE = {
  flex: 1, padding: "13px 0", background: "transparent",
  border: "0.5px solid rgba(168,196,224,0.5)", borderRadius: 8,
  color: "rgba(168,196,224,0.85)", fontSize: 10, fontWeight: 700,
  letterSpacing: "0.15em", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
  transition: "all 0.15s",
};
const BTN_ACTIVE = { ...BTN_BASE, background: "rgba(168,196,224,0.15)", color: "#A8C4E0", border: "0.5px solid #A8C4E0" };

function SwipeCard({ brand, onSwipe, isTop }) {
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [leaving, setLeaving] = useState(null);

  const THRESHOLD = 80;
  const isDark = ["#1A1A2E", "#1A1A1A", "#4A7A5A"].includes(brand.bg);

  function onPointerDown(e) {
    if (!isTop || leaving) return;
    isDragging.current = true;
    startX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    e.currentTarget?.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!isDragging.current || !isTop || leaving) return;
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - startX.current;
    currentX.current = x;
    setDragX(x);
  }
  function onPointerUp() {
    if (!isDragging.current || !isTop || leaving) return;
    isDragging.current = false;
    const x = currentX.current;
    if (Math.abs(x) > THRESHOLD) {
      const dir = x > 0 ? "signal" : "noise";
      setLeaving(dir);
      setTimeout(() => onSwipe(dir), 340);
    } else {
      setDragX(0); currentX.current = 0;
    }
  }

  const rotation = leaving ? (leaving === "signal" ? 18 : -18) : dragX * 0.08;
  const translateX = leaving ? (leaving === "signal" ? 500 : -500) : dragX;
  const sigOpacity = Math.max(0, Math.min(1, dragX / THRESHOLD));
  const noiOpacity = Math.max(0, Math.min(1, -dragX / THRESHOLD));

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "absolute", width: "100%",
        transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
        transition: isDragging.current ? "none" : leaving ? "transform 0.34s ease" : "transform 0.22s ease",
        cursor: isTop ? "grab" : "default",
        userSelect: "none", touchAction: "none",
        zIndex: isTop ? 10 : 5,
      }}
    >
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 56px rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.15)" }}>
        <div style={{ background: brand.bg, height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <img
            src={`https://logo.clearbit.com/${brand.domain}`}
            alt={brand.name}
            style={{ width: 80, height: 80, objectFit: "contain", borderRadius: 14, filter: isDark ? "invert(1)" : "none" }}
            onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
          />
          <div style={{ display: "none", width: 80, height: 80, borderRadius: 14, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 700, color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)" }}>
            {brand.name[0]}
          </div>
          <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.25)", borderRadius: 3, padding: "3px 8px", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", fontFamily: "'DM Sans',sans-serif" }}>
            {getHeatLabel(brand.score)} · {brand.score}
          </div>
          <div style={{ position: "absolute", bottom: 10, left: 13, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: brand.trend === "up" ? "#6fcf97" : brand.trend === "down" ? "#cf6f6f" : "rgba(255,255,255,0.4)" }} />
            <span style={{ fontSize: 8, color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.07em" }}>{brand.total?.toLocaleString()} wiki views/wk</span>
          </div>
          {sigOpacity > 0.05 && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(111,207,151,0.22)", opacity: sigOpacity, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ border: "3px solid #6fcf97", borderRadius: 6, padding: "6px 16px", transform: "rotate(-15deg)" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.2em", color: "#6fcf97" }}>SIGNAL</span>
              </div>
            </div>
          )}
          {noiOpacity > 0.05 && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(168,196,224,0.22)", opacity: noiOpacity, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ border: "3px solid #A8C4E0", borderRadius: 6, padding: "6px 16px", transform: "rotate(15deg)" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "0.2em", color: "#A8C4E0" }}>NOISE</span>
              </div>
            </div>
          )}
        </div>
        <div style={{ background: "#F2F4F7", padding: "14px 16px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, fontWeight: 700, color: "#0A1018", marginBottom: 4 }}>{brand.name}</div>
          {brand.hotTake
            ? <div style={{ fontSize: 12, color: "rgba(10,16,24,0.5)", lineHeight: 1.5 }}>{brand.hotTake}</div>
            : <div style={{ fontSize: 12, color: "rgba(10,16,24,0.25)", fontStyle: "italic", fontFamily: "'DM Sans',sans-serif" }}>reading the room...</div>
          }
        </div>
      </div>
    </div>
  );
}

function RevealCard({ brand, verdict, onNext }) {
  const arch = getArch(brand.archetype);
  const isLight = arch.name === "Odette";
  return (
    <div style={{ width: "100%", animation: "fadeUp 0.35s ease both" }}>
      <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 56px rgba(0,0,0,0.3)", border: "0.5px solid rgba(255,255,255,0.15)" }}>
        <div style={{ background: arch.hex, padding: "36px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 80, fontWeight: 700, lineHeight: 1, color: isLight ? "#0A1018" : "#F2F4F7" }}>{arch.letter}</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, color: isLight ? "#0A1018" : "#F2F4F7", marginTop: 6 }}>{arch.name}</div>
          <div style={{ fontSize: 9, letterSpacing: "0.2em", color: isLight ? "rgba(10,16,24,0.4)" : "rgba(242,244,247,0.4)", marginTop: 4, fontFamily: "'DM Sans',sans-serif" }}>{arch.word}</div>
        </div>
        <div style={{ background: "#F2F4F7", padding: "16px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", border: "0.5px solid", padding: "2px 8px", borderRadius: 2, fontFamily: "'DM Sans',sans-serif", color: verdict === "signal" ? "#2D6A4F" : "#1A3D52", borderColor: verdict === "signal" ? "#6fcf97" : "#A8C4E0" }}>
              {verdict.toUpperCase()}
            </span>
            <span style={{ fontSize: 11, color: "rgba(10,16,24,0.35)", fontFamily: "'DM Sans',sans-serif" }}>— {brand.name}</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(10,16,24,0.5)", lineHeight: 1.5, marginBottom: 14, fontFamily: "'DM Sans',sans-serif" }}>{brand.reason}</div>
          <button onClick={onNext} style={{ width: "100%", padding: "12px 0", background: "transparent", border: "0.5px solid rgba(184,58,42,0.35)", borderRadius: 8, color: "#B83A2A", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", cursor: "pointer", fontFamily: "'DM Sans',sans-serif" }}>
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const [queue, setQueue]     = useState([]);
  const [current, setCurrent] = useState(null);
  const [nextCard, setNextCard] = useState(null);
  const [judged, setJudged]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [verdict, setVerdict] = useState(null);
  const [phase, setPhase]     = useState("loading brands");
  const [hovNoise, setHovNoise] = useState(false);
  const [hovSig, setHovSig]   = useState(false);

  useEffect(() => {
    async function init() {
      const msgs = ["fetching wikipedia", "computing heat", "almost ready"];
      let pi = 0; setPhase(msgs[0]);
      const iv = setInterval(() => { pi = Math.min(pi + 1, msgs.length - 1); setPhase(msgs[pi]); }, 2500);
      const raw = await Promise.all(BRANDS.map(async b => {
        const w = await fetchWiki(b.wiki);
        return { ...b, total: w.total, trend: w.trend, score: heatScore(w.total, w.trend) };
      }));
      clearInterval(iv);
      const shuffled = raw.sort(() => Math.random() - 0.5);
      const [first, second, ...rest] = shuffled;
      setLoading(false);
      loadBrand(first, second, rest);
    }
    init();
  }, []);

  async function loadBrand(brand, nxt, rest) {
    setVerdict(null);
    setCurrent({ ...brand, hotTake: null, archetype: null, reason: null });
    setNextCard(nxt || null);
    setQueue(rest || []);
    try {
      const take = await getBrandTake(brand);
      setCurrent(prev => ({ ...prev, ...take }));
    } catch {
      setCurrent(prev => ({ ...prev, hotTake: "worth watching closely right now.", archetype: "Rex", reason: "momentum without clear foundation" }));
    }
  }

  function onNext() {
    setJudged(prev => [...prev, { ...current, verdict }]);
    const [nxt, ...rest] = queue;
    if (nxt) { loadBrand(nxt, rest[0], rest.slice(1)); }
    else {
      const reshuffled = [...BRANDS].sort(() => Math.random() - 0.5);
      loadBrand(reshuffled[0], reshuffled[1], reshuffled.slice(2));
    }
  }

  const signals = judged.filter(j => j.verdict === "signal");
  const noise   = judged.filter(j => j.verdict === "noise");

  if (loading) return (
    <div style={{ background: "#B83A2A", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap'); @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 10, letterSpacing: "0.35em", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>SIGNAL / NOISE</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 13, color: "rgba(255,255,255,0.35)", letterSpacing: "0.2em", animation: "pulse 1.5s infinite" }}>{phase}</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#B83A2A", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: "#F2F4F7", display: "flex", flexDirection: "column", maxWidth: 400, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.25}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.3)" }}>HERWOOD</span>
        <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 10, letterSpacing: "0.3em", color: "#F2F4F7", fontWeight: 600 }}>SIGNAL / NOISE</span>
        <div style={{ marginLeft: "auto", fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>{judged.length} JUDGED</div>
      </div>

      {/* Game */}
      <div style={{ flex: 1, padding: "24px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", fontWeight: 700, marginBottom: 22 }}>IS THIS BRAND A SIGNAL OR NOISE?</div>

        {verdict ? (
          <RevealCard brand={current} verdict={verdict} onNext={onNext} />
        ) : (
          <>
            <div style={{ position: "relative", width: "100%", height: 290, marginBottom: 18 }}>
              {nextCard && (
                <div style={{ position: "absolute", width: "100%", transform: "scale(0.95) translateY(8px)", zIndex: 5, opacity: 0.5, pointerEvents: "none" }}>
                  <div style={{ borderRadius: 16, overflow: "hidden", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                    <div style={{ background: nextCard.bg, height: 200 }} />
                    <div style={{ background: "#F2F4F7", height: 72 }} />
                  </div>
                </div>
              )}
              {current && <SwipeCard brand={current} onSwipe={setVerdict} isTop={true} />}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18, opacity: 0.45 }}>
              <span style={{ fontSize: 9, color: "#A8C4E0", fontWeight: 700, letterSpacing: "0.1em" }}>← NOISE</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>SWIPE</span>
              <span style={{ fontSize: 9, color: "#A8C4E0", fontWeight: 700, letterSpacing: "0.1em" }}>SIGNAL →</span>
            </div>

            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button onClick={() => setVerdict("noise")} onMouseEnter={() => setHovNoise(true)} onMouseLeave={() => setHovNoise(false)} style={hovNoise ? BTN_ACTIVE : BTN_BASE}>NOISE</button>
              <button onClick={() => setVerdict("signal")} onMouseEnter={() => setHovSig(true)} onMouseLeave={() => setHovSig(false)} style={hovSig ? BTN_ACTIVE : BTN_BASE}>SIGNAL</button>
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {judged.length > 0 && (
        <div style={{ padding: "14px 20px 24px", borderTop: "0.5px solid rgba(255,255,255,0.1)" }}>
          {signals.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.45)", fontWeight: 700, marginBottom: 7 }}>SIGNAL · {signals.length}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {signals.map((j, i) => {
                  const arch = getArch(j.archetype);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 4, background: "rgba(255,255,255,0.1)", border: "0.5px solid rgba(255,255,255,0.15)" }}>
                      <div style={{ width: 14, height: 14, borderRadius: 2, background: arch.hex, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 8, fontWeight: 700, color: arch.name === "Odette" ? "#0A1018" : "#F2F4F7" }}>{arch.letter}</span>
                      </div>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>{j.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {noise.length > 0 && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(168,196,224,0.6)", fontWeight: 700, marginBottom: 7 }}>NOISE · {noise.length}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {noise.map((j, i) => {
                  const arch = getArch(j.archetype);
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 4, background: "rgba(168,196,224,0.08)", border: "0.5px solid rgba(168,196,224,0.2)" }}>
                      <div style={{ width: 14, height: 14, borderRadius: 2, background: arch.hex, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 8, fontWeight: 700, color: arch.name === "Odette" ? "#0A1018" : "#F2F4F7" }}>{arch.letter}</span>
                      </div>
                      <span style={{ fontSize: 10, color: "rgba(168,196,224,0.7)" }}>{j.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
