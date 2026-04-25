// Shared glass UI + charts for Sistem CSI

const { useState, useEffect, useRef, useMemo } = React;

// ---------- Glass primitives ----------

function Glass({ children, className = "", style = {}, hover = false, onClick, ...rest }) {
  return (
    <div
      onClick={onClick}
      className={`csi-glass ${hover ? "csi-glass--hover" : ""} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

function Pill({ children, tone = "blue", className = "" }) {
  const tones = {
    blue: { bg: "rgba(30, 58, 138, 0.12)", color: "#1e3a8a", border: "rgba(30, 58, 138, 0.25)" },
    amber: { bg: "rgba(234, 179, 8, 0.18)", color: "#854d0e", border: "rgba(234, 179, 8, 0.4)" },
    green: { bg: "rgba(16, 185, 129, 0.15)", color: "#065f46", border: "rgba(16, 185, 129, 0.3)" },
    white: { bg: "rgba(255,255,255,0.55)", color: "#1e293b", border: "rgba(255,255,255,0.6)" },
  };
  const t = tones[tone] || tones.blue;
  return (
    <span
      className={`csi-pill ${className}`}
      style={{ background: t.bg, color: t.color, borderColor: t.border }}
    >
      {children}
    </span>
  );
}

function Btn({ children, kind = "primary", icon, onClick, className = "", ...rest }) {
  return (
    <button
      onClick={onClick}
      className={`csi-btn csi-btn--${kind} ${className}`}
      {...rest}
    >
      {icon && <span className="csi-btn__icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}

// ---------- Animated mesh background ----------

function MeshBackground({ intensity = "heavy" }) {
  return (
    <div className="csi-mesh" data-intensity={intensity}>
      <div className="csi-mesh__blob csi-mesh__blob--a" />
      <div className="csi-mesh__blob csi-mesh__blob--b" />
      <div className="csi-mesh__blob csi-mesh__blob--c" />
      <div className="csi-mesh__blob csi-mesh__blob--d" />
      <div className="csi-mesh__grain" />
    </div>
  );
}

// ---------- Charts ----------

// Bar chart for dimensions: performance vs importance
function BarChart({ data, maxValue = 5, height = 220 }) {
  const [hover, setHover] = useState(null);
  const W = 100; // percent-based
  const padX = 6;
  const innerW = W - padX * 2;
  const barGroupW = innerW / data.length;
  const barW = barGroupW * 0.32;

  return (
    <div className="csi-chart">
      <svg viewBox={`0 0 100 ${height / 4}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
        {/* gridlines */}
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <line
            key={g}
            x1="0" x2="100"
            y1={height / 4 - g * (height / 4 - 6)} y2={height / 4 - g * (height / 4 - 6)}
            stroke="rgba(30,58,138,0.08)" strokeWidth="0.15" strokeDasharray="0.6 0.6"
          />
        ))}
        {data.map((d, i) => {
          const cx = padX + i * barGroupW + barGroupW / 2;
          const hPerf = (d.performance / maxValue) * (height / 4 - 6);
          const hImp = (d.importance / maxValue) * (height / 4 - 6);
          const baseY = height / 4;
          return (
            <g key={d.id} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect
                x={cx - barW - 0.4} y={baseY - hImp}
                width={barW} height={hImp}
                fill="rgba(234, 179, 8, 0.85)"
                rx="0.6"
                style={{ transition: "all .3s" }}
              />
              <rect
                x={cx + 0.4} y={baseY - hPerf}
                width={barW} height={hPerf}
                fill="rgba(30, 58, 138, 0.92)"
                rx="0.6"
                style={{ transition: "all .3s" }}
              />
              {hover === i && (
                <text
                  x={cx} y={baseY - Math.max(hImp, hPerf) - 1.2}
                  textAnchor="middle" fontSize="2.2" fill="#1e3a8a" fontWeight="700"
                >
                  {d.performance.toFixed(2)} / {d.importance.toFixed(2)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="csi-chart__labels">
        {data.map((d, i) => (
          <div key={d.id} className={`csi-chart__label ${hover === i ? "is-hover" : ""}`}>
            {d.name}
          </div>
        ))}
      </div>
      <div className="csi-chart__legend">
        <span><i style={{ background: "rgba(234, 179, 8, 0.85)" }} />Importance</span>
        <span><i style={{ background: "rgba(30, 58, 138, 0.92)" }} />Performance</span>
      </div>
    </div>
  );
}

// Donut chart for likert distribution
function DonutChart({ segments, size = 200, thickness = 28, centerLabel, centerSub }) {
  const [hover, setHover] = useState(null);
  const total = segments.reduce((s, x) => s + x.value, 0);
  const r = size / 2 - thickness / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  let acc = 0;

  const arcs = segments.map((s, i) => {
    const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += s.value;
    const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const d = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    return { d, color: s.color, value: s.value, label: s.label, i };
  });

  return (
    <div className="csi-donut">
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {arcs.map((a) => (
          <path
            key={a.i}
            d={a.d}
            fill="none"
            stroke={a.color}
            strokeWidth={hover === a.i ? thickness + 6 : thickness}
            strokeLinecap="butt"
            opacity={hover === null || hover === a.i ? 1 : 0.4}
            style={{ transition: "all .25s" }}
            onMouseEnter={() => setHover(a.i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="28" fontWeight="700" fill="#1e3a8a" fontFamily="Space Grotesk">
          {hover !== null ? segments[hover].value : centerLabel}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="11" fill="#475569" fontWeight="500">
          {hover !== null ? segments[hover].label : centerSub}
        </text>
      </svg>
    </div>
  );
}

// Sparkline — small trend
function Sparkline({ data, color = "#1e3a8a", height = 40, fill = true }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return [x, y];
  });
  const pathD = points.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ");
  const areaD = `${pathD} L 100 ${height} L 0 ${height} Z`;
  return (
    <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block" }}>
      {fill && (
        <>
          <defs>
            <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill={`url(#spark-${color.replace("#", "")})`} />
        </>
      )}
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="2" fill={color} />
    </svg>
  );
}

// Radial gauge for the big CSI score
function ScoreGauge({ score, category, size = 240 }) {
  const pct = parseFloat(score) / 100;
  const r = size / 2 - 18;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * pct;
  return (
    <div className="csi-gauge">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id="gauge-grad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="60%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(30, 58, 138, 0.08)" strokeWidth="14" />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke="url(#gauge-grad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 1.2s cubic-bezier(.2,.7,.2,1)" }}
        />
      </svg>
      <div className="csi-gauge__inner">
        <div className="csi-gauge__num">{score}</div>
        <div className="csi-gauge__lbl">CSI Score</div>
        <div className="csi-gauge__cat" style={{ background: category.color }}>{category.label}</div>
      </div>
    </div>
  );
}

// Confetti — vanilla canvas
function fireConfetti() {
  const canvas = document.getElementById("csi-confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.scale(dpr, dpr);
  const W = canvas.offsetWidth;
  const H = canvas.offsetHeight;
  const colors = ["#1e3a8a", "#3b82f6", "#eab308", "#fbbf24", "#10b981", "#f97316"];
  const N = 140;
  const parts = Array.from({ length: N }).map(() => ({
    x: W / 2 + (Math.random() - 0.5) * 100,
    y: H / 2 - 80 + (Math.random() - 0.5) * 40,
    vx: (Math.random() - 0.5) * 12,
    vy: -Math.random() * 14 - 6,
    g: 0.35 + Math.random() * 0.2,
    size: 4 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.3,
    life: 0,
  }));
  let raf;
  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    let alive = 0;
    parts.forEach((p) => {
      p.vy += p.g;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      p.life++;
      if (p.y < H + 20) alive++;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    });
    if (alive > 0) raf = requestAnimationFrame(tick);
    else ctx.clearRect(0, 0, W, H);
  };
  tick();
}

Object.assign(window, {
  Glass, Pill, Btn, MeshBackground, BarChart, DonutChart, Sparkline, ScoreGauge, fireConfetti,
});
