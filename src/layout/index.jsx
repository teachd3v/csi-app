export function MeshBackground({ intensity = "heavy" }) {
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

export function MobileNav({ title, onLogout }) {
  return (
    <header className="csi-nav csi-nav--internal">
      <div className="csi-nav__left">
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
      </div>
      
      <div className="csi-nav__center">
        <div className="csi-survey__title-name">{title}</div>
      </div>
      
      <div className="csi-nav__right">
        {onLogout && (
          <button 
            className="csi-nav__logout-btn"
            onClick={onLogout} 
            title="Logout"
          >
            <span className="csi-nav__logout-icon">🚪</span>
            <span className="csi-nav__logout-text">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
}
