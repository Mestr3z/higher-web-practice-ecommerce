import * as RadixSelect from '@radix-ui/react-select';

import ArrowIcon from '../../assets/Arrow.svg?react';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  options: SelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  'aria-label'?: string;
};

export function Select({
  options,
  value,
  onValueChange,
  placeholder,
  fullWidth = false,
  'aria-label': ariaLabel,
}: SelectProps) {
  return (
    <RadixSelect.Root value={value} onValueChange={onValueChange}>
      <RadixSelect.Trigger
        aria-label={ariaLabel}
        className={`border-border bg-surface text-text focus-visible:ring-accent/40 data-[state=open]:border-accent inline-flex items-center justify-between gap-2 rounded-md border px-3 py-2.5 text-sm outline-none focus-visible:ring-2 ${
          fullWidth ? 'w-full' : 'min-w-[190px]'
        }`}
      >
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon>
          <ArrowIcon className="text-text-secondary h-4 w-4 -rotate-90" />
        </RadixSelect.Icon>
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content
          position="popper"
          sideOffset={4}
          className="border-border bg-surface z-50 min-w-[190px] overflow-hidden rounded-md border shadow-lg"
        >
          <RadixSelect.Viewport className="p-1">
            {options.map((option) => (
              <RadixSelect.Item
                key={option.value}
                value={option.value}
                className="text-text data-[highlighted]:bg-bg data-[state=checked]:text-accent cursor-pointer rounded px-3 py-2 text-sm outline-none select-none data-[state=checked]:font-semibold"
              >
                <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
              </RadixSelect.Item>
            ))}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
