import { test as base, expect } from '@playwright/test';
import { testUsers, testFormData } from '../fixtures/test-data';

// Define custom fixtures
type TestFixtures = {
  authenticatedPage: any;
  testData: typeof testFormData;
};

// Extend base test with custom fixtures
export const test = base.extend<TestFixtures>({
  authenticatedPage: async ({ page }, use) => {
    // Perform login
    await page.goto('/login');
    await page.fill('[name="email"]', testUsers[0].email);
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    await page.waitForURL('/dashboard');
    
    // Use the authenticated page
    await use(page);
    
    // Cleanup: logout
    await page.click('button:has-text("Logout")');
  },
  
  testData: async ({}, use) => {
    await use(testFormData);
  },
});

export { expect };

// Global setup
export async function globalSetup() {
  console.log('Running global setup...');
  // Add any global setup logic here
  // e.g., database seeding, API setup, etc.
}

// Global teardown
export async function globalTeardown() {
  console.log('Running global teardown...');
  // Add any global cleanup logic here
}

// Helper functions
export async function waitForAPIResponse(page: any, endpoint: string) {
  return page.waitForResponse((response: any) => 
    response.url().includes(endpoint) && response.status() === 200
  );
}

export async function mockAPIEndpoint(page: any, endpoint: string, response: any) {
  await page.route(`**/${endpoint}`, (route: any) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

export async function takeScreenshotOnFailure(page: any, testInfo: any) {
  if (testInfo.status !== 'passed') {
    await page.screenshot({
      path: `screenshots/${testInfo.title}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}

// Common selectors
export const selectors = {
  // Auth
  loginForm: 'form[data-testid="login-form"]',
  signupForm: 'form[data-testid="signup-form"]',
  emailInput: 'input[name="email"]',
  passwordInput: 'input[name="password"]',
  submitButton: 'button[type="submit"]',
  
  // Navigation
  header: 'header',
  nav: 'nav',
  sidebar: 'aside',
  
  // Posts
  postCard: '[data-testid="post-card"]',
  postTitle: '[data-testid="post-title"]',
  postContent: '[data-testid="post-content"]',
  likeButton: 'button[data-testid="like-button"]',
  
  // Todos
  todoItem: '[data-testid="todo-item"]',
  todoCheckbox: 'input[type="checkbox"][data-testid="todo-checkbox"]',
  todoTitle: '[data-testid="todo-title"]',
  
  // Common
  modal: '[role="dialog"]',
  toast: '[role="alert"]',
  loading: '[data-testid="loading"]',
  error: '[data-testid="error"]',
};

// Test data helpers
export function generateRandomEmail(): string {
  return `test${Date.now()}@example.com`;
}

export function generateRandomString(length: number = 10): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

// Assertion helpers
export async function expectToastMessage(page: any, message: string) {
  const toast = page.locator(selectors.toast);
  await expect(toast).toBeVisible();
  await expect(toast).toContainText(message);
}

export async function expectPageHeading(page: any, heading: string) {
  await expect(page.locator('h1')).toContainText(heading);
}

export async function expectFormError(page: any, fieldName: string, errorMessage: string) {
  const field = page.locator(`[name="${fieldName}"]`);
  const error = field.locator('~ .error-message');
  await expect(error).toBeVisible();
  await expect(error).toContainText(errorMessage);
}

// Navigation helpers
export async function navigateTo(page: any, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle');
}

export async function clickAndNavigate(page: any, selector: string, expectedUrl: string) {
  await Promise.all([
    page.waitForNavigation(),
    page.click(selector),
  ]);
  await expect(page).toHaveURL(expectedUrl);
}

// Form helpers
export async function fillForm(page: any, formData: Record<string, string>) {
  for (const [field, value] of Object.entries(formData)) {
    await page.fill(`[name="${field}"]`, value);
  }
}

export async function submitForm(page: any, formSelector: string) {
  const form = page.locator(formSelector);
  await form.locator('button[type="submit"]').click();
}

// API helpers
export async function waitForAPI(page: any) {
  await page.waitForLoadState('networkidle');
}

export async function interceptAPI(page: any, method: string, url: string, handler: Function) {
  await page.route(
    (route: any) => route.request().method() === method && route.request().url().includes(url),
    handler
  );
}

// Accessibility helpers
export async function checkA11y(page: any) {
  // This would integrate with an accessibility testing library
  // For now, just check for basic ARIA attributes
  const buttons = await page.locator('button').all();
  for (const button of buttons) {
    const text = await button.textContent();
    const ariaLabel = await button.getAttribute('aria-label');
    expect(text || ariaLabel).toBeTruthy();
  }
}

// Performance helpers
export async function measurePageLoad(page: any): Promise<number> {
  const navigationTiming = await page.evaluate(() => 
    JSON.stringify(performance.getEntriesByType('navigation'))
  );
  const [navigation] = JSON.parse(navigationTiming);
  return navigation.loadEventEnd - navigation.fetchStart;
}

// Cleanup helpers
export async function cleanupTestData(page: any, userId: string) {
  // Make API calls to clean up test data
  await page.request.delete(`/api/v1/test-cleanup/${userId}`);
}