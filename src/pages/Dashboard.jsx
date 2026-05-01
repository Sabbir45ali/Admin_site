import React, { useEffect, useState } from 'react';
import { getDashboardStats, getBookings } from '../services/api';
import { Users, CalendarCheck, CalendarDays, Star, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { format, subDays, isSameDay } from 'date-fns';

const COLORS = ['#FF69B4', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    todaysAppointmentsCount: 0,
    avgLoyaltyPoints: 0
  });
  
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);

  useEffect(() => {
    Promise.all([getDashboardStats(), getBookings()]).then(([statsData, bookings]) => {
      setStats(statsData);
      
      // Generate Last 7 Days Trend
      const last7Days = Array.from({length: 7}).map((_, i) => subDays(new Date(), 6 - i));
      const trendData = last7Days.map(date => {
        const count = bookings.filter(b => b.date && isSameDay(new Date(b.date), date)).length;
        return {
          name: format(date, 'MMM dd'),
          bookings: count
        };
      });
      setChartData(trendData);

      // Generate Services Popularity
      const servicesCount = {};
      bookings.forEach(b => {
        if (b.serviceName) {
          servicesCount[b.serviceName] = (servicesCount[b.serviceName] || 0) + 1;
        }
      });
      
      const pData = Object.keys(servicesCount)
        .map(key => ({ name: key, value: servicesCount[key] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // top 5
      
      setPieData(pData.length > 0 ? pData : [{name: 'No data', value: 1}]);
      
      setLoading(false);
    });
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
        {loading ? (
          <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
                <Skeleton circle className="w-14 h-14 mr-4" />
                <div className="flex-1">
                  <Skeleton width="60%" height={16} className="mb-2" />
                  <Skeleton width="40%" height={24} />
                </div>
              </div>
            ))}
          </SkeletonTheme>
        ) : (
          statCards.map((stat, index) => {
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
          })
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Booking Trends (Last 7 Days)
          </h3>
          <div className="h-72 w-full">
            {loading ? <Skeleton height="100%" borderRadius={12} /> : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF69B4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#FF69B4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    cursor={{ stroke: '#FF69B4', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="bookings" stroke="#FF69B4" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Top Services
          </h3>
          <div className="h-64 w-full">
             {loading ? <Skeleton height="100%" borderRadius={12} /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }}/>
                </PieChart>
              </ResponsiveContainer>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
