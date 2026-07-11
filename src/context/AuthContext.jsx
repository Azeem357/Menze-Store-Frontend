// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access');
    if (token) {
      authAPI.me()
        .then(setUser)
        .catch(() => { localStorage.removeItem('access'); localStorage.removeItem('refresh'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  async function login(username, password) {
    const data = await authAPI.login({ username, password });
    localStorage.setItem('access',  data.access);
    localStorage.setItem('refresh', data.refresh);
    const me = await authAPI.me();
    setUser(me);
  }

  async function register(username, email, password, password2) {
    const data = await authAPI.register({ username, email, password, password2 });
    localStorage.setItem('access',  data.access);
    localStorage.setItem('refresh', data.refresh);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
