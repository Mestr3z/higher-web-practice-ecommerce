import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

const base =
  'w-full rounded-md border px-3 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-disabled focus:ring-2 focus:ring-accent/20 disabled:bg-surface-disabled disabled:text-text-disabled';

export function Input({ invalid = false, className = '', ...props }: InputProps) {
  const state = invalid
    ? 'border-danger focus:border-danger focus:ring-danger/20'
    : 'border-border focus:border-accent';

  return (
    <input
      aria-invalid={invalid || undefined}
      className={`${base} ${state} ${className}`}
      {...props}
    />
  );
}
