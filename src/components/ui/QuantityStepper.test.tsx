import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { QuantityStepper } from './QuantityStepper';

function Harness() {
  const [value, setValue] = useState(1);
  return <QuantityStepper value={value} onChange={setValue} />;
}

describe('QuantityStepper', () => {
  it('увеличивает и уменьшает количество, не опускаясь ниже минимума', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('Уменьшить количество')).toBeDisabled();

    await user.click(screen.getByLabelText('Увеличить количество'));
    expect(screen.getByText('2')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Уменьшить количество'));
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByLabelText('Уменьшить количество')).toBeDisabled();
  });
});
