import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../services/api';
import { Users, CalendarCheck, CalendarDays, Star } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    todaysAppointmentsCount: 0,
    avgLoyaltyPoints: 0
  });

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'bg-green-500' },
    { title: "Today's Appts", value: stats.todaysAppointmentsCount, icon: CalendarDays, color: 'bg-primary' },
    { title: 'Avg Loyalty Points', value: stats.avgLoyaltyPoints, icon: Star, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center transition duration-300 hover:shadow-md hover:border-gray-200">
              <div className={`${stat.color} p-4 rounded-lg text-white mr-4 shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Welcome to BeautyAdmin</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">
            Manage your beauty parlour effortlessly. Monitor your client base, track upcoming appointments, handle services and loyalty programs, all from one centralized dashboard tailored for a smooth administrative experience.
          </p>
          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-primary-dark text-sm font-medium">Check out today's upcoming appointments in the Calendar tab!</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
              <CalendarCheck className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-700">Appts</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors">
              <Users className="w-6 h-6 text-primary mb-2" />
              <span className="text-sm font-medium text-gray-700">Clients</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
