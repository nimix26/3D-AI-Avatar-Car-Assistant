import React, { createContext, useContext, useState, useEffect } from 'react';

// Your backend server address
const API_URL = 'http://localhost:3000/api'; // (backend-gemini port)

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.error('Failed to fetch user', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
    } else {
      throw new Error(data.error || 'Failed to login');
    }
  };

  const signup = async (fullName, email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign up');
    }
    return data; // Returns { message: "..." }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, API_URL }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);