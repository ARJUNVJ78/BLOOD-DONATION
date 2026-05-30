import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('blood_bank_token');
      const savedUser = localStorage.getItem('blood_bank_user');
      
      if (savedToken && savedUser) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { 
              'Authorization': `Bearer ${savedToken}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (res.ok) {
            const freshUser = await res.json();
            setUser(freshUser);
            localStorage.setItem('blood_bank_user', JSON.stringify(freshUser));
          } else {
            // Token is invalid/expired, log out
            logout();
          }
        } catch (error) {
          console.error('Auth verification error (offline fallback):', error);
          // Offline fallback
          setUser(JSON.parse(savedUser));
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Invalid credentials' };
      }

      setUser(data.user);
      localStorage.setItem('blood_bank_user', JSON.stringify(data.user));
      localStorage.setItem('blood_bank_token', data.token);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Cannot connect to backend server' };
    }
  };

  const signup = async (userData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || 'Registration failed' };
      }

      setUser(data.user);
      localStorage.setItem('blood_bank_user', JSON.stringify(data.user));
      localStorage.setItem('blood_bank_token', data.token);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'Cannot connect to backend server' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blood_bank_user');
    localStorage.removeItem('blood_bank_token');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

