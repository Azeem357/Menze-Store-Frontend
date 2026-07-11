// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar            from './components/Navbar';
import PrivateRoute      from './components/PrivateRoute';

import HomePage          from './pages/HomePage';
import ProductsPage      from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage          from './pages/CartPage';
import CheckoutPage      from './pages/CheckoutPage';
import OrderDetailPage   from './pages/OrderDetailPage';
import LoginPage         from './pages/LoginPage';
import RegisterPage      from './pages/RegisterPage';
import AccountPage       from './pages/AccountPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div style={{ minHeight: '100vh', background: '#F2F2F2', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          <Navbar />
          <Routes>
            <Route path="/"              element={<HomePage />} />
            <Route path="/products"      element={<ProductsPage />} />
            <Route path="/products/:id"  element={<ProductDetailPage />} />
            <Route path="/cart"          element={<CartPage />} />
            <Route path="/login"         element={<LoginPage />} />
            <Route path="/register"      element={<RegisterPage />} />
            <Route path="/checkout"      element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/orders/:id"    element={<PrivateRoute><OrderDetailPage /></PrivateRoute>} />
            <Route path="/account"       element={<PrivateRoute><AccountPage /></PrivateRoute>} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
