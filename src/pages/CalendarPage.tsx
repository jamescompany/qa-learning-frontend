import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'todo' | 'meeting' | 'deadline';
  time?: string;
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events] = useState<Event[]>([
    { id: '1', title: 'Sprint Review', date: '2024-01-15', type: 'meeting', time: '10:00 AM' },
    { id: '2', title: 'Test Plan Due', date: '2024-01-20', type: 'deadline' },
    { id: '3', title: 'Automation Script Review', date: '2024-01-18', type: 'todo' },
  ]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      
      days.push(
        <div key={day} className="h-24 border border-gray-200 p-2 hover:bg-gray-50">
          <div className="font-semibold text-sm text-gray-700">{day}</div>
          <div className="mt-1 space-y-1">
            {dayEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate ${
                  event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                  event.type === 'deadline' ? 'bg-red-100 text-red-700' :
                  'bg-green-100 text-green-700'
                }`}
              >
                {event.time && <span className="font-medium">{event.time} </span>}
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow">
          {/* Calendar Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-sm text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Event Types</h3>
          <div className="flex space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Meeting</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Deadline</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600">Todo</span>
            </div>
          </div>
      </div>
    </div>
    </DashboardLayout>
  );
};

export default CalendarPage;