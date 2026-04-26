import { useState } from 'react';

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

export function MobileNav({ title, onNav }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleNav = (target) => {
    setMobileMenuOpen(false);
    onNav(target);
  };

  return (
    <header className={`csi-nav csi-nav--internal ${mobileMenuOpen ? "menu-open" : ""}`}>
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
        <button className="csi-nav__burger" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          ☰
        </button>
      </div>

      <nav className={`csi-nav__links ${mobileMenuOpen ? "is-open" : ""}`}>
        <a href="#" className={title === "Sistem CSI" ? "is-active" : ""} onClick={(e) => { e.preventDefault(); handleNav("landing"); }}>Beranda</a>
        <a href="#" className={title === "Survey CSI" ? "is-active" : ""} onClick={(e) => { e.preventDefault(); handleNav("survey"); }}>Survey</a>
        <a href="#" className={title === "Dashboard" ? "is-active" : ""} onClick={(e) => { e.preventDefault(); handleNav("dashboard"); }}>Dashboard</a>
        <a href="#" className={title === "Admin" ? "is-active" : ""} onClick={(e) => { e.preventDefault(); handleNav("admin"); }}>Admin</a>
      </nav>
    </header>
  );
}
