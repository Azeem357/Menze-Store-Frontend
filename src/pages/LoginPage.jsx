// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAVY = '#002060';
const GOLD = '#C9A84C';

export default function LoginPage() {
  const { login }        = useAuth();
  const navigate         = useNavigate();
  const [params]         = useSearchParams();
  const [form, setForm]  = useState({ username: '', password: '' });
  const [error, setError]= useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(form.username, form.password);
      navigate(params.get('next') || '/');
    } catch (err) {
      setError(err?.detail || 'Invalid credentials. Please try again.');
    } finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#F2F2F2' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Brand mark */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', fontWeight: 700, color: NAVY, letterSpacing: '0.15em' }}>MENZ</div>
          <div style={{ width: '40px', height: '3px', background: GOLD, margin: '8px auto 0' }} />
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', boxShadow: '0 8px 40px rgba(0,32,96,0.1)' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', color: NAVY, margin: '0 0 6px', fontSize: '1.5rem' }}>Welcome Back</h2>
          <p style={{ color: '#888', fontSize: '0.88rem', margin: '0 0 28px' }}>Sign in to your MENZ account</p>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Username</label>
            <input
              style={inputStyle}
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Enter your username"
              required autoFocus
            />
            <label style={labelStyle}>Password</label>
            <input
              type="password" style={inputStyle}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Enter your password"
              required
            />
            {error && (
              <div style={{ background: '#fce8e6', color: '#c62828', padding: '10px 12px', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '16px' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px', background: GOLD,
              color: NAVY, border: 'none', borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700,
              fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#888', fontSize: '0.88rem' }}>
            New to MENZ?{' '}
            <Link to="/register" style={{ color: GOLD, fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '11px 14px', fontSize: '0.92rem', border: '1px solid #e0e0e0', borderRadius: '6px', marginBottom: '18px', boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.2s' };
