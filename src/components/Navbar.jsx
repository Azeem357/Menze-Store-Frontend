// src/components/Navbar.jsx
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const NAVY = '#002060';
const GOLD = '#C9A84C';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems }   = useCart();
  const navigate         = useNavigate();
  const location         = useLocation();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? GOLD : '#ccd6f6',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    padding: '4px 0',
    borderBottom: location.pathname === path ? `2px solid ${GOLD}` : '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
  });

  return (
    <nav style={{
      background: NAVY,
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '68px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.7rem',
          fontWeight: 700,
          color: GOLD,
          letterSpacing: '0.15em',
        }}>MENZ</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
        <Link to="/" style={linkStyle('/')}>Home</Link>
        <Link to="/products" style={linkStyle('/products')}>Shop</Link>

        {/* Cart */}
        <Link to="/cart" style={{ ...linkStyle('/cart'), display: 'flex', alignItems: 'center', gap: '6px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Cart
          {totalItems > 0 && (
            <span style={{
              background: GOLD, color: NAVY, borderRadius: '50%',
              width: '18px', height: '18px', fontSize: '0.7rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, marginLeft: '2px',
            }}>{totalItems}</span>
          )}
        </Link>

        {user ? (
          <>
            <Link to="/account" style={linkStyle('/account')}>Account</Link>
            <button onClick={handleLogout} style={{
              background: 'transparent', border: `1px solid ${GOLD}`,
              color: GOLD, padding: '7px 18px', borderRadius: '4px',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              transition: 'background 0.2s, color 0.2s',
            }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle('/login')}>Login</Link>
            <Link to="/register" style={{
              background: GOLD, color: NAVY, padding: '8px 20px',
              borderRadius: '4px', textDecoration: 'none',
              fontSize: '0.82rem', fontWeight: 700,
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
