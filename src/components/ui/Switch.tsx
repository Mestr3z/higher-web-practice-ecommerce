import * as RadixSwitch from '@radix-ui/react-switch';
import type { ReactNode } from 'react';

type SwitchProps = {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  children: ReactNode;
};

export function Switch({ id, checked, onCheckedChange, children }: SwitchProps) {
  return (
    <div className="flex items-center gap-2.5">
      <RadixSwitch.Root
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="bg-text-disabled focus-visible:ring-accent/40 data-[state=checked]:bg-accent relative h-6 w-11 shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2"
      >
        <RadixSwitch.Thumb className="bg-surface block h-5 w-5 translate-x-0.5 rounded-full transition-transform data-[state=checked]:translate-x-[22px]" />
      </RadixSwitch.Root>
      <label htmlFor={id} className="text-text cursor-pointer text-sm select-none">
        {children}
      </label>
    </div>
  );
}
