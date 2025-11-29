import { render, screen, fireEvent } from '@testing-library/react';
import PromptTemplates from '../PromptTemplates';

describe('PromptTemplates', () => {
  beforeEach(() => {
    // reset localStorage key used by component
    localStorage.removeItem('promptTemplates.activeCategory');
  });

  it('persists active category to localStorage', () => {
    render(<PromptTemplates />);
    const tab = screen.getByRole('button', { name: 'Tài liệu' });
    fireEvent.click(tab);
    expect(localStorage.getItem('promptTemplates.activeCategory')).toBe('Tài liệu');
  });

  it('dispatches auto-fill and open-file-picker for analyze-document template', () => {
    const spy = vi.spyOn(window, 'dispatchEvent');
    render(<PromptTemplates />);

    // Switch to Tài liệu category to show the template that needs files
    const docTab = screen.getByRole('button', { name: 'Tài liệu' });
    fireEvent.click(docTab);

    const useButtons = screen.getAllByRole('button', { name: /Dùng mẫu/i });
    // pick the first "Dùng mẫu" in this tab (should correspond to analyze-document)
    fireEvent.click(useButtons[0]);

    // Expect auto-fill-question dispatched
    const autoFillCalled = spy.mock.calls.some(([evt]) => evt instanceof CustomEvent && (evt as CustomEvent).type === 'auto-fill-question');
    const openPickerCalled = spy.mock.calls.some(([evt]) => evt instanceof Event && (evt as Event).type === 'open-file-picker');

    expect(autoFillCalled).toBe(true);
    expect(openPickerCalled).toBe(true);

    spy.mockRestore();
  });
});

