import React from 'react';

export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, asChild, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-normal transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
    
    const variants = {
      primary: 'bg-ink-black text-pure-white rounded-md hover:bg-charcoal',
      ghost: 'bg-transparent text-ink-black hover:bg-ash/20 rounded-md',
      danger: 'bg-transparent text-danger border border-danger hover:bg-danger/10 rounded-md',
      outline: 'bg-transparent text-ink-black border border-ash hover:border-ink-black rounded-md',
    };

    const sizes = {
      sm: 'px-4 py-2 text-caption tracking-[0.154px]',
      md: 'px-[23px] py-2 text-caption tracking-[0.154px] min-h-[40px]',
      lg: 'px-[32px] py-3 text-body tracking-[0.144px] min-h-[48px]',
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
