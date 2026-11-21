// src/pages/CheckoutPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../api/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAVY = '#002060';
const GOLD = '#C9A84C';

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [payment, setPayment] = useState('jazzcash');
  const [form, setForm] = useState({ name: user?.username || '', phone: '', address: '', city: '', zip: '' });

  if (items.length === 0) { navigate('/'); return null; }

  const shipping = totalPrice >= 5000 ? 0 : 299;
  const grandTotal = totalPrice + shipping;

  function field(name) {
    return { value: form[name], onChange: e => setForm(f => ({ ...f, [name]: e.target.value })) };
  }

  async function handlePlaceOrder() {
    setLoading(true); setError('');
    try {
      const payload = { items: items.map(({ product, quantity }) => ({ product_id: product.id, quantity })) };
      const order = await orderAPI.create(payload);
      window.MenzeTracker?.trackPurchase(order.id, grandTotal, items.map(i => ({ id: i.product.id, name: i.product.name, qty: i.quantity })));
      clearCart();
      navigate(`/orders/${order.id}`, { state: { success: true } });
    } catch (err) {
      const msg = err?.items?.[0] || err?.detail || 'Failed to place order.';
      setError(msg);
    } finally { setLoading(false); }
  }

  const steps = ['Delivery', 'Payment', 'Review'];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', color: NAVY, fontSize: '1.8rem', marginBottom: '28px' }}>Checkout</h1>

      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '36px' }}>
        {steps.map((s, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: done ? GOLD : active ? NAVY : '#e0e0e0',
                  color: done ? NAVY : active ? GOLD : '#aaa',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.3s',
                }}>{done ? '✓' : num}</div>
                <span style={{ fontSize: '0.75rem', fontWeight: active ? 700 : 400, color: active ? NAVY : '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: done ? GOLD : '#e0e0e0', margin: '0 8px', marginBottom: '22px', transition: 'background 0.3s' }} />
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Step content */}
        <div style={{ flex: 1 }}>
          {/* Step 1: Delivery */}
          {step === 1 && (
            <div style={card}>
              <h3 style={cardTitle}>Delivery Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} placeholder="e.g. Ahmad Khan" {...field('name')} />
                </div>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input style={inputStyle} placeholder="03XX-XXXXXXX" {...field('phone')} />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input style={inputStyle} placeholder="e.g. Lahore" {...field('city')} />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={labelStyle}>Delivery Address</label>
                  <input style={inputStyle} placeholder="Street address, area" {...field('address')} />
                </div>
                <div>
                  <label style={labelStyle}>Postal Code</label>
                  <input style={inputStyle} placeholder="54000" {...field('zip')} />
                </div>
              </div>
              <button onClick={() => setStep(2)} style={{ ...goldBtn, marginTop: '20px' }}>Continue to Payment →</button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div style={card}>
              <h3 style={cardTitle}>Payment Method</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                {[
                  { id: 'jazzcash', label: 'JazzCash', desc: 'Pay via JazzCash mobile wallet', badge: { bg: '#d32f2f', text: 'JAZZCASH' } },
                  { id: 'card', label: 'Debit / Credit Card', desc: 'Visa, Mastercard accepted', badge: { bg: '#1a1a1a', text: 'CARD' } },
                  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order', badge: { bg: '#27ae60', text: 'COD' } },
                ].map(opt => (
                  <label key={opt.id} style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    padding: '16px 18px', borderRadius: '8px', cursor: 'pointer',
                    border: `2px solid ${payment === opt.id ? GOLD : '#e0e0e0'}`,
                    background: payment === opt.id ? '#fffdf4' : '#fff',
                    transition: 'all 0.15s',
                  }}>
                    <input type="radio" name="payment" value={opt.id} checked={payment === opt.id} onChange={() => setPayment(opt.id)} style={{ accentColor: GOLD, width: '18px', height: '18px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: NAVY, fontSize: '0.92rem' }}>{opt.label}</div>
                      <div style={{ color: '#888', fontSize: '0.82rem', marginTop: '2px' }}>{opt.desc}</div>
                    </div>
                    <span style={{ background: opt.badge.bg, color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>{opt.badge.text}</span>
                  </label>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(1)} style={outlineBtn}>← Back</button>
                <button onClick={() => setStep(3)} style={{ ...goldBtn, flex: 1 }}>Review Order →</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div style={card}>
              <h3 style={cardTitle}>Review & Confirm</h3>
              <div style={{ marginBottom: '16px', background: '#f8f8f8', borderRadius: '8px', padding: '14px 16px', fontSize: '0.88rem' }}>
                <div style={{ fontWeight: 600, color: NAVY, marginBottom: '8px' }}>📦 Delivery to</div>
                <div style={{ color: '#555' }}>{form.name || user?.username} · {form.phone}</div>
                <div style={{ color: '#555' }}>{form.address}, {form.city} {form.zip}</div>
              </div>
              <div style={{ marginBottom: '20px', background: '#f8f8f8', borderRadius: '8px', padding: '14px 16px', fontSize: '0.88rem' }}>
                <div style={{ fontWeight: 600, color: NAVY, marginBottom: '4px' }}>💳 Payment</div>
                <div style={{ color: '#555' }}>{{ jazzcash: 'JazzCash Wallet', card: 'Debit/Credit Card', cod: 'Cash on Delivery' }[payment]}</div>
              </div>
              {error && <p style={{ color: '#e74c3c', fontSize: '0.88rem', marginBottom: '12px', background: '#fce8e6', padding: '10px 12px', borderRadius: '6px' }}>{error}</p>}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(2)} style={outlineBtn}>← Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} style={{ ...goldBtn, flex: 1, opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Placing Order…' : '✓ Place Order'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div style={{ ...card, width: '260px', flexShrink: 0 }}>
          <h4 style={{ fontFamily: 'Georgia, serif', color: NAVY, margin: '0 0 16px', paddingBottom: '10px', borderBottom: `2px solid ${GOLD}`, fontSize: '1rem' }}>Order Summary</h4>
          {items.map(({ product, quantity }) => (
            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#555' }}>{product.name} × {quantity}</span>
              <span style={{ fontWeight: 600, color: NAVY }}>PKR {(product.price * quantity).toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: '#666' }}>
              <span>Delivery</span><span>{shipping === 0 ? 'FREE' : `PKR ${shipping}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: NAVY }}>
              <span>Total</span><span style={{ color: GOLD }}>PKR {grandTotal.toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const card = { background: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' };
const cardTitle = { fontFamily: 'Georgia, serif', color: '#002060', margin: '0 0 20px', fontSize: '1.1rem' };
const labelStyle = { display: 'block', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '10px 12px', fontSize: '0.9rem', border: '1px solid #ddd', borderRadius: '6px', boxSizing: 'border-box', outline: 'none' };
const goldBtn = { padding: '12px 24px', background: '#C9A84C', color: '#002060', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase', width: '100%' };
const outlineBtn = { padding: '12px 20px', background: '#fff', color: '#555', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' };
