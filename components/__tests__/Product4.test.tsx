import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Product4 from '../Product4';
import { renderWithProviders } from './test-utils';

vi.mock('../../utils/geminiAPI', () => ({
  generateContent: vi.fn(),
}));

const { generateContent } = await import('../../utils/geminiAPI');

describe('Product4 - Agriculture exam generation & scoring', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  it('handles invalid AI JSON with friendly error', async () => {
    (generateContent as any).mockResolvedValue({ success: true, text: 'Not a JSON array' });

    renderWithProviders(<Product4 />);
    const genBtn = await screen.findByRole('button', { name: /Tạo đề thi mô phỏng/i });
    fireEvent.click(genBtn);

    await waitFor(() => {
      expect(screen.getByText(/định dạng json/i)).toBeInTheDocument();
    });
  });

  it.skip('parses code block JSON, renders and computes score (MC+TF)', async () => {
    (generateContent as any).mockResolvedValue({
      success: true,
      text: '```json\n' + JSON.stringify([
        { text: 'MC A?', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C', type: 'multiple_choice' },
        { text: 'TF A?', statements: [
          { id: 'a', text: 'S1', isCorrect: true },
          { id: 'b', text: 'S2', isCorrect: false },
          { id: 'c', text: 'S3', isCorrect: true },
          { id: 'd', text: 'S4', isCorrect: false },
        ], type: 'true_false' }
      ]) + '\n```'
    });

    renderWithProviders(<Product4 />);

    // Generate
    fireEvent.click(await screen.findByRole('button', { name: /Tạo đề thi mô phỏng/i }));

    // Wait questions
    await screen.findByText(/MC A\?/i);
    await screen.findByText(/TF A\?/i);

    // MC choose wrong answer to test scoring (pick B instead of C)
    const optionB = screen.getByText(/^B\./i);
    fireEvent.click(optionB);

    // For TF: choose a:true, c:true (2 correct out of 4 => 0.5)
    fireEvent.click(screen.getByRole('radio', { name: /Phát biểu a, Đúng/i }));
    fireEvent.click(screen.getByRole('radio', { name: /Phát biểu c, Đúng/i }));

    // Submit
    fireEvent.click(screen.getByRole('button', { name: /Nộp bài/i }));

    await waitFor(() => {
      expect(screen.getByText(/Kết quả bài thi/i)).toBeInTheDocument();
    });
  });
});

