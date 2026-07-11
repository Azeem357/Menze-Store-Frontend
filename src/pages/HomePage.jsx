// src/pages/HomePage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/api';
import { useCart } from '../context/CartContext';

const NAVY = '#002060';
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#e8c96a';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.list('').then(data => setFeatured(data.slice(0, 4))).catch(() => {});
  }, []);

  const categories = [
    { name: 'Suits', emoji: '🧥', desc: 'Premium cuts for every occasion', bg: '#0a1a4a' },
    { name: 'Shoes', emoji: '👞', desc: 'Crafted leather & contemporary styles', bg: '#0d2560' },
    { name: 'Watches', emoji: '⌚', desc: 'Timeless luxury on your wrist', bg: '#102870' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #0a2878 50%, #051540 100%)`,
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
        padding: '60px 60px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position:'absolute', right: '-80px', top: '-80px', width:'400px', height:'400px', borderRadius:'50%', border:`2px solid rgba(201,168,76,0.15)`, pointerEvents:'none' }} />
        <div style={{ position:'absolute', right: '60px', top: '60px', width:'260px', height:'260px', borderRadius:'50%', border:`2px solid rgba(201,168,76,0.1)`, pointerEvents:'none' }} />

        <div style={{ maxWidth: '600px', position: 'relative', zIndex: 1 }}>
          <div style={{ color: GOLD, fontSize: '0.8rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '16px', fontWeight: 600 }}>
            New Collection 2025
          </div>
          <h1 style={{
            fontFamily: 'Georgia, serif',
            fontSize: '3.8rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.1,
            margin: '0 0 20px',
          }}>
            Dress Like<br />
            <span style={{ color: GOLD }}>A King.</span>
          </h1>
          <p style={{ color: '#a0b4d0', fontSize: '1.1rem', lineHeight: 1.7, marginBottom: '36px', maxWidth: '460px' }}>
            Premium men's fashion crafted for the modern Pakistani gentleman. Quality you can see, style you can feel.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/products" style={{
              background: GOLD, color: NAVY, padding: '14px 36px',
              borderRadius: '4px', textDecoration: 'none',
              fontWeight: 700, fontSize: '0.95rem', letterSpacing: '0.05em',
              textTransform: 'uppercase', transition: 'background 0.2s',
            }}>Shop Now</Link>
            <Link to="/products" style={{
              background: 'transparent', color: '#fff',
              border: '1px solid rgba(255,255,255,0.4)',
              padding: '14px 36px', borderRadius: '4px',
              textDecoration: 'none', fontWeight: 600,
              fontSize: '0.95rem', letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>View Catalogue</Link>
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div style={{ background: '#F2F2F2', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>Collections</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: NAVY, margin: 0 }}>Shop by Category</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {categories.map(cat => (
              <Link key={cat.name} to={`/products?category=${cat.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: cat.bg,
                  borderRadius: '12px',
                  padding: '48px 32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  boxShadow: '0 4px 20px rgba(0,32,96,0.2)',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,32,96,0.35)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,32,96,0.2)'; }}
                >
                  <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>{cat.emoji}</div>
                  <h3 style={{ color: GOLD, fontFamily: 'Georgia, serif', fontSize: '1.4rem', margin: '0 0 10px', letterSpacing: '0.05em' }}>{cat.name}</h3>
                  <p style={{ color: '#8a9bc0', fontSize: '0.9rem', margin: 0 }}>{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <div style={{ background: '#fff', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ color: GOLD, fontSize: '0.75rem', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '8px' }}>Handpicked</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '2rem', color: NAVY, margin: 0 }}>Featured Products</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {featured.length === 0 ? (
              [1,2,3,4].map(i => (
                <div key={i} style={{ background: '#f8f8f8', borderRadius: '10px', height: '340px', animation: 'pulse 1.5s infinite' }} />
              ))
            ) : featured.map(product => (
              <ProductCard key={product.id} product={product} onAdd={() => addToCart(product)} navigate={navigate} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/products" style={{
              border: `2px solid ${NAVY}`, color: NAVY,
              padding: '12px 40px', borderRadius: '4px',
              textDecoration: 'none', fontWeight: 700,
              fontSize: '0.9rem', letterSpacing: '0.08em',
              textTransform: 'uppercase', display: 'inline-block',
              transition: 'background 0.2s, color 0.2s',
            }}>View All Products</Link>
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ background: NAVY, padding: '40px', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
          {[
            { icon: '🚚', title: 'Free Delivery', sub: 'On orders over PKR 5,000' },
            { icon: '↩️', title: 'Easy Returns', sub: '7-day hassle-free returns' },
            { icon: '🔒', title: 'Secure Payments', sub: 'JazzCash & card accepted' },
          ].map(item => (
            <div key={item.title} style={{ color: '#fff' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ color: GOLD, fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
              <div style={{ color: '#8a9bc0', fontSize: '0.85rem' }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, onAdd, navigate }) {
  const [added, setAdded] = useState(false);
  function handleAdd(e) {
    e.stopPropagation();
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }
  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={{
        background: '#fff', borderRadius: '10px', overflow: 'hidden',
        border: '1px solid #e8e8e8', cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,32,96,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'; }}
    >
      {product.image
        ? <img
  src={product.image}
  alt={product.name}
  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
/>
        : <div style={{ height: '200px', background: 'linear-gradient(135deg, #e8ecf4, #d0d8ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👔</div>
      }
      <div style={{ padding: '16px' }}>
        <p style={{ fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>MENZ Collection</p>
        <h4 style={{ margin: '0 0 8px', color: NAVY, fontWeight: 600, fontSize: '0.95rem' }}>{product.name}</h4>
        <p style={{ color: GOLD, fontWeight: 700, fontSize: '1.05rem', margin: '0 0 14px' }}>
          PKR {parseFloat(product.price).toLocaleString('en-PK')}
        </p>
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          style={{
            width: '100%', padding: '9px',
            background: added ? '#27ae60' : product.stock === 0 ? '#ccc' : GOLD,
            color: added ? '#fff' : product.stock === 0 ? '#fff' : NAVY,
            border: 'none', borderRadius: '4px', cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
            fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.05em',
            textTransform: 'uppercase', transition: 'background 0.2s',
          }}
        >
          {added ? '✓ Added!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
