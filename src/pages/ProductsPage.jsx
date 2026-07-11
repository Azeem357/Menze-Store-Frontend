// src/pages/ProductsPage.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI } from '../api/api';
import { useCart } from '../context/CartContext';

const NAVY = '#002060';
const GOLD = '#C9A84C';

export default function ProductsPage() {
  const [products, setProducts]   = useState([]);
  const [search,   setSearch]     = useState('');
  const [sortBy,   setSortBy]     = useState('default');
  const [priceMax, setPriceMax]   = useState('');
  const [inStock,  setInStock]    = useState(false);
  const [loading,  setLoading]    = useState(true);
  const [page,     setPage]       = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const PER_PAGE = 8;

  useEffect(() => {
    setLoading(true);
    productAPI.list(search)
      .then(data => setProducts(data))
      .catch(() => {})
      .finally(() => { setLoading(false); setPage(1); });
  }, [search]);

  let filtered = [...products];
  if (inStock) filtered = filtered.filter(p => p.stock > 0);
  if (priceMax) filtered = filtered.filter(p => parseFloat(p.price) <= parseFloat(priceMax));
  if (sortBy === 'price_asc')  filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
  if (sortBy === 'price_desc') filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
  if (sortBy === 'name')       filtered.sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'flex', gap: '28px' }}>

      {/* Filter Sidebar */}
      <aside style={{
        width: '240px', flexShrink: 0,
        background: '#fff', borderRadius: '10px',
        padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        alignSelf: 'flex-start', position: 'sticky', top: '88px',
      }}>
        <h3 style={{ color: NAVY, fontFamily: 'Georgia, serif', fontSize: '1.1rem', margin: '0 0 20px', paddingBottom: '12px', borderBottom: `2px solid ${GOLD}` }}>
          Filters
        </h3>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Search</label>
          <input
            style={inputStyle}
            placeholder="Search products…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={labelStyle}>Max Price (PKR)</label>
          <input
            style={inputStyle}
            type="number"
            placeholder="e.g. 15000"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#444', fontSize: '0.88rem', fontWeight: 500 }}>
            <input type="checkbox" checked={inStock} onChange={e => setInStock(e.target.checked)} style={{ accentColor: GOLD, width: '16px', height: '16px' }} />
            In Stock Only
          </label>
        </div>

        <button
          onClick={() => { setSearch(''); setPriceMax(''); setInStock(false); setSortBy('default'); }}
          style={{ width: '100%', padding: '9px', background: '#f0f0f0', border: 'none', borderRadius: '4px', cursor: 'pointer', color: '#666', fontSize: '0.85rem', fontWeight: 600 }}
        >
          Clear Filters
        </button>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontFamily: 'Georgia, serif', color: NAVY, fontSize: '1.6rem', margin: 0 }}>All Products</h1>
            <p style={{ color: '#888', margin: '4px 0 0', fontSize: '0.87rem' }}>{filtered.length} items found</p>
          </div>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            style={{ ...inputStyle, width: 'auto', margin: 0, padding: '9px 14px' }}
          >
            <option value="default">Sort: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>Loading products…</div>
        )}

        {!loading && paged.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
            <p>No products match your filters.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
          {paged.map(product => (
            <div
              key={product.id}
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
                ?  <img
  src={product.image}
  alt={product.name}
  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
/>
                : <div style={{ height: '180px', background: 'linear-gradient(135deg, #e8ecf4, #d0d8ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>👔</div>
              }
              <div style={{ padding: '14px' }}>
                <h4 style={{ margin: '0 0 6px', color: NAVY, fontWeight: 600, fontSize: '0.92rem' }}>{product.name}</h4>
                <p style={{ color: GOLD, fontWeight: 700, fontSize: '1rem', margin: '0 0 6px' }}>
                  PKR {parseFloat(product.price).toLocaleString('en-PK')}
                </p>
                <p style={{ color: product.stock > 0 ? '#27ae60' : '#e74c3c', fontSize: '0.78rem', margin: '0 0 12px', fontWeight: 600 }}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
                <button
                  onClick={e => { e.stopPropagation(); addToCart(product); }}
                  disabled={product.stock === 0}
                  style={{
                    width: '100%', padding: '8px',
                    background: product.stock === 0 ? '#ccc' : GOLD,
                    color: product.stock === 0 ? '#fff' : NAVY,
                    border: 'none', borderRadius: '4px',
                    cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '36px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={pageBtn(page === 1)}>← Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={pageBtn(false, p === page)}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={pageBtn(page === totalPages)}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' };
const inputStyle = { width: '100%', padding: '9px 12px', fontSize: '0.88rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: 0, boxSizing: 'border-box', outline: 'none' };
const pageBtn = (disabled, active = false) => ({
  padding: '8px 14px', borderRadius: '4px', border: `1px solid ${active ? '#002060' : '#ddd'}`,
  background: active ? '#002060' : disabled ? '#f5f5f5' : '#fff',
  color: active ? '#fff' : disabled ? '#bbb' : '#444',
  cursor: disabled ? 'not-allowed' : 'pointer', fontWeight: active ? 700 : 400, fontSize: '0.88rem',
});
