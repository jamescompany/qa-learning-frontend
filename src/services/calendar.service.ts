import api from './api';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  location?: string;
  reminder?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateEventData {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  location?: string;
  reminder?: boolean;
}

interface UpdateEventData extends Partial<CreateEventData> {}

interface EventsResponse {
  events: CalendarEvent[];
  total: number;
}

class CalendarService {
  async getEvents(startDate?: Date, endDate?: Date): Promise<EventsResponse> {
    const params = new URLSearchParams();
    
    if (startDate) {
      params.append('start_date', startDate.toISOString().split('T')[0]);
    }
    if (endDate) {
      params.append('end_date', endDate.toISOString().split('T')[0]);
    }
    
    const response = await api.get<EventsResponse>(`/calendar/events?${params}`);
    return response.data;
  }

  async getEvent(id: string): Promise<CalendarEvent> {
    const response = await api.get<CalendarEvent>(`/calendar/events/${id}`);
    return response.data;
  }

  async createEvent(data: CreateEventData): Promise<CalendarEvent> {
    const response = await api.post<CalendarEvent>('/calendar/events', {
      title: data.title,
      description: data.description,
      start_time: data.start.toISOString(),
      end_time: data.end.toISOString(),
      all_day: data.allDay,
      color: data.color,
      location: data.location,
      reminder: data.reminder,
    });
    return response.data;
  }

  async updateEvent(id: string, data: UpdateEventData): Promise<CalendarEvent> {
    const payload: any = {};
    
    if (data.title !== undefined) payload.title = data.title;
    if (data.description !== undefined) payload.description = data.description;
    if (data.start !== undefined) payload.start_time = data.start.toISOString();
    if (data.end !== undefined) payload.end_time = data.end.toISOString();
    if (data.allDay !== undefined) payload.all_day = data.allDay;
    if (data.color !== undefined) payload.color = data.color;
    if (data.location !== undefined) payload.location = data.location;
    if (data.reminder !== undefined) payload.reminder = data.reminder;
    
    const response = await api.patch<CalendarEvent>(`/calendar/events/${id}`, payload);
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/calendar/events/${id}`);
  }

  async getEventsForMonth(year: number, month: number): Promise<CalendarEvent[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const response = await this.getEvents(startDate, endDate);
    return response.events;
  }

  async getEventsForWeek(date: Date): Promise<CalendarEvent[]> {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const response = await this.getEvents(startOfWeek, endOfWeek);
    return response.events;
  }

  async getEventsForDay(date: Date): Promise<CalendarEvent[]> {
    const response = await this.getEvents(date, date);
    return response.events;
  }

  async getUpcomingEvents(days: number = 7): Promise<CalendarEvent[]> {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    
    const response = await this.getEvents(startDate, endDate);
    return response.events;
  }
}

export default new CalendarService();