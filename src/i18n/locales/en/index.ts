// Import page-specific translations
import { common } from './common';
import { home } from './home';
import { auth } from './auth';
import { about } from './about';
import { dashboard } from './dashboard';
import { todos } from './todos';
import { banking } from './banking';
import { qa as qaTranslations } from './qa';
import { playground } from './playground';
import { social } from './social';
import { footer } from './footer';
import { sidebar } from './sidebar';
import { posts } from './posts';
import { kanban } from './kanban';
import { chat } from './chat';
import { settings } from './settings';
import { profile } from './profile';
import { privacy } from './privacy';
import { terms } from './terms';

// Combine all translations
const en = {
  ...common,
  common,
  ...home,
  auth,
  about,
  dashboard,
  todos,
  banking,
  social,
  ...qaTranslations,
  ...playground,
  footer,
  sidebar,
  posts,
  kanban,
  chat,
  settings,
  profile,
  privacyPolicy: privacy,
  termsOfService: terms,
  // Expose bookingSystem at root level
  bookingSystem: qaTranslations.hub.bookingSystem,
  calendar: {
    title: 'Calendar',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    today: 'Today',
    previous: 'Previous',
    next: 'Next',
    addEvent: 'Add Event',
    eventTypes: 'Event Types',
    meeting: 'Meeting',
    deadline: 'Deadline',
    todo: 'Todo',
    clickToViewDetails: 'Click to view details',
    eventForm: {
      addTitle: 'Add New Event',
      editTitle: 'Edit Event',
      title: 'Title',
      date: 'Date',
      type: 'Type',
      time: 'Time',
      timeOptional: 'Time (Optional)',
      description: 'Description',
      descriptionOptional: 'Description (Optional)',
      saveChanges: 'Save Changes',
      cancel: 'Cancel',
    },
    eventDetail: {
      title: 'Event Details',
      edit: 'Edit',
      delete: 'Delete',
      close: 'Close',
    },
    deleteConfirm: {
      title: 'Delete Event',
      message: 'Are you sure you want to delete "{title}"?',
      warning: 'This action cannot be undone.',
      confirmButton: 'Delete',
      cancelButton: 'Cancel',
    },
    more: 'more',
    showAllEvents: 'Show all events',
    allEventsForDay: 'Events for {{date}}',
    noEventsForDay: 'No events scheduled for this day',
    view: 'View',
    edit: 'Edit',
    time: 'Time',
    addEventForDay: 'Add Event for This Day',
    events: 'Events',
  },
  // QAHub mapping for compatibility
  qaHub: qaTranslations.qaHub,
  notFound: {
    title: '404',
    heading: 'Page Not Found',
    description: 'Sorry, the page you are looking for does not exist.',
    goHome: 'Go to Home',
    dashboard: 'Go to Dashboard',
  },
};

export default en;