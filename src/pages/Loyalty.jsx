import React, { useState, useEffect } from 'react';
import { getUsers, updateLoyaltyPoints } from '../services/api';
import { Search, Star, Medal } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Loyalty = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPoints, setEditingPoints] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  };

  const handleUpdatePoints = async (userId, points) => {
    try {
      await updateLoyaltyPoints(userId, parseInt(points) || 0);
      setEditingPoints(null);
      fetchUsers();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.loyaltyPoints - a.loyaltyPoints);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none"></div>
        <div className="z-10">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <Medal className="w-7 h-7 mr-3 text-primary" />
            Loyalty Program
          </h2>
          <p className="text-gray-500 text-sm mt-1 mb-0 ml-10">Manage client reward points and VIP tiers</p>
        </div>

        <div className="z-10 bg-gradient-to-r from-primary/10 to-primary/5 text-primary-dark px-4 py-3 rounded-lg border border-primary/20 text-sm font-medium shadow-sm flex items-center">
          <Star className="w-5 h-5 mr-2 text-primary" />
          <strong>Current Rule:</strong> <span className="ml-1 opacity-90">+10 points per booking</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search clients by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 block border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm py-2.5 px-3 bg-white shadow-sm"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-6 py-4 font-medium">Rank</th>
                <th className="px-6 py-4 font-medium">Client</th>
                <th className="px-6 py-4 font-medium text-center">Loyalty Points</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-6 py-4"><Skeleton circle width={32} height={32} /></td>
                      <td className="px-6 py-4">
                        <Skeleton width={120} height={16} className="mb-1" />
                        <Skeleton width={150} height={14} />
                      </td>
                      <td className="px-6 py-4 text-center"><Skeleton width={80} height={24} borderRadius={16} className="mx-auto" /></td>
                      <td className="px-6 py-4 text-right flex gap-2 justify-end mt-1"><Skeleton width={100} height={30} borderRadius={6} /></td>
                    </tr>
                  ))}
                </SkeletonTheme>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      {idx < 3 ? (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm
                          ${idx === 0 ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-600' : idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-400 border border-gray-500' : 'bg-gradient-to-br from-orange-300 to-orange-500 border border-orange-600'}
                        `}>
                          {idx + 1}
                        </div>
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center font-medium text-gray-400 bg-gray-100 rounded-full">
                          {idx + 1}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500 mt-1">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {editingPoints === user.id ? (
                        <input
                          autoFocus
                          type="number"
                          defaultValue={user.loyaltyPoints}
                          onBlur={(e) => handleUpdatePoints(user.id, e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdatePoints(user.id, e.target.value)}
                          className="w-24 text-center border-2 border-primary rounded-md py-1 px-2 focus:outline-none focus:ring-4 focus:ring-primary/20 shadow-sm transition-all"
                        />
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
                          <Star className="w-4 h-4 mr-1.5 text-purple-500 fill-current" />
                          {user.loyaltyPoints} pts
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editingPoints === user.id ? (
                        <span className="text-xs text-primary italic font-medium bg-primary/5 px-2 py-1 rounded-md animate-pulse">Press Enter to save</span>
                      ) : (
                        <button
                          onClick={() => setEditingPoints(user.id)}
                          className="text-primary hover:text-white hover:bg-primary border border-primary px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 shadow-sm hover:shadow"
                        >
                          Adjust Points
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <p className="text-lg">No clients found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Loyalty;
