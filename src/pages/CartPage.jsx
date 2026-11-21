// src/pages/CartPage.jsx
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const NAVY = '#002060';
const GOLD = '#C9A84C';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const { user }  = useAuth();
  const navigate  = useNavigate();

  function handleCheckout() {
    if (!user) return navigate('/login?next=/checkout');
    window.MenzeTracker?.trackCheckout(null, totalPrice);
    navigate('/checkout');
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2 style={{ color: NAVY, fontFamily: 'Georgia, serif', margin: 0 }}>Your cart is empty</h2>
        <p style={{ color: '#888', marginTop: '4px' }}>Add some premium items to get started.</p>
        <button onClick={() => navigate('/products')} style={goldBtn}>Browse Products</button>
      </div>
    );
  }

  const shipping = totalPrice >= 5000 ? 0 : 299;
  const grandTotal = totalPrice + shipping;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontFamily: 'Georgia, serif', color: NAVY, fontSize: '1.8rem', marginBottom: '28px' }}>Shopping Cart</h1>

      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start' }}>
        {/* Items */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#fff', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', padding: '14px 20px', background: '#f8f8f8', borderBottom: '1px solid #eee', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#888' }}>
              <span>Product</span><span style={{ textAlign: 'center' }}>Quantity</span><span style={{ textAlign: 'right' }}>Subtotal</span><span />
            </div>

            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '16px', padding: '18px 20px', borderBottom: '1px solid #f0f0f0', alignItems: 'center' }}>
                {/* Product info */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {product.image
                    ? <img src={`http://localhost:8000${product.image}`} alt={product.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }} />
                    : <div style={{ width: '64px', height: '64px', background: '#e8ecf4', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>👔</div>
                  }
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600, color: NAVY, fontSize: '0.92rem' }}>{product.name}</p>
                    <p style={{ margin: 0, color: '#888', fontSize: '0.82rem' }}>PKR {parseFloat(product.price).toLocaleString('en-PK')} each</p>
                  </div>
                </div>

                {/* Qty */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} style={{ width: '32px', height: '32px', background: '#f8f8f8', border: 'none', cursor: 'pointer', color: NAVY, fontWeight: 700 }}>−</button>
                    <span style={{ padding: '0 12px', fontWeight: 600, color: NAVY }}>{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} style={{ width: '32px', height: '32px', background: '#f8f8f8', border: 'none', cursor: 'pointer', color: NAVY, fontWeight: 700 }}>+</button>
                  </div>
                </div>

                {/* Subtotal */}
                <div style={{ textAlign: 'right', fontWeight: 700, color: NAVY }}>
                  PKR {(quantity * parseFloat(product.price)).toLocaleString('en-PK')}
                </div>

                {/* Remove */}
                <button onClick={() => removeFromCart(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ccc', fontSize: '1.1rem', padding: '4px' }} title="Remove">✕</button>
              </div>
            ))}

            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={clearCart} style={{ background: 'none', border: 'none', color: '#bbb', cursor: 'pointer', fontSize: '0.85rem' }}>Clear Cart</button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div style={{ width: '300px', background: '#fff', borderRadius: '10px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', flexShrink: 0 }}>
          <h3 style={{ fontFamily: 'Georgia, serif', color: NAVY, margin: '0 0 20px', paddingBottom: '12px', borderBottom: `2px solid ${GOLD}` }}>Order Summary</h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: '#555' }}>
            <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
            <span style={{ fontWeight: 600, color: NAVY }}>PKR {totalPrice.toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '0.9rem', color: '#555' }}>
            <span>Delivery</span>
            <span style={{ fontWeight: 600, color: shipping === 0 ? '#27ae60' : NAVY }}>
              {shipping === 0 ? 'FREE' : `PKR ${shipping}`}
            </span>
          </div>
          {shipping > 0 && (
            <p style={{ fontSize: '0.78rem', color: '#888', background: '#f8f8f8', padding: '8px 10px', borderRadius: '4px', margin: '0 0 16px' }}>
              Add PKR {(5000 - totalPrice).toLocaleString('en-PK')} more for free delivery
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '2px solid #eee', marginBottom: '20px' }}>
            <span style={{ fontWeight: 700, color: NAVY, fontSize: '1rem' }}>Total</span>
            <span style={{ fontWeight: 700, color: GOLD, fontSize: '1.2rem' }}>PKR {grandTotal.toLocaleString('en-PK', { minimumFractionDigits: 0 })}</span>
          </div>

          {/* Payment icons */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', background: '#f8f8f8', padding: '10px 12px', borderRadius: '6px' }}>
            <span style={{ fontSize: '0.78rem', color: '#888' }}>Pay via:</span>
            <span style={{ background: '#d32f2f', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', letterSpacing: '0.03em' }}>JazzCash</span>
            <span style={{ background: '#1a1a1a', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>CARD</span>
          </div>

          <button onClick={handleCheckout} style={goldBtn}>
            Proceed to Checkout →
          </button>
          <button onClick={() => navigate('/products')} style={{ width: '100%', padding: '10px', background: 'none', border: `1px solid #ddd`, color: '#666', borderRadius: '4px', cursor: 'pointer', marginTop: '10px', fontSize: '0.85rem' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

const goldBtn = {
  width: '100%', padding: '13px', background: '#C9A84C',
  color: '#002060', border: 'none', borderRadius: '4px',
  cursor: 'pointer', fontWeight: 700, fontSize: '0.92rem',
  letterSpacing: '0.05em', textTransform: 'uppercase',
};
