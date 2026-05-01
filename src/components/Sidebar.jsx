import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CalendarDays,
  Scissors,
  Gift,
  Star,
  Settings,
  X,
  MessageSquareShare,
  Bell,
  Camera
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Appointments', path: '/appointments', icon: CalendarCheck },
    { name: 'Calendar', path: '/calendar', icon: CalendarDays },
    { name: 'Services', path: '/services', icon: Scissors },
    { name: 'Lookbook', path: '/lookbook', icon: Camera },
    { name: 'Offers', path: '/offers', icon: Gift },
    { name: 'Loyalty', path: '/loyalty', icon: Star },
    { name: 'Reviews', path: '/reviews', icon: MessageSquareShare },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-xl lg:shadow-none
      transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="p-6 border-b border-gray-100 flex items-center justify-between lg:justify-center shrink-0">
        <h2 className="text-2xl font-bold text-primary">Beauty<span className="text-gray-800">Admin</span></h2>
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden p-1 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors group ${isActive
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-400 shrink-0">
        &copy; 2026 Beauty Parlour
      </div>
    </div>
  );
};

export default Sidebar;
