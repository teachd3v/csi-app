import { useState } from 'react';

export function BarChart({ data, maxValue = 5, height = 220 }) {
  const [hover, setHover] = useState(null);
  const W = 100;
  const padX = 6;
  const innerW = W - padX * 2;
  const barGroupW = innerW / data.length;
  const barW = barGroupW * 0.32;

  return (
    <div className="csi-chart">
      <svg viewBox={`0 0 100 ${height / 4}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
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

export function DonutChart({ segments, size = 200, thickness = 28, centerLabel, centerSub }) {
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

export function Sparkline({ data, color = "#1e3a8a", height = 40, fill = true }) {
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

export function ScoreGauge({ score, category, size = 240 }) {
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
