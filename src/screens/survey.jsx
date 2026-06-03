// Survey screen — dynamic multi-step renderer
import { useState, useEffect, useRef } from 'react'
import { Pill, Glass, Btn, MobileNav, fireConfetti } from '../components'
import { api } from '../utils/api'

const EMOJIS = ["😠", "😟", "😐", "🙂", "😄"];
const COLORS = ["#ef4444", "#f97316", "#a3a3a3", "#3b82f6", "#10b981"];

function SurveyScreen({ onNav, questions, user, loading, onLogout }) {
  const totalSteps = questions.length;
  
  // Load initial state from sessionStorage
  const [step, setStep] = useState(() => {
    const savedStep = sessionStorage.getItem(`csi_survey_step_${user.id}`);
    return savedStep ? parseInt(savedStep, 10) : 0;
  });
  
  const [answers, setAnswers] = useState(() => {
    const savedAnswers = sessionStorage.getItem(`csi_survey_answers_${user.id}`);
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [alreadyCompleted, setAlreadyCompleted] = useState(() => {
    return sessionStorage.getItem(`csi_survey_completed_${user.id}`) === 'true';
  });

  const [done, setDone] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false); // Flag untuk auto-next
  const stageRef = useRef(null);

  // 1. Persistence Hook
  useEffect(() => {
    if (!loading && user?.id && !alreadyCompleted && !done) {
      sessionStorage.setItem(`csi_survey_step_${user.id}`, step);
      sessionStorage.setItem(`csi_survey_answers_${user.id}`, JSON.stringify(answers));
    }
  }, [step, answers, user?.id, loading, alreadyCompleted, done]);

  const q = questions[step];

  // 2. Reset flag saat pindah soal
  useEffect(() => {
    setJustCompleted(false);
  }, [step]);

  // 3. Auto-next Hook
  useEffect(() => {
    if (justCompleted && q && q.tipe === "Skala 0-4") {
      const timer = setTimeout(() => {
        next();
        setJustCompleted(false);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [justCompleted, q, step]);
  
  if (loading) {
    return (
      <div className="csi-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="csi-dot" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--csi-muted)' }}>Memuat instrumen survey...</p>
        </div>
      </div>
    );
  }

  // Jika user sudah pernah selesai mengisi di sesi ini, langsung ke halaman Done
  if (alreadyCompleted) {
    return <SurveyDone onNav={onNav} answers={{}} questions={[]} user={user} isAlreadySubmitted={true} onLogout={onLogout} />;
  }

  if (!q) return null;

  const isScale = q.tipe === "Skala 0-4";
  const isSelect = q.tipe === "Select";
  const isEsai = q.tipe === "Esai";

  const config = q.opsi_atau_skala || {};
  const progress = (step / totalSteps) * 100;

  const setAnswer = (val, type) => {
    if (isScale) {
      setAnswers((a) => {
        const newAns = { ...a, [q.kode]: { ...(a[q.kode] || {}), [type]: val } };
        // Cek apakah baru saja lengkap
        const curr = newAns[q.kode];
        if (curr.performance !== undefined && curr.importance !== undefined) {
          setJustCompleted(true);
        }
        return newAns;
      });
    } else {
      setAnswers((a) => ({ ...a, [q.kode]: val }));
    }
  };

  const next = () => {
    if (step + 1 < totalSteps) {
      setStep(step + 1);
    } else {
      setDone(true);
      setTimeout(() => fireConfetti(), 200);
    }
  };

  const prev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const currentVal = answers[q.kode];

  const isNextDisabled = () => {
    if (isScale) {
      const a = answers[q.kode] || {};
      return a.performance === undefined || a.importance === undefined;
    }
    if (isEsai) return !answers[q.kode]?.trim();
    if (isSelect) return answers[q.kode] === undefined;
    return false;
  };

  if (done) {
    return <SurveyDone onNav={onNav} answers={answers} questions={questions} user={user} onLogout={onLogout} />;
  }

  return (
    <div className="csi-page csi-survey">
      <MobileNav 
        title={`Survey ${user.program}`} 
        onNav={onNav}
        onLogout={onLogout}
      />

      <div className="csi-survey__progress-wrap">
        <div className="csi-survey__progress-track">
          <div className="csi-survey__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="csi-survey__progress-meta">
          <span><Pill tone="blue">{q.dimensi || q.atribut || "Survey"}</Pill></span>
          <span>{Math.round(progress)}% selesai</span>
        </div>
      </div>

      <div className="csi-survey__stage" ref={stageRef}>
        <Glass 
          className="csi-survey__card" 
          key={`${step}`}
          style={{ padding: '0', overflow: 'hidden' }}
        >
          {/* Header Panduan di dalam Card */}
          <div style={{ 
            background: 'rgba(30, 58, 138, 0.05)', 
            padding: '28px', 
            borderBottom: '1px solid rgba(30, 58, 138, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* 1. Identitas User di Paling Atas */}
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.08)', 
              padding: '16px 20px', 
              borderRadius: '16px', 
              border: '1px solid rgba(16, 185, 129, 0.2)',
              width: '100%'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>👤</span>
                <div>
                  <div style={{ fontSize: '15px', color: '#065f46', fontWeight: '800', lineHeight: '1.2' }}>{user.nama}</div>
                  <div style={{ fontSize: '12px', color: '#065f46', opacity: 0.7 }}>ID Responden: {user.id}</div>
                </div>
                <div style={{ marginLeft: 'auto', background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '10px', fontWeight: '900', letterSpacing: '0.05em' }}>VERIFIED ✓</div>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '12px', 
                paddingTop: '12px',
                borderTop: '1px solid rgba(16, 185, 129, 0.15)'
              }}>
                <div style={{ fontSize: '12px', color: '#065f46' }}>
                  <span style={{ opacity: 0.6 }}>Jenis Kelamin</span><br /><b>{user.jenis_kelamin === 'Laki-laki' ? 'Laki-laki' : 'Perempuan'}</b>
                </div>
                <div style={{ fontSize: '12px', color: '#065f46' }}>
                  <span style={{ opacity: 0.6 }}>Angkatan</span><br /><b>{user.angkatan}</b>
                </div>
                <div style={{ fontSize: '12px', color: '#065f46' }}>
                  <span style={{ opacity: 0.6 }}>Wilayah</span><br /><b>{user.wilayah}</b>
                </div>
                <div style={{ fontSize: '12px', color: '#065f46' }}>
                  <span style={{ opacity: 0.6 }}>Asal Sekolah/Kampus</span><br /><b>{user.asal_sekolah || user['asal_sekolah/kampus']}</b>
                </div>
              </div>
            </div>

            {/* 2. Metadata (Panduan & Program) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pill tone="white">💡 Panduan Pengisian</Pill>
                <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(30, 58, 138, 0.2)' }} />
                <span style={{ fontSize: '13px', color: 'var(--csi-muted)' }}>Program: <b>{user.program}</b></span>
              </div>
            </div>

            {/* 3. Penjelasan Pernyataan */}
            <div style={{ 
              background: 'white', 
              padding: '16px 20px', 
              borderRadius: '12px', 
              border: '1px dashed rgba(30, 58, 138, 0.2)',
              fontSize: '14px', 
              lineHeight: '1.6', 
              color: 'var(--csi-muted)'
            }}>
              {q.penjelasan}
            </div>
          </div>

          <div style={{ padding: '32px' }}>
            <div className="csi-survey__qhead" style={{ marginBottom: '12px' }}>
              <Pill tone="green">{q.tipe}</Pill>
              {q.atribut && <span style={{ fontSize: '12px', color: 'var(--csi-muted)', marginLeft: '8px' }}>Atribut: <b>{q.atribut}</b></span>}
            </div>

            <h2 className="csi-survey__qtext">
              <span className="csi-survey__qnum">Q{step + 1}.</span> {q.pernyataan}
            </h2>

            {/* RENDERING INPUTS */}
            <div className="csi-survey__body">
              {isScale && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                  <div style={{ background: 'rgba(30, 58, 138, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(30, 58, 138, 0.08)' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <Pill tone="blue">A · Kenyataan (Kondisi Aktual)</Pill>
                      <p style={{ fontSize: '13px', color: 'var(--csi-muted)', marginTop: '8px', marginBottom: 0 }}>
                        Bagaimana <b>kondisi nyata atau kinerja</b> yang Anda rasakan di lapangan saat ini?
                      </p>
                    </div>
                    <div className="csi-survey__likert">
                      {(config.kenyataan || []).map((label, i) => (
                        <button
                          key={i}
                          className={`csi-likert ${answers[q.kode]?.performance === i ? "is-active" : ""}`}
                          onClick={() => setAnswer(i, "performance")}
                          style={answers[q.kode]?.performance === i ? { borderColor: COLORS[i], background: `${COLORS[i]}18` } : {}}
                        >
                          <div className="csi-likert__emoji" style={{ fontSize: '36px' }}>{EMOJIS[i]}</div>
                          <div className="csi-likert__lbl csi-likert__lbl--desktop" style={{ fontSize: '11px', marginTop: '6px' }}>{label}</div>
                        </button>
                      ))}
                    </div>
                    {/* Label Dinamis Mobile (Muncul saat diklik) */}
                    <div className="csi-likert__active-lbl">
                      {answers[q.kode]?.performance !== undefined && (
                        <div style={{ color: COLORS[answers[q.kode].performance], fontWeight: '700' }}>
                          {config.kenyataan[answers[q.kode].performance]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(234, 179, 8, 0.03)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(234, 179, 8, 0.08)' }}>
                    <div style={{ marginBottom: '16px' }}>
                      <Pill tone="amber">B · Harapan (Tingkat Kepentingan)</Pill>
                      <p style={{ fontSize: '13px', color: 'var(--csi-muted)', marginTop: '8px', marginBottom: 0 }}>
                        Seberapa <b>penting atau besar ekspektasi</b> Anda terhadap poin tersebut idealnya?
                      </p>
                    </div>
                    <div className="csi-survey__likert">
                      {(config.harapan || []).map((label, i) => (
                        <button
                          key={i}
                          className={`csi-likert ${answers[q.kode]?.importance === i ? "is-active" : ""}`}
                          onClick={() => setAnswer(i, "importance")}
                          style={answers[q.kode]?.importance === i ? { borderColor: COLORS[i], background: `${COLORS[i]}18` } : {}}
                        >
                          <div className="csi-likert__emoji" style={{ fontSize: '36px' }}>{EMOJIS[i]}</div>
                          <div className="csi-likert__lbl csi-likert__lbl--desktop" style={{ fontSize: '11px', marginTop: '6px' }}>{label}</div>
                        </button>
                      ))}
                    </div>
                    {/* Label Dinamis Mobile (Muncul saat diklik) */}
                    <div className="csi-likert__active-lbl">
                      {answers[q.kode]?.importance !== undefined && (
                        <div style={{ color: COLORS[answers[q.kode].importance], fontWeight: '700' }}>
                          {config.harapan[answers[q.kode].importance]}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {isSelect && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(config.opsi || []).map((opt, i) => (
                    <button
                      key={i}
                      className={`csi-btn ${currentVal === opt ? 'is-active' : ''}`}
                      onClick={() => setAnswer(opt)}
                      style={{ 
                        justifyContent: 'flex-start',
                        background: currentVal === opt ? 'rgba(30, 58, 138, 0.1)' : 'white',
                        borderColor: currentVal === opt ? 'var(--csi-blue)' : 'rgba(30, 58, 138, 0.1)',
                        padding: '16px 20px'
                      }}
                    >
                      <span style={{ 
                        width: '20px', height: '20px', 
                        borderRadius: '50%', border: '2px solid var(--csi-blue)',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: 'transparent',
                        marginRight: '12px'
                      }}>
                        {currentVal === opt && (
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--csi-blue)' }} />
                        )}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {isEsai && (
                <textarea
                  className="csi-admin__q-input"
                  style={{ width: '100%', minHeight: '180px', padding: '20px', fontSize: '15px' }}
                  placeholder="Tuliskan jawaban Anda di sini..."
                  value={currentVal || ""}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              )}
            </div>

            <div className="csi-survey__nav" style={{ marginTop: '40px', paddingTop: '24px' }}>
              <Btn kind="ghost" onClick={prev} disabled={step === 0}>
                ← Sebelumnya
              </Btn>
              <Btn 
                kind="primary" 
                onClick={next} 
                disabled={isNextDisabled()}
              >
                {step + 1 === totalSteps ? "Selesai" : "Lanjut →"}
              </Btn>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}

function SurveyDone({ onNav, answers, questions, user, isAlreadySubmitted }) {
  const [submitting, setSubmitting] = useState(!isAlreadySubmitted);
  const [error, setError] = useState(null);
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (isAlreadySubmitted) {
      setSubmitting(false);
      setTimeout(() => fireConfetti(), 300);
      return;
    }

    // Guard: Prevent double submission in StrictMode
    if (hasSubmitted.current) return;

    const submit = async () => {
      hasSubmitted.current = true;
      // ... (submission logic)
      const kenyataan = {};
      const harapan = {};
      const esai = {};

      questions.forEach(q => {
        const val = answers[q.kode];
        if (q.tipe === "Skala 0-4") {
          kenyataan[q.kode] = val?.performance;
          harapan[q.kode] = val?.importance;
        } else if (q.tipe === "Select" || q.tipe === "Esai") {
          esai[q.kode] = val;
        }
      });

      const res = await api.submitSurvey({
        id: user.id,
        program: user.program,
        jawaban_kenyataan: kenyataan,
        jawaban_harapan: harapan,
        jawaban_esai: esai
      });

      if (res.status === 'success') {
        // Clear persistence on success & mark as fully completed
        sessionStorage.removeItem(`csi_survey_step_${user.id}`);
        sessionStorage.removeItem(`csi_survey_answers_${user.id}`);
        sessionStorage.setItem(`csi_survey_completed_${user.id}`, 'true');
        setSubmitting(false);
        setTimeout(() => fireConfetti(), 300);
      } else {
        setError(res.message || "Gagal mengirim data");
        setSubmitting(false);
      }
    };

    submit();
  }, [isAlreadySubmitted]);

  return (
    <div className="csi-page csi-done">
      {!submitting && !error && <canvas id="csi-confetti" className="csi-confetti" />}
      <Glass className="csi-done__card">
        {submitting ? (
          <div style={{ padding: '40px' }}>
            <div className="csi-dot" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }} />
            <p>Sedang mengirim jawaban Anda...</p>
          </div>
        ) : error ? (
          <div style={{ padding: '40px' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>❌</div>
            <h2>Waduh, ada kendala!</h2>
            <p>{error}</p>
            <Btn kind="primary" onClick={() => window.location.reload()}>Coba Lagi</Btn>
          </div>
        ) : (
          <>
            <div className="csi-done__check">
              <svg viewBox="0 0 64 64" width="64" height="64">
                <circle cx="32" cy="32" r="28" fill="rgba(16, 185, 129, 0.18)" />
                <circle cx="32" cy="32" r="20" fill="#10b981" />
                <path d="M22 32 L29 39 L43 25" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2>Terima kasih, {user.nama}!</h2>
            <p>
              {isAlreadySubmitted 
                ? `Anda sudah menyelesaikan survey program ${user.program} untuk sesi ini.`
                : `Jawaban Anda untuk program ${user.program} telah berhasil tersimpan di sistem kami.`}
            </p>
            <div className="csi-done__btns">
              <Btn kind="primary" onClick={() => onNav("landing")} style={{ minWidth: '200px', justifyContent: 'center' }}>
                ← Kembali ke Beranda
              </Btn>
            </div>
          </>
        )}
      </Glass>
    </div>
  );
}

export { SurveyScreen }
