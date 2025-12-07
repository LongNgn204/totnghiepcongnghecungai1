import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import Product1 from '../Product1';

// Silence console errors from components that might log in tests
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as any).mockRestore?.();
  (console.warn as any).mockRestore?.();
});

describe.skip('Product1 - Suggested Questions integration', () => {
  it('auto-fills ChatInput when clicking a suggested question', async () => {
    render(<Product1 />);

    const question = 'Giải thích nguyên lý máy biến áp ba pha?';
    const suggestedItem = await screen.findByText(question);
    fireEvent.click(suggestedItem);

    const input = await screen.findByPlaceholderText('Nhập câu hỏi cho Gemini...');

    await waitFor(() => {
      expect(input).toHaveValue(question);
    });
  });
});

