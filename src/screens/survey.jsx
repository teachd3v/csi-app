// Survey screen — multi-step
import { useState, useEffect, useRef } from 'react'
import { Pill, Glass, Btn, fireConfetti } from '../components'
import { QUESTIONS, LIKERT_PERFORMANCE, LIKERT_IMPORTANCE, csiCategory } from '../data'



function SurveyScreen({ onNav }) {
  const totalSteps = QUESTIONS.length;
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("performance"); // performance vs importance — alternating
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState(1);
  const stageRef = useRef(null);

  const q = QUESTIONS[step];
  const progress = ((step + (mode === "importance" ? 0.5 : 0)) / totalSteps) * 100;

  const setAnswer = (val) => {
    setAnswers((a) => ({
      ...a,
      [q.id]: { ...(a[q.id] || {}), [mode]: val },
    }));
  };

  const next = () => {
    if (mode === "performance") {
      setMode("importance");
    } else {
      if (step + 1 < totalSteps) {
        setDirection(1);
        setStep(step + 1);
        setMode("performance");
      } else {
        setDone(true);
        setTimeout(() => fireConfetti(), 200);
      }
    }
  };

  const prev = () => {
    if (mode === "importance") {
      setMode("performance");
    } else if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
      setMode("importance");
    }
  };

  const currentVal = answers[q?.id]?.[mode];

  if (done) {
    return <SurveyDone onNav={onNav} answers={answers} />;
  }

  return (
    <div className="csi-page csi-survey">
      <div className="csi-survey__top">
        <button className="csi-survey__back" onClick={() => onNav("landing")}>
          ← Kembali ke Beranda
        </button>
        <div className="csi-survey__title">
          <div className="csi-survey__title-name">Survey Kepuasan Pengguna</div>
          <div className="csi-survey__title-sub">Sistem CSI · Q1 / 2026</div>
        </div>
        <div className="csi-survey__count">
          {step + 1}<span>/{totalSteps}</span>
        </div>
      </div>

      <div className="csi-survey__progress-wrap">
        <div className="csi-survey__progress-track">
          <div className="csi-survey__progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="csi-survey__progress-meta">
          <span><Pill tone="blue">{q.dimensionName}</Pill></span>
          <span>{Math.round(progress)}% selesai</span>
        </div>
      </div>

      <div className="csi-survey__stage" ref={stageRef}>
        <Glass className="csi-survey__card" key={`${step}-${mode}`}>
          <div className="csi-survey__qhead">
            <Pill tone={mode === "performance" ? "blue" : "amber"}>
              {mode === "performance" ? "Bagian A · Kinerja" : "Bagian B · Harapan"}
            </Pill>
            <span className="csi-survey__qhead-help">
              {mode === "performance"
                ? "Seberapa sesuai pernyataan ini dengan pengalaman Anda?"
                : "Seberapa penting hal ini menurut Anda secara umum?"}
            </span>
          </div>

          <h2 className="csi-survey__qtext">
            <span className="csi-survey__qnum">Q{step + 1}.</span> {q.text}
          </h2>

          <div className="csi-survey__likert">
            {(mode === "performance" ? LIKERT_PERFORMANCE : LIKERT_IMPORTANCE).map((l) => (
              <button
                key={l.value}
                className={`csi-likert ${currentVal === l.value ? "is-active" : ""}`}
                onClick={() => setAnswer(l.value)}
                style={currentVal === l.value ? { borderColor: l.color, background: `${l.color}18` } : {}}
              >
                <div className="csi-likert__emoji">{l.emoji}</div>
                <div className="csi-likert__num">{l.value}</div>
                <div className="csi-likert__lbl">{l.label}</div>
              </button>
            ))}
          </div>

          <div className="csi-survey__nav">
            <Btn kind="ghost" onClick={prev} disabled={step === 0 && mode === "performance"}>
              ← Sebelumnya
            </Btn>
            <div className="csi-survey__steps">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span
                  key={i}
                  className={`csi-survey__step ${i < step ? "is-done" : i === step ? "is-active" : ""}`}
                />
              ))}
            </div>
            <Btn kind="primary" onClick={next} disabled={!currentVal}>
              {step + 1 === totalSteps && mode === "importance" ? "Selesai" : "Lanjut →"}
            </Btn>
          </div>
        </Glass>

        {/* Side hint card */}
        <Glass className="csi-survey__hint">
          <div className="csi-survey__hint-head">
            <Pill tone="white">💡 Panduan</Pill>
          </div>
          <div className="csi-survey__hint-body">
            {mode === "performance" ? (
              <>
                <p><b>Kinerja</b> = pengalaman Anda saat ini.</p>
                <p>Pilih emoji yang paling mewakili perasaan Anda — dari sangat tidak puas (😠) hingga sangat puas (😄).</p>
              </>
            ) : (
              <>
                <p><b>Harapan</b> = seberapa penting aspek ini bagi Anda.</p>
                <p>Jawaban ini akan menjadi bobot (Importance) untuk perhitungan CSI.</p>
              </>
            )}
            <hr />
            <div className="csi-survey__hint-meta">
              <div>Dimensi · <b>{q.dimensionName}</b></div>
              <div>Estimasi sisa · <b>{Math.max(1, Math.round((totalSteps - step) * 0.4))} menit</b></div>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  );
}

function SurveyDone({ onNav, answers }) {
  // Compute personal CSI from answers
  const filled = Object.values(answers).filter((a) => a.performance && a.importance);
  const sumMIS = filled.reduce((s, a) => s + a.importance, 0) || 1;
  const sumWeighted = filled.reduce((s, a) => s + a.importance * a.performance, 0);
  const personalCSI = ((sumWeighted / (5 * sumMIS)) * 100).toFixed(1);
  const cat = csiCategory(personalCSI);

  return (
    <div className="csi-page csi-done">
      <canvas id="csi-confetti" className="csi-confetti" />
      <Glass className="csi-done__card">
        <div className="csi-done__check">
          <svg viewBox="0 0 64 64" width="64" height="64">
            <circle cx="32" cy="32" r="28" fill="rgba(16, 185, 129, 0.18)" />
            <circle cx="32" cy="32" r="20" fill="#10b981" />
            <path d="M22 32 L29 39 L43 25" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2>Terima kasih atas partisipasi Anda!</h2>
        <p>Jawaban Anda telah tercatat dan akan menjadi bagian dari analisis CSI bulan ini.</p>

        <Glass className="csi-done__score">
          <div className="csi-done__score-lbl">Skor CSI personal Anda</div>
          <div className="csi-done__score-num" style={{ color: cat.color }}>{personalCSI}<span>%</span></div>
          <Pill tone="green">{cat.label}</Pill>
        </Glass>

        <div className="csi-done__btns">
          <Btn kind="secondary" onClick={() => onNav("landing")}>← Beranda</Btn>
          <Btn kind="primary" onClick={() => onNav("dashboard")}>Lihat Dashboard →</Btn>
        </div>
      </Glass>
    </div>
  );
}

export { SurveyScreen }
