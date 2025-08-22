import { create } from 'zustand';
import { useAuthStore } from './authStore';
import calendarService, { CalendarEvent } from '../services/calendar.service';

interface CalendarStore {
  events: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
  fetchEvents: (startDate?: Date, endDate?: Date) => Promise<void>;
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  getEventsByDate: (date: string) => CalendarEvent[];
  getEventsForMonth: (year: number, month: number) => Promise<void>;
  getUserEvents: () => CalendarEvent[];
}

export const useCalendarStore = create<CalendarStore>()(
  (set, get) => ({
      events: [],
      isLoading: false,
      error: null,
      
      fetchEvents: async (startDate?: Date, endDate?: Date) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ isLoading: true, error: null });
        try {
          const response = await calendarService.getEvents(startDate, endDate);
          set({ events: response.events, isLoading: false });
        } catch (error: any) {
          console.error('Failed to fetch events:', error);
          set({ error: error.message || 'Failed to fetch events', isLoading: false });
        }
      },
      
      addEvent: async (event) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ error: null });
        try {
          const newEvent = await calendarService.createEvent({
            title: event.title,
            description: event.description,
            start: event.start,
            end: event.end,
            allDay: event.allDay,
            color: event.color,
            location: event.location,
            reminder: event.reminder,
          });
          
          set((state) => ({
            events: [...state.events, newEvent],
          }));
        } catch (error: any) {
          console.error('Failed to create event:', error);
          set({ error: error.message || 'Failed to create event' });
          throw error;
        }
      },
      
      updateEvent: async (id, updates) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ error: null });
        try {
          const updatedEvent = await calendarService.updateEvent(id, updates);
          
          set((state) => ({
            events: state.events.map((event) =>
              event.id === id ? updatedEvent : event
            ),
          }));
        } catch (error: any) {
          console.error('Failed to update event:', error);
          set({ error: error.message || 'Failed to update event' });
          throw error;
        }
      },
      
      deleteEvent: async (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ error: null });
        try {
          await calendarService.deleteEvent(id);
          
          set((state) => ({
            events: state.events.filter((event) => event.id !== id),
          }));
        } catch (error: any) {
          console.error('Failed to delete event:', error);
          set({ error: error.message || 'Failed to delete event' });
          throw error;
        }
      },
      
      getEventsByDate: (date) => {
        return get().events.filter(
          (event) => {
            const eventDate = new Date(event.start).toISOString().split('T')[0];
            return eventDate === date;
          }
        );
      },
      
      getEventsForMonth: async (year, month) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set({ isLoading: true, error: null });
        try {
          const events = await calendarService.getEventsForMonth(year, month);
          set({ events, isLoading: false });
        } catch (error: any) {
          console.error('Failed to fetch month events:', error);
          set({ error: error.message || 'Failed to fetch month events', isLoading: false });
        }
      },
      
      getUserEvents: () => {
        return get().events;
      },
    })
);