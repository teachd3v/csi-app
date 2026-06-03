// Dashboard screen — "The Analyst" (Real-time Version v2)
import { useState, useEffect } from 'react'
import { Glass, Pill, Btn, MobileNav, BarChart, DonutChart, ScoreGauge, Sparkline } from '../components'
import { csiCategory, LIKERT_PERFORMANCE, getPerformanceCategory } from '../data'
import { api } from '../utils/api'

function DashboardScreen({ onNav }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [hoverDim, setHoverDim] = useState(null);
  
  // Filter state
  const [filters, setFilters] = useState({
    program: 'ALL',
    jenis_kelamin: 'ALL',
    angkatan: 'ALL',
    wilayah: 'ALL',
    asal_sekolah: 'ALL'
  });

  const fetchDashboard = async () => {
    setLoading(true);
    const res = await api.getFullDashboardData(filters);
    if (res.status === 'success') {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, [filters]);

  const handleFilterChange = (key, val) => {
    setFilters(prev => {
      const next = { ...prev, [key]: val };
      // Cascading logic: reset children
      if (key === 'program') {
        next.angkatan = 'ALL';
        next.wilayah = 'ALL';
        next.asal_sekolah = 'ALL';
      }
      if (key === 'wilayah') {
        next.asal_sekolah = 'ALL';
      }
      return next;
    });
  };

  const Skeleton = ({ className, style }) => <div className={`csi-skeleton ${className}`} style={style} />;

  if (loading && !data) {
    return (
      <div className="csi-page csi-dash">
        <MobileNav title="Dashboard" onNav={onNav} />
        <div className="csi-filters">
           {[1,2,3,4,5].map(i => <Skeleton key={i} className="csi-filter-group" style={{ height: '40px' }} />)}
        </div>
        <div className="csi-dash__top-grid">
          <Glass className="csi-dash__gauge-card"><Skeleton className="csi-skeleton--num" style={{ height: '200px', width: '100%' }} /></Glass>
          <div className="csi-dash__kpis">
            {[1, 2, 3, 4].map(i => (
              <Glass key={i} className="csi-dash__kpi"><Skeleton className="csi-skeleton--num" style={{ width: '100%' }} /></Glass>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const dashData = data || {};
  const cat = csiCategory(dashData.csi_score || 0);
  const perfCat = getPerformanceCategory(dashData.avg_performance || 0);
  
  const distSegments = (dashData.distribution || [0, 0, 0, 0, 0]).map((v, i) => ({
    value: v,
    label: LIKERT_PERFORMANCE[i].label,
    color: LIKERT_PERFORMANCE[i].color,
  }));

  return (
    <div className="csi-page csi-dash">
      <MobileNav 
        title="Dashboard Analytics" 
        onNav={onNav}
      />

      {/* 1. Filter Bar */}
      <div className="csi-filters">
        <FilterGroup label="Program" value={filters.program} options={dashData.filterOptions?.programs} onChange={v => handleFilterChange('program', v)} />
        <FilterGroup label="Gender" value={filters.jenis_kelamin} options={dashData.filterOptions?.genders} onChange={v => handleFilterChange('jenis_kelamin', v)} />
        <FilterGroup label="Angkatan" value={filters.angkatan} options={dashData.filterOptions?.cohorts} onChange={v => handleFilterChange('angkatan', v)} />
        <FilterGroup label="Wilayah" value={filters.wilayah} options={dashData.filterOptions?.regions} onChange={v => handleFilterChange('wilayah', v)} />
        <FilterGroup label="Asal Sekolah" value={filters.asal_sekolah} options={dashData.filterOptions?.origins} onChange={v => handleFilterChange('asal_sekolah', v)} />
      </div>

      {/* 2. Metrics Grid */}
      <div className="csi-dash__top-grid">
        <Glass className="csi-dash__gauge-card">
          <div className="csi-dash__card-head">
            <span>Skor CSI Total</span>
            <Pill tone="white">Real-time</Pill>
          </div>
          <ScoreGauge score={Math.round(dashData.csi_score || 0)} category={cat} />
          <div className="csi-dash__gauge-foot">
            Berdasarkan <b>{dashData.total_responden} responden</b> · <b>5 dimensi</b>
          </div>
        </Glass>

        <div className="csi-dash__kpis">
          {[
            { 
              lbl: "Total Responden", 
              num: dashData.total_responden || 0, 
              trend: dashData.trend_responden || [0,0,0,0,0,0,0], 
              pill: `Target: ${dashData.target_responden || 0}`, 
              tone: "blue", 
              color: "#1e3a8a",
              desc: "Representasi jumlah sampel data yang dianalisis saat ini."
            },
            { 
              lbl: "Avg. Performance", 
              num: (dashData.avg_performance || 0).toFixed(2), 
              trend: dashData.trend_csi || [0,0,0,0,0,0,0], 
              pill: perfCat.label, 
              tone: "custom",
              customColor: perfCat.color,
              color: perfCat.color,
              desc: "Tingkat kualitas layanan aktual yang dirasakan responden (Skala 0-4)."
            },
            { 
              lbl: "Atribut < Target", 
              num: dashData.low_attributes || 0, 
              trend: [5,4,3,2,1,0, dashData.low_attributes || 0], 
              pill: "Perhatian", 
              tone: "amber", 
              color: "#f97316",
              desc: "Aspek layanan dengan skor di bawah standar minimal (3.8)."
            },
            { 
              lbl: "Total Feedback", 
              num: dashData.qualitative?.length || 0, 
              trend: [0, 1, 2, 3, 5, 8, dashData.qualitative?.length || 0], 
              pill: "Kualitatif", 
              tone: "blue", 
              color: "#3b82f6",
              desc: "Volume pertanyaan kualitatif yang telah mendapatkan respon."
            },
          ].map((k, i) => (
            <Glass key={i} className="csi-dash__kpi" hover style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="csi-dash__kpi-head">
                <span>{k.lbl}</span>
                {k.tone === "custom" ? (
                   <div className="csi-pill" style={{ color: k.color, borderColor: k.color, background: `${k.color}15` }}>
                     <span className="csi-dot" style={{ background: k.color }} /> {k.pill}
                   </div>
                ) : (
                  <Pill tone={k.tone}>{k.pill}</Pill>
                )}
              </div>
              <div className="csi-dash__kpi-num" style={{ marginBottom: '4px' }}>{loading ? '...' : k.num}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Sparkline data={k.trend} color={k.color} height={36} />
              </div>
              <div style={{ 
                marginTop: '12px', 
                paddingTop: '10px', 
                borderTop: '1px solid rgba(30,58,138,0.05)',
                fontSize: '11px',
                color: 'var(--csi-muted)',
                lineHeight: '1.4'
              }}>
                <b>Interpretasi:</b><br />
                {k.desc}
              </div>
            </Glass>
          ))}
        </div>
      </div>

      {/* 3. Tabs */}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="csi-dash__row">
            <Glass className="csi-dash__bar-card">
              <div className="csi-dash__card-head">
                <div>
                  <h3>Skor per Dimensi</h3>
                  <span>Performance vs Importance · skala Likert 0–4</span>
                </div>
                <Pill tone="blue">5 dimensi</Pill>
              </div>
              {loading ? <Skeleton className="csi-skeleton--chart" style={{ height: '300px' }} /> : <BarChart data={dashData.dimensi} maxValue={4} />}
            </Glass>

            <Glass className="csi-dash__donut-card">
              <div className="csi-dash__card-head">
                <h3>Distribusi Jawaban</h3>
                <Pill tone="amber">{dashData.distribution?.reduce((a, b) => a + b, 0)} poin</Pill>
              </div>
              <DonutChart
                segments={distSegments}
                centerLabel={`${(dashData.distribution?.[3] || 0) + (dashData.distribution?.[4] || 0)}`}
                centerSub="Puas + S. Puas"
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

          <Glass style={{ padding: '32px' }}>
            <div className="csi-dash__card-head">
              <div>
                <h3>Detail Sebaran Atribut</h3>
                <span>Sebaran kepuasan untuk setiap butir pernyataan</span>
              </div>
              <Pill tone="white">Real-time Stats</Pill>
            </div>

            {/* Legenda Warna Sebaran */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '12px', 
              marginTop: '16px', 
              padding: '12px 16px', 
              background: 'rgba(255,255,255,0.3)', 
              borderRadius: '8px',
              border: '1px solid rgba(30,58,138,0.05)'
            }}>
              <span style={{ fontSize: '11px', color: 'var(--csi-muted)', fontWeight: '700', marginRight: '4px' }}>LEGENDA:</span>
              {LIKERT_PERFORMANCE.map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i style={{ width: '10px', height: '10px', borderRadius: '2px', background: l.color }} />
                  <span style={{ fontSize: '11px', color: 'var(--csi-text)' }}>{l.label}</span>
                </div>
              ))}
            </div>
            
            <div className="csi-attr-stack">
              {loading ? (
                [1,2,3].map(i => <Skeleton key={i} style={{ height: '60px', borderRadius: '12px' }} />)
              ) : (
                (dashData.attributes || []).map(attr => (
                  <div key={attr.id} className="csi-attr-row">
                    <div className="csi-attr-name">
                      <Pill tone="white" style={{ fontSize: '9px', padding: '2px 6px', marginBottom: '4px' }}>{attr.dim}</Pill><br />
                      {attr.name}
                    </div>
                    <div className="csi-attr-score">
                      <div>{attr.performance.toFixed(2)}</div>
                      {(() => {
                        const cat = getPerformanceCategory(attr.performance);
                        return (
                          <div style={{ 
                            fontSize: '9px', 
                            color: cat.color, 
                            fontWeight: '800', 
                            textTransform: 'uppercase',
                            marginTop: '4px',
                            padding: '2px 6px',
                            background: `${cat.color}15`,
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}>
                            {cat.label}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="csi-attr-dist">
                      {attr.dist.map((count, i) => {
                        const pct = (count / (attr.dist.reduce((a,b)=>a+b,0) || 1)) * 100;
                        return (
                          <div 
                            key={i} 
                            className="csi-dist-segment" 
                            style={{ 
                              width: `${pct}%`, 
                              background: LIKERT_PERFORMANCE[i].color,
                              opacity: count > 0 ? 1 : 0
                            }} 
                            title={`${LIKERT_PERFORMANCE[i].label}: ${count} (${Math.round(pct)}%)`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Glass>
        </div>
      )}
{tab === "quantitative" && (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
    {/* Glosarium Analisis */}
    <Glass style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <Pill tone="blue">📊 Glosarium Analisis Kuantitatif</Pill>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
          <b style={{ color: 'var(--csi-blue)' }}>MIS (Mean Importance Score)</b><br />
          <span style={{ color: 'var(--csi-muted)' }}>Rata-rata tingkat kepentingan/harapan responden terhadap suatu dimensi (Skala 0-4).</span>
        </div>
        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
          <b style={{ color: 'var(--csi-blue)' }}>WF (Weight Factor)</b><br />
          <span style={{ color: 'var(--csi-muted)' }}>Bobot relatif (prosentase) tingkat kepentingan suatu dimensi terhadap total seluruh dimensi.</span>
        </div>
        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
          <b style={{ color: 'var(--csi-blue)' }}>MSS (Mean Satisfaction Score)</b><br />
          <span style={{ color: 'var(--csi-muted)' }}>Rata-rata tingkat kinerja/kenyataan aktual yang dirasakan oleh responden (Skala 0-4).</span>
        </div>
        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
          <b style={{ color: 'var(--csi-blue)' }}>WS (Weight Score)</b><br />
          <span style={{ color: 'var(--csi-muted)' }}>Skor tertimbang (WF × MSS). Menunjukkan kontribusi dimensi tersebut terhadap indeks kepuasan total.</span>
        </div>
        <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
          <b style={{ color: 'var(--csi-blue)' }}>Status (Diagnosa)</b><br />
          <span style={{ color: 'var(--csi-muted)' }}>Evaluasi apakah kinerja dimensi sudah memenuhi target internal (minimal 2.80 atau 70%).</span>
        </div>
      </div>
    </Glass>

    <div className="csi-dash__quant">
      <Glass className="csi-dash__quant-table">
...
            <div className="csi-dash__card-head">
              <h3>Tabel Perhitungan CSI</h3>
              <Pill tone="white">Live Calculation</Pill>
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
              {/* Info Interpretasi Status */}
              <div style={{ padding: '10px 20px', background: 'rgba(30,58,138,0.02)', fontSize: '11px', color: 'var(--csi-muted)', borderBottom: '1px solid rgba(30,58,138,0.05)' }}>
                💡 <b>Status Interpretasi:</b> <span style={{ color: '#065f46' }}>✓ Memenuhi</span> (Skor ≥ 2.8), <span style={{ color: '#854d0e' }}>⚠ Perlu Perhatian</span> (Skor &lt; 2.8)
              </div>
              {(dashData.dimensi || []).map((d) => {
                const ok = d.performance >= 2.8; 
                return (
                  <div
                    key={d.id}
                    className={`csi-dash__tbl-row ${hoverDim === d.id ? "is-hover" : ""}`}
                    onMouseEnter={() => setHoverDim(d.id)}
                    onMouseLeave={() => setHoverDim(null)}
                  >
                    <div><b>{d.name}</b></div>
                    <div>{d.importance.toFixed(2)}</div>
                    <div>{d.wf.toFixed(2)}%</div>
                    <div>{d.performance.toFixed(2)}</div>
                    <div><b>{d.ws.toFixed(3)}</b></div>
                    <div>
                      <Pill tone={ok ? "green" : "amber"}>
                        {ok ? "✓ Memenuhi" : "⚠ Perlu perhatian"}
                      </Pill>
                    </div>
                  </div>
                );
              })}
            </div>
          </Glass>

          <Glass className="csi-dash__ipa">
            <div className="csi-dash__card-head">
              <h3>IPA Quadrant</h3>
              <span>Importance–Performance Analysis</span>
            </div>
            <IPAQuadrant data={dashData.dimensi || []} xThreshold={dashData.avg_importance} yThreshold={dashData.avg_performance} />
          </Glass>
        </div>
      </div>
    )}

      {tab === "qualitative" && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
          {(dashData.qualitative || []).map((q, idx) => (
            <Glass key={q.kode || idx} style={{ padding: '0', overflow: 'hidden', width: '100%' }}>
              <div className="csi-qual-head">
                <div className="csi-qual-q">{q.pertanyaan}</div>
                <div className="csi-qual-meta">{q.tipe} · {q.kode}</div>
              </div>
              <div className="csi-qual-body" style={{ padding: '32px' }}>
                {q.tipe === "Select" ? (
                  <div className="csi-word-cloud" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                    {Object.entries(q.stats || {}).map(([word, count]) => {
                      const size = 12 + (count / (dashData.total_responden || 1)) * 40;
                      return (
                        <span key={word} className="csi-word-chip" style={{ fontSize: `${size}px`, opacity: 0.6 + (count / (dashData.total_responden || 1)) * 0.4 }}>
                          {word} <b style={{ fontSize: '10px', opacity: 0.5 }}>({count})</b>
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(q.jawaban || []).map((text, i) => (
                      <div key={i} className="csi-esai-card" style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.6)', borderRadius: '12px', border: '1px solid rgba(30,58,138,0.05)' }}>
                        "{text}"
                      </div>
                    ))}
                    {(!q.jawaban || q.jawaban.length === 0) && <p style={{ textAlign: 'center', color: 'var(--csi-muted)' }}>Belum ada jawaban.</p>}
                  </div>
                )}
              </div>
            </Glass>
          ))}
          {dashData.qualitative?.length === 0 && <div style={{ textAlign: 'center', padding: '100px' }}>Tidak ada data kualitatif untuk filter ini.</div>}
        </div>
      )}
    </div>
  );
}

function FilterGroup({ label, value, options, onChange }) {
  return (
    <div className="csi-filter-group">
      <span className="csi-filter-label">{label}</span>
      <select className="csi-filter-select" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="ALL">Semua {label}</option>
        {(options || []).map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function IPAQuadrant({ data, xThreshold, yThreshold }) {
  const [hover, setHover] = useState(null);
  const scale = (val) => ((val - 1) / 4) * 100;
  const xMid = scale(xThreshold || 4);
  const yMid = 100 - scale(yThreshold || 4);

  return (
    <div className="csi-ipa">
      <svg viewBox="0 0 100 100" className="csi-ipa__svg">
        <rect x="0" y="0" width={xMid} height={yMid} fill="rgba(234, 179, 8, 0.1)" />
        <rect x={xMid} y="0" width={100 - xMid} height={yMid} fill="rgba(16, 185, 129, 0.12)" />
        <rect x="0" y={yMid} width={xMid} height={100 - yMid} fill="rgba(239, 68, 68, 0.1)" />
        <rect x={xMid} y={yMid} width={100 - xMid} height={100 - yMid} fill="rgba(30, 58, 138, 0.1)" />
        <line x1={xMid} y1="0" x2={xMid} y2="100" stroke="rgba(30,58,138,0.35)" strokeWidth="0.4" strokeDasharray="1 1" />
        <line x1="0" y1={yMid} x2="100" y2={yMid} stroke="rgba(30,58,138,0.35)" strokeWidth="0.4" strokeDasharray="1 1" />
        {data.map((d, i) => {
          const x = scale(d.importance);
          const y = 100 - scale(d.performance);
          return (
            <g key={d.id} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <circle cx={x} cy={y} r={hover === i ? "3.5" : "2.6"} fill="#1e3a8a" stroke="#fff" strokeWidth="0.6" style={{ transition: "all .2s" }} />
              <text x={x + 3} y={y - 1.5} fontSize="2.6" fill="#1e3a8a" fontWeight="700">{d.name}</text>
            </g>
          );
        })}
      </svg>
      <div className="csi-ipa__axes">
        <span>← Importance →</span>
        <span style={{ writingMode: "vertical-rl" }}>← Performance →</span>
      </div>
    </div>
  );
}

export { DashboardScreen }
