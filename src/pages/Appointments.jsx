import React, { useState, useEffect } from 'react';
import { getBookings, updateBookingStatus, rescheduleAppointment } from '../services/api';
import { format } from 'date-fns';
import { Check, X, Clock, CheckCircle2, Calendar } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [rescheduleData, setRescheduleData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = () => {
    setLoading(true);
    getBookings().then(data => {
      setAppointments(data);
      setLoading(false);
    });
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateBookingStatus(id, newStatus);
      fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const submitReschedule = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await rescheduleAppointment(rescheduleData.id, rescheduleData.date, rescheduleData.time);
      setRescheduleData(null);
      fetchAppointments();
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'All') return true;
    return (app.status || '').toLowerCase() === filter.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed': return <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full border border-green-200 inline-flex items-center"><Check className="w-3 h-3 mr-1" />Confirmed</span>;
      case 'Completed': return <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full border border-blue-200 inline-flex items-center"><CheckCircle2 className="w-3 h-3 mr-1" />Completed</span>;
      case 'Pending': case 'pending': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full inline-flex items-center border border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</span>;
      case 'Cancelled': case 'cancelled': case 'Rejected': return <span className="px-2.5 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full border border-red-200">Cancelled</span>;
      case 'Reschedule pending admin approval': return <span className="px-2 py-1 bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider rounded-md border border-purple-200 bg-opacity-80">Needs Approval</span>;
      case 'Reschedule pending client approval': return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-md border border-gray-200">Waiting on Client</span>;
      default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">{status}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Appointments Management</h2>
        <div className="flex flex-wrap gap-2 bg-gray-100 p-1 rounded-lg">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map(f => (
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
            {loading ? (
              <SkeletonTheme baseColor="#f3f4f6" highlightColor="#e5e7eb">
                {[1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="px-6 py-4"><Skeleton width={100} height={16} /></td>
                    <td className="px-6 py-4"><Skeleton width={130} height={16} /></td>
                    <td className="px-6 py-4 text-center">
                      <Skeleton width={80} height={14} className="mb-1 text-center items-center" />
                      <Skeleton width={60} height={12} className="text-center" />
                    </td>
                    <td className="px-6 py-4 text-center"><Skeleton width={80} height={22} borderRadius={12} className="mx-auto" /></td>
                    <td className="px-6 py-4 text-right flex gap-2 justify-end mt-1"><Skeleton width={80} height={28} borderRadius={8} /> <Skeleton width={32} height={28} borderRadius={8} /></td>
                  </tr>
                ))}
              </SkeletonTheme>
            ) : filteredAppointments.length > 0 ? (
              filteredAppointments.map(app => (
                <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{app.userName || app.userEmail || 'Unknown'}</td>
                  <td className="px-6 py-4 text-gray-700 font-medium text-sm">{app.serviceName || app.service || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 text-center">
                    <div className="font-medium text-gray-900">{app.date}</div>
                    <div className="text-gray-500">{app.time}</div>
                  </td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(app.status)}</td>
                  <td className="px-6 py-4 text-right">
                    {(app.status || '').toLowerCase() === 'pending' ? (
                      <div className="flex justify-end gap-2 text-sm">
                        <button onClick={() => handleStatusChange(app.id, 'Confirmed')} className="py-1.5 px-3 bg-green-50 text-green-700 hover:bg-green-100 font-medium rounded-md transition-colors border border-green-200 shadow-sm inline-flex items-center" title="Confirm">
                          <Check className="w-4 h-4 mr-1" /> Confirm
                        </button>
                        <button onClick={() => handleStatusChange(app.id, 'Cancelled')} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors border border-red-100 shadow-sm" title="Cancel">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (app.status || '').toLowerCase() === 'confirmed' ? (
                      <div className="flex justify-end gap-2 text-sm">
                        <button onClick={() => handleStatusChange(app.id, 'Completed')} className="py-1.5 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-md transition-colors border border-blue-200 shadow-sm inline-flex items-center" title="Mark Done">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Done
                        </button>
                        <button onClick={() => setRescheduleData({ id: app.id, date: app.date, time: app.time })} className="py-1.5 px-3 bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium rounded-md transition-colors border border-gray-200 shadow-sm inline-flex items-center" title="Reschedule">
                          <Calendar className="w-4 h-4 mr-1" /> Reschedule
                        </button>
                      </div>
                    ) : (app.status || '').toLowerCase() === 'reschedule pending admin approval' ? (
                      <div className="flex justify-end gap-2 text-sm">
                        <button onClick={() => handleStatusChange(app.id, 'Confirmed')} className="py-1.5 px-3 bg-green-50 text-green-700 hover:bg-green-100 font-medium rounded-md transition-colors border border-green-200 shadow-sm inline-flex items-center" title="Accept Reschedule">
                          <Check className="w-4 h-4 mr-1" /> Accept
                        </button>
                        <button onClick={() => handleStatusChange(app.id, 'Cancelled')} className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors border border-red-100 shadow-sm" title="Reject">
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

      {/* Reschedule Modal */}
      {rescheduleData && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setRescheduleData(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h3 className="text-lg font-bold text-gray-800">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleData(null)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={submitReschedule} className="p-6 space-y-4">
              <p className="text-sm text-gray-600 mb-4">Pick a new date and time for this appointment. The client will be asked to confirm this new slot.</p>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={rescheduleData.date}
                  onChange={e => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Time</label>
                <input
                  type="time" // We use standard time picker for admin for flexibility
                  required
                  value={rescheduleData.time || '10:00'}
                  onChange={e => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary focus:border-primary outline-none"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setRescheduleData(null)} className="flex-1 py-2 rounded-xl font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={`flex-1 py-2 rounded-xl font-medium bg-primary text-white shadow-md hover:bg-primary/90 transition-all ${saving ? 'opacity-70' : ''}`}>
                  {saving ? 'Saving...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Appointments;
