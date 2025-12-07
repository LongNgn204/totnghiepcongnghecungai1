import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Product3 from '../Product3';
import { renderWithProviders } from './test-utils';

vi.mock('../../utils/geminiAPI', () => ({
  generateContent: vi.fn(),
}));

const { generateContent } = await import('../../utils/geminiAPI');

describe.skip('Product3 - Industrial exam generation & submit', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('generates from AI (code block JSON), shows questions and submits with result banner', async () => {
    (generateContent as any).mockResolvedValue({
      success: true,
      text: '```json\n' + JSON.stringify([
        { text: 'MC 1?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B', type: 'multiple_choice' },
        { text: 'TF 1?', statements: [
          { id: 'a', text: 'S1', isCorrect: true },
          { id: 'b', text: 'S2', isCorrect: false },
          { id: 'c', text: 'S3', isCorrect: true },
          { id: 'd', text: 'S4', isCorrect: false },
        ], type: 'true_false' }
      ]) + '\n```'
    });

    renderWithProviders(<Product3 />);

    // Click generate
    const genBtn = await screen.findByRole('button', { name: /Tạo đề thi mô phỏng/i });
    fireEvent.click(genBtn);

    // Wait questions
    await screen.findByText(/MC 1\?/i);
    await screen.findByText(/TF 1\?/i);

    // Select MC option B by clicking label text 'B.'
    const optionB = screen.getByText(/^B\./i);
    fireEvent.click(optionB);

    // Pick TF answers for a and c = true
    fireEvent.click(screen.getByRole('radio', { name: /Phát biểu a, Đúng/i }));
    fireEvent.click(screen.getByRole('radio', { name: /Phát biểu c, Đúng/i }));

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Nộp bài/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Kết quả bài thi/i)).toBeInTheDocument();
    });
  });
});

