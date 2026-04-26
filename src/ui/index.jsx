export function Glass({ children, className = "", style = {}, hover = false, onClick, ...rest }) {
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

export function Pill({ children, tone = "blue", className = "" }) {
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

export function Btn({ children, kind = "primary", icon, onClick, className = "", ...rest }) {
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
