import { render, screen, fireEvent } from '@testing-library/react';
import AccuracyTipsCard, { AccuracyTip } from '../AccuracyTipsCard';

describe('AccuracyTipsCard', () => {
  const tips: AccuracyTip[] = [
    {
      id: 'context',
      title: 'Đặt câu hỏi cụ thể với ngữ cảnh rõ ràng',
      description: 'Mô tả ngữ cảnh đầy đủ',
      icon: <span data-testid="icon">*</span>,
      examples: ['Ví dụ 1', 'Ví dụ 2']
    }
  ];

  it('renders tip title', () => {
    render(<AccuracyTipsCard tips={tips} onTryNow={() => {}} />);
    expect(screen.getByText('Đặt câu hỏi cụ thể với ngữ cảnh rõ ràng')).toBeInTheDocument();
  });

  it('expands and collapses tip content', () => {
    render(<AccuracyTipsCard tips={tips} onTryNow={() => {}} />);

    // Initially description should not be visible
    expect(screen.queryByText('Mô tả ngữ cảnh đầy đủ')).not.toBeInTheDocument();

    // Click header to expand
    const [headerButton] = screen.getAllByRole('button');
    fireEvent.click(headerButton);
    expect(screen.getByText('Mô tả ngữ cảnh đầy đủ')).toBeInTheDocument();
    expect(screen.getByText('Ví dụ 1')).toBeInTheDocument();
    expect(screen.getByText('Ví dụ 2')).toBeInTheDocument();

    // Click again to collapse (target the same header button)
    fireEvent.click(headerButton);
    expect(screen.queryByText('Mô tả ngữ cảnh đầy đủ')).not.toBeInTheDocument();
  });

  it('calls onTryNow with correct id', () => {
    const onTryNow = vi.fn();
    render(<AccuracyTipsCard tips={tips} onTryNow={onTryNow} />);

    fireEvent.click(screen.getByRole('button')); // expand
    fireEvent.click(screen.getByText(/Thử ngay/i));

    expect(onTryNow).toHaveBeenCalledWith('context');
  });
});

