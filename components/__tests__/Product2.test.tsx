import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';

vi.mock('../../utils/geminiAPI', () => ({
  generateContent: vi.fn(),
}));

const { generateContent } = await import('../../utils/geminiAPI');
const Product2 = (await import('../Product2')).default;

describe('Product2 - Exam generator', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('shows validation error when topic is empty', async () => {
    render(<Product2 />);
    const button = screen.getByRole('button', { name: /Tạo câu hỏi/i });
    fireEvent.click(button);
    expect(await screen.findByText(/Vui lòng nhập chủ đề/i)).toBeInTheDocument();
  });

  it.skip('parses AI JSON and renders questions, then computes score correctly', async () => {
    (generateContent as any).mockResolvedValue({
      success: true,
      text: JSON.stringify({
        mcQuestions: [
          { question: 'MC Q1?', options: ['A', 'B', 'C', 'D'], answer: 'A' },
        ],
        tfQuestions: [
          {
            question: 'TF Q1?',
            statements: [
              { id: 'a', text: 'A1', isCorrect: true },
              { id: 'b', text: 'B1', isCorrect: false },
              { id: 'c', text: 'C1', isCorrect: true },
              { id: 'd', text: 'D1', isCorrect: false },
            ],
          },
        ],
      })
    });

    render(<Product2 />);

    // Fill inputs
    fireEvent.change(screen.getByLabelText(/Chủ đề/i), { target: { value: 'Test Topic' } });

    const generateBtn = screen.getByRole('button', { name: /Tạo câu hỏi/i });
    fireEvent.click(generateBtn);

    // Wait MC + TF rendered
    await screen.findByText('MC Q1?');
    await screen.findByText('TF Q1?');

    // Choose answers: MC correct (A)
    const optionA = screen.getByLabelText(/A\./i);
    fireEvent.click(optionA);

    // For TF: choose a: Đúng, b: Sai, c: Đúng, d: Sai (2 correct pairs minimun). Here choose a and c true only => score MC 1 + TF 0.5 = 1.5
    // Buttons have aria-label like "Phát biểu a, Đúng"
    fireEvent.click(screen.getByRole('radio', { name: /Phát biểu a, Đúng/i }));
    fireEvent.click(screen.getByRole('radio', { name: /Phát biểu c, Đúng/i }));

    // Submit
    const submitBtn = screen.getByRole('button', { name: /Kiểm tra đáp án/i });
    fireEvent.click(submitBtn);

    // Score banner appears with total 2
    await waitFor(() => {
      expect(screen.getByText(/Kết quả:/i)).toBeInTheDocument();
    });

    const banner = screen.getByText(/Kết quả:/i).closest('div');
    expect(banner?.textContent).toMatch(/1\.50\s*\/\s*2/);
  });
});

