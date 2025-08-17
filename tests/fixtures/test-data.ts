import { User, Post, Todo, Comment } from '../../src/types';

// Test Users
export const testUsers: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    name: 'John Doe',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Senior QA Engineer',
    location: 'San Francisco, CA',
    website: 'https://johndoe.com',
    role: 'user' as any,
    isEmailVerified: true,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    lastLoginAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '2',
    email: 'jane@example.com',
    name: 'Jane Smith',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Test Automation Expert',
    location: 'New York, NY',
    website: 'https://janesmith.com',
    role: 'admin' as any,
    isEmailVerified: true,
    isActive: true,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    lastLoginAt: '2024-01-19T00:00:00Z',
  },
];

// Test Posts
export const testPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with API Testing',
    content: 'API testing is crucial for modern applications...',
    excerpt: 'Learn the basics of API testing',
    slug: 'getting-started-api-testing',
    author: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://via.placeholder.com/150',
    },
    tags: ['api', 'testing', 'tutorial'],
    categories: [
      {
        id: '1',
        name: 'Testing',
        slug: 'testing',
        description: 'All about testing',
      },
    ],
    coverImage: 'https://via.placeholder.com/800x400',
    published: true,
    featured: true,
    likes: 42,
    views: 1337,
    readTime: 5,
    comments: [],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    publishedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'Selenium WebDriver Best Practices',
    content: 'When working with Selenium WebDriver...',
    excerpt: 'Master Selenium WebDriver',
    slug: 'selenium-webdriver-best-practices',
    author: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150',
    },
    tags: ['selenium', 'automation', 'webdriver'],
    categories: [
      {
        id: '2',
        name: 'Automation',
        slug: 'automation',
        description: 'Test automation topics',
      },
    ],
    coverImage: 'https://via.placeholder.com/800x400',
    published: true,
    featured: false,
    likes: 28,
    views: 892,
    readTime: 7,
    comments: [],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    publishedAt: '2024-01-05T00:00:00Z',
  },
];

// Test Todos
export const testTodos: Todo[] = [
  {
    id: '1',
    title: 'Write test cases for login flow',
    description: 'Cover all edge cases including invalid credentials',
    priority: 'high' as any,
    status: 'in_progress' as any,
    completed: false,
    dueDate: '2024-01-25T00:00:00Z',
    tags: ['testing', 'priority'],
    attachments: [],
    checklist: [
      {
        id: '1',
        text: 'Test valid credentials',
        completed: true,
        completedAt: '2024-01-20T00:00:00Z',
      },
      {
        id: '2',
        text: 'Test invalid credentials',
        completed: false,
      },
    ],
    estimatedTime: 120,
    actualTime: 60,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
    createdBy: '1',
  },
  {
    id: '2',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing',
    priority: 'medium' as any,
    status: 'todo' as any,
    completed: false,
    dueDate: '2024-01-30T00:00:00Z',
    tags: ['devops', 'automation'],
    attachments: [],
    checklist: [],
    estimatedTime: 240,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    createdBy: '2',
  },
];

// Test Comments
export const testComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    author: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://via.placeholder.com/150',
    },
    content: 'Great article! Very helpful for beginners.',
    likes: 5,
    replies: [],
    createdAt: '2024-01-11T00:00:00Z',
    updatedAt: '2024-01-11T00:00:00Z',
    isEdited: false,
  },
  {
    id: '2',
    postId: '1',
    author: {
      id: '3',
      name: 'Bob Johnson',
      avatar: 'https://via.placeholder.com/150',
    },
    content: 'Could you add more examples?',
    likes: 2,
    replies: [
      {
        id: '3',
        postId: '1',
        author: {
          id: '1',
          name: 'John Doe',
          avatar: 'https://via.placeholder.com/150',
        },
        content: 'Sure! I will update the post with more examples.',
        likes: 1,
        replies: [],
        createdAt: '2024-01-12T00:00:00Z',
        updatedAt: '2024-01-12T00:00:00Z',
        isEdited: false,
      },
    ],
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    isEdited: false,
  },
];

// Mock API responses
export const mockApiResponses = {
  login: {
    success: {
      user: testUsers[0],
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
    },
    error: {
      message: 'Invalid credentials',
      statusCode: 401,
    },
  },
  posts: {
    list: {
      posts: testPosts,
      total: testPosts.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
    single: testPosts[0],
  },
  todos: {
    list: {
      todos: testTodos,
      total: testTodos.length,
      page: 1,
      pageSize: 10,
      totalPages: 1,
      hasNext: false,
      hasPrevious: false,
    },
    single: testTodos[0],
  },
};

// Test form data
export const testFormData = {
  login: {
    valid: {
      email: 'test@example.com',
      password: 'Password123!',
    },
    invalid: {
      email: 'invalid-email',
      password: '123',
    },
  },
  signup: {
    valid: {
      name: 'Test User',
      email: 'newuser@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'SecurePass123!',
    },
    invalid: {
      name: 'T',
      email: 'invalid',
      password: 'weak',
      confirmPassword: 'different',
    },
  },
  post: {
    valid: {
      title: 'Test Post Title',
      content: 'This is a test post content with sufficient length.',
      tags: ['test', 'sample'],
      published: false,
    },
    invalid: {
      title: 'T',
      content: 'Short',
      tags: [],
      published: false,
    },
  },
  todo: {
    valid: {
      title: 'Test Todo',
      description: 'Test todo description',
      priority: 'medium',
      dueDate: '2024-12-31',
    },
    invalid: {
      title: '',
      description: 'a'.repeat(501),
      priority: 'invalid' as any,
      dueDate: 'invalid-date',
    },
  },
};

// Helper functions for generating test data
export const generateMockUser = (overrides: Partial<User> = {}): User => ({
  id: Math.random().toString(36).substr(2, 9),
  email: `user${Date.now()}@example.com`,
  name: 'Test User',
  role: 'user' as any,
  isEmailVerified: true,
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockPost = (overrides: Partial<Post> = {}): Post => ({
  id: Math.random().toString(36).substr(2, 9),
  title: 'Test Post',
  content: 'Test content',
  slug: 'test-post',
  author: {
    id: '1',
    name: 'Test Author',
  },
  tags: [],
  categories: [],
  published: false,
  featured: false,
  likes: 0,
  views: 0,
  readTime: 1,
  comments: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

export const generateMockTodo = (overrides: Partial<Todo> = {}): Todo => ({
  id: Math.random().toString(36).substr(2, 9),
  title: 'Test Todo',
  priority: 'medium' as any,
  status: 'todo' as any,
  completed: false,
  tags: [],
  attachments: [],
  checklist: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  createdBy: '1',
  ...overrides,
});