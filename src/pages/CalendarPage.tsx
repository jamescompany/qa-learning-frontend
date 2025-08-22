import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useCalendarStore } from '../store/calendarStore';


interface LocalEvent {
  id: string;
  title: string;
  date: string;
  type: 'meeting' | 'deadline' | 'todo';
  time?: string;
  description?: string;
}

const CalendarPage: React.FC = () => {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { getUserEvents, addEvent, updateEvent, deleteEvent, fetchEvents } = useCalendarStore();
  const calendarEvents = getUserEvents(); // 현재 사용자의 이벤트만 가져오기
  const [showDayEvents, setShowDayEvents] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  
  React.useEffect(() => {
    fetchEvents();
  }, []);
  
  // Convert calendar events to local format for display
  const events: LocalEvent[] = calendarEvents.map(e => {
    try {
      // Handle both 'start' and 'start_time' properties
      const startTime = (e as any).start_time || e.start;
      const startDate = startTime ? new Date(startTime) : null;
      if (!startDate || isNaN(startDate.getTime())) {
        console.warn('Invalid start date for event:', e);
        return null;
      }
      
      // Get the local date string in YYYY-MM-DD format
      const year = startDate.getFullYear();
      const month = String(startDate.getMonth() + 1).padStart(2, '0');
      const day = String(startDate.getDate()).padStart(2, '0');
      const localDateStr = `${year}-${month}-${day}`;
      
      return {
        id: e.id,
        title: e.title,
        date: localDateStr,
        type: (e.color === 'blue' ? 'meeting' : e.color === 'red' ? 'deadline' : 'todo') as LocalEvent['type'],
        time: e.allDay ? undefined : startDate.toTimeString().substring(0, 5),
        description: e.description
      };
    } catch (error) {
      console.error('Error converting event:', e, error);
      return null;
    }
  }).filter((e): e is NonNullable<typeof e> => e !== null) as LocalEvent[];
  
  const [showEventForm, setShowEventForm] = useState(false);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<LocalEvent | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [eventFormData, setEventFormData] = useState({ title: '', type: 'meeting' });

  const monthNames = t('calendar.months', { returnObjects: true }) as string[];

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
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-gray-700"></div>);
    }

    // Days of the month
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = dateStr === todayStr;
      const maxVisible = 3; // Maximum events to show before showing +n
      const visibleEvents = dayEvents.slice(0, maxVisible);
      const hiddenCount = dayEvents.length - maxVisible;
      
      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-200 dark:border-gray-700 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer relative overflow-hidden ${
            isToday ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500' : 
            selectedDateStr === dateStr ? 'bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500' : ''
          }`}
          onClick={() => {
            setSelectedDateStr(dateStr);
          }}
        >
          <div className="flex items-center justify-between">
            <div className={`font-semibold text-sm ${
              isToday ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
            }`}>
              {day}
            </div>
            {isToday && (
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                {t('calendar.today')}
              </span>
            )}
          </div>
          <div className="mt-1 space-y-1">
            {visibleEvents.map(event => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate cursor-pointer ${
                  event.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                  event.type === 'deadline' ? 'bg-red-100 text-red-700' :
                  'bg-green-100 text-green-700'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedEvent(event);
                  setShowEventDetail(true);
                }}
                title={t('calendar.clickToViewDetails')}
              >
                {event.time && <span className="font-medium">{event.time} </span>}
                {event.title}
              </div>
            ))}
            {hiddenCount > 0 && (
              <div
                className="text-xs p-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 text-center font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  // Show all events for this day in a modal or expanded view
                  setSelectedDate(dateStr);
                  setShowDayEvents(true);
                }}
                title={t('calendar.showAllEvents')}
              >
                +{hiddenCount} {t('calendar.more')}
              </div>
            )}
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {/* Calendar Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const today = new Date();
                  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                  setSelectedDate(dateStr);
                  setEventFormData({ title: '', type: 'meeting' });
                  setShowEventForm(true);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {t('calendar.addEvent')}
              </button>
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                {t('calendar.previous')}
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('calendar.today')}
              </button>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              >
                {t('calendar.next')}
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {(t('calendar.weekDays', { returnObjects: true }) as string[]).map(day => (
                <div key={day} className="text-center font-semibold text-sm text-gray-600 dark:text-gray-400 py-2">
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
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{t('calendar.eventTypes')}</h3>
          <div className="flex space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('calendar.meeting')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('calendar.deadline')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">{t('calendar.todo')}</span>
            </div>
          </div>
      </div>
      
      {/* Event Form Modal */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{t('calendar.eventForm.addTitle')}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const type = formData.get('type') as 'todo' | 'meeting' | 'deadline';
                const time = formData.get('time') as string || '';
                const description = formData.get('description') as string || '';
                
                // Create start and end dates
                const startDate = new Date(selectedDate);
                const endDate = new Date(selectedDate);
                
                if (time) {
                  const [hours, minutes] = time.split(':').map(Number);
                  startDate.setHours(hours, minutes, 0, 0);
                  endDate.setHours(hours + 1, minutes, 0, 0); // Default 1 hour duration
                } else {
                  // All day event
                  startDate.setHours(0, 0, 0, 0);
                  endDate.setHours(23, 59, 59, 999);
                }
                
                try {
                  await addEvent({
                    title,
                    description,
                    start: startDate,
                    end: endDate,
                    allDay: !time,
                    color: type === 'meeting' ? 'blue' : type === 'deadline' ? 'red' : 'green',
                  });
                  setShowEventForm(false);
                  setEventFormData({ title: '', type: 'meeting' });
                } catch (error) {
                  console.error('Failed to add event:', error);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.title')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.date')}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.type')}
                  </label>
                  <select
                    name="type"
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting">{t('calendar.meeting')}</option>
                    <option value="deadline">{t('calendar.deadline')}</option>
                    <option value="todo">{t('calendar.todo')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.timeOptional')}
                  </label>
                  <input
                    type="time"
                    name="time"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.descriptionOptional')}
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={!eventFormData.title.trim()}
                  className={`flex-1 px-4 py-2 rounded-md transition-colors ${
                    eventFormData.title.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {t('calendar.addEvent')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEventForm(false);
                    setEventFormData({ title: '', type: 'meeting' });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('calendar.eventForm.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Event Detail Modal */}
      {showEventDetail && selectedEvent && !isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">{t('calendar.eventDetail.title')}</h2>
              <button
                onClick={() => {
                  setShowEventDetail(false);
                  setSelectedEvent(null);
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('calendar.eventForm.title')}</label>
                <p className="text-gray-900 dark:text-gray-100">{selectedEvent.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('calendar.eventForm.date')}</label>
                <p className="text-gray-900 dark:text-gray-100">{new Date(selectedEvent.date).toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('calendar.eventForm.type')}</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                  selectedEvent.type === 'meeting' ? 'bg-blue-100 text-blue-700' :
                  selectedEvent.type === 'deadline' ? 'bg-red-100 text-red-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                </span>
              </div>
              
              {selectedEvent.time && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('calendar.eventForm.time')}</label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedEvent.time}</p>
                </div>
              )}
              
              {selectedEvent.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{t('calendar.eventForm.description')}</label>
                  <p className="text-gray-900 dark:text-gray-100">{selectedEvent.description}</p>
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setSelectedDate(selectedEvent.date);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {t('calendar.eventDetail.edit')}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(true);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t('calendar.eventDetail.delete')}
              </button>
              <button
                onClick={() => {
                  setShowEventDetail(false);
                  setSelectedEvent(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                {t('calendar.eventDetail.close')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit Event Modal */}
      {isEditing && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">{t('calendar.eventForm.editTitle')}</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const dateStr = formData.get('date') as string;
                const type = formData.get('type') as 'todo' | 'meeting' | 'deadline';
                const time = formData.get('time') as string || '';
                const description = formData.get('description') as string || '';
                
                // Create start and end dates
                const startDate = new Date(dateStr);
                const endDate = new Date(dateStr);
                
                if (time) {
                  const [hours, minutes] = time.split(':').map(Number);
                  startDate.setHours(hours, minutes, 0, 0);
                  endDate.setHours(hours + 1, minutes, 0, 0); // Default 1 hour duration
                } else {
                  // All day event
                  startDate.setHours(0, 0, 0, 0);
                  endDate.setHours(23, 59, 59, 999);
                }
                
                try {
                  await updateEvent(selectedEvent!.id, {
                    title,
                    description,
                    start: startDate,
                    end: endDate,
                    allDay: !time,
                    color: type === 'meeting' ? 'blue' : type === 'deadline' ? 'red' : 'green',
                  });
                  setIsEditing(false);
                  setShowEventDetail(false);
                  setSelectedEvent(null);
                } catch (error) {
                  console.error('Failed to update event:', error);
                }
              }}
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.title')}
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={selectedEvent.title}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.date')}
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={selectedEvent.date}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.type')}
                  </label>
                  <select
                    name="type"
                    defaultValue={selectedEvent.type}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting">{t('calendar.meeting')}</option>
                    <option value="deadline">{t('calendar.deadline')}</option>
                    <option value="todo">{t('calendar.todo')}</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.timeOptional')}
                  </label>
                  <input
                    type="time"
                    name="time"
                    defaultValue={selectedEvent.time || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('calendar.eventForm.descriptionOptional')}
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedEvent.description || ''}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {t('calendar.eventForm.saveChanges')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  {t('calendar.eventForm.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{t('calendar.deleteConfirm.title')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{t('calendar.deleteConfirm.message', { title: selectedEvent.title })}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">
              {t('calendar.deleteConfirm.warning')}
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  deleteEvent(selectedEvent.id);
                  setShowDeleteConfirm(false);
                  setShowEventDetail(false);
                  setSelectedEvent(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t('calendar.deleteConfirm.confirmButton')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                {t('calendar.deleteConfirm.cancelButton')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Day Events Modal - Show all events for a specific day */}
      {showDayEvents && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('calendar.allEventsForDay', { date: new Date(selectedDate).toLocaleDateString() })}
              </h2>
              <button
                onClick={() => {
                  setShowDayEvents(false);
                  setSelectedDate('');
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-400"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-3">
              {events.filter(e => e.date === selectedDate).length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  {t('calendar.noEventsForDay')}
                </p>
              ) : (
                events.filter(e => e.date === selectedDate).map(event => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${
                      event.type === 'meeting' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' 
                        : event.type === 'deadline' 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                        : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          {event.title}
                        </h3>
                        {event.time && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {t('calendar.time')}: {event.time}
                          </p>
                        )}
                        {event.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {event.description}
                          </p>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowDayEvents(false);
                            setShowEventDetail(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          {t('calendar.view')}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEvent(event);
                            setShowDayEvents(false);
                            setIsEditing(true);
                          }}
                          className="text-green-600 hover:text-green-800 text-sm"
                        >
                          {t('calendar.edit')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setShowDayEvents(false);
                  setEventFormData({ title: '', type: 'meeting' });
                  setShowEventForm(true);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {t('calendar.addEventForDay')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected Date Events Side Panel */}
      {selectedDateStr && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setSelectedDateStr('')}
          />
          
          {/* Side Panel */}
          <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {new Date(selectedDateStr).toLocaleDateString()}
              </h3>
              <button
                onClick={() => setSelectedDateStr('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <button
              onClick={() => {
                setSelectedDate(selectedDateStr);
                setEventFormData({ title: '', type: 'meeting' });
                setShowEventForm(true);
              }}
              className="w-full mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('calendar.addEvent')}
            </button>
            
            {(() => {
              const selectedEvents = events.filter(e => e.date === selectedDateStr);
              if (selectedEvents.length === 0) {
                return (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {t('calendar.noEventsForDay')}
                  </div>
                );
              }
              
              return (
                <div className="space-y-3">
                  {selectedEvents.map(event => (
                    <div
                      key={event.id}
                      className={`p-3 rounded-lg border ${
                        event.type === 'meeting' 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700' 
                          : event.type === 'deadline' 
                          ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700'
                          : 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{event.title}</h4>
                          {event.time && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {event.time}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col space-y-1 ml-2">
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowEventDetail(true);
                            }}
                            className="text-gray-600 hover:text-gray-800"
                            title={t('calendar.view')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsEditing(true);
                            }}
                            className="text-blue-600 hover:text-blue-800"
                            title={t('calendar.edit')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setShowDeleteConfirm(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title={t('calendar.eventDetail.delete')}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
        </>
      )}
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;