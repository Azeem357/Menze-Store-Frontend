// src/pages/AccountPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../api/api';

const NAVY = '#002060';
const GOLD = '#C9A84C';

const STATUS_BADGE = {
  pending:    { bg: '#fff8e1', color: '#f57f17', label: 'Pending' },
  processing: { bg: '#e3f2fd', color: '#1565c0', label: 'Processing' },
  shipped:    { bg: '#f3e5f5', color: '#6a1b9a', label: 'Shipped' },
  delivered:  { bg: '#e8f5e9', color: '#2e7d32', label: 'Delivered' },
  cancelled:  { bg: '#fce4ec', color: '#b71c1c', label: 'Cancelled' },
};

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    orderAPI.list()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '28px', alignItems: 'flex-start' }}>

      {/* Profile Sidebar */}
      <aside style={{ width: '240px', flexShrink: 0, background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        {/* Avatar area */}
        <div style={{ background: NAVY, padding: '28px 20px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: GOLD, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '1.5rem', fontWeight: 700, color: NAVY }}>
            {(user?.username || 'U')[0].toUpperCase()}
          </div>
          <p style={{ color: '#fff', fontWeight: 700, margin: '0 0 4px', fontSize: '1rem' }}>{user?.username}</p>
          <p style={{ color: '#8a9bc0', fontSize: '0.8rem', margin: 0 }}>{user?.email}</p>
        </div>

        {/* Nav */}
        <div style={{ padding: '12px 0' }}>
          {[
            { id: 'orders', icon: '📦', label: 'My Orders' },
            { id: 'profile', icon: '👤', label: 'Profile' },
          ].map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{
              display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
              padding: '12px 20px', background: tab === item.id ? '#f0f4ff' : 'transparent',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              color: tab === item.id ? NAVY : '#666', fontWeight: tab === item.id ? 700 : 400,
              borderLeft: `3px solid ${tab === item.id ? GOLD : 'transparent'}`,
              fontSize: '0.9rem', transition: 'all 0.15s',
            }}>
              <span>{item.icon}</span>{item.label}
            </button>
          ))}
          <div style={{ borderTop: '1px solid #eee', margin: '8px 0' }} />
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
            padding: '12px 20px', background: 'transparent', border: 'none',
            cursor: 'pointer', color: '#e74c3c', fontWeight: 600, fontSize: '0.9rem',
          }}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {tab === 'orders' && (
          <div>
            <h2 style={{ fontFamily: 'Georgia, serif', color: NAVY, margin: '0 0 20px', fontSize: '1.4rem' }}>My Orders</h2>

            {loading && <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading orders…</div>}

            {!loading && orders.length === 0 && (
              <div style={{ background: '#fff', borderRadius: '10px', padding: '60px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
                <p style={{ color: '#888', margin: 0 }}>You haven't placed any orders yet.</p>
                <button onClick={() => navigate('/products')} style={{ marginTop: '16px', padding: '10px 28px', background: GOLD, color: NAVY, border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem' }}>
                  Start Shopping
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {orders.map(order => {
                const badge = STATUS_BADGE[order.status] || { bg: '#f5f5f5', color: '#555', label: order.status };
                return (
                  <div key={order.id} style={{ background: '#fff', borderRadius: '10px', padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '48px', height: '48px', background: '#f0f4ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>📦</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <p style={{ fontWeight: 700, color: NAVY, margin: '0 0 4px', fontSize: '0.95rem' }}>Order #MNZ-{order.id}</p>
                          <p style={{ color: '#888', fontSize: '0.82rem', margin: 0 }}>{new Date(order.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })} · {order.items?.length || 0} item(s)</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, color: GOLD, fontSize: '1rem', margin: '0 0 6px' }}>PKR {parseFloat(order.total_price).toLocaleString('en-PK', { minimumFractionDigits: 0 })}</p>
                          <span style={{ background: badge.bg, color: badge.color, padding: '3px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700 }}>{badge.label}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      style={{ padding: '8px 18px', background: NAVY, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', letterSpacing: '0.04em', flexShrink: 0 }}
                    >
                      Track →
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'profile' && (
          <div style={{ background: '#fff', borderRadius: '10px', padding: '28px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: 'Georgia, serif', color: NAVY, margin: '0 0 24px', fontSize: '1.4rem' }}>Profile Information</h2>
            <div style={{ display: 'grid', gap: '20px' }}>
              {[
                { label: 'Username', value: user?.username },
                { label: 'Email', value: user?.email },
              ].map(item => (
                <div key={item.label}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: '6px' }}>{item.label}</label>
                  <div style={{ padding: '11px 14px', background: '#f8f8f8', borderRadius: '6px', color: NAVY, fontSize: '0.92rem', fontWeight: 500 }}>{item.value || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
