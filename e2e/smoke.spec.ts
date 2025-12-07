import { test, expect } from '@playwright/test';

// Helper: stub backend endpoints
async function stubAuthAndAPIs(page: any) {
  // Stub /api/auth/me -> pretend logged in
  await page.route('**/api/auth/me', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: { id: 'u1', email: 'test@example.com', displayName: 'Test User' } })
    });
  });

  // Stub /api/ai/generate -> deterministic code-block JSON for exams
  await page.route('**/api/ai/generate', async route => {
    const body = {
      data: {
        candidates: [
          {
            content: {
              parts: [
                {
                  text: '```json\n' + JSON.stringify([
                    { text: 'MC 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', type: 'multiple_choice' },
                    { text: 'TF 1?', statements: [
                      { id: 'a', text: 'S1', isCorrect: true },
                      { id: 'b', text: 'S2', isCorrect: false },
                      { id: 'c', text: 'S3', isCorrect: true },
                      { id: 'd', text: 'S4', isCorrect: false },
                    ], type: 'true_false' }
                  ]) + '\n```'
                }
              ]
            }
          }
        ]
      }
    };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });

  // Stub exam create
  await page.route('**/api/exams', async route => {
    if (route.request().method() === 'POST') {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { id: 'exam1' } }) });
      return;
    }
    // GET exams
    const res = { data: { exams: [{ id: 'exam1', title: 'Đề thi Công nghiệp Lớp 12 - Khó', score: 1, total_questions: 2, duration: 600, completed_at: Date.now() }] } };
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(res) });
  });

  // Stub progress stats
  await page.route('**/api/progress/stats', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ data: { totalExams: 1, averageScore: 50, bestScore: 80, totalTimeSpent: 10, industrialCount: 1, agricultureCount: 0 } }) });
  });
}

test('Smoke: login (stub) → tạo đề (AI stub) → nộp → history hiển thị', async ({ page }) => {
  await stubAuthAndAPIs(page);

  // Go to homepage
  await page.goto('/');

  // Vào Công nghiệp (Product3)
  await page.getByRole('link', { name: /Công nghiệp/i }).click();

  // Click tạo đề
  await page.getByRole('button', { name: /Tạo đề thi mô phỏng/i }).click();

  // Chờ câu hỏi hiển thị
  await expect(page.getByText('MC 1?')).toBeVisible();
  await expect(page.getByText('TF 1?')).toBeVisible();

  // Nộp bài (không chọn gì – chỉ smoke)
  await page.getByRole('button', { name: /Nộp bài/i }).click();

  // Mở History
  await page.goto('/history');
  await expect(page.getByText(/Lịch Sử Đề Thi/i)).toBeVisible();
});

