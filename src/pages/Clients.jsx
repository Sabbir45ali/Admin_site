import React, { useState, useEffect } from 'react';
import { getUsers } from '../services/api';
import { Search, ChevronRight, X, Award } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Clients = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [pointsInput, setPointsInput] = useState('');
  const [notesInput, setNotesInput] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    getUsers().then(data => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const filteredUsers = users.filter(user => {
    const nameMatch = user.name?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
    const phoneMatch = user.phone?.includes(searchTerm) || false;
    const emailMatch = user.email?.toLowerCase()?.includes(searchTerm.toLowerCase()) || false;
    return nameMatch || phoneMatch || emailMatch;
  });

  const handleUpdatePointsAndNotes = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUpdating(true);
    try {
      const { updateLoyaltyPoints, updateClientNotes } = await import('../services/api');
      await updateLoyaltyPoints(selectedUser.id, parseInt(pointsInput) || 0);
      await updateClientNotes(selectedUser.id, notesInput);
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, loyaltyPoints: parseInt(pointsInput) || 0, adminNotes: notesInput } : u));
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    }
    setUpdating(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Client Management</h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 block border border-gray-300 rounded-md focus:ring-primary focus:border-primary sm:text-sm py-2 px-3"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium text-center">Loyalty Points</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-6 py-4"><Skeleton width={120} height={16} /></td>
                    <td className="px-6 py-4">
                      <Skeleton width={150} height={14} className="mb-1" />
                      <Skeleton width={100} height={12} />
                    </td>
                    <td className="px-6 py-4 text-center"><Skeleton width={60} height={20} borderRadius={10} /></td>
                    <td className="px-6 py-4 text-right"><Skeleton circle width={32} height={32} /></td>
                  </tr>
                ))}
              </SkeletonTheme>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 whitespace-nowrap">{user.displayName || user.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{user.email}</div>
                    <div className="text-xs text-gray-400 mt-1">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {user.loyaltyPoints} pts
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => { 
                        setSelectedUser(user); 
                        setPointsInput(user.loyaltyPoints || 0);
                        setNotesInput(user.adminNotes || '');
                      }}
                      className="text-gray-400 group-hover:text-primary transition-colors p-2 hover:bg-primary/5 rounded-full inline-flex items-center justify-center"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="w-8 h-8 text-gray-300 mb-2" />
                    <p>No clients found matching "{searchTerm}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Client Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedUser(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h3 className="text-lg font-bold text-gray-800">Edit Client</h3>
              <button onClick={() => setSelectedUser(null)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {(selectedUser.displayName || selectedUser.name || 'U')[0].toUpperCase()}
                </div>
                <h4 className="font-bold text-gray-800 text-lg">{selectedUser.displayName || selectedUser.name || 'Unknown Client'}</h4>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
                {selectedUser.phone && <p className="text-xs text-gray-400 mt-1">{selectedUser.phone}</p>}
              </div>

              <form onSubmit={handleUpdatePointsAndNotes} className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Award className="w-4 h-4 mr-1.5 text-[#FF69B4]" />
                    Loyalty Points
                  </label>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={pointsInput}
                      onChange={e => setPointsInput(e.target.value)}
                      className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:ring-primary focus:border-primary text-center font-bold text-lg"
                    />
                    <div className="bg-gray-200 px-4 py-2 rounded-r-md text-gray-600 font-medium">pts</div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    Private Admin Notes
                  </label>
                  <textarea
                    value={notesInput}
                    onChange={e => setNotesInput(e.target.value)}
                    placeholder="E.g. Allergic to particular brand, prefers cold coffee..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary resize-none outline-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button type="button" onClick={() => setSelectedUser(null)} className="flex-1 py-2 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={updating} className={`flex-1 py-2 rounded-xl font-medium bg-gradient-to-r from-[#FF69B4] to-[#FF1493] text-white shadow-md hover:opacity-90 transition-all ${updating ? 'opacity-70' : ''}`}>
                    {updating ? 'Saving...' : 'Update Points'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
