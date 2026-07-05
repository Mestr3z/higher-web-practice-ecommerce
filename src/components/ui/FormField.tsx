import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
};

export function FormField({
  label,
  htmlFor,
  required = false,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-text-secondary text-sm">
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
      {children}
      {error && <span className="text-danger text-xs">{error}</span>}
    </div>
  );
}
