import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { saveAdminFcmToken } from '../services/api';
import { messaging, getToken } from '../firebase/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestNotificationPermission = async () => {
    if (messaging) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
          });
          if (token) {
            await saveAdminFcmToken(token);
          }
        }
      } catch (error) {
        console.error('Failed to get admin FCM token:', error);
      }
    }
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem('admin_user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      // Try to get token if already logged in (user refreshed page)
      requestNotificationPermission();
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && data.token) {
        const adminUser = { uid: data.uid, email, role: 'admin', token: data.token };
        localStorage.setItem('admin_user', JSON.stringify(adminUser));
        setUser(adminUser);

        // Setup push notifications after successful login
        await requestNotificationPermission();

        return true;
      }
      throw new Error(data.message || 'Invalid email or password');
    } catch (err) {
      throw new Error(err.message || 'Failed to authenticate');
    }
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
