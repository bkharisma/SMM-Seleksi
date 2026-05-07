import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children: React.ReactNode;
}

const variants = {
    primary: 'bg-primary text-on-primary hover:bg-primary/90 focus-visible:outline-primary',
    secondary: 'bg-surface-container text-on-surface hover:bg-surface-container-high',
    danger: 'bg-error text-on-error hover:bg-error/90 focus-visible:outline-error',
    ghost: 'text-on-surface hover:bg-surface-container',
    outline: 'border border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export default function Button({ variant = 'primary', size = 'md', isLoading, children, className, disabled, ...props }: ButtonProps) {
    return (
        <button
            className={cn(
                'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            )}
            {children}
        </button>
    );
}
