import type { TextareaHTMLAttributes } from 'react';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export function Textarea({ invalid = false, className = '', ...props }: TextareaProps) {
  const state = invalid
    ? 'border-danger focus:border-danger focus:ring-danger/20'
    : 'border-border focus:border-accent';

  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={`text-text placeholder:text-text-disabled focus:ring-accent/20 w-full rounded-md border px-3 py-2.5 text-sm transition-colors outline-none focus:ring-2 ${state} ${className}`}
      {...props}
    />
  );
}
