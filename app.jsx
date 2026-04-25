// Main app shell

const { useState: appUseState, useEffect: appUseEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "glassBlur": 22,
  "glassOpacity": 0.55,
  "accentHue": 220,
  "amberHue": 45,
  "darkMode": false,
  "density": "comfortable",
  "animatedBg": true,
  "showFormulaHints": true
}/*EDITMODE-END*/;

function App() {
  const [screen, setScreen] = appUseState("landing");
  const [sharedQuestions, setSharedQuestions] = appUseState(QUESTIONS);
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweak CSS vars
  appUseEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--csi-glass-blur", `${tweaks.glassBlur}px`);
    root.style.setProperty("--csi-glass-bg", `rgba(255,255,255,${tweaks.glassOpacity})`);
    // Accent hue rotation via OKLCH
    root.style.setProperty("--csi-blue", `oklch(0.32 0.15 ${tweaks.accentHue})`);
    root.style.setProperty("--csi-blue-2", `oklch(0.55 0.18 ${tweaks.accentHue})`);
    root.style.setProperty("--csi-amber", `oklch(0.78 0.15 ${tweaks.amberHue})`);
    root.style.setProperty("--csi-amber-2", `oklch(0.85 0.13 ${tweaks.amberHue})`);
    root.dataset.theme = tweaks.darkMode ? "dark" : "light";
    root.dataset.density = tweaks.density;
  }, [tweaks]);

  appUseEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  const navigate = (s) => setScreen(s);

  return (
    <div className="csi-shell">
      {tweaks.animatedBg && <MeshBackground />}

      <div key={screen} className="csi-screen-enter">
        {screen === "landing" && <LandingScreen onNav={navigate} />}
        {screen === "survey" && <SurveyScreen onNav={navigate} />}
        {screen === "dashboard" && <DashboardScreen onNav={navigate} />}
        {screen === "admin" && (
          <AdminScreen
            onNav={navigate}
            sharedQuestions={sharedQuestions}
            setSharedQuestions={setSharedQuestions}
          />
        )}
      </div>

      {/* Floating screen switcher */}
      <nav className="csi-switcher">
        {[
          { k: "landing", l: "Beranda", ic: "🏠" },
          { k: "survey", l: "Survey", ic: "📝" },
          { k: "dashboard", l: "Dashboard", ic: "📊" },
          { k: "admin", l: "Admin", ic: "⚙" },
        ].map((s) => (
          <button
            key={s.k}
            className={screen === s.k ? "is-active" : ""}
            onClick={() => setScreen(s.k)}
          >
            <span className="csi-switcher__ic">{s.ic}</span>
            <span>{s.l}</span>
          </button>
        ))}
      </nav>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection title="Glass">
          <TweakSlider
            label="Blur"
            value={tweaks.glassBlur}
            onChange={(v) => setTweak("glassBlur", v)}
            min={0} max={40} step={1} unit="px"
          />
          <TweakSlider
            label="Opacity"
            value={tweaks.glassOpacity}
            onChange={(v) => setTweak("glassOpacity", v)}
            min={0.2} max={0.9} step={0.05}
          />
        </TweakSection>

        <TweakSection title="Color">
          <TweakSlider
            label="Primary hue"
            value={tweaks.accentHue}
            onChange={(v) => setTweak("accentHue", v)}
            min={0} max={360} step={5} unit="°"
          />
          <TweakSlider
            label="Accent hue"
            value={tweaks.amberHue}
            onChange={(v) => setTweak("amberHue", v)}
            min={0} max={360} step={5} unit="°"
          />
          <TweakToggle
            label="Dark mode"
            value={tweaks.darkMode}
            onChange={(v) => setTweak("darkMode", v)}
          />
        </TweakSection>

        <TweakSection title="Background">
          <TweakToggle
            label="Animated mesh"
            value={tweaks.animatedBg}
            onChange={(v) => setTweak("animatedBg", v)}
          />
        </TweakSection>

        <TweakSection title="Layout">
          <TweakRadio
            label="Density"
            value={tweaks.density}
            onChange={(v) => setTweak("density", v)}
            options={[
              { value: "compact", label: "Compact" },
              { value: "comfortable", label: "Comfort" },
              { value: "roomy", label: "Roomy" },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("csi-root")).render(<App />);
