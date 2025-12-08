import { test, expect } from '@playwright/test';

async function stubAuth(page: any) {
  await page.route('**/api/auth/me', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { id: 'u1', email: 'test@example.com', displayName: 'Test User' } }) });
  });
}

test('Chat page loads (stub auth) and shows suggestions', async ({ page }) => {
  await stubAuth(page);
  await page.goto('/san-pham-1');
  await expect(page.getByText(/Trò chuyện với AI/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Ví dụ câu hỏi hay/i)).toBeVisible();
});

