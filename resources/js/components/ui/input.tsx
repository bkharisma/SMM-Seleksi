import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helper?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, helper, className, id, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-on-surface-container">
                    {label}
                </label>
            )}
            <input
                ref={ref}
                id={id}
                className={cn(
                    'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background placeholder:text-on-surface-container/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'border-error focus:border-error focus:ring-error',
                    className
                )}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
            {helper && !error && <p className="mt-1 text-sm text-on-surface-container">{helper}</p>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
