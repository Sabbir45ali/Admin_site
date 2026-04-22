import React, { useState, useEffect } from 'react';
import { getBookings } from '../services/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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
                className={`min-h-[140px] bg-white p-2 transition-colors hover:bg-gray-50 relative ${!isSameMonth(day, currentMonth) ? 'bg-gray-50/50' : ''}`}
              >
                <div className={`font-semibold text-sm w-7 h-7 flex items-center justify-center rounded-full mb-1 ${isToday ? 'bg-primary text-white' : !isSameMonth(day, currentMonth) ? 'text-gray-400' : 'text-gray-700'}`}>
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
                      <div key={idx} className={`text-[11px] p-1.5 rounded font-medium truncate border ${badgeClass} shadow-sm backdrop-blur-sm cursor-pointer hover:opacity-80 transition-opacity`} title={`${app.userName} - ${app.service} (${app.status})`}>
                        <span className="opacity-70 mr-1">{format(new Date(app.date), 'h:mm')}</span>
                        {app.userName.split(' ')[0]}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default CalendarPage;
