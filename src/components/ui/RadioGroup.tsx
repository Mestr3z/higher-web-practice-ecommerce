import * as RadixRadio from '@radix-ui/react-radio-group';

type RadioOption = {
  value: string;
  label: string;
};

type RadioGroupProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: RadioOption[];
};

export function RadioGroup({ value, onValueChange, options }: RadioGroupProps) {
  return (
    <RadixRadio.Root
      value={value}
      onValueChange={onValueChange}
      className="flex flex-col gap-2"
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-center gap-2.5">
          <RadixRadio.Item
            id={`radio-${option.value}`}
            value={option.value}
            className="border-border bg-surface focus-visible:ring-accent/40 data-[state=checked]:border-accent grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border outline-none focus-visible:ring-2"
          >
            <RadixRadio.Indicator className="bg-accent block h-2.5 w-2.5 rounded-full" />
          </RadixRadio.Item>
          <label
            htmlFor={`radio-${option.value}`}
            className="text-text cursor-pointer text-sm select-none"
          >
            {option.label}
          </label>
        </div>
      ))}
    </RadixRadio.Root>
  );
}
