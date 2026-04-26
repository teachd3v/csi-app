// Survey screen — multi-step
import { useState, useEffect, useRef } from 'react'
import { Pill, Glass, Btn, MobileNav, fireConfetti } from '../components'
import { LIKERT_PERFORMANCE, LIKERT_IMPORTANCE, LIKERT_YES_PERFORMANCE, LIKERT_YES_IMPORTANCE, csiCategory, getInstrument, getSectionInfo } from '../data'



function SurveyScreen({ onNav, questions, activeInstrument }) {
  const instrument = getInstrument(activeInstrument);
  const isCsi = activeInstrument === "csi";
  const totalSteps = questions.length;
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState("performance"); // performance vs importance — alternating (CSI only)
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const [direction, setDirection] = useState(1);
  const stageRef = useRef(null);

  const q = questions[step];
  const progress = ((step + (mode === "importance" ? 0.5 : 0)) / totalSteps) * 100;

  const currentLikert = isCsi
    ? (mode === "importance" ? LIKERT_IMPORTANCE : LIKERT_PERFORMANCE)
    : (mode === "importance" ? LIKERT_YES_IMPORTANCE : LIKERT_YES_PERFORMANCE);

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
    return <SurveyDone onNav={onNav} answers={answers} activeInstrument={activeInstrument} />;
  }

  return (
    <div className="csi-page csi-survey">
      <MobileNav 
        title="Survey CSI" 
        onNav={onNav}
      />

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
          </div>

          <h2 className="csi-survey__qtext">
            <span className="csi-survey__qnum">Q{step + 1}.</span> {(() => {
              const context = mode === "performance"
                ? isCsi
                  ? "Menurut pengalaman Anda, seberapa sesuai bahwa"
                  : "Dalam prakteknya, seberapa baik"
                : isCsi
                ? "Seberapa penting bahwa"
                : "Seberapa penting bahwa";
              return `${context} ${q.text}?`;
            })()}
          </h2>

          <div className="csi-survey__likert">
            {currentLikert.map((l) => (
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
              isCsi ? (
                <>
                  <p><b>Bagian A · Kinerja</b> = pengalaman Anda saat ini.</p>
                  <p>Rating tingkat kepuasan: 1 (😠 sangat tidak puas) hingga 5 (😄 sangat puas).</p>
                </>
              ) : (
                <>
                  <p><b>Bagian A · Kinerja</b> = bagaimana prakteknya di lapangan.</p>
                  <p>Rating tingkat kinerja: 1 (😠 sangat tidak baik) hingga 5 (😄 sangat baik).</p>
                </>
              )
            ) : (
              <>
                <p><b>Bagian B · Harapan</b> = tingkat kepentingan untuk Anda.</p>
                <p>Rating tingkat kepentingan: 1 (😒 tidak penting) hingga 5 (😍 sangat penting).</p>
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

function SurveyDone({ onNav, answers, activeInstrument }) {
  const isCsi = activeInstrument === "csi";
  const instrument = getInstrument(activeInstrument);

  let personalCSI = null;
  let cat = null;

  if (isCsi) {
    // Compute personal CSI from answers (CSI only)
    const filled = Object.values(answers).filter((a) => a.performance && a.importance);
    const sumMIS = filled.reduce((s, a) => s + a.importance, 0) || 1;
    const sumWeighted = filled.reduce((s, a) => s + a.importance * a.performance, 0);
    personalCSI = ((sumWeighted / (5 * sumMIS)) * 100).toFixed(1);
    cat = csiCategory(personalCSI);
  }

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
        <p>Jawaban Anda untuk {instrument.name} telah tercatat dan akan dianalisis lebih lanjut.</p>

        {isCsi && personalCSI && (
          <Glass className="csi-done__score">
            <div className="csi-done__score-lbl">Skor CSI personal Anda</div>
            <div className="csi-done__score-num" style={{ color: cat.color }}>{personalCSI}<span>%</span></div>
            <Pill tone="green">{cat.label}</Pill>
          </Glass>
        )}

        <div className="csi-done__btns">
          <Btn kind="secondary" onClick={() => onNav("landing")}>← Beranda</Btn>
          <Btn kind="primary" onClick={() => onNav("dashboard")}>Lihat Dashboard →</Btn>
        </div>
      </Glass>
    </div>
  );
}

export { SurveyScreen }
