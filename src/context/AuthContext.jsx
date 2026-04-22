import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('admin_user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock admin authentication
    if (email === 'admin@beauty.com' && password === 'admin123') {
      const adminUser = { uid: 'admin-1', email, role: 'admin', name: 'Admin User' };
      localStorage.setItem('admin_user', JSON.stringify(adminUser));
      setUser(adminUser);
      return true;
    }
    throw new Error('Invalid email or password');
  };

  const logout = () => {
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
