import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { MeshBackground } from './components'
import { DEVICE_SIZES } from './data'
import { LandingScreen } from './screens/landing'
import { SurveyScreen } from './screens/survey'
import { DashboardScreen } from './screens/dashboard'
import { LoginScreen } from './screens/login'
import { ErrorBoundary } from './ErrorBoundary'
import { api } from './utils/api'

function AppContent() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("csi_user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [sharedQuestions, setSharedQuestions] = useState([]);
  const [loadingInstruments, setLoadingInstruments] = useState(false);
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

  // Fetch instruments when user program changes or manually
  useEffect(() => {
    const loadInstruments = async () => {
      if (user?.program) {
        setLoadingInstruments(true);
        const res = await api.getInstruments(user.program);
        if (res.status === 'success') {
          setSharedQuestions(res.data);
        }
        setLoadingInstruments(false);
      }
    };
    loadInstruments();
  }, [user?.program]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    sessionStorage.setItem("csi_user", JSON.stringify(userData));
    navigate("/survey");
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem("csi_user");
    navigate("/login");
  };

  const handleNav = (s) => {
    if (s === "landing") navigate("/");
    else navigate(`/${s}`);
  };

  return (
    <ErrorBoundary>
      <div className="csi-device-wrapper">
        <div className="csi-shell">
        <MeshBackground />

        <div key={location.pathname} className="csi-screen-enter">
          <Routes>
            <Route path="/" element={<LandingScreen onNav={handleNav} />} />
            <Route path="/login" element={<LoginScreen onLoginSuccess={handleLoginSuccess} />} />
            <Route 
              path="/survey" 
              element={
                user ? (
                  <SurveyScreen 
                    onNav={handleNav} 
                    questions={sharedQuestions} 
                    user={user} 
                    loading={loadingInstruments}
                    onLogout={handleLogout}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                user && user.role === 'superadmin' ? (
                  <DashboardScreen onNav={handleNav} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" />
                )
              } 
            />
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
