// Import page-specific translations
import { home } from './home';
import { auth } from './auth';
import { about } from './about';
import { dashboard } from './dashboard';
import { todos } from './todos';
// import { posts } from './posts';
// import { calendar } from './calendar';
// import { kanban } from './kanban';
// import { chat } from './chat';
// import { settings } from './settings';
// import { profile } from './profile';
// import { privacy } from './privacy';
// import { terms } from './terms';
// import { qa } from './qa';

// Combine all translations
const en = {
  home,
  auth,
  about,
  dashboard,
  todos,
  // Add more page translations here
  // posts,
  // calendar,
  // kanban,
  // chat,
  // settings,
  // profile,
  // privacy,
  // terms,
  // qa,
  
  // Keep existing translations that haven't been modularized yet
  privacyPolicy: {
    title: 'Privacy Policy',
    section1: {
      title: '1. Information We Collect',
      description: 'We collect information you provide directly to us, such as when you create an account, submit content, or request support.',
      items: [
        'Account information (name, email, password)',
        'Profile information (bio, avatar, location)',
        'Content you create (posts, comments, todos)',
        'Communications with us',
      ],
    },
    section2: {
      title: '2. How We Use Information',
      description: 'We use the information we collect to:',
      items: [
        'Provide, maintain, and improve our services',
        'Send you technical notices and support messages',
        'Respond to your comments and questions',
        'Protect against fraud and abuse',
      ],
    },
  },
  termsOfService: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated',
    section1: {
      title: '1. Acceptance of Terms',
      description: 'By accessing or using QA Learning Web, you agree to be bound by these Terms of Service.',
    },
    section2: {
      title: '2. Use of Services',
      description: 'You agree to use the services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else\'s use of the services.',
    },
  },
  notFound: {
    title: '404 - Page Not Found',
    description: 'Sorry, the page you are looking for does not exist.',
    goHome: 'Go to Home',
  },
  common: {
    loading: 'Loading...',
    error: 'An error occurred',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    submit: 'Submit',
    close: 'Close',
    yes: 'Yes',
    no: 'No',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    actions: 'Actions',
  },
};

export default en;