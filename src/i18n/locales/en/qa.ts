export const qa = {
  hub: {
    title: 'QA Testing Playground',
    subtitle: 'Master software testing with hands-on practice',
    description: 'Welcome to your interactive testing environment. Practice real-world QA scenarios, learn testing techniques, and improve your skills.',
    features: {
      title: 'What You Can Test',
      realWorld: {
        title: 'Real-World Scenarios',
        description: 'Practice with e-commerce, banking, and social media applications',
      },
      interactive: {
        title: 'Interactive Components',
        description: 'Test forms, modals, drag-and-drop, and complex UI interactions',
      },
      automated: {
        title: 'Automation Ready',
        description: 'All elements have test IDs for Selenium, Cypress, and Playwright',
      },
      responsive: {
        title: 'Responsive Testing',
        description: 'Test across different screen sizes and devices',
      },
      authSecurity: {
        title: 'Authentication & Security',
        items: [
          'Login/Logout functionality',
          'Password reset flow',
          'Session management',
          'Two-factor authentication',
          'Role-based access control',
        ],
      },
      formsValidation: {
        title: 'Forms & Validation',
        items: [
          'Required field validation',
          'Email format validation',
          'Password strength requirements',
          'Multi-step form workflows',
          'File upload validation',
        ],
      },
      interactiveElements: {
        title: 'Interactive Elements',
        items: [
          'Drag and drop functionality',
          'Modal dialogs and popups',
          'Real-time search and filtering',
          'Infinite scroll pagination',
          'Tooltips and notifications',
        ],
      },
    },
    scenarios: {
      title: 'Testing Scenarios',
      viewDetails: 'View Details',
      startTesting: 'Start Testing',
      difficulty: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      },
      ecommerce: {
        title: 'E-Commerce Platform',
        description: 'Test shopping cart, checkout, payment flows, and inventory management',
        features: ['Product search & filters', 'Shopping cart management', 'Checkout process', 'Payment validation', 'Order tracking'],
      },
      banking: {
        title: 'Banking Dashboard',
        description: 'Test financial transactions, security features, and data validation',
        features: ['Account management', 'Transaction history', 'Fund transfers', 'Bill payments', 'Security testing'],
      },
      social: {
        title: 'Social Media Feed',
        description: 'Test real-time updates, user interactions, and content management',
        features: ['Post creation', 'Comments & reactions', 'Real-time updates', 'Media uploads', 'Privacy settings'],
      },
      booking: {
        title: 'Travel Booking System',
        description: 'Test complex forms, date validations, and booking workflows',
        features: ['Flight search', 'Hotel booking', 'Date validation', 'Price calculation', 'Booking confirmation'],
      },
      playground: {
        title: 'Component Playground',
        description: 'Test individual UI components and their various states',
        features: ['Form validations', 'Modal interactions', 'Drag and drop', 'File uploads', 'Notifications'],
      },
    },
    getStarted: {
      title: 'Getting Started',
      steps: {
        1: {
          title: 'Choose a Scenario',
          description: 'Select from our pre-built testing scenarios or explore the component playground',
        },
        2: {
          title: 'Read Test Cases',
          description: 'Each scenario includes detailed test cases and expected behaviors',
        },
        3: {
          title: 'Execute Tests',
          description: 'Manually test the application or use the provided test IDs for automation',
        },
        4: {
          title: 'Find Bugs',
          description: 'Some scenarios include intentional bugs for you to discover',
        },
      },
    },
    tips: {
      title: 'Testing Tips',
      items: [
        'Always check edge cases and boundary values',
        'Test both positive and negative scenarios',
        'Verify error messages and validation feedback',
        'Check accessibility with keyboard navigation',
        'Test different browser and device combinations',
        'Use browser DevTools to inspect elements and network calls',
      ],
      formValidation: {
        title: 'Form Validation',
        description: 'Test all input types and validation rules',
      },
      responsiveDesign: {
        title: 'Responsive Design',
        description: 'Check layouts on different screen sizes',
      },
      userInteractions: {
        title: 'User Interactions',
        description: 'Test clicks, hovers, and keyboard navigation',
      },
      dataPersistence: {
        title: 'Data Persistence',
        description: 'Verify data saves and loads correctly',
      },
    },
    learningSupport: 'Learning Support',
    testingTips: 'Testing Tips',
    featuresForTesting: 'Features for Testing',
    quickStartGuide: 'Quick Start Guide',
    support: {
      message: 'Need help with your testing journey? Our support team is here to help you master QA skills.',
      email: 'support@qatesting.com',
    },
    quickStart: {
      title: 'How to Get Started',
      steps: [
        'Choose a testing scenario from the available options',
        'Read the test cases and requirements',
        'Interact with the application to find bugs',
        'Use browser DevTools to inspect elements',
        'Document your findings and test results',
      ],
    },
  },
  testingGuide: {
    scenarios: 'Test Scenarios',
    tips: 'Testing Tips',
    testIds: 'Available Test IDs',
    difficulty: 'Difficulty',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    steps: 'Steps',
    expectedResult: 'Expected Result',
    element: 'Element',
    description: 'Description',
  },
};