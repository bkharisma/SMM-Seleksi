import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string | number; label: string }[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, error, options, placeholder, className, id, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-on-surface-container">
                    {label}
                </label>
            )}
            <select
                ref={ref}
                id={id}
                className={cn(
                    'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-background focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50',
                    error && 'border-error focus:border-error focus:ring-error',
                    className
                )}
                {...props}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-error">{error}</p>}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
