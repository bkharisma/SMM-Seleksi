import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, id, ...props }, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label htmlFor={id} className="mb-1 block text-sm font-medium text-on-surface-container">
                    {label}
                </label>
            )}
            <textarea
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
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
