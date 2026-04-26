// Dashboard screen — "The Analyst"
import { useState } from 'react'
import { Glass, Pill, Btn, MobileNav, BarChart, DonutChart, ScoreGauge, Sparkline } from '../components'
import { DIM_SCORES, SCORE_DISTRIBUTION, LIKERT_PERFORMANCE, CSI_SCORE, WORDS, FEEDBACK, csiCategory, getInstrument, flattenDimensions } from '../data'



function DashboardScreen({ onNav, activeInstrument }) {
  const [hoverDim, setHoverDim] = useState(null);
  const [tab, setTab] = useState("overview");
  const cat = csiCategory(CSI_SCORE);
  const instrument = getInstrument(activeInstrument);

  const distSegments = SCORE_DISTRIBUTION.map((v, i) => ({
    value: v,
    label: LIKERT_PERFORMANCE[i].label,
    color: LIKERT_PERFORMANCE[i].color,
  }));

  return (
    <div className="csi-page csi-dash">
      <MobileNav 
        title="Dashboard" 
        onNav={onNav}
      />

      {/* Top row: gauge + KPI cards */}
      <div className="csi-dash__top-grid">
        <Glass className="csi-dash__gauge-card">
          <div className="csi-dash__card-head">
            <span>Skor CSI Total</span>
            <Pill tone="white">↑ +2,1</Pill>
          </div>
          <ScoreGauge score={CSI_SCORE} category={cat} />
          <div className="csi-dash__gauge-foot">
            Berdasarkan <b>312 responden</b> · <b>12 atribut</b> · <b>5 dimensi</b>
          </div>
        </Glass>

        <div className="csi-dash__kpis">
          {[
            { lbl: "Responden", num: "312", trend: [210, 230, 245, 260, 280, 300, 312], pill: "↑ 18%", tone: "blue", color: "#1e3a8a" },
            { lbl: "Completion Rate", num: "94,2%", trend: [88, 89, 91, 90, 92, 93, 94.2], pill: "Stabil", tone: "green", color: "#10b981" },
            { lbl: "Avg. Performance", num: "4,34", trend: [4.1, 4.2, 4.15, 4.25, 4.3, 4.32, 4.34], pill: "↑ 0,12", tone: "amber", color: "#eab308" },
            { lbl: "Atribut < target", num: "2", trend: [4, 4, 3, 3, 3, 2, 2], pill: "Membaik", tone: "green", color: "#f97316" },
          ].map((k, i) => (
            <Glass key={i} className="csi-dash__kpi" hover>
              <div className="csi-dash__kpi-head">
                <span>{k.lbl}</span>
                <Pill tone={k.tone}>{k.pill}</Pill>
              </div>
              <div className="csi-dash__kpi-num">{k.num}</div>
              <Sparkline data={k.trend} color={k.color} height={36} />
            </Glass>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="csi-dash__tabs">
        {[
          { k: "overview", l: "Overview" },
          { k: "quantitative", l: "Kuantitatif" },
          { k: "qualitative", l: "Kualitatif" },
        ].map((t) => (
          <button
            key={t.k}
            className={`csi-dash__tab ${tab === t.k ? "is-active" : ""}`}
            onClick={() => setTab(t.k)}
          >
            {t.l}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="csi-dash__row">
          <Glass className="csi-dash__bar-card">
            <div className="csi-dash__card-head">
              <div>
                <h3>Skor per Dimensi</h3>
                <span>Performance vs Importance · skala Likert 1–5</span>
              </div>
              <Pill tone="blue">5 dimensi</Pill>
            </div>
            <BarChart data={DIM_SCORES} />
          </Glass>

          <Glass className="csi-dash__donut-card">
            <div className="csi-dash__card-head">
              <h3>Distribusi Jawaban</h3>
              <Pill tone="amber">{SCORE_DISTRIBUTION.reduce((a, b) => a + b, 0)} jawaban</Pill>
            </div>
            <DonutChart
              segments={distSegments}
              centerLabel={`${SCORE_DISTRIBUTION[3] + SCORE_DISTRIBUTION[4]}`}
              centerSub="Puas + Sangat Puas"
            />
            <div className="csi-dash__legend">
              {distSegments.map((s, i) => (
                <div key={i} className="csi-dash__legend-row">
                  <i style={{ background: s.color }} />
                  <span>{s.label}</span>
                  <b>{s.value}</b>
                </div>
              ))}
            </div>
          </Glass>
        </div>
      )}

      {tab === "quantitative" && (
        <div className="csi-dash__quant">
          <Glass className="csi-dash__quant-table">
            <div className="csi-dash__card-head">
              <h3>Tabel Perhitungan CSI</h3>
              <Pill tone="white">Live</Pill>
            </div>
            <div className="csi-dash__tbl">
              <div className="csi-dash__tbl-head">
                <div>Dimensi</div>
                <div>MIS</div>
                <div>WF (%)</div>
                <div>MSS</div>
                <div>WS</div>
                <div>Status</div>
              </div>
              {(() => {
                const sumMIS = DIM_SCORES.reduce((s, d) => s + d.importance, 0);
                return DIM_SCORES.map((d) => {
                  const wf = (d.importance / sumMIS) * 100;
                  const ws = (wf / 100) * d.performance;
                  const ok = d.performance >= 4.3;
                  return (
                    <div
                      key={d.id}
                      className={`csi-dash__tbl-row ${hoverDim === d.id ? "is-hover" : ""}`}
                      onMouseEnter={() => setHoverDim(d.id)}
                      onMouseLeave={() => setHoverDim(null)}
                    >
                      <div><b>{d.name}</b></div>
                      <div>{d.importance.toFixed(2)}</div>
                      <div>{wf.toFixed(2)}%</div>
                      <div>{d.performance.toFixed(2)}</div>
                      <div><b>{ws.toFixed(3)}</b></div>
                      <div>
                        <Pill tone={ok ? "green" : "amber"}>
                          {ok ? "✓ Memenuhi" : "⚠ Perlu perhatian"}
                        </Pill>
                      </div>
                    </div>
                  );
                });
              })()}
              <div className="csi-dash__tbl-sum">
                <div>Total</div>
                <div>{DIM_SCORES.reduce((s, d) => s + d.importance, 0).toFixed(2)}</div>
                <div>100%</div>
                <div>—</div>
                <div>
                  <b>{DIM_SCORES.reduce((s, d) => {
                    const wf = d.importance / DIM_SCORES.reduce((x, y) => x + y.importance, 0);
                    return s + wf * d.performance;
                  }, 0).toFixed(3)}</b>
                </div>
                <div><Pill tone="amber">CSI = {CSI_SCORE}%</Pill></div>
              </div>
            </div>
          </Glass>

          <Glass className="csi-dash__ipa">
            <div className="csi-dash__card-head">
              <h3>IPA Quadrant</h3>
              <span>Importance–Performance</span>
            </div>
            <IPAQuadrant />
          </Glass>
        </div>
      )}

      {tab === "qualitative" && (
        <div className="csi-dash__qual">
          <Glass className="csi-dash__cloud">
            <div className="csi-dash__card-head">
              <h3>Word Cloud Feedback</h3>
              <Pill tone="amber">{WORDS.length} keyword</Pill>
            </div>
            <WordCloud />
          </Glass>

          <Glass className="csi-dash__feedback">
            <div className="csi-dash__card-head">
              <h3>Feedback Terbuka</h3>
              <span>{FEEDBACK.length} dari 312 responden</span>
            </div>
            <div className="csi-dash__fb-list">
              {FEEDBACK.map((f, i) => (
                <Glass key={i} className="csi-dash__fb" hover>
                  <div className="csi-dash__fb-head">
                    <div className="csi-dash__fb-avatar" style={{ background: avatarColor(f.name) }}>
                      {f.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <div className="csi-dash__fb-name">{f.name}</div>
                      <div className="csi-dash__fb-role">{f.role}</div>
                    </div>
                    <div className="csi-dash__fb-score">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span key={j} style={{ opacity: j < f.score ? 1 : 0.2 }}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="csi-dash__fb-text">"{f.text}"</div>
                </Glass>
              ))}
            </div>
          </Glass>
        </div>
      )}
    </div>
  );
}

function avatarColor(name) {
  const palette = ["#1e3a8a", "#3b82f6", "#eab308", "#10b981", "#f97316", "#8b5cf6", "#ec4899", "#0ea5e9"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function IPAQuadrant() {
  const [hover, setHover] = useState(null);
  // Bigger viewBox: x = importance, y = performance, both 1..5
  const xMid = 4.4; // mean importance threshold
  const yMid = 4.3; // mean performance threshold
  return (
    <div className="csi-ipa">
      <svg viewBox="0 0 100 100" className="csi-ipa__svg">
        {/* quadrant fills */}
        <rect x="0" y="0" width="50" height="50" fill="rgba(234, 179, 8, 0.1)" />
        <rect x="50" y="0" width="50" height="50" fill="rgba(239, 68, 68, 0.12)" />
        <rect x="0" y="50" width="50" height="50" fill="rgba(16, 185, 129, 0.1)" />
        <rect x="50" y="50" width="50" height="50" fill="rgba(30, 58, 138, 0.1)" />
        {/* axes */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(30,58,138,0.35)" strokeWidth="0.4" strokeDasharray="1 1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(30,58,138,0.35)" strokeWidth="0.4" strokeDasharray="1 1" />

        {DIM_SCORES.map((d, i) => {
          const x = ((d.importance - 3.5) / 1.5) * 100;
          const y = 100 - ((d.performance - 3.5) / 1.5) * 100;
          return (
            <g key={d.id} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <circle cx={x} cy={y} r={hover === i ? "3.5" : "2.6"} fill="#1e3a8a" stroke="#fff" strokeWidth="0.6" style={{ transition: "all .2s" }} />
              <text x={x + 3} y={y - 1.5} fontSize="2.6" fill="#1e3a8a" fontWeight="700">{d.name}</text>
            </g>
          );
        })}

        {/* labels */}
        <text x="3" y="6" fontSize="2.8" fontWeight="700" fill="#854d0e">II · Concentrate Here</text>
        <text x="65" y="6" fontSize="2.8" fontWeight="700" fill="#991b1b">I · Keep Up The Good Work</text>
        <text x="3" y="96" fontSize="2.8" fontWeight="700" fill="#065f46">III · Low Priority</text>
        <text x="65" y="96" fontSize="2.8" fontWeight="700" fill="#1e3a8a">IV · Possible Overkill</text>
      </svg>
      <div className="csi-ipa__axes">
        <span>← Importance →</span>
        <span style={{ writingMode: "vertical-rl" }}>← Performance →</span>
      </div>
    </div>
  );
}

function WordCloud() {
  const max = Math.max(...WORDS.map((w) => w.n));
  const min = Math.min(...WORDS.map((w) => w.n));
  return (
    <div className="csi-cloud-wrap">
      {WORDS.map((w, i) => {
        const t = (w.n - min) / (max - min);
        const size = 14 + t * 36;
        const colors = ["#1e3a8a", "#3b82f6", "#eab308", "#854d0e", "#475569"];
        const c = colors[i % colors.length];
        const rot = (i % 3 === 0 && t < 0.5) ? -6 : 0;
        return (
          <span
            key={w.w}
            className="csi-cloud__w"
            style={{
              fontSize: size,
              color: c,
              opacity: 0.45 + t * 0.55,
              fontWeight: t > 0.5 ? 700 : 500,
              transform: `rotate(${rot}deg)`,
            }}
            title={`${w.w} — ${w.n}×`}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
}

export { DashboardScreen }
