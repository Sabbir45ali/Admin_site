import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bell, Menu, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { getBookings, getReviews } from '../services/api';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = useRef(null);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const [bookings, reviews] = await Promise.all([getBookings(), getReviews()]);

      const pendingAppointments = (bookings || [])
        .filter((app) => {
          const status = String(app.status || '').toLowerCase();
          return status === 'pending' || status === 'reschedule pending admin approval';
        })
        .slice(0, 5)
        .map((app) => ({
          id: `appointment-${app.id}`,
          title: app.status === 'Reschedule pending admin approval' ? 'Reschedule request' : 'New booking request',
          subtitle: `${app.userName || app.userEmail || 'Client'} - ${app.serviceName || app.service || 'Service'}`,
          icon: Clock,
          actionPath: '/appointments',
        }));

      const pendingReviews = (reviews || [])
        .filter((review) => !review.isApproved)
        .slice(0, 5)
        .map((review) => ({
          id: `review-${review.id}`,
          title: 'Review pending approval',
          subtitle: `${review.userName || 'Client'} - ${review.serviceName || 'Service'}`,
          icon: MessageSquare,
          actionPath: '/reviews',
        }));

      setNotifications([...pendingAppointments, ...pendingReviews].slice(0, 8));
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setNotifications([]);
    } finally {
      setNotificationsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [location.pathname]);

  const unreadCount = useMemo(() => notifications.length, [notifications]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans relative">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-sm">
          <div className="flex items-center min-w-0">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="mr-3 p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-md lg:hidden transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800 capitalize truncate">
              {location.pathname === '/' ? 'Dashboard' : location.pathname.substring(1).replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setIsNotificationsOpen((prev) => !prev)}
                className="text-gray-400 hover:text-primary transition-colors relative p-1.5 sm:p-2"
                title="Notifications"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {isNotificationsOpen && (
                <div className="fixed top-20 right-3 sm:right-6 w-[min(22rem,calc(100vw-1rem))] sm:w-80 sm:max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-[60] overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                    <button
                      onClick={fetchNotifications}
                      className="text-xs text-primary font-medium hover:underline"
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notificationsLoading ? (
                      <div className="px-4 py-6 text-sm text-gray-500">Loading notifications...</div>
                    ) : notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-green-500" />
                        No pending items right now
                      </div>
                    ) : (
                      notifications.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              navigate(item.actionPath);
                              setIsNotificationsOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
                          >
                            <div className="flex items-start gap-3">
                              <span className="mt-0.5 text-primary">
                                <Icon className="w-4 h-4" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-800">{item.title}</p>
                                <p className="text-xs text-gray-500 truncate">{item.subtitle}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="h-6 border-l border-gray-200 mx-1 sm:mx-2"></div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm sm:text-base">
                A
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
            </div>
            <button
              onClick={logout}
              className="ml-1 sm:ml-2 text-gray-400 hover:text-red-500 transition-colors p-1.5 sm:p-2"
              title="Logout"
            >
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
