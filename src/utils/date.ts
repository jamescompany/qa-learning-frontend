import { format, formatDistance, formatRelative, isAfter, isBefore, isToday, isYesterday, addDays, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, differenceInDays, differenceInHours, differenceInMinutes, parseISO } from 'date-fns';

// Format date to display string
export const formatDate = (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, formatString);
};

// Format date with time
export const formatDateTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

// Format relative time (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix: true });
};

// Format relative date (e.g., "yesterday at 10:30 AM")
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatRelative(dateObj, new Date());
};

// Check if date is today
export const isDateToday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isToday(dateObj);
};

// Check if date is yesterday
export const isDateYesterday = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isYesterday(dateObj);
};

// Get friendly date display
export const getFriendlyDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(dateObj)) {
    return `Today at ${format(dateObj, 'HH:mm')}`;
  }
  
  if (isYesterday(dateObj)) {
    return `Yesterday at ${format(dateObj, 'HH:mm')}`;
  }
  
  const daysDiff = differenceInDays(new Date(), dateObj);
  
  if (daysDiff < 7) {
    return format(dateObj, 'EEEE at HH:mm');
  }
  
  if (daysDiff < 30) {
    return format(dateObj, 'MMM dd at HH:mm');
  }
  
  return format(dateObj, 'MMM dd, yyyy');
};

// Get time ago display
export const getTimeAgo = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const now = new Date();
  
  const minutesDiff = differenceInMinutes(now, dateObj);
  const hoursDiff = differenceInHours(now, dateObj);
  const daysDiff = differenceInDays(now, dateObj);
  
  if (minutesDiff < 1) {
    return 'just now';
  }
  
  if (minutesDiff < 60) {
    return `${minutesDiff} minute${minutesDiff === 1 ? '' : 's'} ago`;
  }
  
  if (hoursDiff < 24) {
    return `${hoursDiff} hour${hoursDiff === 1 ? '' : 's'} ago`;
  }
  
  if (daysDiff < 7) {
    return `${daysDiff} day${daysDiff === 1 ? '' : 's'} ago`;
  }
  
  if (daysDiff < 30) {
    const weeks = Math.floor(daysDiff / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  }
  
  if (daysDiff < 365) {
    const months = Math.floor(daysDiff / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  }
  
  const years = Math.floor(daysDiff / 365);
  return `${years} year${years === 1 ? '' : 's'} ago`;
};

// Check if date is in the past
export const isPast = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
};

// Check if date is in the future
export const isFuture = (date: string | Date): boolean => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isAfter(dateObj, new Date());
};

// Get start of today
export const getStartOfToday = (): Date => {
  return startOfDay(new Date());
};

// Get end of today
export const getEndOfToday = (): Date => {
  return endOfDay(new Date());
};

// Get start of this week
export const getStartOfThisWeek = (): Date => {
  return startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday as first day
};

// Get end of this week
export const getEndOfThisWeek = (): Date => {
  return endOfWeek(new Date(), { weekStartsOn: 1 });
};

// Get start of this month
export const getStartOfThisMonth = (): Date => {
  return startOfMonth(new Date());
};

// Get end of this month
export const getEndOfThisMonth = (): Date => {
  return endOfMonth(new Date());
};

// Get date range for filtering
export const getDateRange = (range: 'today' | 'yesterday' | 'thisWeek' | 'lastWeek' | 'thisMonth' | 'lastMonth'): { start: Date; end: Date } => {
  const now = new Date();
  
  switch (range) {
    case 'today':
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    
    case 'yesterday':
      const yesterday = subDays(now, 1);
      return {
        start: startOfDay(yesterday),
        end: endOfDay(yesterday),
      };
    
    case 'thisWeek':
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    
    case 'lastWeek':
      const lastWeek = subDays(now, 7);
      return {
        start: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        end: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      };
    
    case 'thisMonth':
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    
    case 'lastMonth':
      const lastMonth = subDays(now, 30);
      return {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth),
      };
    
    default:
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
  }
};

// Calculate reading time (words per minute)
export const calculateReadingTime = (text: string, wordsPerMinute: number = 200): number => {
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};

// Get calendar days for a month
export const getCalendarDays = (date: Date): Date[] => {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn: 1 });
  const days: Date[] = [];
  
  let current = start;
  while (isBefore(current, end) || current.getTime() === end.getTime()) {
    days.push(current);
    current = addDays(current, 1);
  }
  
  return days;
};

// Format duration
export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  
  return `${secs}s`;
};

// Get business days between two dates
export const getBusinessDays = (startDate: Date, endDate: Date): number => {
  let count = 0;
  let current = startDate;
  
  while (isBefore(current, endDate) || current.getTime() === endDate.getTime()) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday or Saturday
      count++;
    }
    current = addDays(current, 1);
  }
  
  return count;
};

// Check if date is weekend
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6;
};

// Get next business day
export const getNextBusinessDay = (date: Date): Date => {
  let next = addDays(date, 1);
  while (isWeekend(next)) {
    next = addDays(next, 1);
  }
  return next;
};