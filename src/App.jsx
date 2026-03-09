import { useState, useEffect, useRef } from "react";

const API_URL = "https://api.anthropic.com/v1/messages";

const COLORS = {
  bg: "#0A0A0F",
  surface: "#12121A",
  card: "#1A1A26",
  border: "#2A2A3E",
  accent: "#FF3D6B",
  gold: "#FFB547",
  teal: "#00D4B1",
  purple: "#8B5CF6",
  text: "#F0EEF8",
  muted: "#7A7899",
};

const CATEGORIES = ["Womenswear", "Menswear", "Streetwear", "Luxury", "Athleisure", "Accessories"];
const SEASONS = ["Spring/Summer 2025", "Fall/Winter 2025", "Resort 2026", "Spring/Summer 2026"];
const REGIONS = ["Global", "North America", "Europe", "Asia-Pacific", "Middle East"];

const SAMPLE_TRENDS = [
  { name: "Quiet Luxury", score: 94, change: +8, category: "Luxury", color: COLORS.gold },
  { name: "Y2K Revival", score: 87, change: +15, category: "Streetwear", color: COLORS.accent },
  { name: "Gorpcore", score: 79, change: +22, category: "Athleisure", color: COLORS.teal },
  { name: "Dopamine Dressing", score: 73, change: -3, category: "Womenswear", color: COLORS.purple },
  { name: "Minimalist Core", score: 68, change: +5, category: "Menswear", color: "#60A5FA" },
  { name: "Cottagecore", score: 61, change: -9, category: "Womenswear", color: "#34D399" },
];

const CUSTOMER_SEGMENTS = [
  { label: "Gen Z Trendsetters", pct: 28, color: COLORS.accent },
  { label: "Millennial Professionals", pct: 34, color: COLORS.teal },
  { label: "Luxury Seekers", pct: 18, color: COLORS.gold },
  { label: "Budget Conscious", pct: 20, color: COLORS.purple },
];

const WEEKLY_DATA = [
  { week: "W1", impressions: 42, conversions: 18, returns: 8 },
  { week: "W2", impressions: 58, conversions: 24, returns: 6 },
  { week: "W3", impressions: 51, conversions: 21, returns: 9 },
  { week: "W4", impressions: 74, conversions: 36, returns: 5 },
  { week: "W5", impressions: 89, conversions: 45, returns: 7 },
  { week: "W6", impressions: 95, conversions: 52, returns: 4 },
];

const PRODUCTS = [
  { name: "Oversized Blazer", trend: "Quiet Luxury", demand: 92, stock: 34, price: "$189" },
  { name: "Platform Sneakers", trend: "Y2K Revival", demand: 88, stock: 12, price: "$145" },
  { name: "Cargo Trousers", trend: "Gorpcore", demand: 81, stock: 67, price: "$98" },
  { name: "Sequin Mini", trend: "Dopamine Dressing", demand: 76, stock: 45, price: "$120" },
  { name: "Linen Co-ord", trend: "Minimalist Core", demand: 71, stock: 89, price: "$165" },
];

function SparkBar({ value, max = 100, color }) {
  return (
    <div style={{ background: COLORS.border, borderRadius: 4, height: 6, width: "100%", overflow: "hidden" }}>
      <div
        style={{
          width: `${(value / max) * 100}%`,
          height: "100%",
          background: color,
          borderRadius: 4,
          transition: "width 1s ease",
        }}
      />
    </div>
  );
}

function MiniChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.impressions));
  return (
    <svg viewBox={`0 0 ${data.length * 40} 60`} style={{ width: "100%", height: 60 }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={COLORS.accent} stopOpacity="0.4" />
          <stop offset="100%" stopColor={COLORS.accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x = i * 40 + 20;
        const h = (d.impressions / maxVal) * 50;
        const y = 55 - h;
        return (
          <g key={i}>
            <rect x={x - 10} y={y} width={20} height={h} rx={3} fill={COLORS.accent} opacity={0.7} />
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ segments }) {
  const r = 50;
  const cx = 70;
  const cy = 70;
  let cumulative = 0;
  const paths = segments.map((seg) => {
    const startAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.pct;
    const endAngle = (cumulative / 100) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = seg.pct > 50 ? 1 : 0;
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`, color: seg.color };
  });
  return (
    <svg viewBox="0 0 140 140" style={{ width: 140, height: 140 }}>
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill={p.color} opacity={0.9} />
      ))}
      <circle cx={cx} cy={cy} r={30} fill={COLORS.card} />
      <text x={cx} y={cy + 5} textAnchor="middle" fill={COLORS.text} fontSize="11" fontFamily="serif">
        Segments
      </text>
    </svg>
  );
}

function AIPanel({ messages, isLoading, onSend }) {
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  return (
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.teal, boxShadow: `0 0 8px ${COLORS.teal}` }} />
        <span style={{ color: COLORS.text, fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 600 }}>
          Trend Intelligence AI
        </span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "10px 14px",
                borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                background: msg.role === "user" ? COLORS.accent : COLORS.card,
                color: COLORS.text,
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: "Georgia, serif",
                border: msg.role === "assistant" ? `1px solid ${COLORS.border}` : "none",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: COLORS.teal,
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "12px 16px", borderTop: `1px solid ${COLORS.border}`, display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about trends, predictions, customer segments…"
          style={{
            flex: 1,
            background: COLORS.card,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 10,
            padding: "9px 14px",
            color: COLORS.text,
            fontSize: 13,
            fontFamily: "Georgia, serif",
            outline: "none",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            background: COLORS.accent,
            border: "none",
            borderRadius: 10,
            padding: "9px 16px",
            color: "#fff",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "sans-serif",
          }}
        >
          ↑
        </button>
      </div>
    </div>
  );
}

export default function FashionTrends() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedSeason, setSelectedSeason] = useState(SEASONS[0]);
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your Fashion Trend Intelligence AI.\n\nI can help you predict upcoming trends, analyze customer segments, forecast demand, and identify emerging styles.\n\nTry asking:\n• 'What trends will dominate next season?'\n• 'Which segment has the highest LTV?'\n• 'Predict demand for Y2K styles in Asia'",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [predictMode, setPredictMode] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  const systemPrompt = `You are an expert fashion trend analyst and ecommerce strategist for a high-end fashion platform. 
You have deep knowledge of:
- Fashion trend cycles, forecasting, and consumer psychology
- Ecommerce metrics (conversion rates, AOV, LTV, returns)
- Customer segmentation (Gen Z, Millennials, Luxury buyers)
- Regional trend variations (NA, EU, APAC, ME)
- Seasonal collections and runway-to-retail pipelines
- Social media trend signals (TikTok, Instagram, Pinterest)
- Key trend categories: Quiet Luxury, Y2K Revival, Gorpcore, Dopamine Dressing, Minimalist Core, Cottagecore

Current dashboard context:
- Top trending: Quiet Luxury (score 94), Y2K Revival (87), Gorpcore (79)
- Strongest growth: Y2K Revival (+22%), Gorpcore (+22%)
- Declining: Cottagecore (-9%), Dopamine Dressing (-3%)
- Season: ${selectedSeason}, Region: ${selectedRegion}

Provide concise, data-driven, actionable insights. Use specific percentages and numbers. Keep responses under 200 words.`;

  const sendMessage = async (text) => {
    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Unable to fetch response.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
    }
    setIsLoading(false);
  };

  const runPrediction = async () => {
    setPredictMode(true);
    setPredictionResult(null);
    setIsLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a fashion AI forecasting engine. Return ONLY a JSON object with this exact structure, no markdown:
{
  "topTrend": "trend name",
  "confidence": 87,
  "growthForecast": "+24%",
  "keyDrivers": ["driver1", "driver2", "driver3"],
  "targetSegment": "segment name",
  "recommendedActions": ["action1", "action2", "action3"],
  "riskFactors": ["risk1", "risk2"],
  "revenueImpact": "$2.4M"
}`,
          messages: [
            {
              role: "user",
              content: `Generate a trend prediction for ${selectedSeason}, ${selectedRegion} market, focusing on ${selectedCategory === "All" ? "all categories" : selectedCategory}.`,
            },
          ],
        }),
      });
      const data = await res.json();
      const text = data.content?.[0]?.text || "{}";
      const clean = text.replace(/```json|```/g, "").trim();
      setPredictionResult(JSON.parse(clean));
    } catch (e) {
      setPredictionResult({ error: "Prediction failed. Please try again." });
    }
    setIsLoading(false);
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "trends", label: "Trend Analysis" },
    { id: "predict", label: "AI Predict" },
    { id: "products", label: "Products" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: "Georgia, serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; scrollbar-width: thin; scrollbar-color: #2A2A3E #0A0A0F; }
        @keyframes bounce { 0%,80%,100%{transform:scale(0)} 40%{transform:scale(1)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        .tab-btn:hover { background: #1A1A26 !important; }
        .card-hover:hover { border-color: #FF3D6B !important; transform: translateY(-2px); transition: all 0.2s; }
        .quick-btn:hover { background: #1A1A26 !important; color: #F0EEF8 !important; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "0 32px" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, background: COLORS.accent, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
              ✦
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px" }}>
                MODEX<span style={{ color: COLORS.accent }}>AI</span>
              </div>
              <div style={{ fontSize: 10, color: COLORS.muted, letterSpacing: 2, textTransform: "uppercase" }}>Fashion Intelligence</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                className="tab-btn"
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 8,
                  border: "none",
                  background: activeTab === t.id ? COLORS.accent : "transparent",
                  color: activeTab === t.id ? "#fff" : COLORS.muted,
                  cursor: "pointer",
                  fontSize: 13,
                  fontFamily: "Georgia, serif",
                  fontWeight: activeTab === t.id ? 700 : 400,
                  transition: "all 0.2s",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer" }}
            >
              {SEASONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, color: COLORS.text, borderRadius: 8, padding: "6px 10px", fontSize: 12, fontFamily: "Georgia, serif", cursor: "pointer" }}
            >
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "28px 32px" }}>

        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 340px", gap: 20 }}>
            {/* KPI Row */}
            <div style={{ gridColumn: "1 / 4", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              {[
                { label: "Trend Score Avg", value: "78.7", unit: "/100", change: "+5.2", color: COLORS.teal },
                { label: "Demand Forecast", value: "94K", unit: " units", change: "+18%", color: COLORS.gold },
                { label: "Active Trends", value: "24", unit: " tracked", change: "+3", color: COLORS.accent },
                { label: "Conversion Lift", value: "32%", unit: "", change: "+7pp", color: COLORS.purple },
              ].map((kpi) => (
                <div key={kpi.label} className="card-hover" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ fontSize: 11, color: COLORS.muted, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10 }}>{kpi.label}</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                    <span style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Playfair Display', serif", color: kpi.color }}>{kpi.value}</span>
                    <span style={{ fontSize: 14, color: COLORS.muted }}>{kpi.unit}</span>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: kpi.change.startsWith("+") ? COLORS.teal : COLORS.accent }}>
                    {kpi.change} vs last season
                  </div>
                </div>
              ))}
            </div>

            {/* Trend Rankings */}
            <div style={{ gridColumn: "1 / 3", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700 }}>Trend Rankings</div>
                <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{selectedSeason}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {SAMPLE_TRENDS.map((t, i) => (
                  <div key={t.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 12, color: COLORS.muted, width: 20 }}>#{i + 1}</span>
                        <span style={{ fontSize: 14 }}>{t.name}</span>
                        <span style={{ fontSize: 10, background: COLORS.surface, border: `1px solid ${COLORS.border}`, padding: "2px 8px", borderRadius: 20, color: COLORS.muted }}>
                          {t.category}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        <span style={{ fontSize: 12, color: t.change > 0 ? COLORS.teal : COLORS.accent }}>
                          {t.change > 0 ? "▲" : "▼"} {Math.abs(t.change)}%
                        </span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: t.color }}>{t.score}</span>
                      </div>
                    </div>
                    <SparkBar value={t.score} color={t.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Performance */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 6 }}>Weekly Performance</div>
              <div style={{ fontSize: 12, color: COLORS.muted, marginBottom: 16 }}>Impressions by week</div>
              <MiniChart data={WEEKLY_DATA} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
                {[
                  { label: "Impressions", value: "95K", color: COLORS.accent },
                  { label: "Conversions", value: "52K", color: COLORS.teal },
                  { label: "Returns", value: "4K", color: COLORS.gold },
                ].map((m) => (
                  <div key={m.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: m.color, fontFamily: "'Playfair Display', serif" }}>{m.value}</div>
                    <div style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Chat Panel */}
            <div style={{ gridRow: "2 / 4", height: 480 }}>
              <AIPanel messages={messages} isLoading={isLoading} onSend={sendMessage} />
            </div>

            {/* Customer Segments */}
            <div style={{ gridColumn: "1 / 2", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Customer Segments</div>
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                <DonutChart segments={CUSTOMER_SEGMENTS} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
                  {CUSTOMER_SEGMENTS.map((s) => (
                    <div key={s.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                        <span style={{ color: COLORS.muted }}>{s.label}</span>
                        <span style={{ color: s.color, fontWeight: 700 }}>{s.pct}%</span>
                      </div>
                      <SparkBar value={s.pct} color={s.color} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ gridColumn: "2 / 4", background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "22px 24px" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Quick Insights</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                {[
                  { q: "Next season's top trend?", icon: "✦" },
                  { q: "Which products to restock?", icon: "◈" },
                  { q: "Fastest growing segment?", icon: "▲" },
                  { q: "Y2K trend forecast 6mo", icon: "⟳" },
                  { q: "Luxury market outlook", icon: "◆" },
                  { q: "Reduce return rates tips", icon: "↓" },
                ].map((item) => (
                  <button
                    key={item.q}
                    className="quick-btn"
                    onClick={() => { setActiveTab("dashboard"); sendMessage(item.q); }}
                    style={{
                      background: COLORS.surface,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 10,
                      padding: "12px 14px",
                      color: COLORS.muted,
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: "Georgia, serif",
                      textAlign: "left",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ color: COLORS.accent, marginRight: 6 }}>{item.icon}</span>
                    {item.q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TRENDS TAB */}
        {activeTab === "trends" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Category Filter */}
              <div style={{ display: "flex", gap: 8 }}>
                {["All", ...CATEGORIES].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: "6px 16px",
                      borderRadius: 20,
                      border: `1px solid ${selectedCategory === cat ? COLORS.accent : COLORS.border}`,
                      background: selectedCategory === cat ? COLORS.accent + "22" : "transparent",
                      color: selectedCategory === cat ? COLORS.accent : COLORS.muted,
                      cursor: "pointer",
                      fontSize: 12,
                      fontFamily: "Georgia, serif",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Trend Cards Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                {SAMPLE_TRENDS.filter((t) => selectedCategory === "All" || t.category === selectedCategory).map((t) => (
                  <div
                    key={t.name}
                    className="card-hover"
                    style={{
                      background: COLORS.card,
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 14,
                      padding: "20px",
                      cursor: "pointer",
                      animation: "fadeIn 0.4s ease",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                      <span style={{ fontSize: 11, background: t.color + "22", color: t.color, padding: "3px 10px", borderRadius: 20 }}>
                        {t.category}
                      </span>
                      <span style={{ fontSize: 11, color: t.change > 0 ? COLORS.teal : COLORS.accent }}>
                        {t.change > 0 ? "▲" : "▼"} {Math.abs(t.change)}%
                      </span>
                    </div>
                    <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 19, fontWeight: 700, marginBottom: 16 }}>{t.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                      <div>
                        <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>TREND SCORE</div>
                        <div style={{ fontSize: 36, fontWeight: 900, color: t.color, fontFamily: "'Playfair Display', serif", lineHeight: 1 }}>{t.score}</div>
                      </div>
                      <div style={{ width: 60, height: 60, borderRadius: "50%", border: `3px solid ${t.color}`, display: "flex", alignItems: "center", justifyContent: "center", background: t.color + "15" }}>
                        <span style={{ fontSize: 22 }}>
                          {t.name.includes("Luxury") ? "◆" : t.name.includes("Y2K") ? "✦" : t.name.includes("Gorp") ? "▲" : t.name.includes("Dop") ? "◉" : t.name.includes("Mini") ? "—" : "❀"}
                        </span>
                      </div>
                    </div>
                    <div style={{ marginTop: 14 }}>
                      <SparkBar value={t.score} color={t.color} />
                    </div>
                    <button
                      onClick={() => sendMessage(`Give me a detailed analysis and 6-month forecast for the ${t.name} trend in ${selectedRegion}`)}
                      style={{
                        marginTop: 14,
                        width: "100%",
                        padding: "8px",
                        background: "transparent",
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 8,
                        color: COLORS.muted,
                        cursor: "pointer",
                        fontSize: 11,
                        fontFamily: "Georgia, serif",
                        transition: "all 0.2s",
                      }}
                    >
                      AI Deep Dive →
                    </button>
                  </div>
                ))}
              </div>

              {/* Trend Velocity Matrix */}
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "22px 24px" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Trend Velocity Matrix</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr", gap: 10, textAlign: "center" }}>
                  {["", "Score", "MoM Chg", "Search Vol", "Social Buzz", "Buy Intent"].map((h) => (
                    <div key={h} style={{ fontSize: 10, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1, paddingBottom: 8, borderBottom: `1px solid ${COLORS.border}` }}>{h}</div>
                  ))}
                  {SAMPLE_TRENDS.map((t) => [
                    <div key={t.name + "n"} style={{ fontSize: 13, textAlign: "left", padding: "8px 0" }}>{t.name}</div>,
                    <div key={t.name + "s"} style={{ color: t.color, fontWeight: 700, padding: "8px 0" }}>{t.score}</div>,
                    <div key={t.name + "c"} style={{ color: t.change > 0 ? COLORS.teal : COLORS.accent, padding: "8px 0" }}>{t.change > 0 ? "+" : ""}{t.change}%</div>,
                    <div key={t.name + "v"} style={{ color: COLORS.muted, padding: "8px 0" }}>{Math.floor(t.score * 1.2)}K</div>,
                    <div key={t.name + "b"} style={{ color: COLORS.muted, padding: "8px 0" }}>{Math.floor(t.score * 0.8)}K</div>,
                    <div key={t.name + "i"} style={{ color: COLORS.muted, padding: "8px 0" }}>{Math.floor(t.score * 0.65)}%</div>,
                  ])}
                </div>
              </div>
            </div>

            {/* Side AI Panel */}
            <div style={{ height: 700 }}>
              <AIPanel messages={messages} isLoading={isLoading} onSend={sendMessage} />
            </div>
          </div>
        )}

        {/* PREDICT TAB */}
        {activeTab === "predict" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
            <div>
              {/* Predict Header */}
              <div style={{ background: `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.purple}22)`, border: `1px solid ${COLORS.accent}44`, borderRadius: 16, padding: "28px 32px", marginBottom: 20 }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
                  AI Trend Prediction Engine
                </div>
                <div style={{ color: COLORS.muted, fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
                  Generate AI-powered fashion trend forecasts tailored to your season, region, and category filters. Predictions are based on social signals, runway data, and historical patterns.
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ fontSize: 12, color: COLORS.muted }}>Season: <span style={{ color: COLORS.text }}>{selectedSeason}</span></div>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.border }} />
                  <div style={{ fontSize: 12, color: COLORS.muted }}>Region: <span style={{ color: COLORS.text }}>{selectedRegion}</span></div>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.border }} />
                  <div style={{ fontSize: 12, color: COLORS.muted }}>Category: <span style={{ color: COLORS.text }}>{selectedCategory}</span></div>
                  <button
                    onClick={runPrediction}
                    style={{
                      marginLeft: "auto",
                      padding: "12px 28px",
                      background: COLORS.accent,
                      border: "none",
                      borderRadius: 10,
                      color: "#fff",
                      cursor: "pointer",
                      fontSize: 14,
                      fontWeight: 700,
                      fontFamily: "Georgia, serif",
                      boxShadow: `0 4px 20px ${COLORS.accent}44`,
                    }}
                  >
                    {isLoading && predictMode ? "Analyzing…" : "✦ Run Prediction"}
                  </button>
                </div>
              </div>

              {/* Prediction Result */}
              {isLoading && predictMode && (
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 40, textAlign: "center" }}>
                  <div style={{ fontSize: 14, color: COLORS.muted, marginBottom: 20 }}>Analyzing runway data, social signals & purchase patterns…</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: COLORS.accent, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}

              {predictionResult && !isLoading && (
                <div style={{ animation: "fadeIn 0.5s ease" }}>
                  {predictionResult.error ? (
                    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.accent}`, borderRadius: 14, padding: 24, color: COLORS.accent }}>{predictionResult.error}</div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      {/* Top Trend */}
                      <div style={{ gridColumn: "1 / 3", background: COLORS.card, border: `1px solid ${COLORS.gold}44`, borderRadius: 14, padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Top Predicted Trend</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: COLORS.gold }}>{predictionResult.topTrend}</div>
                          <div style={{ fontSize: 14, color: COLORS.teal, marginTop: 6 }}>Growth Forecast: {predictionResult.growthForecast}</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 60, fontWeight: 900, fontFamily: "'Playfair Display', serif", color: COLORS.gold, lineHeight: 1 }}>{predictionResult.confidence}</div>
                          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>Confidence %</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.teal, fontFamily: "'Playfair Display', serif" }}>{predictionResult.revenueImpact}</div>
                          <div style={{ fontSize: 11, color: COLORS.muted, textTransform: "uppercase", letterSpacing: 1 }}>Revenue Impact</div>
                        </div>
                      </div>

                      {/* Key Drivers */}
                      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 22px" }}>
                        <div style={{ fontSize: 13, color: COLORS.teal, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Key Drivers</div>
                        {(predictionResult.keyDrivers || []).map((d, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                            <span style={{ color: COLORS.teal, fontSize: 14, marginTop: 1 }}>◈</span>
                            <span style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{d}</span>
                          </div>
                        ))}
                      </div>

                      {/* Recommended Actions */}
                      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 22px" }}>
                        <div style={{ fontSize: 13, color: COLORS.accent, textTransform: "uppercase", letterSpacing: 1, marginBottom: 14 }}>Recommended Actions</div>
                        {(predictionResult.recommendedActions || []).map((a, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                            <span style={{ color: COLORS.accent, fontSize: 14, marginTop: 1 }}>→</span>
                            <span style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.5 }}>{a}</span>
                          </div>
                        ))}
                      </div>

                      {/* Target Segment & Risk */}
                      <div style={{ gridColumn: "1 / 3", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 22px" }}>
                          <div style={{ fontSize: 13, color: COLORS.purple, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Target Segment</div>
                          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700 }}>{predictionResult.targetSegment}</div>
                        </div>
                        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 22px" }}>
                          <div style={{ fontSize: 13, color: COLORS.gold, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Risk Factors</div>
                          {(predictionResult.riskFactors || []).map((r, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <span style={{ color: COLORS.gold }}>⚠</span>
                              <span style={{ fontSize: 13, color: COLORS.muted }}>{r}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!predictionResult && !isLoading && (
                <div style={{ background: COLORS.card, border: `1px dashed ${COLORS.border}`, borderRadius: 14, padding: 60, textAlign: "center" }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✦</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8 }}>Ready to Predict</div>
                  <div style={{ color: COLORS.muted, fontSize: 14 }}>Configure your filters above and click "Run Prediction" to get AI-powered fashion trend forecasts.</div>
                </div>
              )}
            </div>

            <div style={{ height: 700 }}>
              <AIPanel messages={messages} isLoading={isLoading} onSend={sendMessage} />
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, marginBottom: 20 }}>
                Trend-Linked Product Intelligence
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {PRODUCTS.map((p) => (
                  <div
                    key={p.name}
                    className="card-hover"
                    style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "18px 22px", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", alignItems: "center", gap: 16 }}
                  >
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{p.name}</div>
                      <span style={{ fontSize: 11, background: COLORS.accent + "22", color: COLORS.accent, padding: "2px 10px", borderRadius: 20 }}>{p.trend}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 6 }}>Demand</div>
                      <SparkBar value={p.demand} color={COLORS.teal} />
                      <div style={{ fontSize: 12, color: COLORS.teal, marginTop: 4 }}>{p.demand}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>In Stock</div>
                      <div style={{ fontSize: 20, fontWeight: 700, color: p.stock < 20 ? COLORS.accent : COLORS.text, fontFamily: "'Playfair Display', serif" }}>{p.stock}</div>
                      {p.stock < 20 && <div style={{ fontSize: 10, color: COLORS.accent }}>LOW STOCK</div>}
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 4 }}>Price</div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.gold, fontFamily: "'Playfair Display', serif" }}>{p.price}</div>
                    </div>
                    <button
                      onClick={() => sendMessage(`Analyze ${p.name} linked to ${p.trend} trend. Current demand ${p.demand}%, stock ${p.stock} units. Should I restock? What's the 90-day outlook?`)}
                      style={{
                        padding: "8px 14px",
                        background: COLORS.surface,
                        border: `1px solid ${COLORS.border}`,
                        borderRadius: 8,
                        color: COLORS.muted,
                        cursor: "pointer",
                        fontSize: 12,
                        fontFamily: "Georgia, serif",
                      }}
                    >
                      Analyze →
                    </button>
                  </div>
                ))}
              </div>

              {/* Stock Alerts */}
              <div style={{ marginTop: 20, background: COLORS.card, border: `1px solid ${COLORS.accent}44`, borderRadius: 14, padding: "20px 22px" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, marginBottom: 14, color: COLORS.accent }}>⚠ Restock Alerts</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {PRODUCTS.filter((p) => p.stock < 20).map((p) => (
                    <div key={p.name} style={{ background: COLORS.surface, borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: 14 }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: COLORS.muted }}>{p.trend}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.accent, fontFamily: "'Playfair Display', serif" }}>{p.stock}</div>
                        <div style={{ fontSize: 10, color: COLORS.accent }}>units left</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ height: 700 }}>
              <AIPanel messages={messages} isLoading={isLoading} onSend={sendMessage} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
