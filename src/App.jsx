import { useState, useEffect } from 'react'
import { MeshBackground } from './components'
import { QUESTIONS, DEVICE_SIZES } from './data'
import { LandingScreen } from './screens/landing'
import { SurveyScreen } from './screens/survey'
import { DashboardScreen } from './screens/dashboard'
import { AdminScreen } from './screens/admin'
import { ErrorBoundary } from './ErrorBoundary'

function App() {
  const [screen, setScreen] = useState("landing");
  const [sharedQuestions, setSharedQuestions] = useState(QUESTIONS);
  const [darkMode, setDarkMode] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop");

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = darkMode ? "dark" : "light";
    root.dataset.deviceView = deviceView;
    const deviceSize = DEVICE_SIZES[deviceView];
    root.style.setProperty("--csi-device-width", deviceSize.width);
  }, [darkMode, deviceView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [screen]);

  const navigate = (s) => setScreen(s);

  return (
    <ErrorBoundary>
      <div className="csi-device-wrapper">
        <div className="csi-shell">
        <MeshBackground />

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
              onClick={() => navigate(s.k)}
            >
              <span className="csi-switcher__ic">{s.ic}</span>
              <span>{s.l}</span>
            </button>
          ))}
        </nav>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
