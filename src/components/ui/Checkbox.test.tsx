import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { Checkbox } from './Checkbox';

function Harness() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox id="c" checked={checked} onCheckedChange={setChecked}>
      Военный
    </Checkbox>
  );
}

describe('Checkbox', () => {
  it('переключается по клику', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAttribute('aria-checked', 'false');
    await user.click(box);
    expect(box).toHaveAttribute('aria-checked', 'true');
  });
});
