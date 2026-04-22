import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus } from '../services/api';
import { format } from 'date-fns';
import { Check, X, Clock } from 'lucide-react';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    getBookings().then(setAppointments);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'All') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed': return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200">Confirmed</span>;
      case 'Pending': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full inline-flex items-center border border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</span>;
      case 'Cancelled': return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full border border-red-200">Cancelled</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Appointments Management</h2>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          {['All', 'Pending', 'Confirmed', 'Cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${filter === f ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs border-b border-gray-200 uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Service</th>
              <th className="px-6 py-4 font-medium text-center">Date & Time</th>
              <th className="px-6 py-4 font-medium text-center">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(app => (
                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{app.userName}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium text-sm">{app.service}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    <div className="font-medium text-gray-900">{format(new Date(app.date), 'MMM d, yyyy')}</div>
                    <div className="text-gray-500">{format(new Date(app.date), 'h:mm a')}</div>
                  </td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 text-right">
                    {app.status === 'Pending' ? (
                      <div className="flex justify-end gap-2 text-sm">
                        <button onClick={() => handleStatusChange(app.id, 'Confirmed')} className="py-1.5 px-3 bg-green-50 text-green-700 hover:bg-green-100 font-medium rounded-md transition-colors border border-green-200 shadow-sm" title="Confirm">
                          Confirm
                        </button>
                        <button onClick={() => handleStatusChange(app.id, 'Cancelled')} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors border border-red-100 shadow-sm" title="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                  No appointments found for "{filter}" filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Appointments;
