import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

export interface CalendarEvent {
  id: string;
  userId: string; // 사용자별 구분을 위한 필드 추가
  title: string;
  date: string;
  type: 'todo' | 'meeting' | 'deadline';
  time?: string;
  description?: string;
}

interface CalendarStore {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'userId'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  getEventsByDate: (date: string) => CalendarEvent[];
  getUserEvents: () => CalendarEvent[]; // 현재 사용자의 이벤트만 반환
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      events: [],
      
      addEvent: (event) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        const newEvent: CalendarEvent = {
          ...event,
          id: Date.now().toString(),
          userId: user.id,
        };
        
        set((state) => ({
          events: [...state.events, newEvent],
        }));
      },
      
      updateEvent: (id, updates) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id && event.userId === user.id 
              ? { ...event, ...updates } 
              : event
          ),
        }));
      },
      
      deleteEvent: (id) => {
        const user = useAuthStore.getState().user;
        if (!user) return;
        
        set((state) => ({
          events: state.events.filter((event) => 
            !(event.id === id && event.userId === user.id)
          ),
        }));
      },
      
      getEventsByDate: (date) => {
        const user = useAuthStore.getState().user;
        if (!user) return [];
        
        return get().events.filter(
          (event) => event.date === date && event.userId === user.id
        );
      },
      
      getUserEvents: () => {
        const user = useAuthStore.getState().user;
        if (!user) return [];
        
        return get().events.filter(event => event.userId === user.id);
      },
    }),
    {
      name: 'calendar-storage',
    }
  )
);