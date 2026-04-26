import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { MeshBackground } from './components'
import { getInstrument, DEVICE_SIZES } from './data'
import { LandingScreen } from './screens/landing'
import { SurveyScreen } from './screens/survey'
import { DashboardScreen } from './screens/dashboard'
import { AdminScreen } from './screens/admin'
import { ErrorBoundary } from './ErrorBoundary'

function AppContent() {
  const [activeInstrument, setActiveInstrument] = useState(() => {
    return localStorage.getItem("csi_active_instrument") || "csi";
  });
  const [sharedQuestions, setSharedQuestions] = useState(() => {
    const initial = localStorage.getItem("csi_active_instrument") || "csi";
    return getInstrument(initial).questions;
  });
  const [darkMode, setDarkMode] = useState(false);
  const [deviceView, setDeviceView] = useState("desktop");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = darkMode ? "dark" : "light";
    root.dataset.deviceView = deviceView;
    const deviceSize = DEVICE_SIZES[deviceView];
    root.style.setProperty("--csi-device-width", deviceSize.width);
  }, [darkMode, deviceView]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("csi_active_instrument", activeInstrument);
    const instrument = getInstrument(activeInstrument);
    setSharedQuestions(instrument.questions);
  }, [activeInstrument]);

  const handleNav = (s) => {
    if (s === "landing") navigate("/");
    else navigate(`/${s}`);
  };

  const currentScreen = location.pathname === "/" ? "landing" : location.pathname.substring(1);

  return (
    <ErrorBoundary>
      <div className="csi-device-wrapper">
        <div className="csi-shell">
        <MeshBackground />

        <div key={location.pathname} className="csi-screen-enter">
          <Routes>
            <Route path="/" element={<LandingScreen onNav={handleNav} activeInstrument={activeInstrument} onInstrumentChange={setActiveInstrument} />} />
            <Route path="/survey" element={<SurveyScreen onNav={handleNav} questions={sharedQuestions} activeInstrument={activeInstrument} />} />
            <Route path="/dashboard" element={<DashboardScreen onNav={handleNav} activeInstrument={activeInstrument} />} />
            <Route path="/admin" element={<AdminScreen onNav={handleNav} sharedQuestions={sharedQuestions} setSharedQuestions={setSharedQuestions} activeInstrument={activeInstrument} />} />
          </Routes>
        </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
