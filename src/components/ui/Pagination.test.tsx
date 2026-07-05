import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('не рендерится при одной странице', () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onChange={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('на первой странице кнопка "назад" отключена', () => {
    render(<Pagination currentPage={1} totalPages={5} onChange={() => {}} />);
    expect(screen.getByLabelText('Предыдущая страница')).toBeDisabled();
    expect(screen.getByLabelText('Следующая страница')).toBeEnabled();
  });

  it('клик по номеру страницы вызывает onChange с этой страницей', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();
    render(<Pagination currentPage={1} totalPages={5} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: '2' }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('показывает многоточие при большом числе страниц', () => {
    render(<Pagination currentPage={5} totalPages={10} onChange={() => {}} />);
    expect(screen.getAllByText('…')).toHaveLength(2);
  });
});
