import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ContextWizard from '../ContextWizard';

describe('ContextWizard', () => {
  it.skip('blocks next on empty goal and dispatches events on apply', () => {
    const onClose = vi.fn();
    const spy = vi.spyOn(window, 'dispatchEvent');

    render(<ContextWizard open={true} onClose={onClose} />);

    // Step 1 -> Step 2
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp' }));
    // Step 2 -> Step 3
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp' }));
    // Step 3 -> Step 4
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp' }));

    // At Step 4: clear goal and expect Next disabled
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '' } });
    expect(screen.getByRole('button', { name: 'Tiếp' })).toBeDisabled();

    // Fill goal and proceed to Step 5
    fireEvent.change(textarea, { target: { value: 'Ôn thi nhanh mạch 3 pha' } });
    expect(screen.getByRole('button', { name: 'Tiếp' })).not.toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp' }));

    // Step 5: check requireFiles
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    // Step 5 -> Step 6
    fireEvent.click(screen.getByRole('button', { name: 'Tiếp' }));

    // Apply
    fireEvent.click(screen.getByRole('button', { name: 'Áp dụng' }));

    // Verify events
    const autoFillCalled = spy.mock.calls.some(([evt]) => evt instanceof CustomEvent && (evt as CustomEvent).type === 'auto-fill-question');
    const openPickerCalled = spy.mock.calls.some(([evt]) => evt instanceof Event && (evt as Event).type === 'open-file-picker');

    expect(autoFillCalled).toBe(true);
    expect(openPickerCalled).toBe(true);

    spy.mockRestore();
  });
});

