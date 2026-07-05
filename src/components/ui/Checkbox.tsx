import * as RadixCheckbox from '@radix-ui/react-checkbox';
import type { ReactNode } from 'react';

type CheckboxProps = {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
};

export function Checkbox({ id, checked, onCheckedChange, children }: CheckboxProps) {
  return (
    <div className="flex items-center gap-2.5">
      <RadixCheckbox.Root
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
        className="border-border bg-surface focus-visible:ring-accent/40 data-[state=checked]:border-accent data-[state=checked]:bg-accent grid h-[18px] w-[18px] shrink-0 place-items-center rounded border outline-none focus-visible:ring-2"
      >
        <RadixCheckbox.Indicator>
          <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
            <path
              d="M2 6L5 9L10 3"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      <label htmlFor={id} className="text-text cursor-pointer text-sm select-none">
        {children}
      </label>
    </div>
  );
}
