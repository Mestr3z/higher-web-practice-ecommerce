import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';
type ButtonSize = 'md' | 'sm';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  iconOnly?: boolean;
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-white hover:bg-accent-hover disabled:bg-surface-disabled disabled:text-text-disabled',
  outline:
    'border border-accent text-accent hover:bg-accent hover:text-white disabled:border-border disabled:text-text-disabled disabled:hover:bg-transparent disabled:hover:text-text-disabled',
  ghost: 'text-accent hover:text-accent-hover disabled:text-text-disabled',
};

const sizes: Record<ButtonSize, string> = {
  md: 'px-5 py-2.5 text-sm',
  sm: 'px-3 py-2 text-xs',
};

const iconSizes: Record<ButtonSize, string> = {
  md: 'p-2.5',
  sm: 'p-2',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconOnly = false,
  className = '',
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const sizeClass = iconOnly ? iconSizes[size] : sizes[size];
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizeClass} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
