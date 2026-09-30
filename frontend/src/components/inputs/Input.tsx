import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  containerClassName?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, fullWidth = true, containerClassName = '', icon, ...props }, ref) => {
    const baseInputStyles = 'bg-pure-white text-ink-black border border-ash rounded-md px-4 py-2 transition-colors focus:outline-none focus:border-ink-black disabled:opacity-50 disabled:bg-ash/10 font-graphikfix placeholder:text-smoke';
    const inputClasses = `${baseInputStyles} ${fullWidth ? 'w-full' : ''} ${error ? 'border-danger focus:border-danger' : ''} ${className}`;

    return (
      <div className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
        {label && (
          <label className="text-caption text-charcoal font-medium">
            {label}
          </label>
        )}
        <div className="relative w-full flex items-center">
          {icon && (
            <div className="absolute left-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input 
            ref={ref} 
            className={`${inputClasses} ${icon ? 'pl-10' : ''}`} 
            {...props} 
          />
        </div>
        {error && <span className="text-caption text-danger">{error}</span>}
        {!error && helperText && <span className="text-caption text-smoke">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
