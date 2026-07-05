import PlusIcon from '../../assets/Plus.svg?react';

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
};

export function QuantityStepper({ value, onChange, min = 1 }: QuantityStepperProps) {
  return (
    <div className="border-border flex items-center gap-3 rounded-md border px-2 py-1.5">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Уменьшить количество"
        className="text-text-secondary hover:bg-bg grid h-7 w-7 place-items-center rounded disabled:cursor-not-allowed disabled:opacity-40"
      >
        <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
          <path
            d="M3 8H13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span className="w-6 text-center text-sm font-medium">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Увеличить количество"
        className="text-text-secondary hover:bg-bg grid h-7 w-7 place-items-center rounded"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
