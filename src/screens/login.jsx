import { useState } from 'react';
import { Glass, Pill, Btn } from '../components';
import { api } from '../utils/api';

function LoginScreen({ onLoginSuccess }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await api.login(id, password);
    
    if (res.status === 'success') {
      // Pass both user data and the already_completed flag
      onLoginSuccess(res.user, res.already_completed);
      
      // Smart Routing berdasarkan Role
      if (res.user.role === 'superadmin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/survey';
      }
    } else {
      setError(res.message || 'ID atau Password salah');
    }
    setLoading(false);
  };

  return (
    <div className="csi-page csi-login" style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 100px)',
      paddingTop: '5vh' 
    }}>
      <Glass className="csi-login__card" style={{ padding: '40px', maxWidth: '400px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="csi-nav__logo" style={{ margin: '0 auto 16px' }}>
            <svg viewBox="0 0 32 32" width="48" height="48">
              <defs>
                <linearGradient id="login-grad" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="100%" stopColor="#eab308" />
                </linearGradient>
              </defs>
              <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#login-grad)" />
              <path d="M10 18 L14 22 L22 12" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={{ fontFamily: 'var(--csi-font-display)', marginBottom: '8px' }}>Login Responden</h2>
          <p style={{ color: 'var(--csi-muted)', fontSize: '14px' }}>Silakan masukkan ID dan Password Anda</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="csi-admin__q-body" style={{ display: 'block' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--csi-muted)' }}>ID RESPONDEN</label>
            <input
              type="text"
              className="csi-admin__q-input"
              placeholder="Masukkan ID Anda"
              value={id}
              onChange={(e) => setId(e.target.value)}
              required
              disabled={loading}
              style={{ padding: '12px' }}
            />
          </div>

          <div className="csi-admin__q-body" style={{ display: 'block' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: 'var(--csi-muted)' }}>PASSWORD</label>
            <input
              type="password"
              className="csi-admin__q-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              style={{ padding: '12px' }}
            />
          </div>

          {error && (
            <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '13px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <Btn kind="primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>
            {loading ? 'Memvalidasi...' : 'Masuk →'}
          </Btn>
        </form>
      </Glass>
    </div>
  );
}

export { LoginScreen };
