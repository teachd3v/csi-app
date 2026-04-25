// Landing page — "The Educator"

const { useState: lpUseState } = React;

function LandingScreen({ onNav }) {
  const [hovered, setHovered] = lpUseState(null);

  return (
    <div className="csi-page csi-landing">
      {/* Top nav */}
      <header className="csi-nav">
        <div className="csi-nav__brand">
          <div className="csi-nav__logo">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <defs>
                <linearGradient id="brand-grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#brand-grad)" />
              <path d="M10 18 L14 22 L22 12" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="csi-nav__name">Sistem CSI</div>
            <div className="csi-nav__sub">Customer Satisfaction Index</div>
          </div>
        </div>
        <nav className="csi-nav__links">
          <a href="#metode">Metodologi</a>
          <a href="#rumus">Rumus</a>
          <a href="#referensi">Referensi</a>
        </nav>
        <div className="csi-nav__actions">
          <Btn kind="ghost" onClick={() => onNav("admin")}>Admin</Btn>
          <Btn kind="primary" onClick={() => onNav("survey")}>Mulai Survey</Btn>
        </div>
      </header>

      {/* Hero */}
      <section className="csi-hero">
        <div className="csi-hero__copy">
          <Pill tone="amber">
            <span className="csi-dot" /> Versi 2.4 · Riset Akademik
          </Pill>
          <h1 className="csi-hero__title">
            Ukur kepuasan pengguna <br />
            dengan <span className="csi-grad-text">presisi metodologis</span>.
          </h1>
          <p className="csi-hero__lead">
            Sistem CSI menggabungkan <b>Skala Likert</b>, <b>Importance–Performance Analysis</b>,
            dan rumus <b>Customer Satisfaction Index</b> dalam satu antarmuka yang elegan —
            dari penyusunan instrumen hingga visualisasi hasil.
          </p>
          <div className="csi-hero__cta">
            <Btn kind="primary" onClick={() => onNav("survey")}>
              Mulai Survey →
            </Btn>
            <Btn kind="secondary" onClick={() => onNav("dashboard")}>
              Lihat Dashboard
            </Btn>
          </div>

          <div className="csi-hero__metrics">
            <div>
              <div className="csi-hero__metric-num">312</div>
              <div className="csi-hero__metric-lbl">Responden bulan ini</div>
            </div>
            <div>
              <div className="csi-hero__metric-num">87,4<span style={{ fontSize: "0.5em", color: "#64748b" }}>%</span></div>
              <div className="csi-hero__metric-lbl">CSI saat ini</div>
            </div>
            <div>
              <div className="csi-hero__metric-num">5</div>
              <div className="csi-hero__metric-lbl">Dimensi SERVQUAL</div>
            </div>
          </div>
        </div>

        {/* Hero glass preview card */}
        <Glass className="csi-hero__preview">
          <div className="csi-hero__preview-head">
            <span className="csi-hero__preview-dot" />
            <span className="csi-hero__preview-dot" />
            <span className="csi-hero__preview-dot" />
            <span className="csi-hero__preview-title">Ringkasan Real-time</span>
          </div>

          <div className="csi-hero__preview-grid">
            <Glass className="csi-hero__mini" hover>
              <div className="csi-hero__mini-lbl">CSI Score</div>
              <div className="csi-hero__mini-num">87,4</div>
              <div className="csi-hero__mini-trend">
                <Sparkline data={[82, 83, 81, 85, 84, 86, 87.4]} color="#1e3a8a" height={32} />
              </div>
              <Pill tone="green">↑ +2,1 dari bulan lalu</Pill>
            </Glass>
            <Glass className="csi-hero__mini" hover>
              <div className="csi-hero__mini-lbl">Responden</div>
              <div className="csi-hero__mini-num" style={{ color: "#854d0e" }}>312</div>
              <div className="csi-hero__mini-trend">
                <Sparkline data={[210, 230, 245, 260, 280, 300, 312]} color="#eab308" height={32} />
              </div>
              <Pill tone="amber">Target 400 / bulan</Pill>
            </Glass>
            <Glass className="csi-hero__dim-prev">
              <div className="csi-hero__dim-prev-head">
                <span>Skor per Dimensi</span>
                <Pill tone="white">Live</Pill>
              </div>
              <div className="csi-hero__dim-list">
                {DIM_SCORES.map((d) => (
                  <div key={d.id} className="csi-hero__dim-row">
                    <span className="csi-hero__dim-name">{d.name}</span>
                    <div className="csi-hero__dim-bar">
                      <div
                        className="csi-hero__dim-fill"
                        style={{ width: `${(d.performance / 5) * 100}%` }}
                      />
                    </div>
                    <span className="csi-hero__dim-num">{d.performance.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </Glass>
          </div>
        </Glass>
      </section>

      {/* Methodology */}
      <section id="metode" className="csi-section">
        <div className="csi-section__head">
          <Pill tone="blue">01 — Metodologi</Pill>
          <h2 className="csi-section__title">Empat tahap, satu indeks.</h2>
          <p className="csi-section__lead">
            Kami menjalankan setiap survey lewat alur metodologis yang konsisten,
            agar setiap angka dapat dipertanggungjawabkan.
          </p>
        </div>

        <div className="csi-method-grid">
          {[
            {
              n: "01", t: "Susun Instrumen",
              d: "Bangun pertanyaan berbasis 5 dimensi SERVQUAL: Tangibles, Reliability, Responsiveness, Assurance, Empathy.",
              ic: "📋"
            },
            {
              n: "02", t: "Kumpulkan Data",
              d: "Responden memberi nilai Importance (harapan) dan Performance (kinerja) pada skala Likert 1–5.",
              ic: "📥"
            },
            {
              n: "03", t: "Hitung Indeks",
              d: "Sistem menghitung MIS, MSS, weight factor, weight score, dan akhirnya nilai CSI total.",
              ic: "🧮"
            },
            {
              n: "04", t: "Visualisasi Hasil",
              d: "Dashboard menyajikan IPA quadrant, distribusi Likert, dan word cloud feedback kualitatif.",
              ic: "📊"
            },
          ].map((s, i) => (
            <Glass
              key={s.n}
              className="csi-method-card"
              hover
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="csi-method-card__num">{s.n}</div>
              <div className="csi-method-card__icon">{s.ic}</div>
              <div className="csi-method-card__title">{s.t}</div>
              <div className="csi-method-card__desc">{s.d}</div>
            </Glass>
          ))}
        </div>
      </section>

      {/* Formula visualization */}
      <section id="rumus" className="csi-section">
        <div className="csi-section__head">
          <Pill tone="amber">02 — Rumus</Pill>
          <h2 className="csi-section__title">Bagaimana CSI dihitung.</h2>
          <p className="csi-section__lead">
            Hover pada setiap variabel untuk melihat penjelasannya.
          </p>
        </div>

        <Glass className="csi-formula">
          <div className="csi-formula__viz">
            <FormulaDiagram />
          </div>

          <div className="csi-formula__legend">
            <div className="csi-formula__leg">
              <span className="csi-formula__leg-key" style={{ background: "#1e3a8a" }}>MIS</span>
              <div>
                <b>Mean Importance Score</b>
                <p>Rata-rata skor harapan responden untuk tiap atribut.</p>
              </div>
            </div>
            <div className="csi-formula__leg">
              <span className="csi-formula__leg-key" style={{ background: "#eab308", color: "#1e293b" }}>MSS</span>
              <div>
                <b>Mean Satisfaction Score</b>
                <p>Rata-rata skor kinerja yang dirasakan responden.</p>
              </div>
            </div>
            <div className="csi-formula__leg">
              <span className="csi-formula__leg-key" style={{ background: "#10b981" }}>WS</span>
              <div>
                <b>Weight Score</b>
                <p>Hasil perkalian Weight Factor × MSS untuk tiap atribut.</p>
              </div>
            </div>
            <div className="csi-formula__leg">
              <span className="csi-formula__leg-key" style={{ background: "#0f172a" }}>5</span>
              <div>
                <b>Skala Maksimum Likert</b>
                <p>Nilai puncak skala (5 = Sangat Puas).</p>
              </div>
            </div>
          </div>
        </Glass>
      </section>

      {/* References */}
      <section id="referensi" className="csi-section">
        <div className="csi-section__head">
          <Pill tone="blue">03 — Referensi Teoretis</Pill>
          <h2 className="csi-section__title">Berdiri di atas literatur yang kokoh.</h2>
        </div>

        <div className="csi-ref-grid">
          {[
            { a: "Parasuraman, Zeithaml, & Berry (1988)", t: "SERVQUAL: A Multiple-Item Scale for Measuring Consumer Perceptions of Service Quality", j: "Journal of Retailing, 64(1), 12–40." },
            { a: "Martilla & James (1977)", t: "Importance-Performance Analysis", j: "Journal of Marketing, 41(1), 77–79." },
            { a: "Likert, R. (1932)", t: "A Technique for the Measurement of Attitudes", j: "Archives of Psychology, 22(140), 1–55." },
            { a: "Stratford-on-Avon DC (2004)", t: "Customer Satisfaction Index Methodology", j: "Public Sector Benchmark Report." },
          ].map((r, i) => (
            <Glass key={i} className="csi-ref-card" hover>
              <div className="csi-ref-card__a">{r.a}</div>
              <div className="csi-ref-card__t">{r.t}</div>
              <div className="csi-ref-card__j">{r.j}</div>
            </Glass>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="csi-section">
        <Glass className="csi-cta">
          <div>
            <h3>Siap mengukur kepuasan pengguna Anda?</h3>
            <p>Mulai dengan instrumen default atau atur sendiri di Admin Setup.</p>
          </div>
          <div className="csi-cta__btns">
            <Btn kind="secondary" onClick={() => onNav("admin")}>Atur Instrumen</Btn>
            <Btn kind="primary" onClick={() => onNav("survey")}>Mulai Survey →</Btn>
          </div>
        </Glass>
      </section>

      <footer className="csi-foot">
        <div>© 2026 Sistem CSI · Dibangun dengan teliti untuk riset</div>
        <div>v2.4.1 · Build #1042</div>
      </footer>
    </div>
  );
}

// Interactive formula diagram
function FormulaDiagram() {
  const [hover, setHover] = lpUseState(null);
  const items = [
    { key: "WS", color: "#10b981", desc: "Weight Score = WF × MSS" },
    { key: "5", color: "#0f172a", desc: "Skala maksimum Likert" },
    { key: "MIS", color: "#1e3a8a", desc: "Mean Importance Score" },
    { key: "MSS", color: "#eab308", desc: "Mean Satisfaction Score" },
  ];

  return (
    <div className="csi-formula-diagram">
      <div className="csi-formula-diagram__eq">
        <span className="csi-formula__token csi-formula__token--name">CSI</span>
        <span className="csi-formula__op">=</span>
        <div className="csi-formula__frac">
          <div className="csi-formula__num">
            <span>Σ</span>
            <span
              className={`csi-formula__chip ${hover === "WS" ? "is-hover" : ""}`}
              style={{ background: "#10b981" }}
              onMouseEnter={() => setHover("WS")}
              onMouseLeave={() => setHover(null)}
            >WS</span>
          </div>
          <div className="csi-formula__bar" />
          <div className="csi-formula__den">
            <span
              className={`csi-formula__chip ${hover === "5" ? "is-hover" : ""}`}
              style={{ background: "#0f172a" }}
              onMouseEnter={() => setHover("5")}
              onMouseLeave={() => setHover(null)}
            >5</span>
            <span>×</span>
            <span>Σ</span>
            <span
              className={`csi-formula__chip ${hover === "MIS" ? "is-hover" : ""}`}
              style={{ background: "#1e3a8a" }}
              onMouseEnter={() => setHover("MIS")}
              onMouseLeave={() => setHover(null)}
            >MIS</span>
          </div>
        </div>
        <span className="csi-formula__op">×</span>
        <span className="csi-formula__token">100%</span>
      </div>

      <div className="csi-formula-diagram__sub">
        <span>WF</span>
        <span className="csi-formula__op">=</span>
        <div className="csi-formula__frac csi-formula__frac--sm">
          <div className="csi-formula__num">
            <span
              className={`csi-formula__chip csi-formula__chip--sm ${hover === "MIS" ? "is-hover" : ""}`}
              style={{ background: "#1e3a8a" }}
            >MIS<sub>i</sub></span>
          </div>
          <div className="csi-formula__bar" />
          <div className="csi-formula__den">
            <span>Σ</span>
            <span
              className={`csi-formula__chip csi-formula__chip--sm ${hover === "MIS" ? "is-hover" : ""}`}
              style={{ background: "#1e3a8a" }}
            >MIS</span>
          </div>
        </div>
        <span className="csi-formula__op">,</span>
        <span style={{ marginLeft: 16 }}>WS</span>
        <span className="csi-formula__op">=</span>
        <span>WF</span>
        <span className="csi-formula__op">×</span>
        <span
          className={`csi-formula__chip csi-formula__chip--sm ${hover === "MSS" ? "is-hover" : ""}`}
          style={{ background: "#eab308", color: "#1e293b" }}
        >MSS</span>
      </div>

      <div className="csi-formula-diagram__hint">
        {hover ? items.find(i => i.key === hover)?.desc : "Hover variabel untuk lihat penjelasan"}
      </div>
    </div>
  );
}

window.LandingScreen = LandingScreen;
