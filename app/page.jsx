"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── HERWOOD 7 ──────────────────────────────────────────────────────────────
const CAST = [
  { letter: "H", name: "Hugo",   hex: "#1A3D52", word: "MYTHIC",       desc: "The brand that became a myth." },
  { letter: "E", name: "Ellis",  hex: "#B83A2A", word: "GROUNDED",     desc: "The brand that never moved." },
  { letter: "R", name: "Rex",    hex: "#4A7A9A", word: "BURNING",      desc: "Loud right now. No foundation." },
  { letter: "W", name: "Wren",   hex: "#8C2A1C", word: "ELECTRIC",     desc: "The moment before it's named." },
  { letter: "O", name: "Odette", hex: "#A8C4E0", word: "UNTOUCHABLE",  desc: "The aesthetic IS the brand." },
  { letter: "O", name: "Otto",   hex: "#C84A38", word: "WARM",         desc: "Scaled. Kept its soul." },
  { letter: "D", name: "Dot",    hex: "#2A5A7A", word: "BECOMING",     desc: "Not there yet. Watch it." },
];

// ─── 60 BRANDS ───────────────────────────────────────────────────────────────
const HARDCODED_BRANDS = [
  { name: "Rhode",             wiki: "Rhode_(brand)",                             fallbackColor: "#F5EDE6" },
  { name: "Rare Beauty",       wiki: "Rare_Beauty",                               fallbackColor: "#E8C0CC" },
  { name: "Fenty Beauty",      wiki: "Fenty_Beauty",                              fallbackColor: "#1A1A1A" },
  { name: "Glossier",          wiki: "Glossier",                                  fallbackColor: "#F5E6E0" },
  { name: "e.l.f. Beauty",     wiki: "E.l.f._Beauty",                             fallbackColor: "#E8F0D0" },
  { name: "Charlotte Tilbury", wiki: "Charlotte_Tilbury",                         fallbackColor: "#C8A090" },
  { name: "Poppi",             wiki: "Poppi_(drink)",                             fallbackColor: "#F5D5B0" },
  { name: "Olipop",            wiki: "Olipop_(drink)",                            fallbackColor: "#D0E8B8" },
  { name: "Liquid Death",      wiki: "Liquid_Death",                              fallbackColor: "#1A1A2E" },
  { name: "Erewhon",           wiki: "Erewhon_(market)",                          fallbackColor: "#C8D8B0" },
  { name: "Dutch Bros",        wiki: "Dutch_Bros_Coffee",                         fallbackColor: "#1A3D52" },
  { name: "Sweetgreen",        wiki: "Sweetgreen",                                fallbackColor: "#4A7A5A" },
  { name: "Chamberlain Coffee",wiki: "Chamberlain_Coffee",                        fallbackColor: "#C8A878" },
  { name: "Graza",             wiki: "Graza",                                     fallbackColor: "#E8E058" },
  { name: "Fly By Jing",       wiki: "Fly_By_Jing",                               fallbackColor: "#C84828" },
  { name: "Skims",             wiki: "Skims",                                     fallbackColor: "#C8B49A" },
  { name: "Jacquemus",         wiki: "Jacquemus",                                 fallbackColor: "#E8D5B0" },
  { name: "Gymshark",          wiki: "Gymshark",                                  fallbackColor: "#1A1A1A" },
  { name: "Alo Yoga",          wiki: "Alo_Yoga",                                  fallbackColor: "#E8E0D8" },
  { name: "Madhappy",          wiki: "Madhappy",                                  fallbackColor: "#A8C4E0" },
  { name: "Aritzia",           wiki: "Aritzia",                                   fallbackColor: "#1A1A1A" },
  { name: "On Running",        wiki: "On_(company)",                              fallbackColor: "#E8E8E8" },
  { name: "Vuori",             wiki: "Vuori_Clothing",                            fallbackColor: "#B8C8D8" },
  { name: "Fear of God",       wiki: "Fear_of_God",                               fallbackColor: "#1A1818" },
  { name: "WNBA",              wiki: "Women%27s_National_Basketball_Association", fallbackColor: "#F5A050" },
  { name: "Inter Miami",       wiki: "Inter_Miami_CF",                            fallbackColor: "#F5C8D8" },
  { name: "Angel Reese",       wiki: "Angel_Reese",                               fallbackColor: "#C84828" },
  { name: "Caitlin Clark",     wiki: "Caitlin_Clark",                             fallbackColor: "#F5A800" },
  { name: "F1",                wiki: "Formula_One",                               fallbackColor: "#C80000" },
  { name: "Duolingo",          wiki: "Duolingo",                                  fallbackColor: "#E8F5D0" },
  { name: "Notion",            wiki: "Notion_(software)",                         fallbackColor: "#F2F4F7" },
  { name: "Perplexity",        wiki: "Perplexity_AI",                             fallbackColor: "#1A1A2E" },
  { name: "Cursor",            wiki: "Cursor_(text_editor)",                      fallbackColor: "#1A1A1A" },
  { name: "Arc Browser",       wiki: "Arc_(web_browser)",                         fallbackColor: "#2A2A4E" },
  { name: "BeReal",            wiki: "BeReal",                                    fallbackColor: "#F2F4F7" },
  { name: "Substack",          wiki: "Substack",                                  fallbackColor: "#F5A800" },
  { name: "Linear",            wiki: "Linear_(software)",                         fallbackColor: "#5B4FE8" },
  { name: "Stanley",           wiki: "Stanley_(brand)",                           fallbackColor: "#4A7A5A" },
  { name: "Lululemon",         wiki: "Lululemon",                                 fallbackColor: "#C8102E" },
  { name: "Yeti",              wiki: "YETI_(company)",                            fallbackColor: "#1A1A1A" },
  { name: "Liquid I.V.",       wiki: "Liquid_I.V.",                               fallbackColor: "#A8E8F8" },
  { name: "AG1",               wiki: "Athletic_Greens",                           fallbackColor: "#4A8840" },
  { name: "Hims",              wiki: "Hims_&_Hers",                               fallbackColor: "#C8E8E8" },
  { name: "Soho House",        wiki: "Soho_House",                                fallbackColor: "#1A1818" },
  { name: "Ace Hotel",         wiki: "Ace_Hotel",                                 fallbackColor: "#E8D8C0" },
  { name: "Airbnb",            wiki: "Airbnb",                                    fallbackColor: "#FF5A5F" },
  { name: "MrBeast",           wiki: "MrBeast",                                   fallbackColor: "#F5C800" },
  { name: "Emma Chamberlain",  wiki: "Emma_Chamberlain",                          fallbackColor: "#C8B490" },
  { name: "Dude Perfect",      wiki: "Dude_Perfect",                              fallbackColor: "#4A8840" },
  { name: "Loewe",             wiki: "Loewe_(fashion_house)",                     fallbackColor: "#C8B490" },
  { name: "Bottega Veneta",    wiki: "Bottega_Veneta",                            fallbackColor: "#8A7850" },
  { name: "The Row",           wiki: "The_Row_(fashion)",                         fallbackColor: "#E8E0D0" },
  { name: "Uber Eats",         wiki: "Uber_Eats",                                 fallbackColor: "#04AA6D" },
  { name: "DoorDash",          wiki: "DoorDash",                                  fallbackColor: "#FF3008" },
  { name: "Depop",             wiki: "Depop",                                     fallbackColor: "#FF2300" },
  { name: "StockX",            wiki: "StockX",                                    fallbackColor: "#1A1A1A" },
  { name: "GOAT",              wiki: "GOAT_(company)",                            fallbackColor: "#1A1A1A" },
  { name: "The Athletic",      wiki: "The_Athletic",                              fallbackColor: "#1A1A1A" },
  { name: "Punchbowl News",    wiki: "Punchbowl_News",                            fallbackColor: "#C84828" },
  { name: "Madhappy",          wiki: "Madhappy",                                  fallbackColor: "#A8C4E0" },
];

const LOADING_LINES = [
  "forming opinions.",
  "checking the receipts.",
  "this one's complicated.",
  "not impressed yet.",
  "reading the room.",
  "consulting the data.",
  "taking its time.",
  "still deciding.",
];

// ─── HEAT ──────────────────────────────────────────────────────────────────
function heatScore(total, trend, votes = 0) {
  if (votes > 0) return Math.min(95, Math.round((Math.log1p(votes) / Math.log1p(1000)) * 75) + 10);
  const s = Math.min(80, Math.round((Math.log1p(total) / Math.log1p(100000)) * 80));
  return trend === "up" ? Math.min(100, s + 10) : trend === "down" ? Math.max(0, s - 10) : s;
}
function heatLabel(s) {
  if (s >= 88) return "INCANDESCENT";
  if (s >= 72) return "HOT";
  if (s >= 55) return "WARM";
  if (s >= 38) return "TEPID";
  return "COOLING";
}

// ─── WIKIPEDIA FETCH — goes through our own API route to avoid CORS ─────────
async function fetchWikiData(article) {
  if (!article) return { total: 0, trend: "flat", image: null, description: null };
  try {
    const res = await fetch(`/api/wiki?article=${encodeURIComponent(article)}`);
    if (!res.ok) return { total: 0, trend: "flat", image: null, description: null };
    return await res.json();
  } catch {
    return { total: 0, trend: "flat", image: null, description: null };
  }
}

// ─── CLAUDE TAKE ────────────────────────────────────────────────────────────
async function getBrandTake(brand) {
  const ctx = brand.source === "producthunt"
    ? `Brand new Product Hunt launch today: "${brand.name}". Tagline: "${brand.tagline}". ${brand.votes} upvotes. Score: ${brand.score}.`
    : `Brand: ${brand.name}. ${brand.description ? `Wikipedia: "${brand.description}".` : ""} Heat score: ${brand.score}. ${brand.total?.toLocaleString()} wiki views/week. Trend: ${brand.trend}.`;

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 180,
      messages: [{
        role: "user",
        content: `You are THE COMPANY by Herwood Creative — a brutally honest brand culture oracle.

${ctx}

7 archetypes: Hugo (Myth — built on legacy, not volume), Ellis (Conviction — steady POV, never chases trends), Rex (Trend Rider — hot with no foundation, won't last), Wren (Cultural Moment — electric right now, identity still forming), Odette (Visual Identity — the aesthetic IS the brand), Otto (Scaled Soul — grew big and kept the warmth), Dot (Becoming — not there yet but you can feel it).

Return ONLY valid JSON, no markdown:
{"archetype":"Hugo|Ellis|Rex|Wren|Odette|Otto|Dot","hotTake":"one devastating 7-word verdict","reason":"8 words lowercase, no period, no hedging"}`
      }]
    }),
  });
  const d = await res.json();
  const text = d.content?.filter(b => b.type === "text").map(b => b.text).join("") || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ─── SWIPE CARD ─────────────────────────────────────────────────────────────
function SwipeCard({ brand, onSwipe, isTop, peeking }) {
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);
  const [dragX, setDragX] = useState(0);
  const [leaving, setLeaving] = useState(null);
  const THRESHOLD = 85;

  function onPointerDown(e) {
    if (!isTop || leaving) return;
    isDragging.current = true;
    startX.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    e.currentTarget?.setPointerCapture?.(e.pointerId);
  }
  function onPointerMove(e) {
    if (!isDragging.current || !isTop || leaving) return;
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - startX.current;
    currentX.current = x;
    setDragX(x);
  }
  function onPointerUp() {
    if (!isDragging.current || !isTop || leaving) return;
    isDragging.current = false;
    if (Math.abs(currentX.current) > THRESHOLD) {
      const dir = currentX.current > 0 ? "signal" : "noise";
      setLeaving(dir);
      setTimeout(() => onSwipe(dir), 360);
    } else {
      setDragX(0);
      currentX.current = 0;
    }
  }

  const rotation = leaving
    ? leaving === "signal" ? 18 : -18
    : dragX * 0.07;
  const translateX = leaving ? (leaving === "signal" ? 600 : -600) : dragX;
  const sigOpacity = Math.max(0, Math.min(1, dragX / THRESHOLD));
  const noiOpacity = Math.max(0, Math.min(1, -dragX / THRESHOLD));

  // Image: Wikipedia > PH thumbnail > fallback color
  const hasImage = !!(brand.image);
  const bgStyle = hasImage
    ? { backgroundImage: `url(${brand.image})`, backgroundSize: "cover", backgroundPosition: "center top" }
    : { background: brand.fallbackColor || "#1A1818" };

  if (peeking) {
    return (
      <div style={{
        position: "absolute", width: "100%",
        transform: "scale(0.94) translateY(12px)",
        zIndex: 3, opacity: 0.45, pointerEvents: "none",
      }}>
        <div style={{ borderRadius: 20, overflow: "hidden", border: "0.5px solid rgba(255,255,255,0.08)" }}>
          <div style={{ ...bgStyle, height: 220 }} />
          <div style={{ background: "#0E1820", height: 80 }} />
        </div>
      </div>
    );
  }

  return (
    <div
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerCancel={onPointerUp}
      style={{
        position: "absolute", width: "100%",
        transform: `translateX(${translateX}px) rotate(${rotation}deg)`,
        transition: isDragging.current ? "none" : leaving ? "transform 0.36s ease" : "transform 0.2s ease",
        cursor: isTop ? "grab" : "default",
        userSelect: "none", touchAction: "none",
        zIndex: 10,
      }}
    >
      <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 28px 72px rgba(0,0,0,0.55)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
        {/* PHOTO */}
        <div style={{ ...bgStyle, height: 340, position: "relative" }}>
          {/* Gradient overlay for text readability */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 30%, rgba(14,24,32,0.65) 70%, rgba(14,24,32,0.95) 100%)" }} />

          {/* Heat badge */}
          <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)", borderRadius: 3, padding: "3px 9px", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", fontFamily: "'DM Sans',sans-serif", zIndex: 2 }}>
            {heatLabel(brand.score)} · {brand.score}
          </div>

          {/* PH badge */}
          {brand.source === "producthunt" && (
            <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(184,58,42,0.9)", borderRadius: 3, padding: "2px 8px", fontSize: 7, fontWeight: 700, letterSpacing: "0.14em", color: "#F2F4F7", fontFamily: "'DM Sans',sans-serif", zIndex: 2 }}>
              LAUNCHING TODAY
            </div>
          )}

          {/* SIGNAL stamp */}
          {sigOpacity > 0.04 && (
            <div style={{ position: "absolute", top: "28%", left: "8%", zIndex: 5, opacity: sigOpacity, transform: "rotate(-14deg)" }}>
              <div style={{ border: "3px solid #6fcf97", borderRadius: 6, padding: "5px 14px" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 30, fontWeight: 700, letterSpacing: "0.18em", color: "#6fcf97" }}>SIGNAL</span>
              </div>
            </div>
          )}

          {/* NOISE stamp */}
          {noiOpacity > 0.04 && (
            <div style={{ position: "absolute", top: "28%", right: "8%", zIndex: 5, opacity: noiOpacity, transform: "rotate(14deg)" }}>
              <div style={{ border: "3px solid #A8C4E0", borderRadius: 6, padding: "5px 14px" }}>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 30, fontWeight: 700, letterSpacing: "0.18em", color: "#A8C4E0" }}>NOISE</span>
              </div>
            </div>
          )}

          {/* Brand name over photo */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 18px", zIndex: 2 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 44, fontWeight: 700, color: "#F2F4F7", lineHeight: 1, marginBottom: 5, letterSpacing: "-0.01em" }}>
              {brand.name}
            </div>
            {brand.description && (
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.02em", lineHeight: 1.4 }}>
                {brand.description}
              </div>
            )}
          </div>
        </div>

        {/* Bottom strip */}
        <div style={{ background: "#0E1820", padding: "12px 18px 14px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: brand.trend === "up" || brand.source === "producthunt" ? "#6fcf97" : brand.trend === "down" ? "#cf7070" : "rgba(255,255,255,0.25)", flexShrink: 0 }} />
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", fontFamily: "'DM Sans',sans-serif" }}>
            {brand.source === "producthunt"
              ? `${brand.votes?.toLocaleString()} PH votes today`
              : `${brand.total?.toLocaleString()} wiki views this week`}
          </span>
          {brand.hotTake ? (
            <span style={{ marginLeft: "auto", fontSize: 10, color: "rgba(255,255,255,0.45)", fontStyle: "italic", fontFamily: "'DM Sans',sans-serif" }}>
              {brand.hotTake}
            </span>
          ) : (
            <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.2)", fontStyle: "italic", fontFamily: "'DM Sans',sans-serif", animation: "pulse 1.6s infinite" }}>
              {LOADING_LINES[Math.floor(Math.random() * LOADING_LINES.length)]}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── REVEAL CARD ─────────────────────────────────────────────────────────────
function RevealCard({ brand, verdict, onNext }) {
  const arch = CAST.find(c => c.name === brand.archetype) || CAST[2];
  const isLightArch = arch.name === "Odette";

  const bgStyle = brand.image
    ? { backgroundImage: `url(${brand.image})`, backgroundSize: "cover", backgroundPosition: "center top" }
    : { background: arch.hex };

  return (
    <div style={{ width: "100%", animation: "slideUp 0.38s ease both" }}>
      <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 28px 72px rgba(0,0,0,0.55)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
        {/* Top: photo + archetype overlay */}
        <div style={{ height: 340, position: "relative" }}>
          <div style={{ ...bgStyle, position: "absolute", inset: 0 }} />
          {/* Deep color overlay using archetype color */}
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${arch.hex}55 0%, ${arch.hex}bb 60%, ${arch.hex}f0 100%)` }} />

          {/* Verdict badge */}
          <div style={{ position: "absolute", top: 14, left: 14, zIndex: 3 }}>
            <div style={{ border: `0.5px solid ${verdict === "signal" ? "rgba(111,207,151,0.7)" : "rgba(168,196,224,0.7)"}`, borderRadius: 3, padding: "2px 10px" }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: verdict === "signal" ? "#6fcf97" : "#A8C4E0", fontFamily: "'DM Sans',sans-serif" }}>
                {verdict.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Giant archetype letter */}
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 160, fontWeight: 700, color: "rgba(255,255,255,0.92)", lineHeight: 1 }}>
              {arch.letter}
            </div>
          </div>

          {/* Brand name bottom */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 18px 18px", zIndex: 3 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 600, color: "#F2F4F7", lineHeight: 1 }}>
              {brand.name}
            </div>
          </div>
        </div>

        {/* Bottom: verdict */}
        <div style={{ background: "#0E1820", padding: "16px 18px 18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: 4, background: arch.hex, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, fontWeight: 700, color: isLightArch ? "#0A1018" : "#F2F4F7" }}>{arch.letter}</span>
            </div>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "#F2F4F7" }}>{arch.name}</div>
              <div style={{ fontSize: 8, letterSpacing: "0.2em", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans',sans-serif" }}>{arch.word}</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.55, marginBottom: 14, fontStyle: "italic", fontFamily: "'DM Sans',sans-serif" }}>
            {brand.reason || arch.desc}
          </div>
          <button
            onClick={onNext}
            style={{ width: "100%", padding: "12px 0", background: "transparent", border: "0.5px solid rgba(184,58,42,0.4)", borderRadius: 10, color: "#B83A2A", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" }}
          >
            NEXT →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function Page() {
  const [queue, setQueue]     = useState([]);
  const [current, setCurrent] = useState(null);
  const [next, setNext]       = useState(null);
  const [judged, setJudged]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadMsg, setLoadMsg] = useState("reading the room.");
  const [verdict, setVerdict] = useState(null);
  const [phCount, setPhCount] = useState(0);
  const [hovNoise, setHovNoise] = useState(false);
  const [hovSig, setHovSig]   = useState(false);

  useEffect(() => {
    const msgs = ["reading the room.", "checking the receipts.", "forming opinions.", "almost ready."];
    let i = 0;
    const iv = setInterval(() => { i = Math.min(i + 1, msgs.length - 1); setLoadMsg(msgs[i]); }, 2200);

    async function init() {
      // Load all 60 brands with Wikipedia data (image + pageviews)
      const hardcoded = await Promise.all(
        HARDCODED_BRANDS.map(async b => {
          const w = await fetchWikiData(b.wiki);
          return { ...b, total: w.total, trend: w.trend, image: w.image, description: w.description, score: heatScore(w.total, w.trend), source: "hardcoded" };
        })
      );

      // Product Hunt
      let phBrands = [];
      try {
        const phRes = await fetch("/api/producthunt");
        const phData = await phRes.json();
        if (phData.brands?.length > 0) {
          phBrands = phData.brands.map(b => ({ ...b, total: 0, trend: "up", score: heatScore(0, "up", b.votes) }));
          setPhCount(phBrands.length);
        }
      } catch {}

      clearInterval(iv);
      const shuffled = hardcoded.sort(() => Math.random() - 0.5);
      const all = [...phBrands, ...shuffled];
      setLoading(false);
      await loadBrand(all[0], all[1], all.slice(2));
    }
    init();
  }, []);

  async function loadBrand(brand, nxtBrand, rest) {
    setVerdict(null);
    setCurrent({ ...brand, hotTake: null, archetype: null, reason: null });
    setNext(nxtBrand || null);
    setQueue(rest || []);
    try {
      const take = await getBrandTake(brand);
      setCurrent(prev => ({ ...prev, ...take }));
    } catch {
      setCurrent(prev => ({ ...prev, hotTake: "worth watching right now.", archetype: "Rex", reason: "momentum without clear foundation" }));
    }
  }

  function onNext() {
    setJudged(prev => [...prev, { ...current, verdict }]);
    const [nxt, ...rest] = queue;
    if (nxt) loadBrand(nxt, rest[0], rest.slice(1));
    else {
      const reshuffled = [...HARDCODED_BRANDS].sort(() => Math.random() - 0.5);
      loadBrand({ ...reshuffled[0], total: 0, trend: "flat", image: null, score: 30, source: "hardcoded" },
               { ...reshuffled[1], total: 0, trend: "flat", image: null, score: 30, source: "hardcoded" },
               []);
    }
  }

  const signals = judged.filter(j => j.verdict === "signal");
  const noise   = judged.filter(j => j.verdict === "noise");

  if (loading) return (
    <div style={{ background: "#0E1820", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap'); @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.15}}`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 11, letterSpacing: "0.35em", color: "rgba(168,196,224,0.25)", marginBottom: 14 }}>SIGNAL / NOISE</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: "rgba(168,196,224,0.3)", letterSpacing: "0.18em", animation: "pulse 1.6s infinite" }}>{loadMsg}</div>
      </div>
    </div>
  );

  return (
    <div style={{ background: "#0E1820", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", color: "#F2F4F7", display: "flex", flexDirection: "column", maxWidth: 420, margin: "0 auto" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap');
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.15}}
        @keyframes slideUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.25)" }}>HERWOOD</span>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>·</span>
        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 10, letterSpacing: "0.3em", color: "#A8C4E0", fontWeight: 600 }}>SIGNAL / NOISE</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
          {phCount > 0 && <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.1em", color: "#B83A2A", border: "0.5px solid rgba(184,58,42,0.4)", padding: "1px 7px", borderRadius: 2 }}>{phCount} LIVE</span>}
          <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", letterSpacing: "0.12em" }}>{judged.length} JUDGED</span>
        </div>
      </div>

      {/* Game area */}
      <div style={{ flex: 1, padding: "24px 20px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "rgba(255,255,255,0.2)", fontWeight: 700, marginBottom: 22 }}>
          SIGNAL OR NOISE?
        </div>

        {verdict ? (
          <RevealCard brand={current} verdict={verdict} onNext={onNext} />
        ) : (
          <>
            <div style={{ position: "relative", width: "100%", height: 310, marginBottom: 20 }}>
              {next && <SwipeCard brand={next} onSwipe={() => {}} isTop={false} peeking={true} />}
              {current && <SwipeCard brand={current} onSwipe={setVerdict} isTop={true} peeking={false} />}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18, opacity: 0.4 }}>
              <span style={{ fontSize: 9, color: "#A8C4E0", fontWeight: 700, letterSpacing: "0.1em" }}>← NOISE</span>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>DRAG TO SWIPE</span>
              <span style={{ fontSize: 9, color: "#A8C4E0", fontWeight: 700, letterSpacing: "0.1em" }}>SIGNAL →</span>
            </div>

            <div style={{ display: "flex", gap: 10, width: "100%" }}>
              <button onClick={() => setVerdict("noise")} onMouseEnter={() => setHovNoise(true)} onMouseLeave={() => setHovNoise(false)}
                style={{ flex: 1, padding: "13px 0", background: hovNoise ? "rgba(168,196,224,0.1)" : "transparent", border: `0.5px solid ${hovNoise ? "#A8C4E0" : "rgba(168,196,224,0.3)"}`, borderRadius: 10, color: hovNoise ? "#A8C4E0" : "rgba(168,196,224,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" }}>
                NOISE
              </button>
              <button onClick={() => setVerdict("signal")} onMouseEnter={() => setHovSig(true)} onMouseLeave={() => setHovSig(false)}
                style={{ flex: 1, padding: "13px 0", background: hovSig ? "rgba(111,207,151,0.1)" : "transparent", border: `0.5px solid ${hovSig ? "#6fcf97" : "rgba(111,207,151,0.3)"}`, borderRadius: 10, color: hovSig ? "#6fcf97" : "rgba(111,207,151,0.6)", fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", cursor: "pointer", fontFamily: "'DM Sans',sans-serif", transition: "all 0.15s" }}>
                SIGNAL
              </button>
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {judged.length > 0 && (
        <div style={{ padding: "14px 20px 28px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
          {signals.length > 0 && (
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(111,207,151,0.5)", fontWeight: 700, marginBottom: 7 }}>SIGNAL · {signals.length}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {signals.map((j, i) => {
                  const a = CAST.find(c => c.name === j.archetype) || CAST[2];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 5, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: a.hex, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 8, fontWeight: 700, color: a.name === "Odette" ? "#0A1018" : "#F2F4F7" }}>{a.letter}</span>
                      </div>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{j.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {noise.length > 0 && (
            <div>
              <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "rgba(168,196,224,0.4)", fontWeight: 700, marginBottom: 7 }}>NOISE · {noise.length}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {noise.map((j, i) => {
                  const a = CAST.find(c => c.name === j.archetype) || CAST[2];
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 8px", borderRadius: 5, background: "rgba(168,196,224,0.05)", border: "0.5px solid rgba(168,196,224,0.15)" }}>
                      <div style={{ width: 14, height: 14, borderRadius: 3, background: a.hex, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 8, fontWeight: 700, color: a.name === "Odette" ? "#0A1018" : "#F2F4F7" }}>{a.letter}</span>
                      </div>
                      <span style={{ fontSize: 10, color: "rgba(168,196,224,0.5)" }}>{j.name}</span>
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
