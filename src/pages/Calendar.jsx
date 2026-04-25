import React, { useState, useEffect } from 'react';
import { getBookings } from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Clock } from 'lucide-react';

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    getBookings().then(setAppointments);
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <CalendarIcon className="w-7 h-7 mr-3 text-primary" />
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm bg-white">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={() => setCurrentMonth(new Date())} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 font-medium text-sm text-gray-700 transition-colors shadow-sm bg-white">
            Today
          </button>
          <button onClick={nextMonth} className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm bg-white">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
            <div key={day} className={`p-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider ${i > 0 ? 'border-l border-gray-200' : ''}`}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-gray-200 gap-px">
          {days.map((day, dayIdx) => {
            const todaysAppointments = appointments.filter(app => isSameDay(new Date(app.date), day));
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[140px] bg-white p-2 transition-colors hover:bg-gray-50 relative cursor-pointer group ${!isSameMonth(day, currentMonth) ? 'bg-gray-50/50' : ''}`}
              >
                <div className={`font-semibold text-sm w-7 h-7 flex items-center justify-center rounded-full mb-1 group-hover:bg-primary/10 transition-colors ${isToday ? 'bg-primary text-white group-hover:bg-primary' : !isSameMonth(day, currentMonth) ? 'text-gray-400' : 'text-gray-700'}`}>
                  {format(day, 'd')}
                </div>
                <div className="flex flex-col gap-1.5 mt-2">
                  {todaysAppointments.map((app, idx) => {
                    const statusColors = {
                      'Confirmed': 'bg-green-100 text-green-800 border-green-200',
                      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
                    };
                    const badgeClass = statusColors[app.status] || 'bg-gray-100 text-gray-800';
                    return (
                      <div key={idx} className={`text-[11px] p-1.5 rounded font-medium truncate border ${badgeClass} shadow-sm backdrop-blur-sm cursor-pointer hover:opacity-80 transition-opacity`} title={`${app.userName || 'Client'} - ${app.serviceName || app.service || ''} (${app.status})`}>
                        <span className="opacity-70 mr-1">{app.time || ''}</span>
                        {(app.userName || 'Client').split(' ')[0]}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Appointments Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setSelectedDate(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <CalendarIcon className="w-5 h-5 mr-2 text-primary" />
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              <button onClick={() => setSelectedDate(null)} className="p-1.5 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {(() => {
                const dayAppointments = appointments.filter(app => isSameDay(new Date(app.date), selectedDate));
                return dayAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {dayAppointments.map((app, idx) => {
                      const statusColors = {
                        'Confirmed': 'bg-green-100 text-green-800 border-green-200',
                        'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        'Cancelled': 'bg-red-100 text-red-800 border-red-200'
                      };
                      const badgeClass = statusColors[app.status] || 'bg-gray-100 text-gray-800';
                      return (
                        <div key={idx} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-primary/30 hover:shadow-md transition-all flex justify-between items-start group">
                          <div>
                            <div className="font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors">{app.userName || 'Client'}</div>
                            <div className="text-sm text-gray-600 mb-2">{app.serviceName || app.service || 'Unknown Service'}</div>
                            <div className="text-xs font-semibold text-gray-500 flex items-center bg-gray-50 w-max px-2 py-1 rounded-md">
                              <Clock className="w-3.5 h-3.5 mr-1.5 text-primary/70" /> {app.time || 'No time set'}
                            </div>
                          </div>
                          <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md border ${badgeClass}`}>
                            {app.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500 flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <CalendarIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="font-medium text-gray-700 mb-1">Free Day</p>
                    <p className="text-sm">No appointments scheduled for this date.</p>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CalendarPage;
