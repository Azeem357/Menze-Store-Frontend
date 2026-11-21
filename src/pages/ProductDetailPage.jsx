// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/api';
import { useCart } from '../context/CartContext';

const NAVY = '#002060';
const GOLD = '#C9A84C';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['#1a1a1a', '#002060', '#4a3728', '#556B2F', '#8B0000'];
const COLOR_NAMES = ['Black', 'Navy', 'Brown', 'Olive', 'Burgundy'];

export default function ProductDetailPage() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty,     setQty]     = useState(1);
  const [loading, setLoading] = useState(true);
  const [added,   setAdded]   = useState(false);
  const [selSize, setSelSize] = useState('M');
  const [selColor,setSelColor]= useState(0);
  const [activeImg,setActiveImg] = useState(0);

  useEffect(() => {
    productAPI.detail(id)
      .then(setProduct)
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAdd() {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
    window.MenzeTracker?.trackAddToCart(product.id, product.name, product.price);
  }

  if (loading) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>Loading…</div>
  );
  if (!product) return null;

  // Create fake gallery images (same img repeated for demo)
  const images = [product.image, product.image, product.image].filter(Boolean);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '24px', fontSize: '0.85rem', color: '#888' }}>
        <span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: GOLD }}>Home</span>
        <span>/</span>
        <span onClick={() => navigate('/products')} style={{ cursor: 'pointer', color: GOLD }}>Shop</span>
        <span>/</span>
        <span style={{ color: '#444' }}>{product.name}</span>
      </div>

      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
        {/* Image Gallery */}
        <div style={{ flex: '0 0 420px' }}>
          <div style={{
            borderRadius: '12px', overflow: 'hidden', marginBottom: '12px',
            background: 'linear-gradient(135deg, #e8ecf4, #d0d8ea)',
            height: '400px',
          }}>
            {product.image
              ? <img
  src={product.image}
  alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>👔</div>
            }
          </div>
          {/* Thumbnail row */}
          {images.length > 0 && (
            <div style={{ display: 'flex', gap: '10px' }}>
              {images.map((img, i) => (
                <div key={i} onClick={() => setActiveImg(i)} style={{
                  width: '72px', height: '72px', borderRadius: '8px', overflow: 'hidden',
                  border: `2px solid ${activeImg === i ? GOLD : '#ddd'}`,
                  cursor: 'pointer', background: '#e8ecf4', flexShrink: 0,
                }}>
                  {img && <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div style={{ flex: 1 }}>
          <p style={{ color: '#999', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 8px' }}>MENZ Collection</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: NAVY, margin: '0 0 16px', lineHeight: 1.2 }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '1.8rem', color: GOLD, fontWeight: 700 }}>
              PKR {parseFloat(product.price).toLocaleString('en-PK')}
            </span>
            <span style={{
              background: product.stock > 0 ? '#e8f5e9' : '#fce8e6',
              color: product.stock > 0 ? '#2e7d32' : '#c62828',
              padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600,
            }}>
              {product.stock > 0 ? `✓ In Stock (${product.stock})` : '✗ Out of Stock'}
            </span>
          </div>

          <p style={{ color: '#555', lineHeight: 1.8, marginBottom: '24px', fontSize: '0.95rem' }}>
            {product.description || 'Premium quality menswear from the MENZ Collection. Crafted with attention to detail for the modern Pakistani gentleman.'}
          </p>

          <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '20px 0', marginBottom: '24px' }}>
            {/* Size Selector */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={sectionLabel}>Select Size</span>
                <span style={{ fontSize: '0.82rem', color: GOLD, cursor: 'pointer' }}>Size Guide</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {SIZES.map(s => (
                  <button key={s} onClick={() => setSelSize(s)} style={{
                    padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
                    border: `2px solid ${selSize === s ? GOLD : '#ddd'}`,
                    background: selSize === s ? GOLD : '#fff',
                    color: selSize === s ? NAVY : '#555',
                    fontWeight: selSize === s ? 700 : 400, fontSize: '0.85rem',
                    transition: 'all 0.15s',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <div style={{ marginBottom: '10px' }}>
                <span style={sectionLabel}>Color: </span>
                <span style={{ fontSize: '0.88rem', color: '#555', fontWeight: 600 }}>{COLOR_NAMES[selColor]}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {COLORS.map((c, i) => (
                  <button key={i} onClick={() => setSelColor(i)} style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    background: c, border: `3px solid ${selColor === i ? GOLD : 'transparent'}`,
                    cursor: 'pointer', outline: selColor === i ? `2px solid ${GOLD}` : 'none',
                    outlineOffset: '2px', transition: 'all 0.15s',
                  }} title={COLOR_NAMES[i]} />
                ))}
              </div>
            </div>
          </div>

          {/* Qty + Add */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: '40px', height: '44px', background: '#f8f8f8', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: NAVY }}>−</button>
              <span style={{ width: '44px', textAlign: 'center', fontWeight: 700, color: NAVY }}>{qty}</span>
              <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ width: '40px', height: '44px', background: '#f8f8f8', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: NAVY }}>+</button>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              style={{
                flex: 1, padding: '14px',
                background: added ? '#27ae60' : product.stock === 0 ? '#ccc' : GOLD,
                color: added ? '#fff' : NAVY,
                border: 'none', borderRadius: '4px',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: '0.95rem',
                letterSpacing: '0.05em', textTransform: 'uppercase',
                transition: 'background 0.2s',
              }}
            >
              {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
          </div>

          <button onClick={() => navigate('/cart')} style={{
            width: '100%', padding: '12px', background: NAVY,
            color: '#fff', border: 'none', borderRadius: '4px',
            cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
            letterSpacing: '0.05em', textTransform: 'uppercase',
          }}>
            View Cart & Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionLabel = { fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#777' };
