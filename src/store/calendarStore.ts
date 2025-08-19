import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'todo' | 'meeting' | 'deadline';
  time?: string;
  description?: string;
}

interface CalendarStore {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => CalendarEvent[];
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: [
        { id: '1', title: 'Sprint Review', date: '2024-01-15', type: 'meeting', time: '10:00 AM' },
        { id: '2', title: 'Test Plan Due', date: '2024-01-20', type: 'deadline' },
        { id: '3', title: 'Automation Script Review', date: '2024-01-18', type: 'todo' },
      ],
      
      addEvent: (event) => {
        const newEvent: CalendarEvent = {
          ...event,
          id: Date.now().toString(),
        };
        
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },
      
      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, ...updates } : event
          ),
        }));
      },
      
      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        }));
      },
      
      getEventsByDate: (date) => {
        return get().events.filter((event) => event.date === date);
      },
    }),
    {
      name: 'calendar-storage',
    }
  )
);