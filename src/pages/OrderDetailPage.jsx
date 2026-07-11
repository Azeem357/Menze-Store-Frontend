// src/pages/OrderDetailPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/api';

const NAVY = '#002060';
const GOLD = '#C9A84C';

const STATUS_COLORS = {
  pending:    { bg: '#fff8e1', color: '#f57f17' },
  processing: { bg: '#e3f2fd', color: '#1565c0' },
  shipped:    { bg: '#f3e5f5', color: '#6a1b9a' },
  delivered:  { bg: '#e8f5e9', color: '#2e7d32' },
  cancelled:  { bg: '#fce4ec', color: '#b71c1c' },
};

export default function OrderDetailPage() {
  const { id }      = useParams();
  const location    = useLocation();
  const navigate    = useNavigate();
  const [order, setOrder]   = useState(null);
  const [loading, setLoading] = useState(true);
  const success = location.state?.success;

  useEffect(() => {
    orderAPI.detail(id)
      .then(setOrder)
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Loading order…</div>;
  if (!order)  return null;

  const sc = STATUS_COLORS[order.status] || { bg: '#f5f5f5', color: '#555' };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>

      {/* Confirmation banner */}
      {success && (
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{ width: '72px', height: '72px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '2rem' }}>✅</div>
          <h1 style={{ fontFamily: 'Georgia, serif', color: NAVY, margin: '0 0 8px', fontSize: '1.8rem' }}>Order Confirmed!</h1>
          <p style={{ color: '#666', margin: 0 }}>Thank you for shopping with MENZ. Your order is being processed.</p>
        </div>
      )}

      {/* Order card */}
      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,32,96,0.08)' }}>
        {/* Order header */}
        <div style={{ background: NAVY, padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ color: '#8a9bc0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Order ID</p>
            <p style={{ color: '#fff', fontFamily: 'Georgia, serif', fontSize: '1.2rem', margin: '4px 0 0', fontWeight: 700 }}>#MNZ-{order.id}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#8a9bc0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Date</p>
            <p style={{ color: '#fff', fontSize: '0.9rem', margin: '4px 0 0' }}>{new Date(order.created_at).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <span style={{ background: sc.bg, color: sc.color, padding: '6px 16px', borderRadius: '20px', fontWeight: 700, fontSize: '0.82rem', textTransform: 'capitalize' }}>
            {order.status}
          </span>
        </div>

        {/* Items */}
        <div style={{ padding: '24px' }}>
          <h3 style={{ color: NAVY, margin: '0 0 16px', fontSize: '1rem', fontWeight: 700 }}>Items Ordered</h3>
          {order.items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: 600, color: NAVY, fontSize: '0.92rem' }}>{item.product_name}</p>
                <p style={{ margin: 0, color: '#888', fontSize: '0.82rem' }}>× {item.quantity} @ PKR {parseFloat(item.price).toLocaleString('en-PK', { minimumFractionDigits: 0 })}</p>
              </div>
              <span style={{ fontWeight: 700, color: NAVY }}>PKR {parseFloat(item.subtotal).toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
            </div>
          ))}

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0 0', fontWeight: 700, fontSize: '1.05rem' }}>
            <span style={{ color: NAVY }}>Total Paid</span>
            <span style={{ color: GOLD }}>PKR {parseFloat(order.total_price).toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/orders/' + order.id)}
            style={{ flex: 1, padding: '12px', background: NAVY, color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Track Order
          </button>
          <button
            onClick={() => navigate('/products')}
            style={{ flex: 1, padding: '12px', background: GOLD, color: NAVY, border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
